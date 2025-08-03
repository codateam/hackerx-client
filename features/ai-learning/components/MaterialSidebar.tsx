'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Search, Filter, FileText, Video, Image, Link, Volume2, Download, Clock, BookOpen, Star, Eye } from 'lucide-react';
import { CourseMaterial, AILearningCourse, MaterialSidebarProps } from '../types';
import { cn } from '@/lib/utils';

const MaterialSidebar: React.FC<MaterialSidebarProps> = ({
  course,
  selectedMaterial,
  onMaterialSelect,
  collapsed,
  onToggleCollapse,
  className
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'type' | 'recent'>('title');

  const materialIcons = {
    pdf: FileText,
    video: Video,
    document: FileText,
    link: Link,
    image: Image,
    audio: Volume2
  };

  const materialColors = {
    pdf: 'text-red-500',
    video: 'text-blue-500',
    document: 'text-green-500',
    link: 'text-purple-500',
    image: 'text-yellow-500',
    audio: 'text-orange-500'
  };

  const filteredAndSortedMaterials = useMemo(() => {
    let filtered = course.materials.filter(material => {
      const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           material.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || material.type === filterType;
      return matchesSearch && matchesFilter;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'recent':
          return (b.lastAccessed?.getTime() || 0) - (a.lastAccessed?.getTime() || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [course.materials, searchTerm, filterType, sortBy]);

  const materialTypes = useMemo(() => {
    const types = Array.from(new Set(course.materials.map(m => m.type)));
    return types.map(type => ({
      value: type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
      count: course.materials.filter(m => m.type === type).length
    }));
  }, [course.materials]);

  const formatDuration = (duration?: string) => {
    if (!duration) return null;
    return duration;
  };

  const formatSize = (size?: string) => {
    if (!size) return null;
    return size;
  };

  const isCompleted = (materialId: string) => {
    return course.progress?.completedMaterials.includes(materialId) || false;
  };

  if (collapsed) {
    return (
      <div className={cn(
        "w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 transition-all duration-300",
        className
      )}>
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors mb-4"
          title="Expand sidebar"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="flex flex-col gap-2 items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xs text-gray-500 font-medium">
            {course.materials.length}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "w-80 bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 truncate">
            Course Materials
          </h2>
          <button
            onClick={onToggleCollapse}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        
        <div className="text-sm text-gray-600 mb-3">
          {course.title}
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            {materialTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label} ({type.count})
              </option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'title' | 'type' | 'recent')}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="title">A-Z</option>
            <option value="type">Type</option>
            <option value="recent">Recent</option>
          </select>
        </div>
      </div>

      {/* Materials List */}
      <div className="flex-1 overflow-y-auto">
        {filteredAndSortedMaterials.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No materials found</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-blue-600 hover:text-blue-700 text-sm mt-1"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="p-2">
            {filteredAndSortedMaterials.map((material) => {
              const IconComponent = materialIcons[material.type];
              const isSelected = selectedMaterial?.id === material.id;
              const completed = isCompleted(material.id);
              
              return (
                <div
                  key={material.id}
                  onClick={() => onMaterialSelect(material)}
                  className={cn(
                    "p-3 rounded-lg cursor-pointer transition-all duration-200 mb-2 border",
                    isSelected
                      ? "bg-blue-50 border-blue-200 shadow-sm"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                      isSelected ? "bg-blue-100" : "bg-white"
                    )}>
                      <IconComponent className={cn(
                        "w-4 h-4",
                        isSelected ? "text-blue-600" : materialColors[material.type]
                      )} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={cn(
                          "font-medium text-sm truncate",
                          isSelected ? "text-blue-900" : "text-gray-900"
                        )}>
                          {material.title}
                        </h3>
                        {completed && (
                          <div className="flex-shrink-0">
                            <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-green-600 rounded-full" />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {material.description && (
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {material.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        {material.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDuration(material.duration)}</span>
                          </div>
                        )}
                        
                        {material.size && (
                          <div className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            <span>{formatSize(material.size)}</span>
                          </div>
                        )}
                        
                        {material.pages && (
                          <div className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            <span>{material.pages} pages</span>
                          </div>
                        )}
                      </div>
                      
                      {material.difficulty && (
                        <div className="mt-2">
                          <span className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                            material.difficulty === 'beginner' && "bg-green-100 text-green-800",
                            material.difficulty === 'intermediate' && "bg-yellow-100 text-yellow-800",
                            material.difficulty === 'advanced' && "bg-red-100 text-red-800"
                          )}>
                            {material.difficulty}
                          </span>
                        </div>
                      )}
                      
                      {material.tags && material.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {material.tags.slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
                            >
                              {tag}
                            </span>
                          ))}
                          {material.tags.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{material.tags.length - 2} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>{filteredAndSortedMaterials.length} materials</span>
          </div>
          
          {course.progress && (
            <div className="flex items-center gap-2">
              <div className="w-16 bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(course.progress.completedMaterials.length / course.materials.length) * 100}%` 
                  }}
                />
              </div>
              <span className="text-xs">
                {course.progress.completedMaterials.length}/{course.materials.length}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialSidebar;