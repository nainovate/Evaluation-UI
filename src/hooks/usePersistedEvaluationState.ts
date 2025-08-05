// src/hooks/usePersistedEvaluationState.ts - Fixed hydration issue
import { useState, useEffect } from 'react';
import type { EvaluationMetadata } from '../utils/evaluationUtils';

const STORAGE_KEYS = {
  CURRENT_STEP: 'evaluation_current_step',
  METADATA: 'evaluation_metadata',
  TIMESTAMP: 'evaluation_timestamp'
} as const;

interface UsePersistedEvaluationStateReturn {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  metadata: EvaluationMetadata | null;
  setMetadata: (metadata: EvaluationMetadata | null) => void;
  clearPersistedState: (reason?: string) => void;
  markEvaluationCompleted: (metadata: EvaluationMetadata) => void;
  isHydrated: boolean;
}

export const usePersistedEvaluationState = (): UsePersistedEvaluationStateReturn => {
  // ✅ FIX: Always start with default values to prevent hydration mismatch
  const [currentStep, setCurrentStepState] = useState<number>(1);
  const [metadata, setMetadataState] = useState<EvaluationMetadata | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // ✅ FIX: Load from localStorage only after component mounts
  // ✅ REPLACE the useEffect with this corrected version
// ✅ REPLACE the state updates in useEffect with this:
useEffect(() => {
  if (typeof window !== 'undefined') {
    try {
      let shouldUpdateStep = false;
      let shouldUpdateMetadata = false;
      let newStep = 1;
      let newMetadata = null;

      // Load currentStep
      const savedStep = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);
      if (savedStep) {
        const parsedStep = parseInt(savedStep, 10);
        if (parsedStep >= 1 && parsedStep <= 5) {
          newStep = parsedStep;
          shouldUpdateStep = true;
        }
      }

      // Load metadata
      const savedMetadata = localStorage.getItem(STORAGE_KEYS.METADATA);
      if (savedMetadata) {
        const parsedMetadata = JSON.parse(savedMetadata);
        if (parsedMetadata && typeof parsedMetadata === 'object' && parsedMetadata.id) {
          newMetadata = parsedMetadata as EvaluationMetadata;
          shouldUpdateMetadata = true;
        }
      }

      // Debug logs
      console.log('🔍 PERSISTENT HOOK DEBUG:');
      console.log('  - savedStep:', savedStep);
      console.log('  - savedMetadata:', savedMetadata);
      console.log('  - shouldUpdateStep:', shouldUpdateStep, 'newStep:', newStep);
      console.log('  - shouldUpdateMetadata:', shouldUpdateMetadata, 'hasDataset:', !!newMetadata?.dataset);

      // Update states after all processing
      if (shouldUpdateStep) {
        console.log('  → Setting currentStep to:', newStep);
        setCurrentStepState(newStep);
      }

      if (shouldUpdateMetadata) {
        console.log('  → Setting metadata to:', newMetadata);
        setMetadataState(newMetadata);
      }

      // Check if data is expired (existing code)
      const timestamp = localStorage.getItem(STORAGE_KEYS.TIMESTAMP);
      if (timestamp) {
        const age = Date.now() - parseInt(timestamp);
        const MAX_AGE = 24 * 60 * 60 * 1000;
        
        if (age > MAX_AGE) {
          console.log('Evaluation data expired, clearing...');
          localStorage.removeItem(STORAGE_KEYS.CURRENT_STEP);
          localStorage.removeItem(STORAGE_KEYS.METADATA);
          localStorage.removeItem(STORAGE_KEYS.TIMESTAMP);
          setCurrentStepState(1);
          setMetadataState(null);
        }
      }
      
    } catch (error) {
      console.warn('Failed to load saved data:', error);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_STEP);
      localStorage.removeItem(STORAGE_KEYS.METADATA);
      localStorage.removeItem(STORAGE_KEYS.TIMESTAMP);
    }
    
    setIsHydrated(true);
  }
}, []);
// ✅ ADD this debug useEffect to track state changes
useEffect(() => {
  console.log('🔍 METADATA STATE CHANGED:');
  console.log('  - metadata:', metadata);
  console.log('  - metadata?.dataset:', metadata?.dataset);
  console.log('  - isHydrated:', isHydrated);
}, [metadata, isHydrated]);

  // Custom setCurrentStep that syncs to localStorage
  const setCurrentStep = (step: number) => {
    setCurrentStepState(step);
    if (typeof window !== 'undefined' && isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, step.toString());
        localStorage.setItem(STORAGE_KEYS.TIMESTAMP, Date.now().toString());
      } catch (error) {
        console.warn('Failed to save currentStep to localStorage:', error);
      }
    }
  };

  // Custom setMetadata that syncs to localStorage
  const setMetadata = (newMetadata: EvaluationMetadata | null) => {
    setMetadataState(newMetadata);
    if (typeof window !== 'undefined' && isHydrated) {
      try {
        if (newMetadata) {
          localStorage.setItem(STORAGE_KEYS.METADATA, JSON.stringify(newMetadata));
          localStorage.setItem(STORAGE_KEYS.TIMESTAMP, Date.now().toString());
        } else {
          localStorage.removeItem(STORAGE_KEYS.METADATA);
        }
      } catch (error) {
        console.warn('Failed to save metadata to localStorage:', error);
      }
    }
  };

  // Clear all persisted state
  // ✅ UPDATE the clearPersistedState function to clear ALL keys
const clearPersistedState = (reason = 'manual') => {
  if (typeof window !== 'undefined') {
    try {
      console.log(`Clearing evaluation state - Reason: ${reason}`);
      
      // Clear main evaluation keys
      localStorage.removeItem(STORAGE_KEYS.CURRENT_STEP);
      localStorage.removeItem(STORAGE_KEYS.METADATA);
      localStorage.removeItem(STORAGE_KEYS.TIMESTAMP);
      
      // ✅ ADD: Clear metrics-specific key
      localStorage.removeItem('evaluationMetrics');
      
      // ✅ ADD: Clear any other evaluation-related keys
      localStorage.removeItem('completed_evaluations'); // Optional: if you want to clear history too
      
      console.log('✅ All evaluation localStorage keys cleared');
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }
};

  // Mark evaluation as completed (for history tracking)
  const markEvaluationCompleted = (completedMetadata: EvaluationMetadata) => {
    if (typeof window !== 'undefined') {
      try {
        const completedData = {
          ...completedMetadata,
          completedAt: new Date().toISOString()
        };
        
        const existingHistory = localStorage.getItem('completed_evaluations');
        const completedHistory = existingHistory ? JSON.parse(existingHistory) : [];
        
        completedHistory.push(completedData);
        
        if (completedHistory.length > 10) {
          completedHistory.shift();
        }
        
        localStorage.setItem('completed_evaluations', JSON.stringify(completedHistory));
      } catch (error) {
        console.warn('Failed to save completed evaluation:', error);
      }
    }
  };

  return {
    currentStep,
    setCurrentStep,
    metadata,
    setMetadata,
    clearPersistedState,
    markEvaluationCompleted,
    isHydrated
  };
};