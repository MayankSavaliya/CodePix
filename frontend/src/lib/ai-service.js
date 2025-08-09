class AiService {
  constructor() {
    this.baseURL = 'http://localhost:5000/api/ai';
    this.timeout = 30000;
  }

  async makeRequest(endpoint, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format from server');
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection.');
      }
      
      throw error;
    }
  }

  async generateCode(prompt, language = 'javascript', complexity = 'intermediate', modelProvider = 'gemini') {
    if (!prompt || typeof prompt !== 'string') {
      throw new Error('Prompt is required and must be a string');
    }

    const data = await this.makeRequest('/generate', {
      method: 'POST',
      body: JSON.stringify({
        prompt: prompt.trim(),
        language,
        complexity,
        modelProvider
      }),
    });

    return data.result || '';
  }

  async explainCode(code, language = 'javascript', modelProvider = 'groq') {
    if (!code || typeof code !== 'string') {
      throw new Error('Code is required and must be a string');
    }

    const data = await this.makeRequest('/explain', {
      method: 'POST',
      body: JSON.stringify({
        prompt: code.trim(),
        modelProvider
      }),
    });

    return data.result || '';
  }

  async optimizeCode(code, language = 'javascript', modelProvider = 'groq') {
    if (!code || typeof code !== 'string') {
      throw new Error('Code is required and must be a string');
    }

    const data = await this.makeRequest('/optimize', {
      method: 'POST',
      body: JSON.stringify({
        code: code.trim(),
        language, 
        modelProvider
      }),
    });

    return data.result || '';
  }

  async translateCode(code, sourceLanguage = 'javascript', targetLanguage = 'python', modelProvider = 'gemini') {
    if (!code || typeof code !== 'string') {
      throw new Error('Code is required and must be a string');
    }

    const data = await this.makeRequest('/translate', {
      method: 'POST',
      body: JSON.stringify({
        code: code.trim(),
        sourceLanguage,
        targetLanguage,
        modelProvider
      }),
    });

    return data.result || '';
  }

  async checkStatus() {
    try {
      const response = await fetch('/api/status');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to check API status: ${error.message}`);
    }
  }

  async testConnection() {
    try {
      await this.checkStatus();
      return true;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }
}

export const aiService = new AiService();
export default AiService;
