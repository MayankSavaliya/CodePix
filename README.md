# 🎨 CodePix - Beautiful Code Snippet Generator

<div align="center">

![CodePix Logo](https://img.shields.io/badge/CodePix-Code%20Snippet%20Generator-purple?style=for-the-badge&logo=code&logoColor=white)

**Create stunning, shareable code snippets with AI-powered features**

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat-square&logo=python)](https://python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.0+-000000?style=flat-square&logo=flask)](https://flask.palletsprojects.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.10-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 📚 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Installation](#-installation)
- [Usage](#-usage)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- **Beautiful Code Snippets**: 20+ themes, custom fonts, responsive design, export as PNG/SVG, customizable backgrounds
- **AI-Powered Tools**: Explain, optimize, translate, and generate code using Google Gemini or Groq models
- **Snippet Management**: Save, organize, search, and share your code snippets
- **Developer Experience**: Real-time preview, language auto-detection, customizable UI, dark/light mode, keyboard shortcuts
- **Authentication & Security**: Secure login with Firebase, user profiles, private snippets, protected API endpoints

---

## 🚀 Demo

<div align="center">

<!-- Replace the below with your actual demo image path or URL -->
<img src="frontend/public/demo.png" alt="CodePix Demo Screenshot" width="600"/>

<em>CodePix in action – create beautiful code snippets with AI assistance</em>

</div>

---

## 🛠️ Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://python.org/) (v3.8+)
- [Firebase Account](https://firebase.google.com/)
- AI API Keys (Google Gemini and/or Groq)

### Backend Setup

```bash
# 1. Clone the repository
$ git clone https://github.com/yourusername/codepix.git
$ cd codepix/backend

# 2. Install Python dependencies
$ pip install -r requirements.txt

# 3. Set up environment variables
$ cp .env.example .env
# Edit .env and add your API keys

# 4. Run the backend server
$ python server.py
```
Backend runs at: http://localhost:5000

### Frontend Setup

```bash
# 1. Install Node.js dependencies
$ cd ../frontend
$ npm install

# 2. Configure Firebase
# - Create a Firebase project
# - Enable Authentication and Firestore
# - Copy your Firebase config to src/lib/firebase.js

# 3. Start the development server
$ npm run dev
```
Frontend runs at: http://localhost:5173

### Docker Setup (Optional)

```bash
$ docker-compose up -d
```

---

## 📖 Usage

- **Create**: Paste or type code, customize appearance, export or copy
- **AI Tools**: Use Explain, Optimize, Translate, or Generate features
- **Manage**: Save, organize, search, and share snippets

---

## 🤝 Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and new features.

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
