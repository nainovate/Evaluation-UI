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
