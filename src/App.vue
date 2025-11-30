<template>
  <div id="app" class="app">
    <header class="app-header">
      <div class="header-left">
        <div class="logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="url(#gradient)" />
            <path d="M16 8L20 12H18V16H14V12H12L16 8Z" fill="white" />
            <path d="M12 18H20V20H12V18Z" fill="white" />
            <path d="M12 22H20V24H12V22Z" fill="white" />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stop-color="#667eea" />
                <stop offset="100%" stop-color="#764ba2" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="header-title">
          <h1>OPP/AI</h1>
          <p class="subtitle">AI-powered writing helper</p>
        </div>
      </div>
      
      <div class="header-actions">
        <button class="icon-button" @click="clearText" title="Clear text">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M4 6H16M8 6V4H12V6M8 10V14M12 10V14M5 6L6 16H14L15 6H5Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <button class="icon-button theme-toggle" @click="toggleTheme" :title="isDark ? 'Light mode' : 'Dark mode'">
          <svg v-if="isDark" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2C10 2 10 2 10 2C14.4183 2 18 5.58172 18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 6.81465 3.91465 4.08183 6.66667 2.83333C6.66667 6.66667 6.66667 10 10 10C10 6.66667 10 2 10 2Z"/>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <circle cx="10" cy="10" r="3"/>
            <path d="M10 1V3M10 17V19M19 10H17M3 10H1M16.364 3.636L14.95 5.05M5.05 14.95L3.636 16.364M16.364 16.364L14.95 14.95M5.05 5.05L3.636 3.636"/>
          </svg>
        </button>
      </div>
    </header>

    <main class="editor-container">
      <div class="editor-wrapper">
        <!-- Stats Bar -->
        <div class="stats-bar">
          <div class="stat">
            <span class="stat-label">Words:</span>
            <span class="stat-value">{{ wordCount }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Characters:</span>
            <span class="stat-value">{{ charCount }}</span>
          </div>
          <div class="stat" :class="{ error: grammarIssues.length > 0 }">
            <span class="stat-label">Issues:</span>
            <span class="stat-value">{{ grammarIssues.length }}</span>
          </div>
        </div>

        <!-- Main Content Area: Editor + Grammar Panel Side by Side -->
        <div class="content-area">
          <!-- Main Editor with Ghost Text Overlay -->
          <div class="editor-container-inner">
            <div class="backdrop" ref="backdropRef">
              <div class="highlights">
                <span class="text-content">{{ text }}</span><span class="ghost-text" v-if="prediction">{{ prediction.text }}</span>
              </div>
            </div>
            <textarea
              ref="textareaRef"
              v-model="text"
              @input="handleInput"
              @keydown.tab.prevent="acceptPrediction"
              @scroll="handleScroll"
              placeholder="Start typing here... Grammar and spelling will be checked automatically."
              spellcheck="false"
            ></textarea>
          </div>

          <!-- Grammar Issues Panel (on the side) -->
          <transition name="slide-left">
            <div v-if="grammarIssues.length > 0" class="grammar-sidebar">
              <div class="panel-header">
                <span class="panel-icon">✍️</span>
                <span class="panel-title">{{ grammarIssues.length }} issue{{ grammarIssues.length !== 1 ? 's' : '' }}</span>
              </div>
              <div class="issues-list">
                <div
                  v-for="(issue, index) in grammarIssues.slice(0, 10)"
                  :key="index"
                  class="issue-item"
                  @click="applyCorrection(issue)"
                >
                  <div class="issue-message">{{ issue.shortMessage }}</div>
                  <div v-if="issue.replacements.length > 0" class="issue-fix">
                    → {{ issue.replacements[0] }}
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTheme } from './composables/useTheme';
import { useTextPrediction } from './composables/useTextPrediction';
import { useGrammarCheck } from './composables/useGrammarCheck';
import type { GrammarIssue } from './types';

const { theme, toggleTheme } = useTheme();
const { prediction, getPrediction, clearPrediction } = useTextPrediction();
const { grammarIssues, checkText, clearIssues } = useGrammarCheck();

const text = ref('');
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const backdropRef = ref<HTMLElement | null>(null);

const isDark = computed(() => theme.value === 'dark');

const wordCount = computed(() => {
  const words = text.value.trim().split(/\s+/);
  return text.value.trim() === '' ? 0 : words.length;
});

const charCount = computed(() => text.value.length);

const handleInput = () => {
  const currentText = text.value;
  
  if (currentText.trim().length > 0) {
    getPrediction(currentText);
    checkText(currentText);
  } else {
    clearPrediction();
    clearIssues();
  }
};

const handleScroll = () => {
  if (textareaRef.value && backdropRef.value) {
    backdropRef.value.scrollTop = textareaRef.value.scrollTop;
    backdropRef.value.scrollLeft = textareaRef.value.scrollLeft;
  }
};

const acceptPrediction = () => {
  if (prediction.value && textareaRef.value) {
    // If it's a next word prediction (starts with space usually, or we are at end of word)
    // The prediction service returns just the suffix for autocomplete, or full word for next word
    // We simply append it
    
    // Check if we need to add a space if prediction is a full word and we don't have a trailing space
    const currentText = text.value;
    const predictionText = prediction.value.text;
    
    // Logic is handled by the service to return exactly what needs to be appended
    // But for next word prediction, we might want to ensure spacing is correct if the service returns a raw word
    
    // Actually, our updated service returns:
    // 1. Next word: "word" (if we ended with space)
    // 2. Autocomplete: "pletion" (if we typed "com")
    
    // So we can just append directly? 
    // Wait, if next word prediction returns "am" and we have "I ", we append "am" -> "I am". Correct.
    // If autocomplete returns "plete" and we have "com", we append "plete" -> "complete". Correct.
    
    // One edge case: if we are predicting next word, we usually want to add a space if the user hasn't typed one?
    // The service checks `endsWithSpace`. If true, it returns next word.
    // If false, it tries autocomplete.
    // So direct append should work!
    
    text.value += predictionText;
    clearPrediction();
    
    // Move cursor to end
    setTimeout(() => {
      if (textareaRef.value) {
        textareaRef.value.focus();
        textareaRef.value.setSelectionRange(text.value.length, text.value.length);
        // Trigger input to update predictions again
        handleInput();
      }
    }, 0);
  }
};

const applyCorrection = (issue: GrammarIssue) => {
  if (issue.replacements.length > 0) {
    const before = text.value.substring(0, issue.offset);
    const after = text.value.substring(issue.offset + issue.length);
    text.value = before + issue.replacements[0] + after;
    handleInput();
    textareaRef.value?.focus();
  }
};

const clearText = () => {
  if (text.value.length > 0 && confirm('Clear all text?')) {
    text.value = '';
    clearPrediction();
    clearIssues();
  }
};
</script>

<style>
@import './assets/global.css';

/* Main App Layout */
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-primary);
}

