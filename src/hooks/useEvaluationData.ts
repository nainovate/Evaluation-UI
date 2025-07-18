// src/hooks/useEvaluationData.ts
'use client'

import { useState, useEffect, useCallback } from 'react';
import { EvaluationData } from '../types/evaluation';

interface UseEvaluationDataReturn {
  evaluation: EvaluationData | null;
  loading: boolean;
  error: string | null;
  isLive: boolean;
  toggleLive: () => void;
  updateEvaluation: (data: Partial<EvaluationData>) => void;
  refetch: () => void;
}

export const useEvaluationData = (
  evaluationName: string,
  initialData?: EvaluationData
): UseEvaluationDataReturn => {
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(true);

  // Mock data generator for demo purposes
  const generateMockEvaluation = useCallback((name: string): EvaluationData => {
    return {
      id: 'eval_cs_001',
      name: decodeURIComponent(name),
      description: 'Comprehensive evaluation of AI model performance on customer support tasks with multi-dimensional scoring',
      status: Math.random() > 0.3 ? 'running' : 'completed',
      model: 'Claude-3 Sonnet',
      modelVersion: 'claude-3-sonnet-20240229',
      dataset: 'Customer Support Conversations v2',
      datasetSize: '15,420 samples • 2.8 GB',
      owner: 'alex.chen@company.com',
      created: '6/30/2025',
      progress: Math.floor(Math.random() * 100),
      currentStage: 'Evaluation',
      stages: [
        { name: 'Dataset Loading', status: 'completed', description: 'Loading and validating evaluation data' },
        { name: 'Model Setup', status: 'completed', description: 'Initializing model and configuration' },
        { name: 'Evaluation', status: 'running', description: 'Running evaluation tasks and collecting metrics' },
        { name: 'Analysis', status: 'pending', description: 'Analyzing results and generating reports' }
      ],
      metrics: {
        answerRelevance: 0.924,
        coherence: 0.887,
        helpfulness: 0.913,
        accuracy: 0.896,
        currentTask: 1034,
        totalTasks: 1542
      },
      systemStatus: {
        cpuUsage: 23.7,
        gpuUsage: 78.4,
        ramUsage: '12.3GB',
        vramUsage: '18.2GB',
        temperature: '67°C',
        diskUsage: '0.8TB'
      },
      tags: ['customer-service', 'quality-assessment', 'production']
    };
  }, []);

  // Fetch evaluation data
  const fetchEvaluationData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/evaluations/${evaluationName}`);
      // if (!response.ok) throw new Error('Failed to fetch evaluation');
      // const data = await response.json();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = generateMockEvaluation(evaluationName);
      setEvaluation(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load evaluation');
    } finally {
      setLoading(false);
    }
  }, [evaluationName, generateMockEvaluation]);

  // Initial data fetch
  useEffect(() => {
    if (!initialData) {
      fetchEvaluationData();
    }
  }, [fetchEvaluationData, initialData]);

  // Real-time updates for running evaluations
  useEffect(() => {
    if (!isLive || !evaluation || evaluation.status !== 'running') return;

    const interval = setInterval(() => {
      setEvaluation(prev => {
        if (!prev) return prev;
        
        const newProgress = Math.min(prev.progress + Math.random() * 2, 100);
        const newCurrentTask = Math.min(
          prev.metrics.currentTask + Math.floor(Math.random() * 3),
          prev.metrics.totalTasks
        );

        return {
          ...prev,
          progress: newProgress,
          metrics: {
            ...prev.metrics,
            currentTask: newCurrentTask,
            answerRelevance: Math.max(0.8, Math.min(1.0, prev.metrics.answerRelevance + (Math.random() - 0.5) * 0.02)),
            coherence: Math.max(0.8, Math.min(1.0, prev.metrics.coherence + (Math.random() - 0.5) * 0.02)),
            helpfulness: Math.max(0.8, Math.min(1.0, prev.metrics.helpfulness + (Math.random() - 0.5) * 0.02)),
            accuracy: Math.max(0.8, Math.min(1.0, prev.metrics.accuracy + (Math.random() - 0.5) * 0.02))
          },
          systemStatus: {
            ...prev.systemStatus,
            cpuUsage: Math.max(15, Math.min(40, prev.systemStatus.cpuUsage + (Math.random() - 0.5) * 5)),
            gpuUsage: Math.max(60, Math.min(90, prev.systemStatus.gpuUsage + (Math.random() - 0.5) * 8))
          }
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive, evaluation?.status]);

  const toggleLive = useCallback(() => {
    setIsLive(prev => !prev);
  }, []);

  const updateEvaluation = useCallback((data: Partial<EvaluationData>) => {
    setEvaluation(prev => prev ? { ...prev, ...data } : null);
  }, []);

  const refetch = useCallback(() => {
    fetchEvaluationData();
  }, [fetchEvaluationData]);

  return {
    evaluation,
    loading,
    error,
    isLive,
    toggleLive,
    updateEvaluation,
    refetch
  };
};