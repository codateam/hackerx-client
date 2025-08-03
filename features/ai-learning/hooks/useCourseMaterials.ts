'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { CourseMaterial } from '../types';

interface UseCourseMaterialsOptions {
  materials: CourseMaterial[];
  onMaterialSelect?: (material: CourseMaterial) => void;
  onProgressUpdate?: (materialId: string, progress: number) => void;
}

interface UseCourseMaterialsReturn {
  materials: CourseMaterial[];
  selectedMaterial: CourseMaterial | null;
  filteredMaterials: CourseMaterial[];
  searchQuery: string;
  selectedType: string;
  sortBy: string;
  completedCount: number;
  totalCount: number;
  progressPercentage: number;
  setSearchQuery: (query: string) => void;
  setSelectedType: (type: string) => void;
  setSortBy: (sortBy: string) => void;
  selectMaterial: (material: CourseMaterial) => void;
  markAsCompleted: (materialId: string) => void;
  markAsIncomplete: (materialId: string) => void;
  updateProgress: (materialId: string, progress: number) => void;
  getNextMaterial: () => CourseMaterial | null;
  getPreviousMaterial: () => CourseMaterial | null;
  getMaterialsByType: (type: string) => CourseMaterial[];
  getRecommendedMaterials: () => CourseMaterial[];
}

export const useCourseMaterials = ({
  materials: initialMaterials,
  onMaterialSelect,
  onProgressUpdate,
}: UseCourseMaterialsOptions): UseCourseMaterialsReturn => {
  const [materials, setMaterials] = useState<CourseMaterial[]>(initialMaterials);
  const [selectedMaterial, setSelectedMaterial] = useState<CourseMaterial | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('order');

  // Update materials when initialMaterials change
  useEffect(() => {
    setMaterials(initialMaterials);
  }, [initialMaterials]);

  // Filter and sort materials
  const filteredMaterials = useMemo(() => {
    let filtered = materials;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(material =>
        material.title.toLowerCase().includes(query) ||
        material.description?.toLowerCase().includes(query) ||
        material.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(material => material.type === selectedType);
    }

    // Sort materials
    switch (sortBy) {
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'type':
        filtered.sort((a, b) => a.type.localeCompare(b.type));
        break;
      case 'duration':
        filtered.sort((a, b) => {
          const aDuration = parseFloat(a.duration || '0') || 0;
          const bDuration = parseFloat(b.duration || '0') || 0;
          return aDuration - bDuration;
        });
        break;
      case 'progress':
        filtered.sort((a, b) => (b.progress || 0) - (a.progress || 0));
        break;
      case 'recent':
        filtered.sort((a, b) => {
          const aDate = a.lastAccessed || a.createdAt || new Date(0);
          const bDate = b.lastAccessed || b.createdAt || new Date(0);
          return new Date(bDate).getTime() - new Date(aDate).getTime();
        });
        break;
      case 'order':
      default:
        filtered.sort((a, b) => (a.order || 0) - (b.order || 0));
        break;
    }

    return filtered;
  }, [materials, searchQuery, selectedType, sortBy]);

  // Calculate progress statistics
  const { completedCount, totalCount, progressPercentage } = useMemo(() => {
    const total = materials.length;
    const completed = materials.filter(m => m.isCompleted).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return {
      completedCount: completed,
      totalCount: total,
      progressPercentage: percentage,
    };
  }, [materials]);

  const selectMaterial = useCallback((material: CourseMaterial) => {
    setSelectedMaterial(material);
    
    // Update last accessed time
    setMaterials(prev => prev.map(m => 
      m.id === material.id 
        ? { ...m, lastAccessed: new Date() }
        : m
    ));
    
    onMaterialSelect?.(material);
  }, [onMaterialSelect]);

  const markAsCompleted = useCallback((materialId: string) => {
    setMaterials(prev => prev.map(material => 
      material.id === materialId 
        ? { 
            ...material, 
            isCompleted: true, 
            progress: 100,
            completedAt: new Date()
          }
        : material
    ));
    
    onProgressUpdate?.(materialId, 100);
  }, [onProgressUpdate]);

  const markAsIncomplete = useCallback((materialId: string) => {
    setMaterials(prev => prev.map(material => 
      material.id === materialId 
        ? { 
            ...material, 
            isCompleted: false, 
            progress: 0,
            completedAt: undefined
          }
        : material
    ));
    
    onProgressUpdate?.(materialId, 0);
  }, [onProgressUpdate]);

  const updateProgress = useCallback((materialId: string, progress: number) => {
    const clampedProgress = Math.max(0, Math.min(100, progress));
    
    setMaterials(prev => prev.map(material => 
      material.id === materialId 
        ? { 
            ...material, 
            progress: clampedProgress,
            isCompleted: clampedProgress >= 100,
            completedAt: clampedProgress >= 100 ? new Date() : undefined,
            lastAccessed: new Date()
          }
        : material
    ));
    
    onProgressUpdate?.(materialId, clampedProgress);
  }, [onProgressUpdate]);

  const getNextMaterial = useCallback(() => {
    if (!selectedMaterial) return null;
    
    const currentIndex = filteredMaterials.findIndex(m => m.id === selectedMaterial.id);
    if (currentIndex === -1 || currentIndex === filteredMaterials.length - 1) {
      return null;
    }
    
    return filteredMaterials[currentIndex + 1];
  }, [selectedMaterial, filteredMaterials]);

  const getPreviousMaterial = useCallback(() => {
    if (!selectedMaterial) return null;
    
    const currentIndex = filteredMaterials.findIndex(m => m.id === selectedMaterial.id);
    if (currentIndex <= 0) {
      return null;
    }
    
    return filteredMaterials[currentIndex - 1];
  }, [selectedMaterial, filteredMaterials]);

  const getMaterialsByType = useCallback((type: string) => {
    return materials.filter(material => material.type === type);
  }, [materials]);

  const getRecommendedMaterials = useCallback(() => {
    // Simple recommendation logic:
    // 1. Incomplete materials
    // 2. Recently accessed
    // 3. Next in sequence
    
    const incomplete = materials.filter(m => !m.isCompleted);
    const recent = materials
      .filter(m => m.lastAccessed)
      .sort((a, b) => {
        const aDate = a.lastAccessed || new Date(0);
        const bDate = b.lastAccessed || new Date(0);
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      })
      .slice(0, 3);
    
    // Combine and deduplicate
    const recommended = new Map<string, CourseMaterial>();
    
    // Add incomplete materials first
    incomplete.slice(0, 5).forEach(m => recommended.set(m.id, m));
    
    // Add recent materials
    recent.forEach(m => recommended.set(m.id, m));
    
    return Array.from(recommended.values()).slice(0, 5);
  }, [materials]);

  return {
    materials,
    selectedMaterial,
    filteredMaterials,
    searchQuery,
    selectedType,
    sortBy,
    completedCount,
    totalCount,
    progressPercentage,
    setSearchQuery,
    setSelectedType,
    setSortBy,
    selectMaterial,
    markAsCompleted,
    markAsIncomplete,
    updateProgress,
    getNextMaterial,
    getPreviousMaterial,
    getMaterialsByType,
    getRecommendedMaterials,
  };
};

export default useCourseMaterials;