/* Header Styles */
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg) var(--space-2xl);
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.logo {
  flex-shrink: 0;
  animation: fadeIn var(--transition-base);
}

.header-title h1 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin: 0;
  background: var(--color-accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
  margin-top: var(--space-xs);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  transition: all var(--transition-fast);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.icon-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: var(--color-accent-primary);
  opacity: 0.2;
  transform: translate(-50%, -50%);
  transition: width var(--transition-base), height var(--transition-base);
}

.icon-button:hover::before {
  width: 100%;
  height: 100%;
}

.icon-button:hover {
  background: var(--color-accent-primary);
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-accent-primary);
}

.icon-button:active {
  transform: translateY(0);
}

.theme-toggle svg {
  transition: transform var(--transition-base);
}

.theme-toggle:hover svg {
  transform: rotate(20deg);
}

/* Main Editor Container */
.editor-container {
  flex: 1;
  padding: var(--space-2xl);
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}

.editor-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  height: 100%;
}

/* Stats Bar */
.stats-bar {
  display: flex;
  gap: var(--space-xl);
  padding: var(--space-lg);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  animation: slideDown var(--transition-base);
}

.stat {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  background: var(--color-bg-tertiary);
  transition: all var(--transition-fast);
}

.stat:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.stat.error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--color-error);
}

