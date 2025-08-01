'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, Download, Play, Pause, Volume2, VolumeX, Maximize, Minimize, FileText, Image as ImageIcon, Link as LinkIcon, Eye, Clock, BookOpen } from 'lucide-react';
import { CourseMaterial, MaterialViewerProps } from '../types';
import { cn } from '@/lib/utils';

const MaterialViewer: React.FC<MaterialViewerProps> = ({
  material,
  onProgress,
  onComplete,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [material]);

  useEffect(() => {
    onProgress?.(progress);
    if (progress >= 100) {
      onComplete?.();
    }
  }, [progress, onProgress, onComplete]);

  const handleProgressUpdate = (newProgress: number) => {
    setProgress(Math.min(100, Math.max(0, newProgress)));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderPDFViewer = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-red-500" />
          <div>
            <h3 className="font-medium text-gray-900">{material.title}</h3>
            <p className="text-sm text-gray-600">
              {material.pages ? `${material.pages} pages` : 'PDF Document'} • {material.size || 'Unknown size'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.open(material.url, '_blank')}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Open in new tab
          </button>
          
          <button
            onClick={() => {
              const link = document.createElement('a');
              link.href = material.url;
              link.download = material.title;
              link.click();
            }}
            className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
      
      <div className="flex-1 bg-gray-100">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading PDF...</p>
            </div>
          </div>
        ) : (
          <iframe
            src={`${material.url}#toolbar=1&navpanes=1&scrollbar=1`}
            className="w-full h-full border-0"
            title={material.title}
            onLoad={() => handleProgressUpdate(100)}
          />
        )}
      </div>
    </div>
  );

  const renderVideoViewer = () => (
    <div className="h-full flex flex-col bg-black">
      <div className="flex-1 relative">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p>Loading video...</p>
            </div>
          </div>
        ) : (
          <video
            className="w-full h-full object-contain"
            controls
            poster={material.thumbnail}
            onTimeUpdate={(e) => {
              const video = e.target as HTMLVideoElement;
              setCurrentTime(video.currentTime);
              const progressPercent = (video.currentTime / video.duration) * 100;
              handleProgressUpdate(progressPercent);
            }}
            onLoadedMetadata={(e) => {
              const video = e.target as HTMLVideoElement;
              setDuration(video.duration);
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onVolumeChange={(e) => {
              const video = e.target as HTMLVideoElement;
              setIsMuted(video.muted);
            }}
          >
            <source src={material.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-colors"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>
      
      <div className="p-4 bg-gray-900 text-white">
        <h3 className="font-medium mb-2">{material.title}</h3>
        <div className="flex items-center justify-between text-sm text-gray-300">
          <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
          <div className="flex items-center gap-4">
            <span>Progress: {Math.round(progress)}%</span>
            {material.duration && <span>Duration: {material.duration}</span>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAudioViewer = () => (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-600">
        <div className="text-center text-white">
          <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Volume2 className="w-12 h-12" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{material.title}</h3>
          <p className="text-blue-100 mb-6">{material.description}</p>
          
          {!isLoading && (
            <audio
              controls
              className="w-full max-w-md"
              onTimeUpdate={(e) => {
                const audio = e.target as HTMLAudioElement;
                setCurrentTime(audio.currentTime);
                const progressPercent = (audio.currentTime / audio.duration) * 100;
                handleProgressUpdate(progressPercent);
              }}
              onLoadedMetadata={(e) => {
                const audio = e.target as HTMLAudioElement;
                setDuration(audio.duration);
              }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src={material.url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
          
          {isLoading && (
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto" />
          )}
        </div>
      </div>
      
      <div className="p-4 bg-white border-t">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
          <div className="flex items-center gap-4">
            <span>Progress: {Math.round(progress)}%</span>
            {material.duration && <span>Duration: {material.duration}</span>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderImageViewer = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
        <div className="flex items-center gap-3">
          <ImageIcon className="w-5 h-5 text-green-500" />
          <div>
            <h3 className="font-medium text-gray-900">{material.title}</h3>
            <p className="text-sm text-gray-600">{material.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.open(material.url, '_blank')}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
            View full size
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center bg-gray-100 p-4">
        {isLoading ? (
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading image...</p>
          </div>
        ) : (
          <img
            src={material.url}
            alt={material.title}
            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
            onLoad={() => handleProgressUpdate(100)}
            onError={() => setError('Failed to load image')}
          />
        )}
      </div>
    </div>
  );

  const renderLinkViewer = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
        <div className="flex items-center gap-3">
          <LinkIcon className="w-5 h-5 text-purple-500" />
          <div>
            <h3 className="font-medium text-gray-900">{material.title}</h3>
            <p className="text-sm text-gray-600">{material.description}</p>
          </div>
        </div>
        
        <button
          onClick={() => {
            window.open(material.url, '_blank');
            handleProgressUpdate(100);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Open Link
        </button>
      </div>
      
      <div className="flex-1 bg-gray-100">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading content...</p>
            </div>
          </div>
        ) : (
          <iframe
            src={material.url}
            className="w-full h-full border-0"
            title={material.title}
            onLoad={() => handleProgressUpdate(100)}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        )}
      </div>
    </div>
  );

  const renderDocumentViewer = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-blue-500" />
          <div>
            <h3 className="font-medium text-gray-900">{material.title}</h3>
            <p className="text-sm text-gray-600">
              Document • {material.size || 'Unknown size'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.open(material.url, '_blank')}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Open
          </button>
          
          <button
            onClick={() => {
              const link = document.createElement('a');
              link.href = material.url;
              link.download = material.title;
              link.click();
            }}
            className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{material.title}</h1>
            {material.description && (
              <p className="text-gray-600 mb-6 leading-relaxed">{material.description}</p>
            )}
            
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                This document contains important course material. Click the "Open" button above to view the full content 
                in a new tab or download it to your device for offline access.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Study Tips</span>
                </div>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Take notes while reading</li>
                  <li>• Ask the AI assistant about any unclear concepts</li>
                  <li>• Review the material multiple times for better retention</li>
                </ul>
              </div>
              
              {material.tags && material.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {material.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (error) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error loading material</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 1000);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    switch (material.type) {
      case 'pdf':
        return renderPDFViewer();
      case 'video':
        return renderVideoViewer();
      case 'audio':
        return renderAudioViewer();
      case 'image':
        return renderImageViewer();
      case 'link':
        return renderLinkViewer();
      case 'document':
      default:
        return renderDocumentViewer();
    }
  };

  return (
    <div className={cn(
      "bg-white border border-gray-200 rounded-lg overflow-hidden",
      isFullscreen && "fixed inset-0 z-50 rounded-none"
    )}>
      {renderContent()}
    </div>
  );
};

export default MaterialViewer;