from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import os
import time
import re
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Google Gemini - use environment variable for API key
try:
    import google.generativeai as genai
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if gemini_api_key:
        genai.configure(api_key=gemini_api_key)
        genai_client = genai
        logger.info("Gemini client initialized successfully")
    else:
        genai_client = None
        logger.warning("GEMINI_API_KEY not found in environment variables")
except ImportError:
    genai_client = None
    gemini_api_key = None
    logger.warning("Google Gemini library not installed")

# Groq models - use environment variable for API key
try:
    from groq import Groq
    groq_api_key = os.getenv("GROQ_API_KEY")
    if groq_api_key:
        groq_client = Groq(api_key=groq_api_key)
        logger.info("Groq client initialized successfully")
    else:
        groq_client = None
        logger.warning("GROQ_API_KEY not found in environment variables")
except ImportError:
    groq_client = None
    groq_api_key = None
    logger.warning("Groq library not installed")

# Initialize Flask app
app = Flask(__name__)
CORS(app) 

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def get_prompt_from_request():
    """Extract prompt and model provider from request"""
    data = request.get_json()
    if not data or 'prompt' not in data:
        return None, None, jsonify({'error': 'Missing "prompt" in request body'}), 400
    
    # Extract additional parameters if available
    model_provider = data.get('modelProvider', 'gemini')  # Default to Gemini if not specified
    
    return data['prompt'], model_provider, None, None

def format_code_generation_prompt(prompt, language="javascript", complexity="intermediate"):
    """Format the prompt for code generation to get better results from the AI model"""
    # Extract parameters from request if provided
    data = request.get_json()
    language = data.get('language', language)
    complexity = data.get('complexity', complexity)
    
    formatted_prompt = f"""
        You are a code generator that produces ONLY code Not anything extra in that like example and much error handling things.
        This response will be pasted to direct code editor, so it should be ready to run without any modifications and user friendly.
        code should be written in a way that it is easy to understand and maintain.
        You will be given a task to generate code in a specific programming language with a certain complexity level.
        You will only return the code in a code block with the appropriate syntax for the specified language.
        Do not include any explanations, comments, or additional text outside of the code block.
        code should be proper and clean, and should follow best practices for the specified language.

        Task: {prompt}

        Requirements:
        - Language: {language}
        - Complexity: {complexity}
        - Include only essential comments that explain complex logic
        - Follow best practices for {language}
        - Make the code clean and concise
        - Do NOT include usage examples
        - Do NOT include explanatory text outside the code
        - Do NOT include console.log statements unless specifically requested
        - Do NOT include commented out code
        - Do NOT include any text outside of the code block

        Your entire response should be ONLY a code block with the appropriate syntax, nothing else.
        """
    return formatted_prompt

def format_code_translation_prompt(code, source_language, target_language):
    """Format the prompt for code translation"""
    formatted_prompt = f"""
        Translate the following code from {source_language} to {target_language}.
        Maintain the same functionality and logic while following {target_language} conventions and best practices.
        Return only the translated code in a code block with the appropriate syntax for {target_language}.
        Do not include any explanations or additional text outside the code block.

        Source Code ({source_language}):
        {code}

        Translate to {target_language}:
        """
    return formatted_prompt

def format_code_optimization_prompt(code, language):
    """Format the prompt for code optimization"""
    formatted_prompt = f"""
        Analyze and optimize the following {language} code. Provide specific optimization suggestions including:
        1. Performance improvements
        2. Code readability enhancements
        3. Best practices recommendations
        4. Security considerations (if applicable)
        5. Memory usage optimizations

        Provide both the optimized code and a brief explanation of the changes made.

        Original Code:
        {code}

        Please provide:
        1. The optimized code in a code block
        2. A brief explanation of the optimizations made
        """
    return formatted_prompt

def extract_code_blocks(response_text):
    """Extract code blocks from AI response"""
    # First try to find code blocks with language specified
    code_block_pattern = r"```(\w+)?\n([\s\S]*?)```"
    matches = re.findall(code_block_pattern, response_text)
    
    if matches:
        language, code = matches[0]
        # Return with formatting that frontend expects for parsing
        return f"```{language}\n{code.strip()}\n```"
    
    # If no match with language, try generic code blocks
    code_block_pattern = r"```([\s\S]*?)```"
    code_blocks = re.findall(code_block_pattern, response_text)
    if code_blocks:
        # Return with formatting that frontend expects for parsing
        return f"```\n{code_blocks[0].strip()}\n```"
    
    # If no code blocks at all
    return response_text.strip()

