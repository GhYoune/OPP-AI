<template>
  <div class="chat-header">
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
        <h1>AI Chatbot</h1>
        <p class="subtitle">Smart predictions & grammar assistance</p>
      </div>
    </div>
    
    <div class="header-actions">
      <button
        class="icon-button"
        @click="$emit('export')"
        title="Export chat"
        aria-label="Export chat"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
          <path d="M10 14V4M10 4L6 8M10 4L14 8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M4 16H16" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      
      <button
        class="icon-button"
        @click="$emit('clear')"
        title="Clear chat"
        aria-label="Clear chat"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
          <path d="M4 6H16M8 6V4H12V6M8 10V14M12 10V14M5 6L6 16H14L15 6H5Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      
      <button
        class="icon-button theme-toggle"
        @click="$emit('toggleTheme')"
        :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        <svg v-if="isDark" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2C10 2 10 2 10 2C14.4183 2 18 5.58172 18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 6.81465 3.91465 4.08183 6.66667 2.83333C6.66667 6.66667 6.66667 10 10 10C10 6.66667 10 2 10 2Z"/>
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <circle cx="10" cy="10" r="3"/>
          <path d="M10 1V3M10 17V19M19 10H17M3 10H1M16.364 3.636L14.95 5.05M5.05 14.95L3.636 16.364M16.364 16.364L14.95 14.95M5.05 5.05L3.636 3.636"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTheme } from '@/composables/useTheme';

defineEmits<{
  export: [];
  clear: [];
  toggleTheme: [];
}>();

const { theme } = useTheme();
const isDark = computed(() => theme.value === 'dark');
</script>

<style scoped>
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg) var(--space-xl);
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  transition: all var(--transition-base);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.logo {
  flex-shrink: 0;
}

.header-title h1 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin: 0;
  background: var(--color-accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
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
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  transition: all var(--transition-fast);
  cursor: pointer;
}

.icon-button:hover {
  background: var(--color-accent-primary);
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
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

@media (max-width: 768px) {
  .chat-header {
    padding: var(--space-md);
  }
  
  .subtitle {
    display: none;
  }
  
  .header-title h1 {
    font-size: var(--font-size-lg);
  }
}
</style>
