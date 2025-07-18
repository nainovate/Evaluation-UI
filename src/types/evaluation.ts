// Evaluation-specific types and interfaces

import { EvaluationRun, EvaluationTask, TaskMetrics } from './index'

// Extended evaluation with additional details
export interface DetailedEvaluation extends EvaluationRun {
  tasks: EvaluationTask[]
  settings: EvaluationSettings
  results?: EvaluationResults
}

// Evaluation configuration
export interface EvaluationSettings {
  deployment: {
    id: string
    name: string
    version: string
    endpoint: string
  }
  payload: {
    template: string
    variables: Record<string, any>
  }
  thresholds: {
    answerRelevance: number
    coherence: number
    helpfulness: number
  }
  timeout: number
  retries: number
}

// Overall evaluation results
export interface EvaluationResults {
  summary: {
    totalTasks: number
    passedTasks: number
    failedTasks: number
    averageScores: {
      answerRelevance: number
      coherence: number
      helpfulness: number
      overall: number
    }
    executionTime: number
  }
  breakdown: {
    byCategory: Record<string, CategoryResults>
    byMetric: Record<string, MetricResults>
  }
}

// Category-specific results
export interface CategoryResults {
  category: string
  totalTasks: number
  passedTasks: number
  averageScore: number
  subCategories: Record<string, {
    totalTasks: number
    passedTasks: number
    averageScore: number
  }>
}

// Metric-specific results
export interface MetricResults {
  metric: string
  averageScore: number
  passRate: number
  distribution: {
    range: string
    count: number
  }[]
}

// Real-time evaluation status
export interface EvaluationProgress {
  evaluationId: string
  currentTask: number
  totalTasks: number
  currentTaskName: string
  estimatedTimeRemaining: number
  throughput: number // tasks per minute
  errors: TaskError[]
}

// Task error details
export interface TaskError {
  taskId: string
  taskName: string
  error: string
  timestamp: string
  retryCount: number
}

// Deployment options
export interface Deployment {
  id: string
  name: string
  description: string
  version: string
  endpoint: string
  status: 'active' | 'inactive' | 'maintenance'
  lastUpdated: string
  organization: string
}

// Organization info
export interface Organization {
  id: string
  name: string
  description?: string
  activeDeployments: number
  totalEvaluations: number
}

// Payload templates
export interface PayloadTemplate {
  id: string
  name: string
  description: string
  template: string
  variables: {
    name: string
    type: 'string' | 'number' | 'boolean' | 'object'
    required: boolean
    defaultValue?: any
    description?: string
  }[]
  category: string
}

// Evaluation report
export interface EvaluationReport {
  id: string
  evaluationId: string
  generatedAt: string
  format: 'pdf' | 'json' | 'csv' | 'html'
  downloadUrl: string
  sections: {
    summary: boolean
    detailedResults: boolean
    categoryBreakdown: boolean
    metricAnalysis: boolean
    recommendations: boolean
  }
}

// Comparison between evaluations
export interface EvaluationComparison {
  baseline: EvaluationRun
  comparison: EvaluationRun
  differences: {
    scoreChanges: Record<string, {
      baseline: number
      comparison: number
      change: number
      percentChange: number
    }>
    categoryChanges: Record<string, {
      baseline: CategoryResults
      comparison: CategoryResults
    }>
  }
}

// Evaluation templates for quick setup
export interface EvaluationTemplate {
  id: string
  name: string
  description: string
  settings: Partial<EvaluationSettings>
  defaultPayload: string
  category: string
  tags: string[]
  isPublic: boolean
  createdBy: string
  usageCount: number
}
// src/types/evaluation.ts

export interface EvaluationMetrics {
  answerRelevance: number;
  coherence: number;
  helpfulness: number;
  accuracy: number;
  currentTask: number;
  totalTasks: number;
}

export interface SystemStatus {
  cpuUsage: number;
  gpuUsage: number;
  ramUsage: string;
  vramUsage: string;
  temperature: string;
  diskUsage: string;
}

export interface EvaluationStage {
  name: string;
  status: 'completed' | 'running' | 'pending' | 'failed';
  description: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
}

export type EvaluationStatus = 'running' | 'completed' | 'failed' | 'pending' | 'cancelled';

export interface EvaluationData {
  id: string;
  name: string;
  description: string;
  status: EvaluationStatus;
  model: string;
  modelVersion: string;
  dataset: string;
  datasetSize: string;
  owner: string;
  created: string;
  completed?: string;
  progress: number;
  currentStage: string;
  stages: EvaluationStage[];
  metrics: EvaluationMetrics;
  systemStatus: SystemStatus;
  tags: string[];
  configuration?: {
    batchSize?: number;
    timeout?: number;
    retryAttempts?: number;
  };
  results?: {
    overallScore?: number;
    passedTests?: number;
    failedTests?: number;
    reportUrl?: string;
  };
}

export interface EvaluationSummary {
  id: string;
  name: string;
  status: EvaluationStatus;
  progress: number;
  created: string;
  model: string;
  dataset: string;
}

// API Response types
export interface EvaluationListResponse {
  evaluations: EvaluationSummary[];
  total: number;
  page: number;
  pageSize: number;
}

export interface EvaluationResponse {
  evaluation: EvaluationData;
  success: boolean;
  message?: string;
}

// Hook types
export interface UseEvaluationOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  onStatusChange?: (status: EvaluationStatus) => void;
  onError?: (error: string) => void;
}