import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

// Ensure env vars are loaded
dotenv.config();

class AIService {
  constructor() {
    // Initialize Gemini
    if (process.env.GEMINI_API_KEY) {
      this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      console.log(' Gemini client initialized');
    } else {
      console.warn(' GEMINI_API_KEY not found');
    }

    // Initialize Groq
    if (process.env.GROQ_API_KEY) {
      this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      console.log('Groq client initialized');
    } else {
      console.warn('GROQ_API_KEY not found');
    }
  }

  async callAI(prompt, modelProvider = 'gemini', modelNameGemini = 'gemini-1.5-flash', modelNameGroq = 'llama-3.3-70b-versatile') {
    const startTime = Date.now();
    let result, modelName;

    if (modelProvider.toLowerCase() === 'gemini') {
      if (!this.gemini) {
        throw new Error('Gemini client not available. Please check GEMINI_API_KEY environment variable and ensure google-generativeai library is installed.');
      }
      
      const model = this.gemini.getGenerativeModel({ model: modelNameGemini });
      const response = await model.generateContent(prompt);
      result = response.response.text();
      modelName = modelNameGemini;
      
    } else if (modelProvider.toLowerCase() === 'groq') {
      if (!this.groq) {
        throw new Error('Groq client not available. Please check GROQ_API_KEY environment variable and ensure groq library is installed.');
      }
      
      const completion = await this.groq.chat.completions.create({
        model: modelNameGroq,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 1,
        stop: null,
      });
      
      result = completion.choices[0].message.content;
      modelName = modelNameGroq;
      
    } else {
      throw new Error(`Unsupported model provider: ${modelProvider}. Supported providers are 'gemini' and 'groq'.`);
    }

    const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
    
    return {
      model: modelName,
      modelProvider,
      result,
      time_taken: `${timeTaken} seconds`
    };
  }

  extractCodeBlocks(responseText) {
    // First try to find code blocks with language specified
    const codeBlockPattern = /```(\w+)?\n([\s\S]*?)```/g;
    const matches = [...responseText.matchAll(codeBlockPattern)];
    
    if (matches.length > 0) {
      const [, language, code] = matches[0];
      // Return with formatting that frontend expects for parsing
      return `\`\`\`${language || ''}\n${code.trim()}\n\`\`\``;
    }
    
    // If no match with language, try generic code blocks
    const genericCodeBlockPattern = /```([\s\S]*?)```/g;
    const codeBlocks = [...responseText.matchAll(genericCodeBlockPattern)];
    if (codeBlocks.length > 0) {
      // Return with formatting that frontend expects for parsing
      return `\`\`\`\n${codeBlocks[0][1].trim()}\n\`\`\``;
    }
    
    // If no code blocks at all
    return responseText.trim();
  }

  async generateCode(prompt, language = 'javascript', complexity = 'intermediate', modelProvider = 'gemini') {
    const formattedPrompt = `
        You are a code generator that produces ONLY code Not anything extra in that like example and much error handling things.
        This response will be pasted to direct code editor, so it should be ready to run without any modifications and user friendly.
        code should be written in a way that it is easy to understand and maintain.
        You will be given a task to generate code in a specific programming language with a certain complexity level.
        You will only return the code in a code block with the appropriate syntax for the specified language.
        Do not include any explanations, comments, or additional text outside of the code block.
        code should be proper and clean, and should follow best practices for the specified language.

        Task: ${prompt}

        Requirements:
        - Language: ${language}
        - Complexity: ${complexity}
        - Include only essential comments that explain complex logic
        - Follow best practices for ${language}
        - Make the code clean and concise
        - Do NOT include usage examples
        - Do NOT include explanatory text outside the code
        - Do NOT include console.log statements unless specifically requested
        - Do NOT include commented out code
        - Do NOT include any text outside of the code block

        Your entire response should be ONLY a code block with the appropriate syntax, nothing else.
        `;

    const response = await this.callAI(formattedPrompt, modelProvider);
    response.result = this.extractCodeBlocks(response.result);
    return response;
  }

  async explainCode(code, modelProvider = 'gemini') {
    const prompt = `Explain this code in clear, concise terms:\n\n${code}`;
    return await this.callAI(prompt, modelProvider);
  }

  async translateCode(code, sourceLanguage = 'javascript', targetLanguage = 'python', modelProvider = 'gemini') {
    const formattedPrompt = `
        Translate the following code from ${sourceLanguage} to ${targetLanguage}.
        Maintain the same functionality and logic while following ${targetLanguage} conventions and best practices.
        Return only the translated code in a code block with the appropriate syntax for ${targetLanguage}.
        Do not include any explanations or additional text outside the code block.

        Source Code (${sourceLanguage}):
        ${code}

        Translate to ${targetLanguage}:
        `;

    const response = await this.callAI(formattedPrompt, modelProvider);
    response.result = this.extractCodeBlocks(response.result);
    response.sourceLanguage = sourceLanguage;
    response.targetLanguage = targetLanguage;
    return response;
  }

  async optimizeCode(code, language = 'javascript', modelProvider = 'gemini') {
    const formattedPrompt = `
        Analyze and optimize the following ${language} code. Provide specific optimization suggestions including:
        1. Performance improvements
        2. Code readability enhancements
        3. Best practices recommendations
        4. Security considerations (if applicable)
        5. Memory usage optimizations

        Provide both the optimized code and a brief explanation of the changes made.

        Original Code:
        ${code}

        Please provide:
        1. The optimized code in a code block
        2. A brief explanation of the optimizations made
        `;

    const response = await this.callAI(formattedPrompt, modelProvider);
    response.language = language;
    return response;
  }
}

export default new AIService();
