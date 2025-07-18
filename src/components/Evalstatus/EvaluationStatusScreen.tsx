// src/components/evaluation/EvaluationStatusScreen.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '../ThemeToggle';
import { EvaluationSidebar } from './EvaluationSidebar';
import { EvaluationContent } from './EvaluationContent';
import { useEvaluationData } from '../../hooks/useEvaluationData';
import { EvaluationData } from '../../types/evaluation';

interface EvaluationStatusScreenProps {
  evaluationName: string;
  initialData?: EvaluationData;
  onBack?: () => void;
}

export const EvaluationStatusScreen: React.FC<EvaluationStatusScreenProps> = ({
  evaluationName,
  initialData,
  onBack
}) => {
  const router = useRouter();
  const {
    evaluation,
    loading,
    error,
    isLive,
    toggleLive,
    updateEvaluation
  } = useEvaluationData(evaluationName, initialData);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <ThemeToggle />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading evaluation details...</p>
        </div>
      </div>
    );
  }

  if (error || !evaluation) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <ThemeToggle />
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Evaluation Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || 'The requested evaluation could not be found.'}
          </p>
          <button
            onClick={handleBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <ThemeToggle />
      <EvaluationSidebar 
        evaluation={evaluation}
        isLive={isLive}
        onToggleLive={toggleLive}
        onBack={handleBack}
      />
      <EvaluationContent 
        evaluation={evaluation}
        onUpdate={updateEvaluation}
      />
    </div>
  );
};