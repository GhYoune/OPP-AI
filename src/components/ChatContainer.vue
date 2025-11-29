<template>
  <div class="chat-container" ref="containerRef">
    <div v-if="messages.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" stroke="url(#emptyGradient)" stroke-width="2" stroke-dasharray="4 4"/>
          <path d="M32 20V32L40 40" stroke="url(#emptyGradient)" stroke-width="3" stroke-linecap="round"/>
          <defs>
            <linearGradient id="emptyGradient" x1="0" y1="0" x2="64" y2="64">
              <stop offset="0%" stop-color="#667eea" />
              <stop offset="100%" stop-color="#764ba2" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <h2>Start a Conversation</h2>
      <p>Type a message below to begin chatting with AI assistance</p>
      <div class="features">
        <div class="feature">
          <span class="feature-icon">🤖</span>
          <span>AI Text Prediction</span>
        </div>
        <div class="feature">
          <span class="feature-icon">✍️</span>
          <span>Grammar Correction</span>
        </div>
        <div class="feature">
          <span class="feature-icon">💬</span>
          <span>Smart Responses</span>
        </div>
      </div>
    </div>
    
    <div v-else class="messages-list">
      <ChatMessage
        v-for="message in messages"
        :key="message.id"
        :message="message"
      />
      
      <div v-if="isTyping" class="typing-message">
        <div class="typing-bubble">
          <TypingIndicator />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import type { Message } from '@/types';
import ChatMessage from './ChatMessage.vue';
import TypingIndicator from './TypingIndicator.vue';

const props = defineProps<{
  messages: Message[];
  isTyping: boolean;
}>();

const containerRef = ref<HTMLElement | null>(null);

const scrollToBottom = () => {
  nextTick(() => {
    if (containerRef.value) {
      containerRef.value.scrollTo({
        top: containerRef.value.scrollHeight,
        behavior: 'smooth',
      });
    }
  });
};

// Watch for new messages and scroll
watch(
  () => props.messages.length,
  () => {
    scrollToBottom();
  }
);
</script>

<style scoped>
.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-xl);
  background: var(--color-bg-primary);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: var(--space-2xl);
  animation: fadeIn var(--transition-slow);
}

.empty-icon {
  margin-bottom: var(--space-xl);
  animation: pulse 3s ease-in-out infinite;
}

.empty-state h2 {
  margin-bottom: var(--space-sm);
  background: var(--color-accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.empty-state p {
  color: var(--color-text-secondary);
  margin-bottom: var(--space-xl);
}

.features {
  display: flex;
  gap: var(--space-lg);
  flex-wrap: wrap;
  justify-content: center;
}

.feature {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
}

.feature:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-accent-primary);
}

.feature-icon {
  font-size: var(--font-size-xl);
}

.messages-list {
  display: flex;
  flex-direction: column;
}

.typing-message {
  display: flex;
  justify-content: flex-start;
  margin-bottom: var(--space-md);
  animation: fadeIn var(--transition-base);
}

.typing-bubble {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  border-bottom-left-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
}

@media (max-width: 768px) {
  .chat-container {
    padding: var(--space-md);
  }
  
  .features {
    flex-direction: column;
    gap: var(--space-sm);
  }
  
  .feature {
    width: 100%;
  }
}
</style>
