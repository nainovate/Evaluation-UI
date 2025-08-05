// src/utils/evaluationUtils.ts - Updated to use API instead of hardcoded data

import { dataService } from '@/services/data.service';

// Types for evaluation metrics (keep existing types)
export interface SubMetric {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  config?: Record<string, any>;
}

export interface MetricCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  selected: boolean;
  subMetrics: SubMetric[];
}

export interface MetricsConfiguration {
  evaluationModel: string;
  batchSize: number;
  timeout: number;
}

export interface Deployment {
  id: string;
  name: string;
  model?: string;
  status: 'active' | 'inactive' | 'error' | 'maintenance';
  endpoint: string;
  provider?: string;
  region?: string;
  lastUpdated: string;
  responseTime?: number;
  uptime?: number;
  description: string;
  version: string;
  organization?: string;
}

export interface EvaluationDataset {
  id: string;
  uid?: string;
  name: string;
  description: string;
  size: number;
  status: 'valid' | 'invalid' | 'pending';
  columns: string[];
  rows: number;
  uploadedAt: string;
  filePath?: string;
  originalFileName?: string;
  taskType?: string;
  tags?: string[];
  format?: 'CSV' | 'JSON' | 'YAML';
  preview?: any[];
}

export interface EvaluationMetadata {
  evaluationSession: {
    id: string | null;
    createdAt: string | null;
    lastModified: string | null;
    status: string;
  };
  dataset: {
    uid: string | null;
    id: string | null;
    name: string | null;
    selectedAt: string | null;
    taskType?: string | null;
    rows?: number | null;
    columns?: string[] | null;
  };
  deployment?: {
    id: string | null;
    name: string | null;
    model: string | null;
    provider: string | null;
    selectedAt: string | null;
  };
  deployments?: Array<{
    id: string;
    name: string;
    model: string;
    provider: string;
    selectedAt: string;
  }>;
  metrics?: {
    categories: MetricCategory[];
    selectedCategory: string | null;
    totalSelected: number;
    configuration: MetricsConfiguration;
    configuredAt: string | null;
  };
  execution?: {
    startedAt: string | null;
    completedAt: string | null;
    status: string | null;
    results: any | null;
    evaluationName?: string | null;
    evaluationDescription?: string | null;
  };
  selectedDataset?: EvaluationDataset;
  selectedModel?: any;
  selectedMetrics?: string[];
  configuration?: any;
}

// ========== API-BASED FUNCTIONS (Replace hardcoded data) ==========

// Evaluation dataset management functions - NOW USES API
export async function getEvaluationDatasets(): Promise<EvaluationDataset[]> {
  try {
    console.log('Fetching evaluation datasets from API...');
    const response = await dataService.getEvaluationDatasets();
    
    if (response.error) {
      console.error('Error fetching evaluation datasets:', response.error);
      return [];
    }
    
    return response.data?.datasets || [];
  } catch (error) {
    console.error('Failed to fetch evaluation datasets:', error);
    return [];
  }
}

// Deployment management functions - NOW USES API  
export async function getEvaluationDeployments(): Promise<Deployment[]> {
  try {
    console.log('Fetching evaluation deployments from API...');
    const response = await dataService.getEvaluationDeployments();
    
    if (response.error) {
      console.error('Error fetching evaluation deployments:', response.error);
      return [];
    }
    
    return response.data?.deployments || [];
  } catch (error) {
    console.error('Failed to fetch evaluation deployments:', error);
    return [];
  }
}

// Organization management functions - NOW USES API
export async function getEvaluationOrganizations() {
  try {
    console.log('Fetching evaluation organizations from API...');
    const response = await dataService.getEvaluationOrganizations();
    
    if (response.error) {
      console.error('Error fetching evaluation organizations:', response.error);
      return [];
    }
    
    return response.data?.organizations || [];
  } catch (error) {
    console.error('Failed to fetch evaluation organizations:', error);
    return [];
  }
}

// Evaluation runs management - NOW USES API
export async function getEvaluationRuns() {
  try {
    console.log('Fetching evaluation runs from API...');
    const response = await dataService.getEvaluations();
    
    if (response.error) {
      console.error('Error fetching evaluation runs:', response.error);
      return [];
    }
    
    return response.data?.evaluationRuns || [];
  } catch (error) {
    console.error('Failed to fetch evaluation runs:', error);
    return [];
  }
}

// Get evaluation tasks - NOW USES API
export async function getEvaluationTasks(evaluationId?: string) {
  try {
    console.log('Fetching evaluation tasks from API...');
    const response = await dataService.getEvaluationTasks(evaluationId);
    
    if (response.error) {
      console.error('Error fetching evaluation tasks:', response.error);
      return [];
    }
    
    return response.data?.tasks || [];
  } catch (error) {
    console.error('Failed to fetch evaluation tasks:', error);
    return [];
  }
}

