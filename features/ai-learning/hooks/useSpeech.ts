'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Language } from '../types';

interface UseSpeechOptions {
  language: Language;
  onTranscript?: (transcript: string) => void;
  onError?: (error: string) => void;
  autoStop?: boolean;
  maxDuration?: number; // in milliseconds
}

interface UseSpeechReturn {
  // Speech Recognition
  isListening: boolean;
  transcript: string;
  confidence: number;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  
  // Text-to-Speech
  isSpeaking: boolean;
  speak: (text: string, options?: SpeechSynthesisUtteranceOptions) => void;
  stopSpeaking: () => void;
  pauseSpeaking: () => void;
  resumeSpeaking: () => void;
  
  // Support detection
  speechRecognitionSupported: boolean;
  speechSynthesisSupported: boolean;
  
  // Error handling
  error: string | null;
}

interface SpeechSynthesisUtteranceOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
}

export const useSpeech = ({
  language,
  onTranscript,
  onError,
  autoStop = true,
  maxDuration = 30000, // 30 seconds default
}: UseSpeechOptions): UseSpeechReturn => {
  // Speech Recognition State
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  
  // Text-to-Speech State
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Error State
  const [error, setError] = useState<string | null>(null);
  
  // Refs
  const recognitionRef = useRef<any | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Support detection
  const speechRecognitionSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  
  const speechSynthesisSupported = typeof window !== 'undefined' && 
    'speechSynthesis' in window;

  // Initialize Speech Recognition
  useEffect(() => {
    if (!speechRecognitionSupported) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language.speechCode || language.code;
    recognition.maxAlternatives = 1;
    
    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      
      // Set auto-stop timeout
      if (autoStop && maxDuration > 0) {
        timeoutRef.current = setTimeout(() => {
          recognition.stop();
        }, maxDuration);
      }
    };
    
    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      let maxConfidence = 0;
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence || 0;
        
        if (result.isFinal) {
          finalTranscript += transcript;
          maxConfidence = Math.max(maxConfidence, confidence);
        } else {
          interimTranscript += transcript;
        }
      }
      
      const fullTranscript = finalTranscript || interimTranscript;
      setTranscript(fullTranscript);
      setConfidence(maxConfidence);
      
      if (finalTranscript) {
        onTranscript?.(finalTranscript);
      }
    };
    
    recognition.onerror = (event) => {
      const errorMessage = `Speech recognition error: ${event.error}`;
      setError(errorMessage);
      onError?.(errorMessage);
      setIsListening(false);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
    
    recognition.onend = () => {
      setIsListening(false);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
    
    recognitionRef.current = recognition;
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [language, onTranscript, onError, autoStop, maxDuration, speechRecognitionSupported]);

  // Speech Recognition Methods
  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    
    try {
      setTranscript('');
      setConfidence(0);
      setError(null);
      recognitionRef.current.start();
    } catch (err: any) {
      const errorMessage = `Failed to start speech recognition: ${err.message}`;
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [isListening, onError]);
  
  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;
    
    recognitionRef.current.stop();
  }, [isListening]);
  
  const resetTranscript = useCallback(() => {
    setTranscript('');
    setConfidence(0);
  }, []);

  // Text-to-Speech Methods
  const speak = useCallback((text: string, options: SpeechSynthesisUtteranceOptions = {}) => {
    if (!speechSynthesisSupported || !text.trim()) return;
    
    // Stop any current speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language
    utterance.lang = language.speechCode || language.code;
    
    // Apply options
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;
    
    if (options.voice) {
      utterance.voice = options.voice;
    } else {
      // Try to find a voice for the current language
      const voices = window.speechSynthesis.getVoices();
      const languageVoice = voices.find(voice => 
        voice.lang.startsWith(language.code) || 
        voice.lang.startsWith(language.speechCode || '')
      );
      if (languageVoice) {
        utterance.voice = languageVoice;
      }
    }
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setError(null);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = (event) => {
      const errorMessage = `Speech synthesis error: ${event.error}`;
      setError(errorMessage);
      onError?.(errorMessage);
      setIsSpeaking(false);
    };
    
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [language, speechSynthesisSupported, onError]);
  
  const stopSpeaking = useCallback(() => {
    if (!speechSynthesisSupported) return;
    
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [speechSynthesisSupported]);
  
  const pauseSpeaking = useCallback(() => {
    if (!speechSynthesisSupported) return;
    
    window.speechSynthesis.pause();
  }, [speechSynthesisSupported]);
  
  const resumeSpeaking = useCallback(() => {
    if (!speechSynthesisSupported) return;
    
    window.speechSynthesis.resume();
  }, [speechSynthesisSupported]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechSynthesisSupported) {
        window.speechSynthesis.cancel();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [speechSynthesisSupported]);

  return {
    // Speech Recognition
    isListening,
    transcript,
    confidence,
    startListening,
    stopListening,
    resetTranscript,
    
    // Text-to-Speech
    isSpeaking,
    speak,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    
    // Support detection
    speechRecognitionSupported,
    speechSynthesisSupported,
    
    // Error handling
    error,
  };
};

// Utility function to get available voices for a language
export const getVoicesForLanguage = (languageCode: string): SpeechSynthesisVoice[] => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }
  
  const voices = window.speechSynthesis.getVoices();
  return voices.filter(voice => 
    voice.lang.startsWith(languageCode) ||
    voice.lang.startsWith(languageCode.split('-')[0])
  );
};

export default useSpeech;