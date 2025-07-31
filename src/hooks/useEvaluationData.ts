// src/hooks/useEvaluationData.ts - Updated to use API-based data

import { useState, useEffect, useCallback } from 'react';
import { dataService } from '@/services/data.service';
import { 
  getEvaluationDatasets,
  getEvaluationDeployments,
  getEvaluationOrganizations,
  getEvaluationRuns,
  getEvaluationTasks,
  getDashboardStats,
  generateMockEvaluation
} from '@/utils/evaluationUtils';

// Types
interface EvaluationData {
  id: string;
  name: string;
  deployment: string;
  organization: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  currentStage: string;
  stages: Array<{
    name: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    description: string;
  }>;
  metrics: {
    answerRelevance: number;
    coherence: number;
    helpfulness: number;
    accuracy: number;
    currentTask: number;
    totalTasks: number;
  };
  systemStatus: {
    cpuUsage: number;
    gpuUsage: number;
    ramUsage: string;
    vramUsage: string;
    temperature: string;
    diskUsage: string;
  };
  tags: string[];
}

interface UseEvaluationDataReturn {
  evaluation: EvaluationData | null;
  evaluationRuns: any[];
  evaluationTasks: any[];
  organizations: any[];
  deployments: any[];
  datasets: any[];
  dashboardStats: any;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  fetchEvaluationData: (evaluationName: string) => Promise<void>;
}

export function useEvaluationData(): UseEvaluationDataReturn {
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
  const [evaluationRuns, setEvaluationRuns] = useState<any[]>([]);
  const [evaluationTasks, setEvaluationTasks] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [deployments, setDeployments] = useState<any[]>([]);
  const [datasets, setDatasets] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate stages from config (keep this helper function)
  const generateStagesFromConfig = useCallback((currentStage: string) => {
    const allStages = [
      { name: 'Dataset Loading', status: 'completed', description: 'Loading and validating evaluation data' },
      { name: 'Model Setup', status: 'completed', description: 'Initializing model and configuration' },
      { name: 'Evaluation', status: 'pending', description: 'Running evaluation tasks and collecting metrics' },
      { name: 'Analysis', status: 'pending', description: 'Analyzing results and generating reports' }
    ];

    const currentIndex = allStages.findIndex(stage => stage.name === currentStage);
    
    return allStages.map((stage, index) => ({
      ...stage,
      status: index < currentIndex ? 'completed' : 
              index === currentIndex ? 'running' : 'pending'
    }));
  }, []);

  // Generate mock evaluation data (for individual evaluation detail view)
  const generateMockEvaluationData = useCallback((evaluationName: string): EvaluationData => {
    return {
      id: `eval-${Date.now()}`,
      name: evaluationName,
      deployment: 'GPT-4 Customer Support',
      organization: 'Acme Corporation',
      status: Math.random() > 0.5 ? 'running' : 'completed',
      model: 'Claude-3 Sonnet',
      modelVersion: 'claude-3-sonnet-20240229',
      dataset: 'Customer Support Conversations v2',
      datasetSize: '15,420 samples • 2.8 GB',
      owner: 'alex.chen@company.com',
      created: '6/30/2025',
      progress: Math.floor(Math.random() * 100),
      currentStage: 'Evaluation',
      
      stages: generateStagesFromConfig('Evaluation'),
      
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
  }, [generateStagesFromConfig]);

  // Fetch all evaluation data from API
  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Refreshing all evaluation data from APIs...');
      
      // Fetch all data in parallel
      const [
        runsData,
        tasksData,
        orgsData,
        deploymentsData,
        datasetsData,
        statsData
      ] = await Promise.all([
        getEvaluationRuns(),
        getEvaluationTasks(),
        getEvaluationOrganizations(),
        getEvaluationDeployments(),
        getEvaluationDatasets(),
        getDashboardStats()
      ]);

      setEvaluationRuns(runsData);
      setEvaluationTasks(tasksData);
      setOrganizations(orgsData);
      setDeployments(deploymentsData);
      setDatasets(datasetsData);
      setDashboardStats(statsData);
      
      console.log('Successfully loaded all evaluation data');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch evaluation data';
      setError(errorMessage);
      console.error('Error refreshing evaluation data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch specific evaluation data
  const fetchEvaluationData = useCallback(async (evaluationName?: string) => {
    const nameToUse = evaluationName || 'Default Evaluation';
    
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching evaluation data for: ${nameToUse}`);
      
      // For now, generate mock data for individual evaluation view
      // In the future, this could fetch from a specific API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = generateMockEvaluationData(nameToUse);
      setEvaluation(mockData);
      
      console.log('Successfully loaded evaluation data');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch evaluation';
      setError(errorMessage);
      console.error('Error fetching evaluation data:', err);
    } finally {
      setLoading(false);
    }
  }, [generateMockEvaluationData]);

  // Load initial data when hook mounts
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    evaluation,
    evaluationRuns,
    evaluationTasks,
    organizations,
    deployments,
    datasets,
    dashboardStats,
    loading,
    error,
    refreshData,
    fetchEvaluationData
  };
}