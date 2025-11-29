import { ref, watch } from 'vue';
import type { Message } from '@/types';

const STORAGE_KEY = 'ai-chatbot-messages';

const messages = ref<Message[]>([]);
const isTyping = ref(false);

// Load messages from localStorage on initialization
const loadMessages = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      messages.value = JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading messages:', error);
  }
};

// Save messages to localStorage
const saveMessages = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.value));
  } catch (error) {
    console.error('Error saving messages:', error);
  }
};

// Watch for changes and save
watch(messages, saveMessages, { deep: true });

export function useChat() {
  // Load messages on first use
  if (messages.value.length === 0) {
    loadMessages();
  }

  const addMessage = (text: string, sender: 'user' | 'ai') => {
    const message: Message = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      sender,
      timestamp: Date.now(),
    };
    messages.value.push(message);
    return message;
  };

  const updateMessage = (id: string, updates: Partial<Message>) => {
    const index = messages.value.findIndex((m) => m.id === id);
    if (index !== -1) {
      messages.value[index] = { ...messages.value[index], ...updates };
    }
  };

  const clearMessages = () => {
    messages.value = [];
    localStorage.removeItem(STORAGE_KEY);
  };

  const simulateAIResponse = async (userMessage: string) => {
    isTyping.value = true;
    
    // Simulate AI thinking time
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    // Generate a simple response
    const responses = [
      "That's an interesting point! Let me help you with that.",
      "I understand what you're saying. Here's my perspective...",
      "Great question! Based on what you've shared...",
      "I've processed your message. Here's what I think...",
      "Thanks for sharing that. Let me provide some insights...",
    ];
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    addMessage(response, 'ai');
    
    isTyping.value = false;
  };

  return {
    messages,
    isTyping,
    addMessage,
    updateMessage,
    clearMessages,
    simulateAIResponse,
  };
}
