'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Globe, Mic, MicOff, Copy, ThumbsUp, ThumbsDown, RotateCcw, Sparkles, MessageSquare, Languages } from 'lucide-react';
import { ChatMessage, ChatPanelProps, Language, QuickPrompt } from '../types';
import { aiLearningService } from '../services/aiService';
import { cn } from '@/lib/utils';
import { AVAILABLE_LANGUAGES, QUICK_PROMPTS } from '../utils/constants';



const ChatPanel: React.FC<ChatPanelProps> = ({
  courseId,
  selectedMaterial,
  language,
  onLanguageChange,
  className
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const currentLanguage = AVAILABLE_LANGUAGES.find(lang => lang.code === language) || AVAILABLE_LANGUAGES[0];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputMessage.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date(),
      language,
      materialContext: selectedMaterial?.id,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await aiLearningService.sendMessage({
        message: text,
        courseId,
        materialId: selectedMaterial?.id,
        language,
        context: selectedMaterial?.description,
        conversationHistory: messages
      });

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.content,
        timestamp: new Date(),
        language,
        materialContext: selectedMaterial?.id,
        confidence: response.confidence,
        sources: response.sources,
        sender: 'ai'
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        language,
        sender: 'ai'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.type === 'user';
    const isSystem = message.type === 'system';

    return (
      <div
        key={message.id}
        className={cn(
          "flex gap-3 p-4",
          isUser ? "justify-end" : "justify-start",
          isSystem && "justify-center"
        )}
      >
        {!isUser && !isSystem && (
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-blue-600" />
          </div>
        )}
        
        <div className={cn(
          "max-w-[80%] rounded-lg px-4 py-2",
          isUser && "bg-blue-600 text-white",
          !isUser && !isSystem && "bg-gray-100 text-gray-900",
          isSystem && "bg-yellow-100 text-yellow-800 text-sm"
        )}>
          <div className="whitespace-pre-wrap break-words line-clamp-3">
            {message.content}
          </div>
          
          <div className={cn(
            "flex items-center justify-between mt-2 text-xs",
            isUser ? "text-blue-100" : "text-gray-500"
          )}>
            <span>{formatTimestamp(message.timestamp)}</span>
            
            {!isUser && !isSystem && (
              <div className="flex items-center gap-2">
                {message.confidence && (
                  <span className="text-xs">
                    {Math.round(message.confidence * 100)}% confident
                  </span>
                )}
                
                <button
                  onClick={() => copyToClipboard(message.content)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  title="Copy message"
                >
                  <Copy className="w-3 h-3" />
                </button>
                
                <button
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  title="Helpful"
                >
                  <ThumbsUp className="w-3 h-3" />
                </button>
                
                <button
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  title="Not helpful"
                >
                  <ThumbsDown className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
          
          {message.sources && message.sources.length > 0 && (
            <div className="mt-2 text-xs text-gray-600">
              <span className="font-medium">Sources: </span>
              {message.sources.join(', ')}
            </div>
          )}
        </div>
        
        {isUser && (
          <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn("flex flex-col h-full bg-white", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Learning Assistant</h3>
            <p className="text-sm text-gray-600">
              {selectedMaterial ? `Discussing: ${selectedMaterial.title}` : 'Ready to help you learn'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg">{currentLanguage.flag}</span>
              <span className="text-sm font-medium">{currentLanguage.code.toUpperCase()}</span>
              <Languages className="w-4 h-4 text-gray-500" />
            </button>
            
            {showLanguageDropdown && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {AVAILABLE_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setShowLanguageDropdown(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors",
                      lang.code === language && "bg-blue-50 text-blue-700"
                    )}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-sm font-medium">{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button
            onClick={clearChat}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Clear chat"
          >
            <RotateCcw className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Start a conversation
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">
              Ask me anything about the course materials. I can explain concepts, provide examples, or help you understand complex topics.
            </p>
            
            {/* Quick Prompts */}
            <div className="grid grid-cols-1 gap-2 w-full max-w-md">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt.id}
                  onClick={() => handleSendMessage(prompt.text)}
                  className="flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  <span className="text-lg">{prompt.icon}</span>
                  <span className="text-sm font-medium text-gray-700 ">{prompt.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="pb-4">
            {messages.map(renderMessage)}
            {isLoading && (
              <div className="flex gap-3 p-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask me anything about ${selectedMaterial?.title || 'the course'}...`}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32"
              rows={1}
              disabled={isLoading}
            />
            
            {/* Voice Input Button */}
            {recognitionRef.current && (
              <button
                onClick={isListening ? stopListening : startListening}
                className={cn(
                  "absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg transition-colors",
                  isListening
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
                title={isListening ? "Stop listening" : "Start voice input"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}
          </div>
          
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className={cn(
              "p-3 rounded-lg transition-colors",
              inputMessage.trim() && !isLoading
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>{inputMessage.length}/1000</span>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;