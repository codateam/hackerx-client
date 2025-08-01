import { Language } from './types';

// Components
export {
  MaterialSidebar,
  ChatPanel,
  MaterialViewer,
  LanguageSelector,
  QuickPrompts,
} from './components';

// Hooks
export {
  useAIChat,
  useCourseMaterials,
  useSpeech,
  getVoicesForLanguage,
} from './hooks';

// Services
// export { aiServic } from './services/aiService';

// Types
export type {
  CourseMaterial,
  ChatMessage,
  AILearningCourse,
  Language,
  QuickPrompt,
  AIResponse,
  ChatSession,
  LearningAnalytics,
  MaterialViewerProps,
  ChatPanelProps,
  MaterialSidebarProps,
  AILearningPageProps,
} from './types';


export const MATERIAL_TYPES = [
  { value: 'pdf', label: 'PDF Documents', icon: '📄' },
  { value: 'video', label: 'Videos', icon: '🎥' },
  { value: 'audio', label: 'Audio Files', icon: '🎵' },
  { value: 'image', label: 'Images', icon: '🖼️' },
  { value: 'link', label: 'External Links', icon: '🔗' },
  { value: 'document', label: 'Documents', icon: '📝' },
  { value: 'presentation', label: 'Presentations', icon: '📊' },
  { value: 'quiz', label: 'Quizzes', icon: '❓' },
  { value: 'assignment', label: 'Assignments', icon: '📋' },
];

export const SORT_OPTIONS = [
  { value: 'order', label: 'Default Order' },
  { value: 'title', label: 'Title (A-Z)' },
  { value: 'type', label: 'Type' },
  { value: 'duration', label: 'Duration' },
  { value: 'progress', label: 'Progress' },
  { value: 'recent', label: 'Recently Accessed' },
];