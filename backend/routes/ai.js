import express from 'express';
import aiService from '../services/aiService.js';

const router = express.Router();

// Generate code from natural language
router.post('/generate', async (req, res) => {
  try {
    const { prompt, language, complexity, modelProvider } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Missing "prompt" in request body' });
    }

    const result = await aiService.generateCode(prompt, language, complexity, modelProvider);
    res.json(result);
  } catch (error) {
    console.error('Error in generate endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

// Explain existing code
router.post('/explain', async (req, res) => {
  try {
    const { prompt, modelProvider } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Missing "prompt" in request body' });
    }

    const result = await aiService.explainCode(prompt, modelProvider);
    res.json(result);
  } catch (error) {
    console.error('Error in explain endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

// Translate code between languages
router.post('/translate', async (req, res) => {
  try {
    const { code, sourceLanguage, targetLanguage, modelProvider } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Missing "code" in request body' });
    }

    const result = await aiService.translateCode(code, sourceLanguage, targetLanguage, modelProvider);
    res.json(result);
  } catch (error) {
    console.error('Error in translate endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

// Optimize existing code
router.post('/optimize', async (req, res) => {
  try {
    const { code, language, modelProvider } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Missing "code" in request body' });
    }

    const result = await aiService.optimizeCode(code, language, modelProvider);
    res.json(result);
  } catch (error) {
    console.error('Error in optimize endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
