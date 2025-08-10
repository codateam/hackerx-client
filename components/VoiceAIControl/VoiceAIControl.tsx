"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Mic, MicOff, Play, Pause, Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface VoiceAIControlProps {
  /** Text content to be read by AI */
  textToRead?: string;
  /** Whether AI explanations are enabled */
  isAIExplanationEnabled?: boolean;
  /** Callback when AI explanation toggle changes */
  onAIExplanationToggle?: (enabled: boolean) => void;
  /** Whether user microphone is muted */
  isUserMuted?: boolean;
  /** Callback when user mute toggle changes */
  onUserMuteToggle?: (muted: boolean) => void;
  /** Custom className for styling */
  className?: string;
  /** Position of the control panel */
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "inline";
}

export const VoiceAIControl: React.FC<VoiceAIControlProps> = ({
  textToRead = "",
  isAIExplanationEnabled = false,
  onAIExplanationToggle,
  isUserMuted = false,
  onUserMuteToggle,
  className = "",
  position = "top-right",
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechVolume, setSpeechVolume] = useState(0.8);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  const speechSynthesis = useRef<SpeechSynthesis | null>(null);

  // Initialize speech synthesis and recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      speechSynthesis.current = window.speechSynthesis;

      // Initialize speech recognition if available
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onstart = () => {
          setIsListening(true);
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        recognitionInstance.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionInstance.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          console.log('Voice input:', transcript);
          // You can add callback here to handle voice input
        };

        setRecognition(recognitionInstance);
      }
    }

    return () => {
      if (speechSynthesis.current) {
        speechSynthesis.current.cancel();
      }
    };
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (currentUtterance && speechSynthesis.current) {
        speechSynthesis.current.cancel();
      }
    };
  }, [currentUtterance]);

  const handlePlayPause = () => {
    if (!speechSynthesis.current || !textToRead.trim()) return;

    if (isPlaying && !isPaused) {
      // Pause
      speechSynthesis.current.pause();
      setIsPaused(true);
    } else if (isPlaying && isPaused) {
      // Resume
      speechSynthesis.current.resume();
      setIsPaused(false);
    } else {
      // Start new speech
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = speechRate;
      utterance.volume = speechVolume;
      utterance.lang = 'en-US';

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentUtterance(null);
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentUtterance(null);
      };

      setCurrentUtterance(utterance);
      speechSynthesis.current.speak(utterance);
    }
  };

  const handleStop = () => {
    if (speechSynthesis.current) {
      speechSynthesis.current.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentUtterance(null);
    }
  };

  const handleVoiceInput = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case "top-left":
        return "top-4 left-4";
      case "top-right":
        return "top-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "bottom-right":
        return "bottom-4 right-4";
      case "inline":
        return "";
      default:
        return "top-4 right-4";
    }
  };

  const containerClasses = position === "inline" 
    ? `inline-flex ${className}`
    : `fixed ${getPositionClasses()} z-50 ${className}`;

  return (
    <div className={containerClasses}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
      >
        {/* Main Control Bar */}
        <div className="flex items-center space-x-2 p-3">
          {/* AI Explanation Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAIExplanationToggle?.(!isAIExplanationEnabled)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isAIExplanationEnabled
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            title={`${isAIExplanationEnabled ? "Disable" : "Enable"} AI Explanations`}
          >
            {isAIExplanationEnabled ? (
              <Volume2 size={18} />
            ) : (
              <VolumeX size={18} />
            )}
          </motion.button>

          {/* Play/Pause Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayPause}
            disabled={!textToRead.trim() || !isAIExplanationEnabled}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isPlaying && !isPaused
                ? "bg-orange-500 text-white shadow-md"
                : "bg-green-500 text-white shadow-md hover:bg-green-600"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={isPlaying && !isPaused ? "Pause" : "Play"}
          >
            {isPlaying && !isPaused ? (
              <Pause size={18} />
            ) : (
              <Play size={18} />
            )}
          </motion.button>

          {/* Stop Button */}
          {isPlaying && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStop}
              className="p-2 rounded-lg bg-red-500 text-white shadow-md hover:bg-red-600 transition-all duration-200"
              title="Stop"
            >
              <Square size={18} />
            </motion.button>
          )}

          {/* User Microphone Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onUserMuteToggle?.(!isUserMuted)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isUserMuted
                ? "bg-red-500 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            title={`${isUserMuted ? "Unmute" : "Mute"} Microphone`}
          >
            {isUserMuted ? (
              <MicOff size={18} />
            ) : (
              <Mic size={18} />
            )}
          </motion.button>

          {/* Voice Input Button */}
          {recognition && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleVoiceInput}
              disabled={isUserMuted}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isListening
                  ? "bg-purple-500 text-white shadow-md animate-pulse"
                  : "bg-purple-100 text-purple-600 hover:bg-purple-200"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title={isListening ? "Stop Listening" : "Start Voice Input"}
            >
              <Mic size={18} />
            </motion.button>
          )}

          {/* Expand/Collapse Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200"
            title="Settings"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              ⚙️
            </motion.div>
          </motion.button>
        </div>

        {/* Expanded Settings Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-gray-200 p-4 bg-gray-50"
            >
              <div className="space-y-3">
                {/* Speech Rate Control */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Speech Rate: {speechRate}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={speechRate}
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Speech Volume Control */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Volume: {Math.round(speechVolume * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={speechVolume}
                    onChange={(e) => setSpeechVolume(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Status Indicators */}
                <div className="flex justify-between text-xs text-gray-500">
                  <span>AI: {isAIExplanationEnabled ? "ON" : "OFF"}</span>
                  <span>Mic: {isUserMuted ? "MUTED" : "ACTIVE"}</span>
                  <span>Speech: {isPlaying ? (isPaused ? "PAUSED" : "PLAYING") : "STOPPED"}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default VoiceAIControl;