// Dashboard stats - NOW USES API
export async function getDashboardStats() {
  try {
    console.log('Fetching dashboard stats from API...');
    const response = await dataService.getEvaluations();
    
    if (response.error) {
      console.error('Error fetching dashboard stats:', response.error);
      return {
        totalEvaluations: 0,
        activeEvaluations: 0,
        completedEvaluations: 0,
        failedEvaluations: 0,
        averageSuccessRate: 0
      };
    }
    
    return response.data?.dashboardStats || {
      totalEvaluations: 0,
      activeEvaluations: 0,
      completedEvaluations: 0,
      failedEvaluations: 0,
      averageSuccessRate: 0
    };
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return {
      totalEvaluations: 0,
      activeEvaluations: 0,
      completedEvaluations: 0,
      failedEvaluations: 0,
      averageSuccessRate: 0
    };
  }
}

export async function getEvaluationMetadata(): Promise<EvaluationMetadata> {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('evaluation_metadata');
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('Loading metadata from localStorage:', parsed);
        return parsed;
      }
    } catch (error) {
      console.warn('Failed to load metadata from localStorage:', error);
    }
  }
   return {
    id: `eval_${Date.now()}`,
    name: '',
    description: '',
    status: 'created',
    createdAt: new Date().toISOString(),
    dataset: null,
    deployment: null,
    metrics: {
      categories: [],
      selectedCategory: null,
      totalSelected: 0,
      configuration: null,
      results: null
    }
  };
}

export async function updateEvaluationMetadata(updates: Partial<EvaluationMetadata>): Promise<void> {
  if (typeof window !== 'undefined') {
    try {
      // Get current metadata from localStorage
      const current = await getEvaluationMetadata();
      
      // Merge updates
      const updated = { ...current, ...updates };
      
      // Save back to localStorage
      localStorage.setItem('evaluation_metadata', JSON.stringify(updated));
      localStorage.setItem('evaluation_timestamp', Date.now().toString());
      
      console.log('Updated metadata in localStorage:', updates);
    } catch (error) {
      console.warn('Failed to update metadata in localStorage:', error);
    }
  }
}

// Utility functions for generating IDs
export function generateEvaluationDatasetUID(): string {
  return `eval_dataset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateEvaluationSessionUID(): string {
  return `eval_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Helper functions that now use API data
export async function getMockEvaluationById(id: string) {
  try {
    const response = await dataService.getEvaluation(id);
    if (response.error) {
      console.error('Error fetching evaluation by ID:', response.error);
      return undefined;
    }
    return response.data?.evaluation;
  } catch (error) {
    console.error('Failed to fetch evaluation by ID:', error);
    return undefined;
  }
}

export async function getMockTasksByEvaluationId(evaluationId: string) {
  try {
    const response = await dataService.getEvaluationTasks(evaluationId);
    if (response.error) {
      console.error('Error fetching tasks by evaluation ID:', response.error);
      return [];
    }
    return response.data?.tasks || [];
  } catch (error) {
    console.error('Failed to fetch tasks by evaluation ID:', error);
    return [];
  }
}

export async function getMockTaskById(id: string) {
  try {
    const response = await dataService.getEvaluationTasks();
    if (response.error) {
      console.error('Error fetching tasks:', response.error);
      return undefined;
    }
    
    const tasks = response.data?.tasks || [];
    return tasks.find((task: any) => task.id === id);
  } catch (error) {
    console.error('Failed to fetch task by ID:', error);
    return undefined;
  }
}

// Generate additional mock data for testing
export const generateMockEvaluation = (overrides: any = {}): any => {
  const randomId = `eval-${Date.now()}`;
  return {
    id: randomId,
    name: `Test Evaluation ${randomId}`,
    deployment: 'GPT-4 Customer Support',
    organization: 'Acme Corporation',
    status: 'pending',
    createdAt: new Date().toISOString(),
    totalTasks: 10,
    completedTasks: 0,
    failedTasks: 0,
    progress: 0,
    ...overrides
  };
}

// Additional utility functions
export async function addEvaluationDataset(datasetData: any): Promise<boolean> {
  try {
    // In a real implementation, this would POST to /api/evaluations/datasets
    console.log('Adding evaluation dataset:', datasetData);
    
    // For now, just simulate success
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  } catch (error) {
    console.error('Failed to add evaluation dataset:', error);
    return false;
  }
}

// Validate evaluation dataset columns based on task type
export function validateEvaluationColumns(columns: string[], taskType?: string): boolean {
  if (!taskType) return true;
  
  const requiredColumns: Record<string, string[]> = {
    'Question Answering': ['input', 'expected_output'],
    'Text Classification': ['text', 'label'],
    'Code Generation': ['problem_description', 'expected_code'],
    'Conversational QA': ['conversation_history', 'question', 'expected_answer'],
    'Retrieval (RAG)': ['query', 'relevant_documents'],
    'Open-ended Generation': ['prompt', 'expected_output']
  };
  
  const required = requiredColumns[taskType];
  if (!required) return true;
  
  return required.every(col => columns.includes(col));
}

// Load evaluation metadata (for backward compatibility)
export async function loadEvaluationMetadata(): Promise<EvaluationMetadata> {
  return getEvaluationMetadata();
}

// Validate metrics configuration
export function validateMetricsConfiguration(config: MetricsConfiguration): boolean {
  return !!(config.evaluationModel && config.batchSize > 0 && config.timeout > 0);
}

// Get metrics summary
export function getMetricsSummary(categories: MetricCategory[]): string {
  const selectedCount = categories.filter(cat => cat.selected).length;
  const totalCount = categories.length;
  return `${selectedCount}/${totalCount} metric categories selected`;
}