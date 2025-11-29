<template>
  <div
    class="chat-message"
    :class="[message.sender, 'slide-up']"
  >
    <div class="message-bubble">
      <div class="message-content">
        <p v-if="!hasGrammarIssues">{{ message.text }}</p>
        <p v-else v-html="highlightedText"></p>
      </div>
      
      <div class="message-footer">
        <span class="message-time">{{ formattedTime }}</span>
        <button
          class="copy-button"
          @click="handleCopy"
          :title="copied ? 'Copied!' : 'Copy message'"
          :aria-label="copied ? 'Copied!' : 'Copy message'"
        >
          <svg v-if="!copied" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
            <rect x="5" y="5" width="9" height="9" rx="1" stroke-width="1.5"/>
            <path d="M3 11V3C3 2.44772 3.44772 2 4 2H10" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
            <path d="M3 8L6 11L13 4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      
      <div v-if="hasGrammarIssues" class="grammar-badge">
        {{ message.grammarIssues!.length }} grammar {{ message.grammarIssues!.length === 1 ? 'issue' : 'issues' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Message } from '@/types';
import { copyToClipboard } from '@/utils/clipboard';

const props = defineProps<{
  message: Message;
}>();

const copied = ref(false);

const formattedTime = computed(() => {
  const date = new Date(props.message.timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
});

const hasGrammarIssues = computed(() => {
  return props.message.grammarIssues && props.message.grammarIssues.length > 0;
});

const highlightedText = computed(() => {
  if (!hasGrammarIssues.value) return props.message.text;
  
  let text = props.message.text;
  const issues = [...props.message.grammarIssues!].sort((a, b) => b.offset - a.offset);
  
  issues.forEach((issue) => {
    const before = text.substring(0, issue.offset);
    const error = text.substring(issue.offset, issue.offset + issue.length);
    const after = text.substring(issue.offset + issue.length);
    
    text = `${before}<span class="grammar-error" title="${issue.message}">${error}</span>${after}`;
  });
  
  return text;
});

const handleCopy = async () => {
  const success = await copyToClipboard(props.message.text);
  if (success) {
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  }
};
</script>

<style scoped>
.chat-message {
  display: flex;
  margin-bottom: var(--space-md);
  animation: slideUp var(--transition-base);
}

.chat-message.user {
  justify-content: flex-end;
}

.chat-message.ai {
  justify-content: flex-start;
}

.message-bubble {
  position: relative;
  max-width: 70%;
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.message-bubble:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.user .message-bubble {
  background: var(--color-user-message);
  color: white;
  border-bottom-right-radius: var(--radius-sm);
}

.ai .message-bubble {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-bottom-left-radius: var(--radius-sm);
}

.message-content {
  margin-bottom: var(--space-sm);
}

.message-content p {
  margin: 0;
  line-height: var(--line-height-relaxed);
  word-wrap: break-word;
}

.message-content :deep(.grammar-error) {
  background: rgba(239, 68, 68, 0.2);
  border-bottom: 2px wavy var(--color-error);
  cursor: help;
  padding: 0 2px;
  border-radius: 2px;
}

.message-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
}

.message-time {
  font-size: var(--font-size-xs);
  opacity: 0.7;
}

.copy-button {
  opacity: 0;
  padding: var(--space-xs);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.message-bubble:hover .copy-button {
  opacity: 0.7;
}

.copy-button:hover {
  opacity: 1 !important;
  background: rgba(0, 0, 0, 0.1);
}

.user .copy-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.grammar-badge {
  position: absolute;
  top: -8px;
  right: var(--space-md);
  background: var(--color-error);
  color: white;
  font-size: var(--font-size-xs);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-medium);
  box-shadow: var(--shadow-md);
}

@media (max-width: 768px) {
  .message-bubble {
    max-width: 85%;
  }
}
</style>
