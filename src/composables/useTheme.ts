import { ref } from 'vue';
import type { Theme } from '@/types';

const STORAGE_KEY = 'ai-chatbot-theme';

const theme = ref<Theme>('light');

// Load theme from localStorage or system preference
const loadTheme = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored) {
      theme.value = stored;
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme.value = prefersDark ? 'dark' : 'light';
    }
  } catch (error) {
    console.error('Error loading theme:', error);
  }
};

// Apply theme to document
const applyTheme = (newTheme: Theme) => {
  document.documentElement.setAttribute('data-theme', newTheme);
  try {
    localStorage.setItem(STORAGE_KEY, newTheme);
  } catch (error) {
    console.error('Error saving theme:', error);
  }
};

export function useTheme() {
  // Load theme on first use
  if (!document.documentElement.hasAttribute('data-theme')) {
    loadTheme();
    applyTheme(theme.value);
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    applyTheme(theme.value);
  };

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme;
    applyTheme(newTheme);
  };

  return {
    theme,
    toggleTheme,
    setTheme,
  };
}
