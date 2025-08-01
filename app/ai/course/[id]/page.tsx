'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

import { useParams, useRouter } from 'next/navigation';
import { CustomCard } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { 
  MessageCircle, 
  Send, 
  FileText, 
  Download, 
  Globe, 
  ChevronLeft,
  ChevronRight,
  Bot,
  User,
  Lightbulb,
  X,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIChatIntegration, useChatHistory } from '@/features/ai-learning/hooks';

import { AVAILABLE_LANGUAGES, QUICK_PROMPTS } from '@/features/ai-learning/utils/constants';
import { ChatMessage } from '@/features/ai-learning/types';
import { useCourse } from '@/features/courses/hooks/useCourses';
import { stripOnlyMarkdownBlock } from '@/features/ai-learning/helper/helper';

interface CourseMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'document' | 'link';
  url: string;
  description?: string;
  size?: string;
}



interface Course {
  id: string;
  title: string;
  description: string;
  materials: CourseMaterial[];
}

// Helper function to convert course materials from API
const convertCourseMaterials = (courseMaterials: string[] = []): CourseMaterial[] => {
  return courseMaterials.map((url, index) => ({
    id: `material-${index + 1}`,
    title: `Course Material ${index + 1}`,
    type: url.toLowerCase().includes('.pdf') ? 'pdf' : 
          url.toLowerCase().includes('.mp4') || url.toLowerCase().includes('.avi') ? 'video' :
          url.toLowerCase().includes('.doc') || url.toLowerCase().includes('.docx') ? 'document' : 'link',
    url,
    description: `Course material ${index + 1}`,
    size: undefined
  }));
};



