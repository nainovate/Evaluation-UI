// Core evaluation types for Nainovate-Dashboard
export type EvaluationStatus = 'completed' | 'in-progress' | 'failed' | 'pending'
export type TaskStatus = 'completed' | 'running' | 'failed' | 'pending'
export type FilterType = 'all' | 'completed' | 'failed' | 'in-progress'

// Main evaluation run interface
export interface EvaluationRun {
  id: string
  name: string
  deployment: string
  organization: string
  status: EvaluationStatus
  createdAt: string
  completedAt?: string
  totalTasks: number
  completedTasks: number
  failedTasks: number
  progress: number // 0-100
  description?: string
}

// Individual evaluation task
export interface EvaluationTask {
  id: string
  evaluationId: string
  name: string
  status: TaskStatus
  progress: number // 0-100
  startedAt: string
  completedAt?: string
  metrics?: TaskMetrics
  error?: string
}

// Task metrics/results
export interface TaskMetrics {
  answerRelevance: MetricScore
  coherence: MetricScore
  helpfulness: MetricScore
  category: string
  subCategory: string
  expectedOutput: string
  actualOutput: string
}

// Individual metric score
export interface MetricScore {
  score: number // 0-1 or 0-100
  comments: string
  threshold?: number
  passed: boolean
}

// Form data for starting evaluation
export interface StartEvaluationForm {
  deployment: string
  payload: string
  processName: string
  organization: string
}

// Dropdown options
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Dashboard stats
export interface DashboardStats {
  totalEvaluations: number
  activeEvaluations: number
  completedEvaluations: number
  failedEvaluations: number
  averageSuccessRate: number
}

// Filter state
export interface FilterState {
  status: FilterType
  organization?: string
  deployment?: string
  dateRange?: {
    start: string
    end: string
  }
}

// Sort options
export type SortField = 'name' | 'createdAt' | 'status' | 'progress'
export type SortDirection = 'asc' | 'desc'

export interface SortState {
  field: SortField
  direction: SortDirection
}

// Component props interfaces
export interface StatusBadgeProps {
  status: EvaluationStatus | TaskStatus
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

export interface EvaluationCardProps {
  evaluation: EvaluationRun
  onClick?: (id: string) => void
  showActions?: boolean
}

export interface MetricViewerProps {
  metrics: TaskMetrics
  showDetails?: boolean
}

export interface FilterTabsProps {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  counts?: {
    all: number
    completed: number
    failed: number
    'in-progress': number
  }
}

// Hook return types
export interface UseEvaluationsReturn {
  evaluations: EvaluationRun[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  createEvaluation: (data: StartEvaluationForm) => Promise<string>
  deleteEvaluation: (id: string) => Promise<void>
}

export interface UseTasksReturn {
  tasks: EvaluationTask[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  getTaskById: (id: string) => EvaluationTask | undefined
}

// Constants
export const EVALUATION_STATUS_COLORS = {
  completed: 'green',
  'in-progress': 'blue',
  failed: 'red',
  pending: 'yellow'
} as const

export const TASK_STATUS_COLORS = {
  completed: 'green',
  running: 'blue', 
  failed: 'red',
  pending: 'gray'
} as const

export interface Deployment {
  id: string;
  name: string;
  model: string;
  status: 'active' | 'inactive' | 'error';
  endpoint: string;
  provider: string;
  region: string;
  lastUpdated: string;
  responseTime: number;
  uptime: number;
  description?: string;
  version?: string;
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
  };
  deployment: {
    id: string | null;
    name: string | null;
    model: string | null;
    provider: string | null;
    selectedAt: string | null;
  };
  metrics: {
    selectedMetrics: string[];
    customMetrics: any[];
    configuredAt: string | null;
  };
  execution: {
    startedAt: string | null;
    completedAt: string | null;
    status: string | null;
    results: any | null;
  };
}