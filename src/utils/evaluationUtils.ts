// src/utils/evaluationUtils.ts - Simplified with direct mock data (no backend)

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

// Define mandatory and optional columns for each task type - UPDATED
const TASK_TYPE_COLUMNS = {
  'Question Answering': {
    mandatory: ['question', 'expected_answer', 'generated_answer'],
    optional: ['context', 'reference', 'ground_truth', 'metadata']
  },
  'Summarization': {
    mandatory: ['input_text', 'expected_summary', 'generated_summary'],
    optional: ['reference_summary', 'metadata', 'source_title']
  },
  'Conversational QA': {
    mandatory: ['conversation_history', 'question', 'expected_answer', 'generated_answer'],
    optional: ['context', 'turn_id', 'metadata']
  },
  'Retrieval (RAG)': {
    mandatory: ['query', 'retrieved_documents', 'expected_answer', 'generated_answer'],
    optional: ['ground_truth_docs', 'reference', 'metadata']
  },
  'Classification': {
    mandatory: ['input_text', 'expected_label', 'predicted_label'],
    optional: ['label_confidence', 'metadata', 'reasoning']
  },
  'Structured Output Generation': {
    mandatory: ['input_instruction', 'expected_output', 'generated_output'],
    optional: ['format_schema', 'reference', 'metadata']
  },
  'Open-ended Generation': {
    mandatory: ['prompt', 'generated_output'],
    optional: ['reference_output', 'feedback', 'toxicity_flag', 'metadata']
  },
  // Keep backward compatibility with old names
  'Structured Output': {
    mandatory: ['input_text', 'expected_json', 'schema_type'],
    optional: ['difficulty']
  },
  'Retrieval': {
    mandatory: ['query', 'relevant_documents', 'irrelevant_documents'],
    optional: ['relevance_scores']
  }
};

// MOCK DEPLOYMENTS DATA - Direct mock data for no backend
const mockDeployments: Deployment[] = [
  {
    id: 'deploy_001',
    name: 'GPT-4 Production',
    model: 'gpt-4-turbo',
    status: 'active',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    provider: 'OpenAI',
    region: 'us-east-1',
    lastUpdated: '2024-01-20T10:30:00Z',
    responseTime: 1200,
    uptime: 99.9,
    description: 'Production deployment of GPT-4 Turbo for general purpose evaluation',
    version: '2024-01-25'
  },
  {
    id: 'deploy_002',
    name: 'Claude-3 Sonnet',
    model: 'claude-3-sonnet',
    status: 'active',
    endpoint: 'https://api.anthropic.com/v1/messages',
    provider: 'Anthropic',
    region: 'us-west-2',
    lastUpdated: '2024-01-19T15:45:00Z',
    responseTime: 950,
    uptime: 99.8,
    description: 'Claude-3 Sonnet deployment for balanced performance and cost',
    version: '2024-01-15'
  },
  {
    id: 'deploy_003',
    name: 'Gemini Pro',
    model: 'gemini-pro',
    status: 'active',
    endpoint: 'https://generativelanguage.googleapis.com/v1/models/gemini-pro',
    provider: 'Google',
    region: 'us-central1',
    lastUpdated: '2024-01-18T09:20:00Z',
    responseTime: 800,
    uptime: 99.7,
    description: 'Google Gemini Pro for multimodal evaluation tasks',
    version: '2024-01-10'
  },
  {
    id: 'deploy_004',
    name: 'Llama-2 70B',
    model: 'llama-2-70b-chat',
    status: 'inactive',
    endpoint: 'https://api.together.xyz/inference',
    provider: 'Together AI',
    region: 'us-west-1',
    lastUpdated: '2024-01-15T14:30:00Z',
    responseTime: 1500,
    uptime: 95.2,
    description: 'Llama-2 70B Chat model for open-source evaluation',
    version: '2023-12-01'
  },
  {
    id: 'deploy_005',
    name: 'GPT-3.5 Turbo',
    model: 'gpt-3.5-turbo',
    status: 'active',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    provider: 'OpenAI',
    region: 'us-east-1',
    lastUpdated: '2024-01-21T11:15:00Z',
    responseTime: 600,
    uptime: 99.9,
    description: 'Cost-effective GPT-3.5 Turbo for high-volume evaluations',
    version: '2024-01-20'
  },
  {
    id: 'deploy_006',
    name: 'Claude-3 Haiku',
    model: 'claude-3-haiku',
    status: 'error',
    endpoint: 'https://api.anthropic.com/v1/messages',
    provider: 'Anthropic',
    region: 'eu-west-1',
    lastUpdated: '2024-01-16T08:45:00Z',
    responseTime: 400,
    uptime: 87.3,
    description: 'Fast and lightweight Claude-3 Haiku - currently experiencing issues',
    version: '2024-01-05'
  }
];

