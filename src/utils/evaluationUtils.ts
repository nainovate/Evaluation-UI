import fs from 'fs/promises';
import path from 'path';

// Types for evaluation metrics
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
  model: string;
  status: 'active' | 'inactive' | 'error';
  endpoint: string;
  provider: string;
  region: string;
  lastUpdated: string;
  responseTime: number;
  uptime: number;
  description: string;
  version: string;
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
}

// Generate unique identifier
export const generateUID = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

// Generate unique evaluation session ID
export function generateEvaluationSessionId(): string {
  return `eval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Generate a unique identifier for evaluation datasets
export function generateEvaluationDatasetUID(): string {
  return `eval_dataset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Default metadata structure
const defaultEvaluationMetadata: EvaluationMetadata = {
  evaluationSession: {
    id: null,
    createdAt: null,
    lastModified: null,
    status: 'not_started'
  },
  dataset: {
    uid: null,
    id: null,
    name: null,
    selectedAt: null,
    taskType: null,
    rows: null,
    columns: null
  },
  deployment: {
    id: null,
    name: null,
    model: null,
    provider: null,
    selectedAt: null
  },
  metrics: {
    categories: [],
    selectedCategory: null,
    totalSelected: 0,
    configuration: {
      evaluationModel: 'gpt-4',
      batchSize: 50,
      timeout: 30
    },
    configuredAt: null
  },
  execution: {
    startedAt: null,
    completedAt: null,
    status: null,
    results: null,
    evaluationName: null,
    evaluationDescription: null
  }
};

// Load evaluation metadata from storage
export const loadEvaluationMetadata = async (): Promise<EvaluationMetadata> => {
  try {
    // Try API first
    const response = await fetch('/api/evaluation-metadata');
    if (response.ok) {
      const data = await response.json();
      return { ...defaultEvaluationMetadata, ...data };
    }
  } catch (error) {
    console.error('API not available, falling back to localStorage');
  }

  // Fallback to localStorage
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('evaluation-metadata');
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...defaultEvaluationMetadata, ...parsed };
      }
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }

  return defaultEvaluationMetadata;
};

// Update evaluation metadata - UNIFIED VERSION
export const updateEvaluationMetadata = async (updates: Partial<EvaluationMetadata>): Promise<EvaluationMetadata> => {
  try {
    const currentMetadata = await loadEvaluationMetadata();
    
    // Initialize session if not exists
    if (!currentMetadata.evaluationSession.id && (updates.dataset || updates.deployment || updates.metrics)) {
      currentMetadata.evaluationSession = {
        id: generateEvaluationSessionId(),
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        status: 'in_progress'
      };
    }

    const updatedMetadata = {
      ...currentMetadata,
      ...updates,
      evaluationSession: {
        ...currentMetadata.evaluationSession,
        ...updates.evaluationSession,
        lastModified: new Date().toISOString()
      }
    };

    // Try to save via API
    try {
      const response = await fetch('/api/evaluation-metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMetadata),
      });
      
      if (!response.ok) {
        throw new Error('API call failed');
      }
    } catch (apiError) {
      console.warn('API not available, using localStorage fallback');
      if (typeof window !== 'undefined') {
        localStorage.setItem('evaluation-metadata', JSON.stringify(updatedMetadata));
      }
    }

    return updatedMetadata;
  } catch (error) {
    console.error('Error updating evaluation metadata:', error);
    throw error;
  }
};

