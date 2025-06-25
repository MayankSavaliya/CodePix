from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import os
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Google Gemini - use environment variable for API key
try:
    from google import genai
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    genai_client = genai.Client(api_key=gemini_api_key) if gemini_api_key else None
except ImportError:
    genai_client = None
    gemini_api_key = None

# Groq models - use environment variable for API key
try:
    from groq import Groq
    groq_api_key = os.getenv("GROQ_API_KEY")
    groq_client = Groq(api_key=groq_api_key) if groq_api_key else None
except ImportError:
    groq_client = None
    groq_api_key = None

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def get_prompt_from_request():
    data = request.get_json()
    if not data or 'prompt' not in data:
        return None, jsonify({'error': 'Missing "prompt" in request body'}), 400
    
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

@app.route('/api/status')
def api_status():
    return jsonify({
        "status": "online",
        "endpoints": {
            "generate": "/api/ai/generate",
            "explain": "/api/ai/explain"
        },
        "api_keys": {
            "gemini": bool(gemini_api_key),
            "groq": bool(groq_api_key)
        }
    })

@app.route('/api/ai/generate', methods=['POST'])
def generate_code():
    try:
        prompt, model_provider, error_response, status = get_prompt_from_request()
        if error_response:
            return error_response, status
            
        # Format the prompt with our helper function
        formatted_prompt = format_code_generation_prompt(prompt)
        print(f"Using model provider: {model_provider}")
        print(formatted_prompt)
        
        start_time = time.time()
        response_text = ""
        model_name = ""
        
        # Use the specified model provider
        if model_provider.lower() == 'gemini':
            if not gemini_api_key:
                return jsonify({"error": "Gemini API key not configured in environment variables"}), 500
                
            model_name = "gemini-2.0-flash"
            response = genai_client.models.generate_content(
                model=model_name,
                contents=[formatted_prompt]
            )
            response_text = response.text
            
        elif model_provider.lower() == 'groq':
            if not groq_api_key:
                return jsonify({"error": "Groq API key not configured in environment variables"}), 500
                
            model_name = "llama-3.3-70b-versatile"
            completion = groq_client.chat.completions.create(
                model=model_name,
                messages=[{"role": "user", "content": formatted_prompt}],
                temperature=0.7,
                max_tokens=2048,
                top_p=1,
                stop=None,
            )
            response_text = completion.choices[0].message.content
        else:
            return jsonify({"error": f"Unsupported model provider: {model_provider}. Supported providers are 'gemini' and 'groq'."}), 400        # Process the response to extract only the code
        
        # Extract code blocks if they exist (between triple backticks)
        import re
        code_block_pattern = r"```(?:\w*\n)?([\s\S]*?)```"
        code_blocks = re.findall(code_block_pattern, response_text)
        
        # Use the extracted code if found, otherwise use the full response
        clean_code = code_blocks[0].strip() if code_blocks else response_text.strip()
        
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
    try:
        prompt, model_provider, error_response, status = get_prompt_from_request()
        if error_response:
            return error_response, status
            
        explain_prompt = f"Explain this code in clear, concise terms:\n\n{prompt}"
        
        start_time = time.time()
        response_text = ""
        model_name = ""
        
        # Use the specified model provider
        if model_provider.lower() == 'gemini':
            if not gemini_api_key:
                return jsonify({"error": "Gemini API key not configured in environment variables"}), 500
                
            model_name = "gemini-2.0-flash"
            response = genai_client.models.generate_content(
                model=model_name,
                contents=[explain_prompt]
            )
            response_text = response.text
            
        elif model_provider.lower() == 'groq':
            if not groq_api_key:
                return jsonify({"error": "Groq API key not configured in environment variables"}), 500
                
            model_name = "llama-3.3-70b-versatile"
            completion = groq_client.chat.completions.create(
                model=model_name,
                messages=[{"role": "user", "content": explain_prompt}],
                temperature=0.7,
                max_tokens=2048,
                top_p=1,
                stop=None,
            )
            response_text = completion.choices[0].message.content
        else:
            return jsonify({"error": f"Unsupported model provider: {model_provider}. Supported providers are 'gemini' and 'groq'."}), 400
        
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 