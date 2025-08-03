import axios from 'axios';
import { ChatMessage, AIResponse, CourseMaterial, Language } from '../types';

class AILearningService {
  private baseURL: string;
  private apiKey?: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_AI_API_URL || '/api/ai';
    this.apiKey = process.env.NEXT_PUBLIC_AI_API_KEY;
  }

  /**
   * Send a message to the AI and get a response
   */
  async sendMessage({
    message,
    courseId,
    materialId,
    language = 'en',
    context,
    conversationHistory = []
  }: {
    message: string;
    courseId: string;
    materialId?: string;
    language?: string;
    context?: string;
    conversationHistory?: ChatMessage[];
  }, signal?: AbortSignal): Promise<AIResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/chat`, {
        message,
        courseId,
        materialId,
        language,
        context,
        conversationHistory: conversationHistory.slice(-10), // Last 10 messages for context
      }, {
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        },
        signal
      });

      return response.data;
    } catch (error) {
      console.error('AI Service Error:', error);
      
      // Fallback response for demo purposes
      return this.generateFallbackResponse(message, language);
    }
  }

  /**
   * Explain course material
   */
  async explainMaterial({
    material,
    question,
    language = 'en',
    difficulty = 'intermediate'
  }: {
    material: CourseMaterial;
    question?: string;
    language?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
  }): Promise<AIResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/explain`, {
        materialId: material.id,
        materialType: material.type,
        materialContent: material?.description || 'No content available',
        question,
        language,
        difficulty
      }, {
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        }
      });

      return response.data;
    } catch (error) {
      console.error('AI Explain Error:', error);
      
      // Fallback response
      return this.generateMaterialExplanation(material, question, language);
    }
  }

  /**
   * Get AI suggestions for learning
   */
  async getSuggestions({
    courseId,
    currentMaterial,
    userProgress,
    language = 'en'
  }: {
    courseId: string;
    currentMaterial?: CourseMaterial;
    userProgress?: any;
    language?: string;
  }): Promise<string[]> {
    try {
      const response = await axios.post(`${this.baseURL}/suggestions`, {
        courseId,
        currentMaterial,
        userProgress,
        language
      }, {
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        }
      });

      return response.data.suggestions || [];
    } catch (error) {
      console.error('AI Suggestions Error:', error);
      
      // Fallback suggestions
      return this.getFallbackSuggestions(language);
    }
  }

  /**
   * Generate a fallback response when AI service is unavailable
   */
  private generateFallbackResponse(message: string, language: string = 'en'): AIResponse {
    const responses = {
      en: {
        greeting: "Hello! I'm your AI learning assistant. How can I help you understand the course material better?",
        explanation: `I understand you're asking about "${message}". Based on the current material, here's a comprehensive explanation...`,
        summary: `Here's a summary of the key points...`
      },
      es: {
        greeting: "¡Hola! Soy tu asistente de aprendizaje con IA. ¿Cómo puedo ayudarte a entender mejor el material del curso?",
        explanation: `Entiendo que preguntas sobre "${message}". Basado en el material actual, aquí tienes una explicación completa...`,
        summary: `Aquí tienes un resumen de los puntos clave...`
      },
      fr: {
        greeting: "Bonjour! Je suis votre assistant d'apprentissage IA. Comment puis-je vous aider à mieux comprendre le matériel de cours?",
        explanation: `Je comprends que vous demandez a propos de "${message}". Base sur le materiel actuel, voici une explication complete...`,
        summary: `Voici un resume des points cles...`
      }
    };

    const langResponses = responses[language as keyof typeof responses] || responses.en;
    
    let content = langResponses.explanation;
    
    // Simple keyword-based responses
    if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
      content = langResponses.greeting;
    }
    
    return {
      content,
      confidence: 0.7,
      sources: [],
      suggestedFollowUps: this.getFallbackSuggestions(language),
      relatedMaterials: []
    };
  }

  /**
   * Generate material explanation fallback
   */
  private generateMaterialExplanation(
    material: CourseMaterial, 
    question?: string, 
    language: string = 'en'
  ): AIResponse {
    const explanations = {
      en: `This ${material.type} covers important concepts. ${question ? `Regarding your question about "${question}", ` : ''}Here's what you need to know...`,
      es: `Este ${material.type} cubre conceptos importantes. ${question ? `Respecto a tu pregunta sobre "${question}", ` : ''}Esto es lo que necesitas saber...`,
      fr: `Ce ${material.type} couvre des concepts importants. ${question ? `Concernant votre question sur "${question}", ` : ''}Voici ce que vous devez savoir...`
    };

    const content = explanations[language as keyof typeof explanations] || explanations.en;

    return {
      content,
      confidence: 0.6,
      sources: [material.title],
      suggestedFollowUps: this.getFallbackSuggestions(language),
      relatedMaterials: [material.id]
    };
  }

  /**
   * Get fallback suggestions based on language
   */
  private getFallbackSuggestions(language: string = 'en'): string[] {
    const suggestions = {
      en: [
        "Can you explain this concept in simpler terms?",
        "What are the key points I should remember?",
        "Can you give me an example?",
        "How does this relate to previous topics?"
      ],
      es: [
        "¿Puedes explicar este concepto en términos más simples?",
        "¿Cuáles son los puntos clave que debo recordar?",
        "¿Puedes darme un ejemplo?",
        "¿Cómo se relaciona esto con temas anteriores?"
      ],
      fr: [
        "Pouvez-vous expliquer ce concept en termes plus simples?",
        "Quels sont les points cles que je dois retenir?",
        "Pouvez-vous me donner un exemple?",
        "Comment cela se rapporte-t-il aux sujets precedents?"
      ]
    };

    return suggestions[language as keyof typeof suggestions] || suggestions.en;
  }

  /**
   * Validate message before sending
   */
  private validateMessage(message: string): boolean {
    return message.trim().length > 0 && message.length <= 1000;
  }

  /**
   * Format conversation history for API
   */
  private formatConversationHistory(history: ChatMessage[]): any[] {
    return history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content,
      timestamp: msg.timestamp
    }));
  }
}

export const aiLearningService = new AILearningService();
export default aiLearningService;