// MOCK EVALUATION DATASETS - Direct mock data for no backend
const mockEvaluationDatasets: EvaluationDataset[] = [
  {
    id: 'eval_dataset_001',
    uid: 'eval_dataset_001',
    name: 'Customer Support QA',
    description: 'Question answering dataset for customer support evaluation with generated responses',
    size: 2048000,
    status: 'valid',
    columns: ['question', 'expected_answer', 'generated_answer', 'context', 'metadata'],
    rows: 1000,
    uploadedAt: '2024-01-10T14:30:00Z',
    taskType: 'Question Answering',
    tags: ['customer-support', 'qa', 'evaluation'],
    format: 'YAML'
  },
  {
    id: 'eval_dataset_002',
    uid: 'eval_dataset_002',
    name: 'News Article Summarization',
    description: 'Summarization evaluation with expected and generated summaries',
    size: 3584000,
    status: 'valid',
    columns: ['input_text', 'expected_summary', 'generated_summary', 'source_title', 'metadata'],
    rows: 500,
    uploadedAt: '2024-01-12T09:15:00Z',
    taskType: 'Summarization',
    tags: ['summarization', 'news', 'evaluation'],
    format: 'YAML'
  },
  {
    id: 'eval_dataset_003',
    uid: 'eval_dataset_003',
    name: 'Sentiment Classification',
    description: 'Text classification evaluation with predictions and confidence scores',
    size: 1536000,
    status: 'valid',
    columns: ['input_text', 'expected_label', 'predicted_label', 'label_confidence', 'reasoning'],
    rows: 2000,
    uploadedAt: '2024-01-13T16:45:00Z',
    taskType: 'Classification',
    tags: ['classification', 'sentiment', 'evaluation'],
    format: 'YAML'
  },
  {
    id: 'eval_dataset_004',
    uid: 'eval_dataset_004',
    name: 'JSON Entity Extraction',
    description: 'Structured output generation evaluation with format validation',
    size: 2560000,
    status: 'valid',
    columns: ['input_instruction', 'expected_output', 'generated_output', 'format_schema', 'metadata'],
    rows: 750,
    uploadedAt: '2024-01-14T11:20:00Z',
    taskType: 'Structured Output Generation',
    tags: ['structured-output', 'json', 'evaluation'],
    format: 'YAML'
  },
  {
    id: 'eval_dataset_005',
    uid: 'eval_dataset_005',
    name: 'Multi-turn Conversation',
    description: 'Conversational QA with context awareness and multi-turn dialogue evaluation',
    size: 1536000,
    status: 'valid',
    columns: ['conversation_history', 'question', 'expected_answer', 'generated_answer', 'turn_id'],
    rows: 800,
    uploadedAt: '2024-01-15T13:10:00Z',
    taskType: 'Conversational QA',
    tags: ['conversational', 'multi-turn', 'evaluation'],
    format: 'YAML'
  },
  {
    id: 'eval_dataset_006',
    uid: 'eval_dataset_006',
    name: 'RAG Document Retrieval',
    description: 'Retrieval-Augmented Generation evaluation with document relevance',
    size: 2560000,
    status: 'valid',
    columns: ['query', 'retrieved_documents', 'expected_answer', 'generated_answer', 'ground_truth_docs'],
    rows: 300,
    uploadedAt: '2024-01-16T09:30:00Z',
    taskType: 'Retrieval (RAG)',
    tags: ['rag', 'retrieval', 'evaluation'],
    format: 'YAML'
  },
  {
    id: 'eval_dataset_007',
    uid: 'eval_dataset_007',
    name: 'Creative Writing Evaluation',
    description: 'Open-ended generation evaluation with creativity and safety assessments',
    size: 1920000,
    status: 'valid',
    columns: ['prompt', 'generated_output', 'reference_output', 'feedback', 'toxicity_flag'],
    rows: 400,
    uploadedAt: '2024-01-17T15:20:00Z',
    taskType: 'Open-ended Generation',
    tags: ['generation', 'creative', 'evaluation'],
    format: 'YAML'
  }
];

