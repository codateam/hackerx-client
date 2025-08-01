'use client';

import React, { useState } from 'react';
import { MessageSquare, Lightbulb, HelpCircle, BookOpen, Brain, Zap, ChevronRight, Shuffle, Plus } from 'lucide-react';
import { QuickPrompt } from '../types';
import { cn } from '@/lib/utils';

interface QuickPromptsProps {
  onPromptSelect: (prompt: string) => void;
  currentMaterial?: string;
  className?: string;
  variant?: 'default' | 'compact' | 'grid';
}

const DEFAULT_PROMPTS: QuickPrompt[] = [
  {
    id: '1',
    text: 'Explain this concept in simple terms',
    category: 'explanation',
    icon: 'lightbulb'
  },
  {
    id: '2',
    text: 'What are the key points I should remember?',
    category: 'summary',
    icon: 'brain'
  },
  {
    id: '3',
    text: 'Give me some practice questions',
    category: 'quiz',
    icon: 'help-circle'
  },
  {
    id: '4',
    text: 'How does this relate to real-world applications?',
    category: 'application',
    icon: 'zap'
  },
  {
    id: '5',
    text: 'Can you provide more examples?',
    category: 'example',
    icon: 'book-open'
  },
  {
    id: '6',
    text: 'What prerequisites should I know?',
    category: 'explanation',
    icon: 'brain'
  },
  {
    id: '7',
    text: 'Summarize this material',
    category: 'summary',
    icon: 'message-square'
  },
  {
    id: '8',
    text: 'What are common misconceptions about this topic?',
    category: 'explanation',
    icon: 'help-circle'
  },
  {
    id: '9',
    text: 'How can I remember this better?',
    category: 'summary',
    icon: 'brain'
  },
  {
    id: '10',
    text: 'What should I study next?',
    category: 'application',
    icon: 'book-open'
  }
];

const CATEGORY_COLORS = {
  explanation: 'bg-blue-100 text-blue-700 border-blue-200',
  summary: 'bg-green-100 text-green-700 border-green-200',
  quiz: 'bg-purple-100 text-purple-700 border-purple-200',
  application: 'bg-orange-100 text-orange-700 border-orange-200',
  example: 'bg-indigo-100 text-indigo-700 border-indigo-200',
};

const getIcon = (iconName: string) => {
  const iconProps = { className: 'w-4 h-4' };
  
  switch (iconName) {
    case 'lightbulb':
      return <Lightbulb {...iconProps} />;
    case 'brain':
      return <Brain {...iconProps} />;
    case 'help-circle':
      return <HelpCircle {...iconProps} />;
    case 'zap':
      return <Zap {...iconProps} />;
    case 'book-open':
      return <BookOpen {...iconProps} />;
    case 'message-square':
    default:
      return <MessageSquare {...iconProps} />;
  }
};

const QuickPrompts: React.FC<QuickPromptsProps> = ({
  onPromptSelect,
  currentMaterial,
  className,
  variant = 'default',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [customPrompts, setCustomPrompts] = useState<QuickPrompt[]>([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customPromptText, setCustomPromptText] = useState('');

  const allPrompts = [...DEFAULT_PROMPTS, ...customPrompts];
  const categories = Array.from(new Set(allPrompts.map(p => p.category)));
  
  const filteredPrompts = selectedCategory
    ? allPrompts.filter(p => p.category === selectedCategory)
    : allPrompts;

  const getRandomPrompts = (count: number = 3) => {
    const shuffled = [...allPrompts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const handlePromptClick = (prompt: QuickPrompt) => {
    let finalPrompt = prompt.text;
    
    // Add context if current material is available
    if (currentMaterial) {
      finalPrompt = `Regarding "${currentMaterial}": ${prompt.text}`;
    }
    
    onPromptSelect(finalPrompt);
  };

  const handleAddCustomPrompt = () => {
    if (customPromptText.trim()) {
      const newPrompt: QuickPrompt = {
        id: `custom-${Date.now()}`,
        text: customPromptText.trim(),
        category: 'explanation',
        icon: 'message-square'
      };
      
      setCustomPrompts(prev => [...prev, newPrompt]);
      setCustomPromptText('');
      setShowCustomInput(false);
    }
  };

  const removeCustomPrompt = (id: string) => {
    setCustomPrompts(prev => prev.filter(p => p.id !== id));
  };

  if (variant === 'compact') {
    const randomPrompts = getRandomPrompts(3);
    
    return (
      <div className={cn('space-y-2', className)}>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <Lightbulb className="w-4 h-4" />
          <span>Quick suggestions</span>
          <button
            onClick={() => window.location.reload()}
            className="ml-auto p-1 hover:bg-gray-100 rounded transition-colors"
            title="Shuffle suggestions"
          >
            <Shuffle className="w-3 h-3" />
          </button>
        </div>
        
        {randomPrompts.map((prompt) => (
          <button
            key={prompt.id}
            onClick={() => handlePromptClick(prompt)}
            className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
          >
            <div className="flex items-center gap-2">
              {getIcon(prompt.icon || 'help')}
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {prompt.text}
              </span>
              <ChevronRight className="w-3 h-3 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Quick Prompts</h3>
          <button
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Custom
          </button>
        </div>
        
        {showCustomInput && (
          <div className="flex gap-2">
            <input
              type="text"
              value={customPromptText}
              onChange={(e) => setCustomPromptText(e.target.value)}
              placeholder="Enter your custom prompt..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomPrompt()}
            />
            <button
              onClick={handleAddCustomPrompt}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Add
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredPrompts.map((prompt) => (
            <button
              key={prompt.id}
              onClick={() => handlePromptClick(prompt)}
              className={cn(
                'p-4 border rounded-lg text-left hover:shadow-md transition-all group relative',
                CATEGORY_COLORS[prompt.category as keyof typeof CATEGORY_COLORS] || 'bg-gray-100 text-gray-700 border-gray-200'
              )}
            >

              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getIcon(prompt.icon || 'help')}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm mb-1">{prompt.text}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs font-medium uppercase tracking-wide opacity-60">
                  {prompt.category}
                </span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Quick Prompts</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Custom
          </button>
        </div>
      </div>
      
      {showCustomInput && (
        <div className="flex gap-2 p-3 bg-gray-50 rounded-lg">
          <input
            type="text"
            value={customPromptText}
            onChange={(e) => setCustomPromptText(e.target.value)}
            placeholder="Enter your custom prompt..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleAddCustomPrompt()}
          />
          <button
            onClick={handleAddCustomPrompt}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Add
          </button>
        </div>
      )}
      
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={cn(
            'px-3 py-1.5 text-sm rounded-full border transition-colors',
            !selectedCategory
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
          )}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              'px-3 py-1.5 text-sm rounded-full border transition-colors capitalize',
              selectedCategory === category
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            )}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* Prompts List */}
      <div className="space-y-2">
        {filteredPrompts.map((prompt) => (
          <button
            key={prompt.id}
            onClick={() => handlePromptClick(prompt)}
            className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all group relative"
          >

            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {getIcon(prompt.icon || 'help')}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 mb-1">{prompt.text}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                    CATEGORY_COLORS[prompt.category as keyof typeof CATEGORY_COLORS] || 'bg-gray-100 text-gray-700'
                  )}>
                    {prompt.category}
                  </span>
                  {currentMaterial && (
                    <span className="text-xs text-gray-500">
                      Will reference: {currentMaterial}
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
      </div>
      
      {filteredPrompts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No prompts found for this category.</p>
        </div>
      )}
    </div>
  );
};

export default QuickPrompts;