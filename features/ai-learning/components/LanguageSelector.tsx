'use client';

import React, { useState } from 'react';
import { ChevronDown, Globe, Check } from 'lucide-react';
import { Language } from '../types';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'compact';
}

const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', speechCode: 'en-US' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', speechCode: 'es-ES' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', speechCode: 'fr-FR' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', speechCode: 'de-DE' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', speechCode: 'it-IT' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', speechCode: 'pt-PT' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', speechCode: 'ru-RU' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', speechCode: 'zh-CN' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', speechCode: 'ja-JP' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', speechCode: 'ko-KR' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', speechCode: 'ar-SA', rtl: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', speechCode: 'hi-IN' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', speechCode: 'tr-TR' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', speechCode: 'nl-NL' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', speechCode: 'sv-SE' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴', speechCode: 'no-NO' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰', speechCode: 'da-DK' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮', speechCode: 'fi-FI' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', speechCode: 'pl-PL' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', speechCode: 'cs-CZ' },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
  className,
  size = 'md',
  variant = 'default',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLanguageSelect = (language: Language) => {
    onLanguageChange(language);
    setIsOpen(false);
    setSearchTerm('');
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-1';
      case 'lg':
        return 'text-base px-4 py-3';
      default:
        return 'text-sm px-3 py-2';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'minimal':
        return 'border-0 bg-transparent hover:bg-gray-100';
      case 'compact':
        return 'border border-gray-200 bg-white hover:bg-gray-50';
      default:
        return 'border border-gray-300 bg-white hover:bg-gray-50 shadow-sm';
    }
  };

  const renderTrigger = () => {
    if (variant === 'compact') {
      return (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex items-center gap-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            getSizeClasses(),
            getVariantClasses(),
            className
          )}
        >
          <span className="text-lg">{selectedLanguage.flag}</span>
          <span className="font-medium">{selectedLanguage.code.toUpperCase()}</span>
          <ChevronDown className={cn(
            'w-4 h-4 transition-transform',
            isOpen && 'rotate-180'
          )} />
        </button>
      );
    }

    return (
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          getSizeClasses(),
          getVariantClasses(),
          className
        )}
      >
        {variant !== 'minimal' && <Globe className="w-4 h-4 text-gray-500" />}
        <span className="text-lg">{selectedLanguage.flag}</span>
        <div className="flex flex-col items-start">
          <span className="font-medium text-gray-900">{selectedLanguage.name}</span>
          {size !== 'sm' && (
            <span className="text-xs text-gray-500">{selectedLanguage.nativeName}</span>
          )}
        </div>
        <ChevronDown className={cn(
          'w-4 h-4 text-gray-400 transition-transform ml-auto',
          isOpen && 'rotate-180'
        )} />
      </button>
    );
  };

  return (
    <div className="relative">
      {renderTrigger()}
      
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-hidden">
            {/* Search */}
            <div className="p-3 border-b border-gray-100">
              <input
                type="text"
                placeholder="Search languages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>
            
            {/* Language List */}
            <div className="max-h-60 overflow-y-auto">
              {filteredLanguages.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <Globe className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No languages found</p>
                </div>
              ) : (
                filteredLanguages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageSelect(language)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors',
                      selectedLanguage.code === language.code && 'bg-blue-50 text-blue-700'
                    )}
                  >
                    <span className="text-lg">{language.flag}</span>
                    <div className="flex-1">
                      <div className="font-medium">{language.name}</div>
                      <div className="text-sm text-gray-500">{language.nativeName}</div>
                    </div>
                    <div className="text-xs text-gray-400 uppercase font-mono">
                      {language.code}
                    </div>
                    {selectedLanguage.code === language.code && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </button>
                ))
              )}
            </div>
            
            {/* Footer */}
            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500 text-center">
                {filteredLanguages.length} of {SUPPORTED_LANGUAGES.length} languages
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;