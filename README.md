# 🤖 AI Chatbot

A modern, feature-rich chatbot application built with Vue 3 and TypeScript, featuring AI-powered text prediction and grammar correction.

![Vue 3](https://img.shields.io/badge/Vue-3-4FC08D?logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)

## ✨ Features

- 🤖 **AI Text Prediction** - Real-time next-word suggestions using Hugging Face GPT-2
- ✍️ **Grammar Correction** - Automatic grammar and spelling checks with LanguageTool
- 🌓 **Dark/Light Mode** - Beautiful themes with smooth transitions
- 💾 **Conversation History** - Auto-saved to localStorage
- 📤 **Export Chat** - Download conversations as text or JSON
- 📋 **Copy Messages** - One-click copy to clipboard
- 🎨 **Modern UI** - Glassmorphism, gradients, and smooth animations
- 📱 **Responsive Design** - Works perfectly on mobile and desktop

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The application will be available at `http://localhost:5173`

## 🎯 Usage

1. **Type a message** in the input field at the bottom
2. **Watch for predictions** - AI suggests next words as you type
3. **See grammar suggestions** - Errors are highlighted with corrections
4. **Click suggestions** to accept them instantly
5. **Send messages** by clicking the send button or pressing Enter
6. **Toggle theme** using the sun/moon icon in the header
7. **Export chat** to save your conversation
8. **Clear chat** to start fresh

## 🏗️ Tech Stack

- **Framework**: Vue 3 (Composition API)
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Vanilla CSS with CSS Variables
- **APIs**: 
  - Hugging Face Inference API (text prediction)
  - LanguageTool API (grammar checking)

## 📁 Project Structure

```
src/
├── assets/          # Styles and design tokens
├── components/      # Vue components
├── composables/     # Reusable composition functions
├── services/        # API integrations
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── App.vue          # Main application
└── main.ts          # Entry point
```

## 🎨 Design System

- **Colors**: Purple-blue gradients with light/dark themes
- **Typography**: Inter (body), Outfit (headings)
- **Effects**: Glassmorphism, smooth shadows, micro-animations
- **Responsive**: Mobile-first approach

## 🔧 Configuration

No configuration needed! The app uses free APIs that don't require API keys:

- **Hugging Face**: Public models (no key required)
- **LanguageTool**: Free tier (no key required)

## 📝 API Limitations

- **Hugging Face**: Model may take 20-30s to load on first use
- **LanguageTool**: ~20 requests/minute on free tier

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co/) for text prediction API
- [LanguageTool](https://languagetool.org/) for grammar checking API
- [Vue.js](https://vuejs.org/) for the amazing framework

---

Built with ❤️ using Vue 3 and TypeScript