// Mock evaluation metadata
let mockMetadata: EvaluationMetadata = {
  evaluationSession: {
    id: null,
    createdAt: null,
    lastModified: null,
    status: 'new'
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
  deployments: [],
  metrics: {
    categories: [],
    selectedCategory: null,
    totalSelected: 0,
    configuration: {
      evaluationModel: 'gpt-4-turbo',
      batchSize: 10,
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

// Validate evaluation dataset columns based on task type - UPDATED
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
      col.toLowerCase().includes('conversation') ||
      col.toLowerCase().includes('instruction')
    );
    
    const hasExpectedColumn = columns.some(col => 
      col.toLowerCase().includes('expected') ||
      col.toLowerCase().includes('reference') ||
      col.toLowerCase().includes('target') ||
      col.toLowerCase().includes('ground_truth')
    );

    const hasGeneratedColumn = columns.some(col => 
      col.toLowerCase().includes('generated') ||
      col.toLowerCase().includes('predicted') ||
      col.toLowerCase().includes('output') ||
      col.toLowerCase().includes('answer') ||
      col.toLowerCase().includes('label') ||
      col.toLowerCase().includes('json') ||
      col.toLowerCase().includes('documents')
    );
    
    if (!hasInputColumn) {
      errors.push('Missing input column (should contain text/questions/prompts to evaluate)');
    }
    
    if (!hasExpectedColumn) {
      errors.push('Missing expected output column (should contain reference answers/labels)');
    }

    if (!hasGeneratedColumn) {
      errors.push('Missing generated output column (should contain model predictions/responses)');
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

// NEW: Get column requirements for a specific task type
export function getTaskTypeColumns(taskType: string) {
  return TASK_TYPE_COLUMNS[taskType as keyof typeof TASK_TYPE_COLUMNS] || null;
}

// NEW: Check if a dataset has the required columns for a task type
export function hasRequiredColumns(columns: string[], taskType: string): boolean {
  const taskConfig = TASK_TYPE_COLUMNS[taskType as keyof typeof TASK_TYPE_COLUMNS];
  if (!taskConfig) return false;
  
  const missingMandatory = taskConfig.mandatory.filter(col => 
    !columns.some(dataCol => dataCol.toLowerCase() === col.toLowerCase())
  );
  
  return missingMandatory.length === 0;
}

// NEW: Get missing mandatory columns for a task type
export function getMissingColumns(columns: string[], taskType: string): string[] {
  const taskConfig = TASK_TYPE_COLUMNS[taskType as keyof typeof TASK_TYPE_COLUMNS];
  if (!taskConfig) return [];
  
  return taskConfig.mandatory.filter(col => 
    !columns.some(dataCol => dataCol.toLowerCase() === col.toLowerCase())
  );
}

// NEW: Get present optional columns for a task type
export function getPresentOptionalColumns(columns: string[], taskType: string): string[] {
  const taskConfig = TASK_TYPE_COLUMNS[taskType as keyof typeof TASK_TYPE_COLUMNS];
  if (!taskConfig) return [];
  
  return taskConfig.optional.filter(col =>
    columns.some(dataCol => dataCol.toLowerCase() === col.toLowerCase())
  );
}

// Export the task type columns configuration
export { TASK_TYPE_COLUMNS };

// Dataset management functions - DIRECT MOCK DATA (no backend)
export async function loadEvaluationDatasets(): Promise<EvaluationDataset[]> {
  // Return mock data directly since no backend
  console.log('Using direct mock evaluation datasets data');
  return mockEvaluationDatasets;
}

// Deployment management functions - DIRECT MOCK DATA (no backend)
export async function getEvaluationDeployments(): Promise<Deployment[]> {
  // Return mock data directly since no backend
  console.log('Using direct mock deployment data');
  return mockDeployments;
}

// Evaluation metadata management functions - DIRECT MOCK DATA (no backend)
export async function getEvaluationMetadata(): Promise<EvaluationMetadata> {
  // Return mock metadata directly since no backend
  console.log('Using direct mock metadata');
  return mockMetadata;
}

export async function updateEvaluationMetadata(updates: Partial<EvaluationMetadata>): Promise<void> {
  // Update mock data directly since no backend
  console.log('Updating mock metadata:', updates);
  mockMetadata = { ...mockMetadata, ...updates };
}

// Utility functions for generating IDs
export function generateEvaluationDatasetUID(): string {
  return `eval_dataset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateEvaluationSessionUID(): string {
  return `eval_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Additional utility functions that were missing
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
      format: datasetData.format || 'YAML'
    };

    // TODO: Save to data folder or API
    console.log('Would save evaluation dataset:', newDataset);
    return true;
  } catch (error) {
    console.error('Failed to add evaluation dataset:', error);
    return false;
  }
}

export async function updateEvaluationDataset(datasetId: string, updates: Partial<EvaluationDataset>): Promise<boolean> {
  try {
    // TODO: Update in data folder or API
    console.log('Would update evaluation dataset:', datasetId, updates);
    return true;
  } catch (error) {
    console.error('Failed to update evaluation dataset:', error);
    return false;
  }
}

export async function deleteEvaluationDataset(datasetId: string): Promise<boolean> {
  try {
    // TODO: Delete from data folder or API
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
        status: 'dataset_selected',
        id: null,
        createdAt: null,
        lastModified: null
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