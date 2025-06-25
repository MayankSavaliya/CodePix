class AiService {
  constructor() {
    this.baseURL = '/api/ai';
    this.timeout = 30000; // 30 seconds timeout
  }

  /**
   * Make HTTP request with proper error handling and timeout
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} Response data
   */
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
      
      // Validate response structure
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

  /**
   * Generate code from natural language description
   * @param {string} prompt - Natural language description
   * @param {string} language - Target programming language
   * @param {string} complexity - Code complexity level
   * @param {string} modelProvider - AI model provider (gemini/groq)
   * @returns {Promise<string>} Generated code
   */
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

  /**
   * Explain existing code
   * @param {string} code - Code to explain
   * @param {string} language - Programming language
   * @param {string} modelProvider - AI model provider
   * @returns {Promise<string>} Code explanation
   */
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

  /**
   * Optimize existing code
   * @param {string} code - Code to optimize
   * @param {string} language - Programming language
   * @param {string} modelProvider - AI model provider
   * @returns {Promise<string>} Optimization suggestions
   */
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

  /**
   * Translate code between programming languages
   * @param {string} code - Source code
   * @param {string} sourceLanguage - Source programming language
   * @param {string} targetLanguage - Target programming language
   * @param {string} modelProvider - AI model provider
   * @returns {Promise<string>} Translated code
   */
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

  /**
   * Check API status and available endpoints
   * @returns {Promise<Object>} API status information
   */
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

  /**
   * Test API connectivity
   * @returns {Promise<boolean>} True if API is accessible
   */
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

// Export singleton instance
export const aiService = new AiService();
export default AiService;
