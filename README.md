# ✍️ OPP/AI - AI-Powered Writing Assistant

A modern, intelligent writing assistant built with Vue 3 and TypeScript, featuring real-time grammar checking and AI-powered text prediction to help you write better, faster.

![Vue 3](https://img.shields.io/badge/Vue-3-4FC08D?logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)

## ✨ Features

- 🤖 **Intelligent Text Prediction** - Real-time next-word suggestions and autocomplete
- ✍️ **Grammar Checking** - Automatic grammar and spelling correction with LanguageTool
- 👻 **Ghost Text Overlay** - Non-intrusive prediction preview with Tab-to-accept
- 📊 **Writing Statistics** - Real-time word count, character count, and issue tracking
- 🌓 **Dark/Light Mode** - Beautiful themes with smooth transitions
- 🎨 **Modern UI** - Clean, minimalist design with gradient accents
- 📱 **Responsive Design** - Seamless experience on desktop, tablet, and mobile
- ⚡ **Performance Optimized** - Debounced API calls and local prediction engine

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ or 22.12.0+
- npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The application will be available at `http://localhost:5174` (or 5173 if available)

## 🎯 Usage

### Writing with Predictions

1. **Start typing** in the text editor
2. **Ghost text appears** in gray, showing AI prediction
3. **Press Tab** to accept the suggestion
4. **Continue typing** to ignore and get new predictions

### Fixing Grammar Issues

1. **Type your text** (grammar check runs automatically after 800ms)
2. **Grammar sidebar appears** with detected issues
3. **Click any issue** to apply the suggested correction
4. **Text updates** automatically

### Customizing Appearance

- **Toggle theme** using the sun/moon icon in the header
- **Clear text** using the trash icon
- **Theme preference** is saved automatically

## 🏗️ Tech Stack

- **Framework**: Vue 3 (Composition API)
- **Language**: TypeScript
- **Build Tool**: Vite 7
- **Styling**: Modern CSS with Custom Properties
- **APIs**: 
  - LanguageTool API (grammar checking)
  - Local Prediction Engine (text suggestions)

## 📁 Project Structure

```
src/
├── assets/          # Global styles and design tokens
│   ├── global.css
│   ├── variables.css
│   └── base.css
├── components/      # Reusable Vue components
├── composables/     # Vue composables (business logic)
│   ├── useTextPrediction.ts
│   ├── useGrammarCheck.ts
│   └── useTheme.ts
├── services/        # API integrations
│   ├── huggingface.ts    # Local prediction engine
│   └── languagetool.ts   # Grammar checking API
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── App.vue          # Main application component
└── main.ts          # Entry point
```

## 🎨 Design System

### Color Palette

**Light Mode:**
- Background: `#f8f9fa`
- Cards: `#ffffff`
- Text: `#1a1a2e`
- Accent: Linear gradient `#667eea → #764ba2`

**Dark Mode:**
- Background: `#0f172a`
- Cards: `#1e293b`
- Text: `#f1f5f9`
- Accent: Linear gradient `#667eea → #764ba2`

### Typography
- **Font Family**: Inter (body), Outfit (headings)
- **Base Size**: 16px
- **Line Height**: 1.5 (normal), 1.8 (editor)

### Design Principles
- Minimalism and clean interfaces
- Smooth animations and transitions
- Responsive, mobile-first approach
- Accessibility and keyboard navigation

## 🔧 Configuration

No API keys required! The application uses:

- **LanguageTool**: Free public API (no authentication needed)
- **Local Prediction**: Client-side engine with 1,000+ word dictionary

## ⚡ Performance Features

- **Debouncing**: 100ms for predictions, 800ms for grammar checks
- **Local-First**: Predictions run in browser (no network latency)
- **GPU Acceleration**: Smooth animations using CSS transforms
- **Optimized Rendering**: Efficient Vue reactivity and computed properties

## 📊 Statistics

- **Prediction Dictionary**: 1,000+ common English words
- **Next Word Patterns**: 45+ context-based patterns
- **Response Time**: <10ms for predictions, ~800ms for grammar
- **Supported Languages**: English (expandable)

## 🎓 University Presentation

This project includes comprehensive presentation materials:

- **PRESENTATION.md** - Full project documentation
- **QUICK_REFERENCE.md** - Fast lookup guide
- **PRESENTATION_SCRIPT.md** - 10-minute presentation script
- **PRESENTATION_INDEX.md** - Navigation guide for all materials

See `PRESENTATION_INDEX.md` for complete presentation preparation guide.

## 🚀 Future Enhancements

- Advanced AI integration (GPT-based models)
- Document management (save, load, export)
- Collaboration features (real-time editing)
- Multi-language support
- Analytics dashboard
- Custom dictionaries

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [LanguageTool](https://languagetool.org/) for grammar checking API
- [Vue.js](https://vuejs.org/) for the excellent framework
- [Vite](https://vitejs.dev/) for blazing fast build tool
- [Google Fonts](https://fonts.google.com/) for Inter and Outfit typefaces

---

Built with ❤️ using Vue 3, TypeScript, and modern web technologies

**OPP/AI** - Write better, faster, with confidence.

