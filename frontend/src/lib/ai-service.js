// AI Service - Centralized AI functionality
// Simple implementation to connect to the backend API

class AiService {  // Code generation function using the backend API
  async generateCode(prompt, language = 'javascript', complexity = 'simple', modelProvider = 'gemini') {
    try {
      // Connect to the backend API (via Vite proxy)
      const response = await fetch(`/api/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          language,
          complexity,
          modelProvider
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API Error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error generating code:', error);
      throw error; // Let the component handle the error
    }
  }  // Explain code using backend API
  async explainCode(code, language, modelProvider = 'gemini') {
    try {
      const response = await fetch(`/api/ai/explain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: code,
          language,
          modelProvider
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error explaining code:', error);
      throw error;
    }
  }
  // Optimize code using backend API
  async optimizeCode(code, language, modelProvider = 'gemini') {
    try {
      const response = await fetch(`/api/ai/optimize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: code,
          language,
          modelProvider
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error optimizing code:', error);
      throw error;
    }
  }
  // Translate code using backend API
  async translateCode(code, fromLanguage, toLanguage, modelProvider = 'gemini') {
    try {
      const response = await fetch(`/api/ai/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: code,
          fromLanguage,
          toLanguage,
          modelProvider
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error translating code:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const aiService = new AiService();
export default AiService;
