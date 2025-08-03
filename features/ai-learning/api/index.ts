import api from "@/configs/api-config";
import { ResponseType } from "@/types/common";

// Types for AI Chat API
export interface SendMessagePayload {
  courseId: string;
  message: string;
  additionalInfo?: string;
  lang: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatHistory {
  _id: string;
  userId: string;
  courseId: string | {
    _id: string;
    title: string;
    code: string;
  };
  organizationId: string;
  messages: ChatMessage[];
  lang: string;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageResponse {
  response: string;
  chatHistory: ChatHistory;
}

// API Functions
export const sendMessageToAI = async (
  payload: SendMessagePayload
): Promise<ResponseType<SendMessageResponse>> => {
  try {
    const response = await api.post('/ai/chat/message', payload);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Message sent successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Failed to send message',
    };
  }
};

export const getChatHistory = async (
  courseId: string
): Promise<ResponseType<ChatHistory>> => {
  try {
    const response = await api.get(`/ai/chat/history/${courseId}`);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Chat history retrieved successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Failed to retrieve chat history',
    };
  }
};

export const getAllChatHistories = async (): Promise<ResponseType<ChatHistory[]>> => {
  try {
    const response = await api.get('/ai/chat/histories');
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Chat histories retrieved successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Failed to retrieve chat histories',
    };
  }
};