.stat-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.stat-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.stat.error .stat-value {
  color: var(--color-error);
}

/* Content Area - Side by Side Layout */
.content-area {
  display: flex;
  gap: var(--space-xl);
  flex: 1;
  min-height: 600px;
}

/* Editor Container Inner */
.editor-container-inner {
  position: relative;
  flex: 1;
  min-height: 600px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border);
  animation: fadeIn var(--transition-base);
}

.editor-container-inner:focus-within {
  box-shadow: var(--shadow-lg);
  border-color: var(--color-accent-primary);
}

.backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: var(--space-2xl);
  overflow: auto;
  pointer-events: none;
  z-index: 1;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.highlights {
  font-family: 'Inter', sans-serif;
  font-size: 1.125rem;
  line-height: 1.8;
  color: transparent;
  letter-spacing: -0.01em;
}

.text-content {
  color: transparent;
}

.ghost-text {
  color: var(--color-text-tertiary);
  opacity: 0.5;
  pointer-events: none;
  font-style: italic;
}

textarea {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  min-height: 600px;
  padding: var(--space-2xl);
  font-family: 'Inter', sans-serif;
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--color-text-primary);
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  white-space: pre-wrap;
  word-wrap: break-word;
  letter-spacing: -0.01em;
}

textarea::placeholder {
  color: var(--color-text-tertiary);
  opacity: 0.6;
}

/* Grammar Sidebar */
.grammar-sidebar {
  width: 340px;
  flex-shrink: 0;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  max-height: 600px;
  overflow-y: auto;
  position: sticky;
  top: var(--space-lg);
  box-shadow: var(--shadow-md);
  animation: slideUp var(--transition-base);
}

.panel-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-md);
  border-bottom: 2px solid var(--color-border);
}

.panel-icon {
  font-size: var(--font-size-2xl);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.panel-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.issues-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.issue-item {
  padding: var(--space-md);
  background: var(--color-bg-tertiary);
  border-left: 4px solid var(--color-error);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
  overflow: hidden;
}

.issue-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.1), transparent);
  transition: left var(--transition-slow);
}

.issue-item:hover::before {
  left: 100%;
}

.issue-item:hover {
  background: var(--color-bg-primary);
  transform: translateX(-4px);
  box-shadow: var(--shadow-md);
  border-left-width: 6px;
}

.issue-message {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  margin-bottom: var(--space-sm);
  font-weight: var(--font-weight-medium);
  line-height: 1.5;
}

.issue-fix {
  font-size: var(--font-size-sm);
  color: var(--color-success);
  font-weight: var(--font-weight-semibold);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

/* Transitions */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all var(--transition-base);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all var(--transition-base);
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .content-area {
    flex-direction: column;
  }
  
  .grammar-sidebar {
    width: 100%;
    position: static;
    max-height: 400px;
  }
}

@media (max-width: 768px) {
  .app-header {
    padding: var(--space-md) var(--space-lg);
  }
  
  .header-title h1 {
    font-size: var(--font-size-xl);
  }
  
  .subtitle {
    display: none;
  }
  
  .editor-container {
    padding: var(--space-md);
  }
  
  .stats-bar {
    gap: var(--space-md);
    flex-wrap: wrap;
    padding: var(--space-md);
  }
  
  .stat {
    flex: 1;
    min-width: 100px;
  }
  
  .editor-container-inner {
    min-height: 400px;
  }
  
  textarea {
    font-size: var(--font-size-base);
    min-height: 400px;
    padding: var(--space-lg);
  }

  .backdrop {
    padding: var(--space-lg);
  }
  
  .highlights {
    font-size: var(--font-size-base);
  }
  
  .grammar-sidebar {
    max-height: 300px;
  }
  
  .icon-button {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 480px) {
  .editor-container {
    padding: var(--space-sm);
  }
  
  .stats-bar {
    flex-direction: column;
    gap: var(--space-sm);
  }
  
  .stat {
    width: 100%;
  }
}
</style>
