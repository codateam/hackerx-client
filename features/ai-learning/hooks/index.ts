export { useAIChat, default as useAIChatDefault } from './useAIChat';
export { useCourseMaterials, default as useCourseMaterialsDefault } from './useCourseMaterials';
export { useSpeech, default as useSpeechDefault, getVoicesForLanguage } from './useSpeech';
export {
  useSendMessageMutation,
  useChatHistory,
  useAllChatHistories,
  useAIChatIntegration,
  AI_CHAT_QUERY_KEYS,
} from './useAIChatAPI';

// Re-export types for convenience
export type {
  ChatMessage,
  Language,
  AIResponse,
  CourseMaterial,
} from '../types';