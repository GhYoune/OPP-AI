import { ref } from 'vue';
import { predictNextWord } from '@/services/huggingface';
import type { Prediction } from '@/types';

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

export function useTextPrediction() {
  const prediction = ref<Prediction | null>(null);
  const isLoading = ref(false);

  const getPrediction = async (text: string) => {
    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Don't predict for empty text
    if (!text || text.trim().length === 0) {
      prediction.value = null;
      return;
    }

    // Debounce the API call
    debounceTimer = setTimeout(async () => {
      isLoading.value = true;
      try {
        const result = await predictNextWord(text);
        prediction.value = result;
      } catch (error) {
        console.error('Prediction error:', error);
        prediction.value = null;
      } finally {
        isLoading.value = false;
      }
    }, 100); // Wait 100ms after user stops typing
  };

  const clearPrediction = () => {
    prediction.value = null;
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  };

  return {
    prediction,
    isLoading,
    getPrediction,
    clearPrediction,
  };
}