// Mock data for evaluation datasets
const mockEvaluationDatasets: EvaluationDataset[] = [
  {
    id: 'eval_dataset_001',
    uid: 'eval_dataset_001',
    name: 'Customer Support QA Evaluation',
    description: 'Evaluation dataset for customer support chatbot performance with question-answer pairs',
    size: 1024000,
    status: 'valid',
    columns: ['question', 'expected_answer', 'context', 'category'],
    rows: 500,
    uploadedAt: '2024-01-15T10:30:00Z',
    taskType: 'Question Answering',
    tags: ['customer-support', 'factual-qa', 'evaluation'],
    format: 'CSV'
  },
  {
    id: 'eval_dataset_002',
    uid: 'eval_dataset_002',
    name: 'Text Summarization Benchmark',
    description: 'Standard benchmark for evaluating text summarization models with reference summaries',
    size: 2048000,
    status: 'valid',
    columns: ['input_text', 'reference_summary', 'length_constraint', 'domain'],
    rows: 1000,
    uploadedAt: '2024-01-10T14:20:00Z',
    taskType: 'Summarization',
    tags: ['summarization', 'abstractive', 'evaluation'],
    format: 'CSV'
  },
  {
    id: 'eval_dataset_003',
    uid: 'eval_dataset_003',
    name: 'Incomplete Evaluation Set',
    description: 'Missing reference outputs for proper evaluation - needs to be fixed',
    size: 512000,
    status: 'invalid',
    columns: ['input_text'],
    rows: 200,
    uploadedAt: '2024-01-08T09:15:00Z',
    taskType: 'Classification',
    tags: ['incomplete', 'invalid'],
    format: 'CSV'
  },
  {
    id: 'eval_dataset_004',
    uid: 'eval_dataset_004',
    name: 'Structured Data Extraction',
    description: 'JSON and table extraction tasks for evaluating structured output generation',
    size: 3145728,
    status: 'valid',
    columns: ['input_text', 'expected_json', 'schema_type', 'difficulty'],
    rows: 150,
    uploadedAt: '2024-01-12T16:45:00Z',
    taskType: 'Structured Output',
    tags: ['json-generation', 'structured-output', 'evaluation'],
    format: 'JSON'
  },
  {
    id: 'eval_dataset_005',
    uid: 'eval_dataset_005',
    name: 'Multi-turn Conversation QA',
    description: 'Conversational QA with context awareness and multi-turn dialogue evaluation',
    size: 1536000,
    status: 'valid',
    columns: ['conversation_history', 'question', 'expected_answer', 'context'],
    rows: 800,
    uploadedAt: '2024-01-14T11:20:00Z',
    taskType: 'Conversational QA',
    tags: ['multi-turn', 'dialogue-qa', 'evaluation'],
    format: 'CSV'
  },
  {
    id: 'eval_dataset_006',
    uid: 'eval_dataset_006',
    name: 'Document Retrieval Benchmark',
    description: 'Information retrieval evaluation with passage ranking and semantic search',
    size: 2560000,
    status: 'valid',
    columns: ['query', 'relevant_documents', 'irrelevant_documents', 'relevance_scores'],
    rows: 300,
    uploadedAt: '2024-01-16T09:30:00Z',
    taskType: 'Retrieval',
    tags: ['document-retrieval', 'semantic-search', 'evaluation'],
    format: 'CSV'
  }
];

// Define mandatory and optional columns for each task type
const TASK_TYPE_COLUMNS = {
  'Question Answering': {
    mandatory: ['question', 'expected_answer', 'context'],
    optional: ['category']
  },
  'Summarization': {
    mandatory: ['input_text', 'reference_summary'],
    optional: ['length_constraint', 'domain']
  },
  'Classification': {
    mandatory: ['input_text', 'expected_label'],
    optional: ['category']
  },
  'Structured Output': {
    mandatory: ['input_text', 'expected_json', 'schema_type'],
    optional: ['difficulty']
  },
  'Conversational QA': {
    mandatory: ['conversation_history', 'question', 'expected_answer'],
    optional: ['context']
  },
  'Retrieval': {
    mandatory: ['query', 'relevant_documents', 'irrelevant_documents'],
    optional: ['relevance_scores']
  }
};

// Validate evaluation dataset columns based on task type
export function validateEvaluationColumns(columns: string[], taskType?: string): string[] {
  const errors: string[] = [];
  
  if (!taskType) {
    // General validation - check for basic input/output pattern
    const hasInputColumn = columns.some(col => 
      col.toLowerCase().includes('input') || 
      col.toLowerCase().includes('question') ||
      col.toLowerCase().includes('text') ||
      col.toLowerCase().includes('prompt') ||
      col.toLowerCase().includes('query') ||
      col.toLowerCase().includes('conversation')
    );
    
    const hasOutputColumn = columns.some(col => 
      col.toLowerCase().includes('output') || 
      col.toLowerCase().includes('answer') ||
      col.toLowerCase().includes('expected') ||
      col.toLowerCase().includes('reference') ||
      col.toLowerCase().includes('target') ||
      col.toLowerCase().includes('ground_truth') ||
      col.toLowerCase().includes('label') ||
      col.toLowerCase().includes('json') ||
      col.toLowerCase().includes('documents')
    );
    
    if (!hasInputColumn) {
      errors.push('Missing input column (should contain text/questions to evaluate)');
    }
    
    if (!hasOutputColumn) {
      errors.push('Missing expected output column (should contain reference answers/labels)');
    }
  } else {
    // Task-specific validation
    const taskConfig = TASK_TYPE_COLUMNS[taskType as keyof typeof TASK_TYPE_COLUMNS];
    if (taskConfig) {
      const missingMandatory = taskConfig.mandatory.filter(col => 
        !columns.some(dataCol => dataCol.toLowerCase() === col.toLowerCase())
      );
      
      if (missingMandatory.length > 0) {
        errors.push(`Missing mandatory columns for ${taskType}: ${missingMandatory.join(', ')}`);
      }
    }
  }
  
  return errors;
}

