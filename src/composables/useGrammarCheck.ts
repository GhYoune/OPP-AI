import { ref } from 'vue';
import { checkGrammar } from '@/services/languagetool';
import type { GrammarIssue } from '@/types';

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

export function useGrammarCheck() {
  const grammarIssues = ref<GrammarIssue[]>([]);
  const isChecking = ref(false);

  const checkText = async (text: string) => {
    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Don't check very short text
    if (text.trim().length < 3) {
      grammarIssues.value = [];
      return;
    }

    // Debounce the API call
    debounceTimer = setTimeout(async () => {
      isChecking.value = true;
      try {
        const issues = await checkGrammar(text);
        grammarIssues.value = issues;
      } catch (error) {
        console.error('Grammar check error:', error);
        grammarIssues.value = [];
      } finally {
        isChecking.value = false;
      }
    }, 800); // Wait 800ms after user stops typing
  };

  const clearIssues = () => {
    grammarIssues.value = [];
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  };

  return {
    grammarIssues,
    isChecking,
    checkText,
    clearIssues,
  };
}