def call_ai_model(model_provider, prompt, model_name_gemini="gemini-2.0-flash-exp", model_name_groq="llama-3.3-70b-versatile"):
    """Generic function to call AI models"""
    if model_provider.lower() == 'gemini':
        if not genai_client:
            raise Exception("Gemini client not available. Please check GEMINI_API_KEY environment variable and ensure google-generativeai library is installed.")
            
        model = genai_client.GenerativeModel(model_name_gemini)
        response = model.generate_content(prompt)
        return response.text, model_name_gemini
        
    elif model_provider.lower() == 'groq':
        if not groq_client:
            raise Exception("Groq client not available. Please check GROQ_API_KEY environment variable and ensure groq library is installed.")
            
        completion = groq_client.chat.completions.create(
            model=model_name_groq,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=2048,
            top_p=1,
            stop=None,
        )
        return completion.choices[0].message.content, model_name_groq
    else:
        raise Exception(f"Unsupported model provider: {model_provider}. Supported providers are 'gemini' and 'groq'.")

# ============================================================================
# API ROUTES
# ============================================================================

@app.route('/api/ai/generate', methods=['POST'])
def generate_code():
    """Generate code from natural language description"""
    try:
        prompt, model_provider, error_response, status = get_prompt_from_request()
        if error_response:
            return error_response, status
            
        # Format the prompt with our helper function
        formatted_prompt = format_code_generation_prompt(prompt)
        
        start_time = time.time()
        response_text, model_name = call_ai_model(model_provider, formatted_prompt)
        
        # Extract code blocks if they exist
        clean_code = extract_code_blocks(response_text)
        
        elapsed_time = time.time() - start_time
        return jsonify({
            "model": model_name,
            "modelProvider": model_provider,
            "result": clean_code,
            "time_taken": f"{elapsed_time:.2f} seconds"
        })
    except Exception as e:
        logger.error(f"Error in generate_code endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/ai/explain', methods=['POST'])
def explain_code():
    """Explain existing code"""
    try:
        prompt, model_provider, error_response, status = get_prompt_from_request()
        if error_response:
            return error_response, status
            
        explain_prompt = f"Explain this code in clear, concise terms:\n\n{prompt}"
        
        start_time = time.time()
        response_text, model_name = call_ai_model(model_provider, explain_prompt)
        
        elapsed_time = time.time() - start_time
        return jsonify({
            "model": model_name,
            "modelProvider": model_provider,
            "result": response_text,
            "time_taken": f"{elapsed_time:.2f} seconds"
        })
    except Exception as e:
        logger.error(f"Error in explain_code endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/ai/translate', methods=['POST'])
def translate_code():
    """Translate code from one language to another"""
    try:
        data = request.get_json()
        if not data or 'code' not in data:
            return jsonify({'error': 'Missing "code" in request body'}), 400
        
        code = data['code']
        source_language = data.get('sourceLanguage', 'javascript')
        target_language = data.get('targetLanguage', 'python')
        model_provider = data.get('modelProvider', 'gemini')
        
        formatted_prompt = format_code_translation_prompt(code, source_language, target_language)
        
        start_time = time.time()
        response_text, model_name = call_ai_model(model_provider, formatted_prompt)
        
        # Extract code blocks if they exist
        translated_code = extract_code_blocks(response_text)
        
        elapsed_time = time.time() - start_time
        return jsonify({
            "model": model_name,
            "modelProvider": model_provider,
            "sourceLanguage": source_language,
            "targetLanguage": target_language,
            "result": translated_code,
            "time_taken": f"{elapsed_time:.2f} seconds"
        })
    except Exception as e:
        logger.error(f"Error in translate_code endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/ai/optimize', methods=['POST'])
def optimize_code():
    """Optimize existing code"""
    try:
        data = request.get_json()
        if not data or 'code' not in data:
            return jsonify({'error': 'Missing "code" in request body'}), 400
        
        code = data['code']
        language = data.get('language', 'javascript')
        model_provider = data.get('modelProvider', 'gemini')
        
        formatted_prompt = format_code_optimization_prompt(code, language)
        
        start_time = time.time()
        response_text, model_name = call_ai_model(model_provider, formatted_prompt)
        
        elapsed_time = time.time() - start_time
        return jsonify({
            "model": model_name,
            "modelProvider": model_provider,
            "language": language,
            "result": response_text,
            "time_taken": f"{elapsed_time:.2f} seconds"
        })
    except Exception as e:
        logger.error(f"Error in optimize_code endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

# ============================================================================
# MAIN APPLICATION
# ============================================================================

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 