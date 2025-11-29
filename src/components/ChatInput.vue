<template>
  <div class="chat-input-wrapper">
    <!-- Prediction Panel -->
    <transition name="slide-down">
      <div v-if="prediction" class="prediction-panel" @click="acceptPrediction">
        <div class="panel-header">
          <span class="panel-icon">🤖</span>
          <span class="panel-title">Suggested continuation</span>
        </div>
        <div class="prediction-text">{{ prediction.text }}</div>
        <div class="panel-hint">Click to accept</div>
      </div>
    </transition>
    
    <!-- Grammar Panel -->
    <transition name="slide-down">
      <div v-if="grammarIssues.length > 0" class="grammar-panel">
        <div class="panel-header">
          <span class="panel-icon">✍️</span>
          <span class="panel-title">{{ grammarIssues.length }} grammar {{ grammarIssues.length === 1 ? 'issue' : 'issues' }} found</span>
        </div>
        <div class="grammar-issues">
          <div
            v-for="(issue, index) in grammarIssues.slice(0, 3)"
            :key="index"
            class="grammar-issue"
            @click="applyCorrection(issue)"
          >
            <div class="issue-message">{{ issue.shortMessage }}</div>
            <div v-if="issue.replacements.length > 0" class="issue-suggestion">
              → {{ issue.replacements[0] }}
            </div>
          </div>
        </div>
      </div>
    </transition>
    
    <!-- Input Area -->
    <div class="chat-input">
      <textarea
        ref="textareaRef"
        v-model="inputText"
        @input="handleInput"
        @keydown.enter.exact.prevent="handleSend"
        placeholder="Type your message..."
        rows="1"
        :disabled="isSending"
      ></textarea>
      
      <div class="input-actions">
        <span class="char-counter" :class="{ warning: inputText.length > 500 }">
          {{ inputText.length }}
        </span>
        
        <button
          class="send-button"
          @click="handleSend"
          :disabled="!canSend"
          :aria-label="isSending ? 'Sending...' : 'Send message'"
        >
          <svg v-if="!isSending" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 3L18 10L2 17V11L13 10L2 9V3Z"/>
          </svg>
          <div v-else class="spinner"></div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import type { Prediction, GrammarIssue } from '@/types';
import { useTextPrediction } from '@/composables/useTextPrediction';
import { useGrammarCheck } from '@/composables/useGrammarCheck';

const emit = defineEmits<{
  send: [text: string];
}>();

const inputText = ref('');
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const isSending = ref(false);

const { prediction, getPrediction, clearPrediction } = useTextPrediction();
const { grammarIssues, checkText, clearIssues } = useGrammarCheck();

const canSend = computed(() => {
  return inputText.value.trim().length > 0 && !isSending.value;
});

const handleInput = () => {
  // Auto-resize textarea
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
    textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 150)}px`;
  }
  
  // Trigger prediction and grammar check
  const text = inputText.value;
  if (text.trim().length > 0) {
    getPrediction(text);
    checkText(text);
  } else {
    clearPrediction();
    clearIssues();
  }
};

const handleSend = async () => {
  if (!canSend.value) return;
  
  isSending.value = true;
  const text = inputText.value.trim();
  
  emit('send', text);
  
  // Clear input and reset
  inputText.value = '';
  clearPrediction();
  clearIssues();
  
  // Reset textarea height
  await nextTick();
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
  }
  
  isSending.value = false;
};

const acceptPrediction = () => {
  if (prediction.value) {
    inputText.value += ' ' + prediction.value.text;
    clearPrediction();
    handleInput();
    textareaRef.value?.focus();
  }
};

const applyCorrection = (issue: GrammarIssue) => {
  if (issue.replacements.length > 0) {
    const before = inputText.value.substring(0, issue.offset);
    const after = inputText.value.substring(issue.offset + issue.length);
    inputText.value = before + issue.replacements[0] + after;
    handleInput();
    textareaRef.value?.focus();
  }
};

// Focus textarea on mount
watch(textareaRef, (el) => {
  if (el) {
    el.focus();
  }
});
</script>

<style scoped>
.chat-input-wrapper {
  position: relative;
  background: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border);
  padding: var(--space-lg);
}

.prediction-panel,
.grammar-panel {
  position: absolute;
  bottom: 100%;
  left: var(--space-lg);
  right: var(--space-lg);
  margin-bottom: var(--space-sm);
  background: var(--color-bg-glass);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  box-shadow: var(--shadow-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.prediction-panel:hover,
.grammar-panel:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

.panel-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.panel-icon {
  font-size: var(--font-size-lg);
}

.prediction-text {
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  margin-bottom: var(--space-xs);
  font-style: italic;
}

.panel-hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.grammar-issues {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.grammar-issue {
  padding: var(--space-sm);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--color-error);
  transition: all var(--transition-fast);
}

.grammar-issue:hover {
  background: var(--color-bg-tertiary);
  transform: translateX(4px);
}

.issue-message {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  margin-bottom: var(--space-xs);
}

.issue-suggestion {
  font-size: var(--font-size-xs);
  color: var(--color-success);
  font-weight: var(--font-weight-medium);
}

.chat-input {
  display: flex;
  align-items: flex-end;
  gap: var(--space-md);
  background: var(--color-bg-tertiary);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-md);
  transition: all var(--transition-fast);
}

.chat-input:focus-within {
  border-color: var(--color-accent-primary);
  box-shadow: var(--shadow-glow);
}

textarea {
  flex: 1;
  min-height: 24px;
  max-height: 150px;
  font-family: inherit;
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--color-text-primary);
  background: transparent;
  border: none;
  outline: none;
  resize: none;
}

textarea::placeholder {
  color: var(--color-text-tertiary);
}

textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-actions {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.char-counter {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  font-weight: var(--font-weight-medium);
  min-width: 30px;
  text-align: right;
}

.char-counter.warning {
  color: var(--color-warning);
}

.send-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  background: var(--color-accent-gradient);
  color: white;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.send-button:not(:disabled):hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: var(--shadow-glow);
}

.send-button:not(:disabled):active {
  transform: translateY(0) scale(1);
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all var(--transition-base);
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .chat-input-wrapper {
    padding: var(--space-md);
  }
  
  .prediction-panel,
  .grammar-panel {
    left: var(--space-md);
    right: var(--space-md);
  }
}
</style>
