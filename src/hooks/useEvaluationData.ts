
import { useState, useEffect, useCallback, useRef } from 'react';
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
  
  const fetchAttemptedRef = useRef<Set<string>>(new Set());

  // Generate stages from config
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

  // Generate mock evaluation data
  const generateMockEvaluationData = useCallback((evaluationName: string): EvaluationData => {
    return {
      id: `eval-${Date.now()}`,
      name: evaluationName,
      deployment: 'GPT-4 Medical Support',
      organization: 'Healthcare AI Corp',
      status: Math.random() > 0.5 ? 'running' : 'completed',
      progress: Math.floor(Math.random() * 100),
      currentStage: 'Evaluation',
      
      stages: generateStagesFromConfig('Evaluation'),
      
      metrics: {
        answerRelevance: 0.945,
        coherence: 0.912,
        helpfulness: 0.889,
        accuracy: 0.923,
        currentTask: 567,
        totalTasks: 875
      },
      systemStatus: {
        cpuUsage: 18.3,
        gpuUsage: 82.1,
        ramUsage: '14.7GB',
        vramUsage: '20.4GB',
        temperature: '71°C',
        diskUsage: '1.2TB'
      },
      tags: ['evaluation', 'quality-assessment']
    };
  }, [generateStagesFromConfig]);

  // 🔍 IMPROVED: Fetch all evaluation data with detailed debugging
  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 HOOK: Refreshing all evaluation data...');
      
      // 🔍 TEST: Direct API call to see what we get
      console.log('🔍 HOOK: Testing direct API call...');
      const directResponse = await fetch('/api/evaluations');
      const directData = await directResponse.json();
      console.log('🔍 HOOK: Direct API response:', directData);
      console.log('🔍 HOOK: Direct evaluation runs:', directData.data?.evaluationRuns);
      console.log('🔍 HOOK: Direct count:', directData.data?.evaluationRuns?.length);

      // Use direct API response for evaluation runs
      if (directData.success && directData.data?.evaluationRuns) {
        setEvaluationRuns(directData.data.evaluationRuns);
        setDashboardStats(directData.data.dashboardStats || {});
        console.log('✅ HOOK: Set evaluation runs from direct API:', directData.data.evaluationRuns.length);
      } else {
        console.log('❌ HOOK: Direct API failed or no data');
        setEvaluationRuns([]);
      }

      // Fetch other data using utility functions (but don't wait for them)
      Promise.all([
        getEvaluationTasks(),
        getEvaluationOrganizations(),
        getEvaluationDeployments(),
        getEvaluationDatasets()
      ]).then(([
        tasksData,
        orgsData,
        deploymentsData,
        datasetsData
      ]) => {
        setEvaluationTasks(tasksData);
        setOrganizations(orgsData);
        setDeployments(deploymentsData);
        setDatasets(datasetsData);
        console.log('✅ HOOK: Set additional data');
      }).catch(err => {
        console.log('⚠️ HOOK: Additional data fetch failed:', err);
      });
      
      console.log('✅ HOOK: Successfully loaded main evaluation data');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch evaluation data';
      setError(errorMessage);
      console.error('❌ HOOK: Error refreshing evaluation data:', err);
      
      // Fallback: try to set some data anyway
      setEvaluationRuns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch specific evaluation data with guard
  const fetchEvaluationData = useCallback(async (evaluationName?: string) => {
    const nameToUse = evaluationName || 'Default Evaluation';
    
    if (fetchAttemptedRef.current.has(nameToUse)) {
      console.log(`🔍 HOOK: Already attempted to fetch ${nameToUse}, skipping`);
      return;
    }
    
    fetchAttemptedRef.current.add(nameToUse);
    
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔍 HOOK: Fetching evaluation data for: ${nameToUse}`);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = generateMockEvaluationData(nameToUse);
      setEvaluation(mockData);
      
      console.log('✅ HOOK: Successfully loaded mock evaluation data');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch evaluation';
      setError(errorMessage);
      console.error('❌ HOOK: Error fetching evaluation data:', err);
    } finally {
      setLoading(false);
    }
  }, [generateMockEvaluationData]);

  // Clear fetch attempts when needed
  useEffect(() => {
    fetchAttemptedRef.current.clear();
  }, []);

  // Load initial data when hook mounts
  useEffect(() => {
    console.log('🔄 HOOK: Initial data load triggered');
    refreshData();
  }, [refreshData]);

  // 🔍 DEBUG: Log state changes
  useEffect(() => {
    console.log('🔍 HOOK STATE CHANGE:');
    console.log('  evaluationRuns.length:', evaluationRuns.length);
    console.log('  evaluationRuns:', evaluationRuns.map(e => ({ id: e.id, name: e.name })));
    console.log('  loading:', loading);
    console.log('  error:', error);
  }, [evaluationRuns, loading, error]);

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
