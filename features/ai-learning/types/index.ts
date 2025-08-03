export interface CourseMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'document' | 'link' | 'image' | 'audio';
  url: string;
  description?: string;
  size?: string;
  duration?: string; // for video/audio
  pages?: number; // for documents
  thumbnail?: string;
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  lastAccessed?: Date;
  order?: number;
  isCompleted?: boolean;
  progress?: number;
  createdAt?: Date;
}

export interface ChatMessage {
  id: string;
  type?: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  language?: string;
  materialContext?: string; // ID of the material being discussed
  confidence?: number; // AI confidence score
  sources?: string[]; // Referenced materials
  reactions?: {
    helpful: boolean;
    accurate: boolean;
  };
  sender: 'user' | 'ai';
}

export interface AILearningCourse {
  id: string;
  title: string;
  description: string;
  materials: CourseMaterial[];
  instructor?: {
    id: string;
    name: string;
    avatar?: string;
  };
  progress?: {
    completedMaterials: string[];
    totalTimeSpent: number;
    lastAccessed: Date;
  };
  aiSettings?: {
    preferredLanguage: string;
    explanationLevel: 'simple' | 'detailed' | 'technical';
    enableAutoSuggestions: boolean;
  };
}

export interface Language {
  code: string;
  name: string;
  flag: string;
  rtl?: boolean;
  nativeName: string;
  speechCode: string;
}

export interface QuickPrompt {
  id: string;
  text: string;
  category: 'explanation' | 'example' | 'summary' | 'application' | 'quiz';
  icon?: string;
}

export interface AIResponse {
  content: string;
  confidence: number;
  sources: string[];
  suggestedFollowUps?: string[];
  relatedMaterials?: string[];
}

export interface ChatSession {
  id: string;
  courseId: string;
  materialId?: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  title?: string;
}

export interface LearningAnalytics {
  timeSpentOnMaterials: Record<string, number>;
  questionsAsked: number;
  topicsDiscussed: string[];
  learningStreak: number;
  comprehensionScore: number;
  preferredLearningStyle: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
}

export interface MaterialViewerProps {
  material: CourseMaterial;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

export interface ChatPanelProps {
  courseId: string;
  selectedMaterial?: CourseMaterial;
  language: string;
  onLanguageChange: (language: string) => void;
  className?: string;
}

export interface MaterialSidebarProps {
  course: AILearningCourse;
  selectedMaterial?: CourseMaterial;
  onMaterialSelect: (material: CourseMaterial) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  className?: string;
}

export interface AILearningPageProps {
  courseId: string;
  initialMaterial?: string;
  initialLanguage?: string;
}