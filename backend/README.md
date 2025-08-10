# CodePix Node.js Backend

A clean, organized Express.js backend for the CodePix application with AI-powered code features.

## Features

- 🚀 Express.js server with proper middleware
- 🤖 AI integrations (Gemini & Groq)
- 🛡️ Security with Helmet and CORS
- ⚡ Rate limiting
- 🎯 Clean route organization
- 📝 Proper error handling

## API Endpoints

### AI Features

- `POST /api/ai/generate` - Generate code from natural language
- `POST /api/ai/explain` - Explain existing code
- `POST /api/ai/translate` - Translate code between languages
- `POST /api/ai/optimize` - Optimize existing code

### Health Check

- `GET /health` - Server health status

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Add your API keys to `.env`

4. Start development server:
```bash
npm run dev
```

5. Start production server:
```bash
npm start
```

## Environment Variables

- `GEMINI_API_KEY` - Google Gemini API key
- `GROQ_API_KEY` - Groq API key
- `PORT` - Server port (default: 5000)

## Project Structure

```
backend-nodejs/
├── server.js          # Main server file
├── routes/
│   └── ai.js          # AI-related routes
├── services/
│   └── aiService.js   # AI service logic
├── package.json
├── .env.example
└── README.md
```

## Example Request

```bash
curl -X POST http://localhost:5000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a function to sort an array",
    "language": "javascript",
    "complexity": "intermediate",
    "modelProvider": "gemini"
  }'
```
