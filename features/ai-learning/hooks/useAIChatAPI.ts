import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { toast } from 'sonner';
import {
  sendMessageToAI,
  getChatHistory,
  getAllChatHistories,
  SendMessagePayload,
  ChatHistory,
  SendMessageResponse,
} from '../api';

// Query Keys
export const AI_CHAT_QUERY_KEYS = {
  chatHistory: (courseId: string) => ['ai-chat-history', courseId],
  allChatHistories: () => ['ai-chat-histories'],
} as const;

// Send Message Mutation
export const useSendMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessageToAI,
    onSuccess: (data, variables) => {
      if (data.success) {
        // Invalidate and refetch chat history for the specific course
        queryClient.invalidateQueries({
          queryKey: AI_CHAT_QUERY_KEYS.chatHistory(variables.courseId),
        });
        
        // Invalidate all chat histories
        queryClient.invalidateQueries({
          queryKey: AI_CHAT_QUERY_KEYS.allChatHistories(),
        });
        
        // toast.success('Message sent successfully');
      } else {
        // toast.error(data.message || 'Failed to send message');
      }
    },
    onError: (error: any) => {
      // toast.error(error.message || 'Failed to send message');
    },
  });
};

// Get Chat History Query
export const useChatHistory = (courseId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: AI_CHAT_QUERY_KEYS.chatHistory(courseId),
    queryFn: () => getChatHistory(courseId),
    enabled: enabled && !!courseId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => {
      if (data.success && data.data) {
        return data.data;
      }
      return null;
    },
  });
};

// Get All Chat Histories Query
export const useAllChatHistories = (enabled: boolean = true) => {
  return useQuery({
    queryKey: AI_CHAT_QUERY_KEYS.allChatHistories(),
    queryFn: getAllChatHistories,
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => {
      if (data.success && data.data) {
        return data.data;
      }
      return [];
    },
  });
};

// Custom hook for AI Chat functionality
export const useAIChatIntegration = (courseId: string) => {
  const sendMessageMutation = useSendMessageMutation();
  const { data: chatHistory, isLoading: isLoadingHistory, refetch: refetchHistory } = useChatHistory(courseId);

  const sendMessage = async (payload: SendMessagePayload) => {
    try {
      const result = await sendMessageMutation.mutateAsync(payload);
      return result;
    } catch (error) {
      throw error;
    }
  };

  return {
    // Data
    chatHistory,
    messages: chatHistory?.messages || [],
    
    // Loading states
    isLoadingHistory,
    isSendingMessage: sendMessageMutation.isPending,
    
    // Actions
    sendMessage,
    refetchHistory,
    
    // Error states
    sendMessageError: sendMessageMutation.error,
    historyError: null, // Add error handling if needed
  };
};