// Dataset management functions
export async function loadEvaluationDatasets(): Promise<EvaluationDataset[]> {
  try {
    // In development, return mock data
    if (process.env.NODE_ENV === 'development') {
      return mockEvaluationDatasets;
    }
    
    // TODO: Replace with API call
    const EVALUATION_DATASETS_FILE = path.join(process.cwd(), 'src/data/evaluation-datasets.json');
    const data = await fs.readFile(EVALUATION_DATASETS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.log('Using mock evaluation datasets data');
    return mockEvaluationDatasets;
  }
}

export async function addEvaluationDataset(datasetData: any): Promise<boolean> {
  try {
    const newDataset: EvaluationDataset = {
      id: generateEvaluationDatasetUID(),
      uid: generateEvaluationDatasetUID(),
      name: datasetData.name,
      description: datasetData.description || '',
      size: datasetData.size || 0,
      status: 'valid',
      columns: datasetData.columns || [],
      rows: datasetData.samples || 0,
      uploadedAt: new Date().toISOString(),
      filePath: datasetData.filePath,
      originalFileName: datasetData.originalFileName,
      taskType: datasetData.taskType,
      tags: datasetData.tags || [],
      format: datasetData.format || 'CSV'
    };

    // TODO: Replace with API call
    console.log('Would save evaluation dataset:', newDataset);
    return true;
  } catch (error) {
    console.error('Failed to add evaluation dataset:', error);
    return false;
  }
}

export async function updateEvaluationDataset(datasetId: string, updates: Partial<EvaluationDataset>): Promise<boolean> {
  try {
    // TODO: Replace with API call
    console.log('Would update evaluation dataset:', datasetId, updates);
    return true;
  } catch (error) {
    console.error('Failed to update evaluation dataset:', error);
    return false;
  }
}

export async function deleteEvaluationDataset(datasetId: string): Promise<boolean> {
  try {
    // TODO: Replace with API call
    console.log('Would delete evaluation dataset:', datasetId);
    return true;
  } catch (error) {
    console.error('Failed to delete evaluation dataset:', error);
    return false;
  }
}

export async function updateEvaluationDatasetSelection(dataset: EvaluationDataset): Promise<boolean> {
  try {
    await updateEvaluationMetadata({
      evaluationSession: {
        status: 'dataset_selected'
      },
      dataset: {
        uid: dataset.uid || dataset.id,
        id: dataset.id,
        name: dataset.name,
        selectedAt: new Date().toISOString(),
        taskType: dataset.taskType || null,
        rows: dataset.rows,
        columns: dataset.columns
      }
    });
    
    return true;
  } catch (error) {
    console.error('Failed to update evaluation dataset selection:', error);
    return false;
  }
}

// Deployment management functions
export async function getEvaluationDeployments(): Promise<Deployment[]> {
  try {
    const response = await fetch('/data/evaluation-deployments.json');
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Error loading evaluation deployments:', error);
  }
  
  // Return default mock data if file not found
  return [
    {
      id: '1',
      name: 'production-v1',
      model: 'claude-3-sonnet-20240229',
      status: 'active',
      endpoint: 'https://api.anthropic.com/v1/messages',
      provider: 'Anthropic',
      region: 'us-east-1',
      lastUpdated: '2024-01-15T10:30:00Z',
      responseTime: 850,
      uptime: 99.9,
      description: 'Primary production deployment for customer-facing applications',
      version: 'v1.2.0'
    },
    {
      id: '2',
      name: 'staging-v2',
      model: 'claude-3-haiku-20240307',
      status: 'active',
      endpoint: 'https://api.anthropic.com/v1/messages',
      provider: 'Anthropic',
      region: 'us-west-2',
      lastUpdated: '2024-01-14T14:20:00Z',
      responseTime: 650,
      uptime: 99.5,
      description: 'Staging environment for testing new features and updates',
      version: 'v2.0.0-beta'
    },
    {
      id: '3',
      name: 'gpt-4-turbo',
      model: 'gpt-4-turbo-2024-04-09',
      status: 'active',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      provider: 'OpenAI',
      region: 'us-central',
      lastUpdated: '2024-01-16T09:15:00Z',
      responseTime: 920,
      uptime: 99.8,
      description: 'OpenAI GPT-4 Turbo for comparison testing',
      version: 'turbo-2024-04-09'
    },
    {
      id: '4',
      name: 'beta-test',
      model: 'claude-3-opus-20240229',
      status: 'inactive',
      endpoint: 'https://api.anthropic.com/v1/messages',
      provider: 'Anthropic',
      region: 'eu-west-1',
      lastUpdated: '2024-01-12T16:45:00Z',
      responseTime: 1200,
      uptime: 95.2,
      description: 'Beta testing environment - currently offline',
      version: 'v0.9.0-beta'
    },
    {
      id: '5',
      name: 'development-v3',
      model: 'claude-3-sonnet-20240229',
      status: 'error',
      endpoint: 'https://dev.api.anthropic.com/v1/messages',
      provider: 'Anthropic',
      region: 'us-east-1',
      lastUpdated: '2024-01-10T11:30:00Z',
      responseTime: 0,
      uptime: 87.3,
      description: 'Development environment - experiencing connection issues',
      version: 'v3.0.0-dev'
    }
  ];
}

export async function updateEvaluationModelSelection(deployment: Deployment): Promise<void> {
  await updateEvaluationMetadata({
    deployment: {
      id: deployment.id,
      name: deployment.name,
      model: deployment.model,
      provider: deployment.provider,
      selectedAt: new Date().toISOString()
    }
  });
}

// Metrics configuration functions
export const updateMetricsConfiguration = async (config: {
  selectedCategory: MetricCategory;
  selectedMetrics: MetricCategory[];
  evaluationModel: string;
  batchSize: number;
  timeout: number;
}): Promise<void> => {
  try {
    console.log('📊 Updating metrics configuration:', {
      category: config.selectedCategory.name,
      totalMetrics: config.selectedMetrics.reduce((total, cat) => 
        total + cat.subMetrics.filter(sm => sm.enabled).length, 0
      ),
      model: config.evaluationModel,
      batchSize: config.batchSize,
      timeout: config.timeout
    });

    await updateEvaluationMetadata({
      metrics: {
        categories: config.selectedMetrics,
        selectedCategory: config.selectedCategory.id,
        totalSelected: config.selectedMetrics.reduce((total, cat) => 
          total + cat.subMetrics.filter(sm => sm.enabled).length, 0
        ),
        configuration: {
          evaluationModel: config.evaluationModel,
          batchSize: config.batchSize,
          timeout: config.timeout
        },
        configuredAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error updating metrics configuration:', error);
    throw error;
  }
};

// Validation functions
export function validateDeploymentSelection(deployment: Deployment | null): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!deployment) {
    errors.push('Please select a deployment');
    return { isValid: false, errors };
  }

  if (deployment.status === 'error') {
    errors.push('Selected deployment has connection issues');
  }

  if (deployment.uptime < 90) {
    errors.push('Selected deployment has low uptime (<90%)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export const validateMetricsConfiguration = (categories: MetricCategory[]): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  const selectedCategories = categories.filter(cat => cat.selected);
  if (selectedCategories.length === 0) {
    errors.push('Please select at least one metric category');
  }
  
  if (selectedCategories.length > 1) {
    errors.push('Please select only one metric category');
  }
  
  const selectedCategory = selectedCategories[0];
  if (selectedCategory) {
    const enabledMetrics = selectedCategory.subMetrics.filter(sm => sm.enabled);
    if (enabledMetrics.length === 0) {
      errors.push('Please select at least one metric from the selected category');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Utility functions
export function formatDeploymentInfo(deployment: Deployment): {
  displayName: string;
  statusColor: string;
  performanceScore: number;
} {
  const displayName = `${deployment.name} (${deployment.provider})`;
  
  let statusColor = 'gray';
  switch (deployment.status) {
    case 'active':
      statusColor = 'green';
      break;
    case 'inactive':
      statusColor = 'yellow';
      break;
    case 'error':
      statusColor = 'red';
      break;
  }

  // Calculate performance score based on uptime and response time
  const responseTimeScore = Math.max(0, (2000 - deployment.responseTime) / 2000) * 50;
  const uptimeScore = deployment.uptime * 0.5;
  const performanceScore = Math.round(responseTimeScore + uptimeScore);

  return {
    displayName,
    statusColor,
    performanceScore
  };
}

export const getMetricsSummary = (categories: MetricCategory[]): {
  selectedCategory: string | null;
  totalMetrics: number;
  metricsList: string[];
} => {
  const selectedCategory = categories.find(cat => cat.selected);
  
  if (!selectedCategory) {
    return {
      selectedCategory: null,
      totalMetrics: 0,
      metricsList: []
    };
  }
  
  const enabledMetrics = selectedCategory.subMetrics.filter(sm => sm.enabled);
  
  return {
    selectedCategory: selectedCategory.name,
    totalMetrics: enabledMetrics.length,
    metricsList: enabledMetrics.map(sm => sm.name)
  };
};