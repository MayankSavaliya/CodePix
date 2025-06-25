# CodePix Backend API

A Flask-based backend API that provides AI-powered code generation, explanation, translation, and optimization services using Google Gemini and Groq (LLaMA 3) models.

## Features

- **Code Generation**: Generate code from natural language descriptions
- **Code Explanation**: Get explanations for existing code
- **Code Translation**: Convert code between different programming languages
- **Code Optimization**: Get optimization suggestions for existing code
- **Multi-Model Support**: Support for both Google Gemini and Groq (LLaMA 3) models

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Environment Variables

Create a `.env` file in the backend directory with your API keys:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Run the Server

```bash
python server.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### 1. Status Check
- **GET** `/api/status`
- Returns server status and available endpoints

### 2. Code Generation
- **POST** `/api/ai/generate`
- **Purpose**: Generate code from natural language description
- **Request Body**:
  ```json
  {
    "prompt": "Write a function to sort an array",
    "modelProvider": "gemini", // or "groq"
    "language": "python",
    "complexity": "intermediate"
  }
  ```

### 3. Code Explanation
- **POST** `/api/ai/explain`
- **Purpose**: Explain existing code
- **Request Body**:
  ```json
  {
    "prompt": "function add(a, b) { return a + b; }",
    "modelProvider": "groq" // or "gemini"
  }
  ```

### 4. Code Translation
- **POST** `/api/ai/translate`
- **Purpose**: Convert code from one language to another
- **Request Body**:
  ```json
  {
    "code": "function add(a, b) { return a + b; }",
    "sourceLanguage": "javascript",
    "targetLanguage": "python",
    "modelProvider": "gemini"
  }
  ```

### 5. Code Optimization
- **POST** `/api/ai/optimize`
- **Purpose**: Get optimization suggestions for code
- **Request Body**:
  ```json
  {
    "code": "def find_duplicates(arr): ...",
    "language": "python",
    "modelProvider": "groq"
  }
  ```

## Response Format

All endpoints return responses in the following format:

```json
{
  "model": "model-name",
  "modelProvider": "gemini|groq",
  "result": "AI generated content",
  "time_taken": "X.XX seconds"
}
```

## Testing

Run the comprehensive test suite:

```bash
python test_all_endpoints.py
```

Or test individual endpoints:

```bash
python test_generate_code.py
```

## Model Providers

### Google Gemini
- **Model**: `gemini-2.0-flash`
- **Best for**: Code generation, translation
- **API Key**: Required from Google AI Studio

### Groq (LLaMA 3)
- **Model**: `llama-3.3-70b-versatile`
- **Best for**: Code explanation, optimization
- **API Key**: Required from Groq

## Error Handling

The API includes comprehensive error handling:
- Missing required fields
- Invalid model providers
- API key configuration issues
- Network and service errors

## CORS

Cross-Origin Resource Sharing (CORS) is enabled for all routes to allow frontend integration.

## Logging

The application includes logging for debugging and monitoring purposes. Logs are output to the console with INFO level. 