export default function AICoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  
  // API hooks
  const { sendMessage: sendMessageToAPI, isSendingMessage } = useAIChatIntegration(courseId);
  const { data: chatHistory, isLoading: isLoadingHistory } = useChatHistory(courseId);
  const { course, loading: courseLoading, error: courseError, loadCourse } = useCourse(courseId);
  
  // State management
  const [error, setError] = useState<string | null>(null);
  const loading = courseLoading;
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<CourseMaterial | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [displayCourse, setDisplayCourse] = useState<Course | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);



  // Fetch course data
  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  // Set error from course hook
  useEffect(() => {
    if (courseError) {
      setError(courseError);
    }
  }, [courseError]);

  // Convert API course data to display format
  useEffect(() => {
    if (course) {
      const convertedCourse: Course = {
        id: course._id || course.id || courseId,
        title: course.title,
        description: course.description,
        materials: convertCourseMaterials(course.courseMaterials)
      };
      setDisplayCourse(convertedCourse);
      
      // Set first material as selected if available
      if (convertedCourse.materials.length > 0) {
        setSelectedMaterial(convertedCourse.materials[0]);
      }
    }
  }, [course, courseId]);

  // Auto-scroll chat to bottom
  // Load chat history when component mounts
  useEffect(() => {
    if (chatHistory?.messages) {
      const formattedMessages: ChatMessage[] = chatHistory.messages.map((msg, index) => ({
         id: `${msg.timestamp}-${index}`,
         content: msg.content,
         timestamp: new Date(msg.timestamp),
         language: chatHistory.lang,
         sender: msg.role === 'user' ? 'user' : 'ai'
       }));
      setChatMessages(formattedMessages);
    }
  }, [chatHistory]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Send message to AI
  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      timestamp: new Date(),
      language: selectedLanguage,
      sender: 'user'
    };

    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setShowQuickPrompts(false);

    try {
      const additionalInfo = selectedMaterial 
        ? `Current material: ${selectedMaterial.title} - ${selectedMaterial.description}`
        : 'General course discussion';

      const response = await sendMessageToAPI({
        courseId,
        message,
        additionalInfo,
        lang: selectedLanguage
      });

      if (response.success && response.data) {
        // Display AI response as explanation
        setAiExplanation(response.data.response);
        setShowExplanation(true);
        
        // Add confirmation message to chat
        const confirmationMessage: ChatMessage = {
             id: (Date.now() + 1).toString(),
             content: `✅ I've generated an explanation for "${message}" and displayed it in the explanation panel. You can see the detailed response above.`,
             timestamp: new Date(),
             language: selectedLanguage,
             sender: 'ai'
           };
        setChatMessages(prev => [...prev, confirmationMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
           id: (Date.now() + 1).toString(),
           content: 'Sorry, I encountered an error while processing your message. Please try again.',
           timestamp: new Date(),
           sender: 'ai'
         };
      setChatMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isSendingMessage) {
      e.preventDefault();
      sendMessage(currentMessage);
    }
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'video': return '🎥';
      case 'document': return '📝';
      case 'link': return '🔗';
      default: return '📄';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ErrorState message={error || 'Course not found'} onGoBack={() => router.back()} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Course Materials Sidebar */}
      <motion.div
        initial={false}
        animate={{ 
          width: sidebarCollapsed ? 60 : 320,
        }}
        transition={{ duration: 0.3 }}
        className={`bg-white border-r border-gray-200 flex flex-col shadow-md h-full ${
          mobileMenuOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden md:flex md:relative'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900 truncate">{displayCourse?.title || 'Loading...'}</h2>
              <p className="text-sm text-gray-500 mt-1">Course Materials</p>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Materials List */}
        {!sidebarCollapsed && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {displayCourse?.materials?.map((material) => (
              <motion.div
                key={material.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMaterial(material)}
                className={`p-3 rounded-md border cursor-pointer transition-all ${
                  selectedMaterial?.id === material.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{getMaterialIcon(material.type)}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{material.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{material.description}</p>
                    {material.size && (
                      <p className="text-xs text-gray-400 mt-1">{material.size}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {material.type.toUpperCase()}
                  </span>
                  <Download size={16} className="text-gray-400 hover:text-gray-600" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
             <button
               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
               className="p-2 hover:bg-gray-100 rounded-md transition-colors md:hidden"
             >
               <Menu size={20} className="text-gray-600" />
             </button>
             
             {/* Desktop Sidebar Toggle */}
             <button
               onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
               className="p-2 hover:bg-gray-100 rounded-md transition-colors hidden md:block"
             >
               <Menu size={20} className="text-gray-600" />
             </button>
            <div className="flex items-center space-x-2">
              <FileText className="text-blue-600" size={24} />
              <h1 className="text-md md:text-xl font-semibold text-gray-900 truncate">
                {selectedMaterial?.title || 'Select a material'}
              </h1>
            </div>
          </div>
          
          {/* Language Selector */}
          <div className="flex items-center space-x-3">
            <Globe size={20} className="text-gray-500" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {AVAILABLE_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content and Chat Area */}
        <div className="flex-1 max-h-[calc(100vh-80px)] flex flex-col md:flex-row ">
          {/* AI Explanation Content */}
          <div className="flex-1 bg-white p-3  md:p-6 overflow-y-scroll md:flex hidden">
            {showExplanation && aiExplanation ? (
              <CustomCard className="h-full shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                        <Bot className="text-white" size={18} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">AI Explanation</h3>
                        <p className="text-sm text-gray-500">Powered by advanced AI</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowExplanation(false)}
                      className="p-2 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 group"
                    >
                      <X size={20} className="text-gray-400 group-hover:text-red-500" />
                    </button>
                  </div>
                  
                  <div className="flex-1 min-h-0">
                    <div className="h-full overflow-y-auto overflow-x-hidden bg-gradient-to-br from-gray-50 to-white rounded-xl p-3 md:p-6 shadow-inner border border-gray-100">
                      <div className="prose prose-sm md:prose-base md:prose-md max-w-none break-words ">
                        <ReactMarkdown 
                        //   components={{
                        //     h1: ({ children }) => (
                        //       <h1 className="text-md md:text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 pb-2 border-b border-gray-200">
                        //         {children}
                        //       </h1>
                        //     ),
                        //     h2: ({ children }) => (
                        //       <h2 className="text-base md:text-md md:text-xl font-semibold text-gray-800 mb-2 md:mb-3 mt-4 md:mt-6">
                        //         {children}
                        //       </h2>
                        //     ),
                        //     h3: ({ children }) => (
                        //       <h3 className="text-sm md:text-base md:text-md font-medium text-gray-800 mb-2 mt-3 md:mt-4">
                        //         {children}
                        //       </h3>
                        //     ),
                        //     p: ({ children }) => (
                        //       <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-3 md:mb-4 break-words">
                        //         {children}
                        //       </p>
                        //     ),
                        //     pre: ({ children }) => (
                        //       <div className="my-3 md:my-4">
                        //         <pre className="overflow-x-auto bg-gray-900 text-gray-100 p-2 md:p-3 md:p-4 rounded-md text-xs md:text-sm border border-gray-200 shadow-sm">
                        //           {children}
                        //         </pre>
                        //       </div>
                        //     ),
                        //     code: ({ children, className }) => {
                        //       const isInline = !className;
                        //       return isInline ? (
                        //         <code className="bg-blue-50 text-blue-800 px-1 md:px-2 py-0.5 md:py-1 rounded text-xs md:text-sm font-medium border border-blue-200 break-all">
                        //           {children}
                        //         </code>
                        //       ) : (
                        //         <code className="text-gray-100">{children}</code>
                        //       );
                        //     },
                        //     blockquote: ({ children }) => (
                        //       <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 text-gray-700 italic rounded-r-md">
                        //         {children}
                        //       </blockquote>
                        //     ),
                        //     ul: ({ children }) => (
                        //       <ul className="list-disc list-inside space-y-1 md:space-y-2 mb-3 md:mb-4 text-sm md:text-base text-gray-700">
                        //         {children}
                        //       </ul>
                        //     ),
                        //     ol: ({ children }) => (
                        //       <ol className="list-decimal list-inside space-y-1 md:space-y-2 mb-3 md:mb-4 text-sm md:text-base text-gray-700">
                        //         {children}
                        //       </ol>
                        //     ),
                        //     li: ({ children }) => (
                        //       <li className="break-words text-sm md:text-base">{children}</li>
                        //     ),
                        //     table: ({ children }) => (
                        //       <div className="overflow-x-auto my-3 md:my-4 rounded-md border border-gray-200 shadow-sm">
                        //         <table className="min-w-full bg-white text-xs md:text-sm">{children}</table>
                        //       </div>
                        //     ),
                        //     th: ({ children }) => (
                        //       <th className="px-2 md:px-3 md:px-4 py-2 md:py-3 bg-gray-50 text-left text-xs md:text-sm font-semibold text-gray-900 border-b border-gray-200">
                        //         {children}
                        //       </th>
                        //     ),
                        //     td: ({ children }) => (
                        //       <td className="px-2 md:px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-700 border-b border-gray-100">
                        //         {children}
                        //       </td>
                        //     )
                        //   }}
                        >
                          {stripOnlyMarkdownBlock(aiExplanation)}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              </CustomCard>
            ) : (
              <div className="md:h-full items-center justify-center hidden md:flex">
                <div className="text-center max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Bot size={40} className="text-white" />
                  </div>
                  <h3 className="text-md  md:text-2xl font-bold text-gray-800 mb-3">AI Learning Assistant</h3>
                  <p className="text-sm md:text-base text-gray-500 leading-relaxed">Ask questions in the chat to get detailed AI explanations displayed here. I'm here to help you understand the course material better!</p>
                </div>
              </div>
            )}
          </div>

          {/* AI Chat Panel - Responsive */}
          <div className="w-full md:w-96 bg-white border-t md:border-t-0 md:border-l border-gray-200 flex flex-col flex-shrink-0 shadow-xl md:shadow-none  overflow-hidden">
            {/* Chat Header */}
            <div className="p-3 md:p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 flex-shrink-0">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-8 h-8  md:h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-md md:rounded-xl flex items-center justify-center shadow-md">
                  <Bot className="text-white w-4 h-4 md:h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm md:text-base md:text-md">AI Assistant</h3>
                  <p className="text-xs md:text-sm text-gray-600">Ask questions about the course material</p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-3 md:p-4 overflow-y-auto space-y-3 md:space-y-4 min-h-0">
              {chatMessages.length === 0 && showQuickPrompts && (
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-600 mb-2 md:mb-3">
                    <Lightbulb className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span>Quick prompts to get started:</span>
                  </div>
                  {QUICK_PROMPTS.map((prompt, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => sendMessage(prompt.text)}
                      className="w-full text-left p-2 md:p-3 bg-gray-50 hover:bg-gray-100 rounded-md text-xs md:text-sm text-gray-700 transition-colors break-words "
                    >
                      {prompt.text}
                    </motion.button>
                  ))}
                </div>
              )}
              
              <AnimatePresence>
                {chatMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex space-x-2 md:space-x-3 ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.sender === 'ai' && (
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="text-white w-3 h-3 md:w-4 md:h-4" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[75%] md:max-w-[80%] p-2 md:p-3 rounded-md ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900 '
                      }`}
                    >
                      <p className="text-xs md:text-sm whitespace-pre-wrap break-words md:line-clamp-3">{message.content}</p>
                      <div className="flex justify-between items-end mt-1 md:mt-2">
                        <p className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                        {message.sender === 'ai' && (
                          <button
                            onClick={() => {
                              setAiExplanation(message.content);
                              setShowExplanation(true);
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 underline cursor-pointer ml-2 flex-shrink-0"
                          >
                            View details
                          </button>
                        )}
                      </div>    
                     
                    </div>
                    
                    {message.sender === 'user' && (
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="text-gray-600 w-3 h-3 md:w-4 md:h-4" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isSendingMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex space-x-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="text-white w-4 h-4" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-3 md:p-4 border-t border-gray-200 flex-shrink-0">
              <div className="flex space-x-2">
                <textarea
                  ref={messageInputRef}
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Ask a question in ${AVAILABLE_LANGUAGES.find(l => l.code === selectedLanguage)?.name}...`}
                  className="flex-1 resize-none border border-gray-300 rounded-md px-2 md:px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-16 md:max-h-24"
                  rows={1}
                />
                <button
                    onClick={() => sendMessage(currentMessage)}
                    disabled={!currentMessage.trim() || isSendingMessage}
                    className="px-3 md:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[44px] md:min-w-[48px]"
                  >
                    {isSendingMessage ? (
                      <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-3 h-3 md:w-4 md:h-4" />
                    )}
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}