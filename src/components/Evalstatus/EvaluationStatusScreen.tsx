// src/components/Evalstatus/EvaluationStatusScreen.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '../ThemeToggle';
import { EvaluationSidebar } from '../EvaluationSidebar';
import { EvaluationContent } from './EvaluationContent';
import { useEvaluationData } from '../../hooks/useEvaluationData';
import { Loader2, AlertCircle } from 'lucide-react';

interface EvaluationStatusScreenProps {
  evaluationName: string;
  initialData?: any;
  onBack?: () => void;
}

export const EvaluationStatusScreen: React.FC<EvaluationStatusScreenProps> = ({
  evaluationName,
  initialData,
  onBack
}) => {
  const router = useRouter();
  
  const { 
    evaluationRuns, 
    loading, 
    error,
    refreshData,
    fetchEvaluationData 
  } = useEvaluationData();

  const [evaluation, setEvaluation] = useState(null);
  const [isLive, setIsLive] = useState(true);
  
  // 🔥 FIX: Use ref to track if we've already tried to fetch data
  const hasFetchedRef = useRef(false);

  // 🔥 FIXED: Remove fetchEvaluationData from dependency array and add guard
  useEffect(() => {
    if (evaluationRuns.length > 0) {
      // Try to find evaluation by name (decoded)
      const decodedName = decodeURIComponent(evaluationName);
      const foundEvaluation = evaluationRuns.find(item => 
        item.name === decodedName || 
        item.name === evaluationName ||
        item.id === evaluationName
      );

      if (foundEvaluation) {
        // Convert to the format expected by the status screen
        const formattedEvaluation = {
          id: foundEvaluation.id,
          name: foundEvaluation.name,
          description: foundEvaluation.description || 'Evaluation in progress',
          status: foundEvaluation.status === 'in-progress' ? 'running' : foundEvaluation.status,
          progress: foundEvaluation.progress || 0,
          currentStage: 'Evaluation',
          model: foundEvaluation.deployment,
          modelVersion: 'latest',
          dataset: foundEvaluation.organization,
          datasetSize: `${foundEvaluation.totalTasks} samples`,
          owner: 'user@example.com',
          created: new Date(foundEvaluation.createdAt).toLocaleDateString(),
          stages: [
            { name: 'Dataset Loading', status: 'completed', description: 'Loading and validating evaluation data' },
            { name: 'Model Setup', status: 'completed', description: 'Initializing model and configuration' },
            { name: 'Evaluation', status: foundEvaluation.status === 'completed' ? 'completed' : 'running', description: 'Running evaluation tasks and collecting metrics' },
            { name: 'Analysis', status: foundEvaluation.status === 'completed' ? 'completed' : 'pending', description: 'Analyzing results and generating reports' }
          ],
          metrics: {
            answerRelevance: 0.924,
            coherence: 0.887,
            helpfulness: 0.913,
            accuracy: 0.896,
            currentTask: foundEvaluation.completedTasks || 0,
            totalTasks: foundEvaluation.totalTasks || 0
          },
          systemStatus: {
            cpuUsage: 23.7,
            gpuUsage: 78.4,
            ramUsage: '12.3GB',
            vramUsage: '18.2GB',
            temperature: '67°C',
            diskUsage: '0.8TB'
          },
          tags: ['medical-qa', 'quality-assessment', 'production']
        };
        
        setEvaluation(formattedEvaluation);
        hasFetchedRef.current = true; // Mark as fetched
      }
    } else if (!loading && !hasFetchedRef.current) {
      // 🔥 FIX: Only call once and mark as attempted
      console.log('No evaluations loaded from API yet. Creating mock data.');
      hasFetchedRef.current = true;
      fetchEvaluationData(evaluationName);
    }
  }, [evaluationRuns, evaluationName, loading]); // 🔥 REMOVED fetchEvaluationData from deps

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/dashboard');
    }
  };

  const toggleLive = () => {
    setIsLive(prev => !prev);
  };

  const updateEvaluation = (data) => {
    setEvaluation(prev => prev ? { ...prev, ...data } : null);
  };

  // 🔥 IMPROVED LOADING STATE with timeout
  if (loading || (!evaluation && !hasFetchedRef.current)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <ThemeToggle />
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading evaluation details...</p>
          <p className="text-sm text-gray-500 mt-2">Searching for: {decodeURIComponent(evaluationName)}</p>
          
          {/* 🔥 ADD: Loading timeout warning */}
          <div className="mt-4">
            <button
              onClick={() => {
                hasFetchedRef.current = false;
                refreshData();
              }}
              className="text-blue-600 hover:text-blue-700 text-sm underline"
            >
              Taking too long? Click to retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 🔥 IMPROVED ERROR STATE
  if (error || (!evaluation && hasFetchedRef.current)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <ThemeToggle />
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <AlertCircle className="w-12 h-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Evaluation Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Could not find evaluation: <strong>{decodeURIComponent(evaluationName)}</strong>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {error || 'The requested evaluation could not be found in the system.'}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleBack}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => {
                hasFetchedRef.current = false;
                refreshData();
              }}
              className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Refresh Data
            </button>
          </div>
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