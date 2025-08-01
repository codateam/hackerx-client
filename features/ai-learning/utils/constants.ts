import { Language, QuickPrompt } from "../types";

export const AVAILABLE_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English', speechCode: 'en-US' },
  {
    code: 'yo',
    name: 'Yoruba',
    flag: '🇳🇬',
    nativeName: 'Yorùbá',
    speechCode: 'yo-NG' // or fallback 'en-NG' if TTS for Yoruba not supported
  },
  {
    code: 'ig',
    name: 'Igbo',
    flag: '🇳🇬',
    nativeName: 'Asụsụ Igbo',
    speechCode: 'ig-NG' // or fallback 'en-NG'
  },
  {
    code: 'ha',
    name: 'Hausa',
    flag: '🇳🇬',
    nativeName: 'Harshen Hausa',
    speechCode: 'ha-NE' // or 'ha-NG' depending on platform
  }
  // { code: 'es', name: 'Español', flag: '🇪🇸', nativeName: 'Español', speechCode: 'es-ES' },
  // { code: 'fr', name: 'Français', flag: '🇫🇷', nativeName: 'Français', speechCode: 'fr-FR' },
  // { code: 'de', name: 'Deutsch', flag: '🇩🇪', nativeName: 'Deutsch', speechCode: 'de-DE' },
  // { code: 'it', name: 'Italiano', flag: '🇮🇹', nativeName: 'Italiano', speechCode: 'it-IT' },
  // { code: 'pt', name: 'Português', flag: '🇵🇹', nativeName: 'Português', speechCode: 'pt-PT' },
  // { code: 'zh', name: '中文', flag: '🇨🇳', nativeName: '中文', speechCode: 'zh-CN' },
  // { code: 'ja', name: '日本語', flag: '🇯🇵', nativeName: '日本語', speechCode: 'ja-JP' },
  // { code: 'ko', name: '한국어', flag: '🇰🇷', nativeName: '한국어', speechCode: 'ko-KR' },
  // { code: 'ar', name: 'العربية', flag: '🇸🇦', nativeName: 'العربية', speechCode: 'ar-SA', rtl: true }
];

export const QUICK_PROMPTS: QuickPrompt[] = [
  { id: '1', text: 'Explain this concept simply', category: 'explanation', icon: '💡' },
  { id: '2', text: 'Give me an example', category: 'example', icon: '📝' },
  { id: '3', text: 'Summarize the key points', category: 'summary', icon: '📋' },
  { id: '4', text: 'How is this used in practice?', category: 'application', icon: '🔧' },
  { id: '5', text: 'Test my understanding', category: 'quiz', icon: '🎯' }
];