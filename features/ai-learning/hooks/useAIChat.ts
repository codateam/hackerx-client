'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage, Language, AIResponse } from '../types';
import { aiLearningService } from '../services/aiService';

interface UseAIChatOptions {
  courseId: string;
  language: Language;
  onError?: (error: string) => void;
  onSuccess?: (response: AIResponse) => void;
}

interface UseAIChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  isTyping: boolean;
  error: string | null;
  sendMessage: (content: string, type?: 'text' | 'voice') => Promise<void>;
  clearMessages: () => void;
  retryLastMessage: () => Promise<void>;
  exportChat: () => string;
  importChat: (chatData: string) => void;
}

export const useAIChat = ({
  courseId,
  language,
  onError,
  onSuccess,
}: UseAIChatOptions): UseAIChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastMessageRef = useRef<string>('');
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      content: `Hello! I'm your AI learning assistant. I'm here to help you understand the course material better. Feel free to ask me any questions about the content, request explanations, or get study tips. How can I assist you today?`,
      sender: 'ai',
      timestamp: new Date(),
      language: language.code,
    };
    
    setMessages([welcomeMessage]);
  }, [language.code]);

  const sendMessage = useCallback(async (
    content: string,
   
  ) => {
    if (!content.trim() || isLoading) return;

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: content.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: "user",
      language: language.code,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);
    setError(null);
    lastMessageRef.current = content.trim();

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const response = await aiLearningService.sendMessage({
        message: content.trim(),
        courseId,
        language: language.code,
        conversationHistory: messages.slice(-10), // Send last 10 messages for context
      }, abortControllerRef.current.signal);

      // Simulate typing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        content: response?.content || 'No response received',
        sender: 'ai',
        timestamp: new Date(),
        language: language.code,
        confidence: response?.confidence,
        sources: response?.sources,
      };

      setMessages(prev => [...prev, aiMessage]);
      if (response) {
        onSuccess?.(response);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return; // Request was cancelled, don't show error
      }

      const errorMessage = err.message || 'Failed to send message. Please try again.';
      setError(errorMessage);
      onError?.(errorMessage);

      // Add error message to chat
      const errorChatMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        content: 'Sorry, I encountered an error while processing your message. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
        language: language.code,
      };

      setMessages(prev => [...prev, errorChatMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  }, [courseId, language.code, messages, isLoading, onError, onSuccess]);

  const retryLastMessage = useCallback(async () => {
    if (lastMessageRef.current) {
      await sendMessage(lastMessageRef.current);
    }
  }, [sendMessage]);

  const clearMessages = useCallback(() => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const welcomeMessage: ChatMessage = {
      id: 'welcome-new',
      content: `Chat cleared! I'm ready to help you with your course material. What would you like to learn about?`,
      sender: 'ai',
      timestamp: new Date(),
      language: language.code,
    };
    
    setMessages([welcomeMessage]);
    setError(null);
    setIsLoading(false);
    setIsTyping(false);
    lastMessageRef.current = '';
  }, [language.code]);

  const exportChat = useCallback(() => {
    const chatData = {
      messages,
      courseId,
      language: language.code,
      exportedAt: new Date().toISOString(),
    };
    
    return JSON.stringify(chatData, null, 2);
  }, [messages, courseId, language.code]);

  const importChat = useCallback((chatData: string) => {
    try {
      const parsed = JSON.parse(chatData);
      
      if (parsed.messages && Array.isArray(parsed.messages)) {
        // Validate message structure
        const validMessages = parsed.messages.filter((msg: any) => 
          msg.id && msg.content && msg.sender && msg.timestamp
        );
        
        setMessages(validMessages);
        setError(null);
      } else {
        throw new Error('Invalid chat data format');
      }
    } catch (err) {
      setError('Failed to import chat data. Please check the format.');
      onError?.('Failed to import chat data');
    }
  }, [onError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    messages,
    isLoading,
    isTyping,
    error,
    sendMessage,
    clearMessages,
    retryLastMessage,
    exportChat,
    importChat,
  };
};

export default useAIChat;