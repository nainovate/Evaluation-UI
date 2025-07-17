export interface ModelDeployment {
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
  tags?: string[];
  apiKey?: string;
  maxTokens?: number;
  rateLimit?: number;
}

export interface EvaluationModelMetadata {
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
  model: {
    uid: string | null;
    name: string | null;
    modelName: string | null;
    provider: string | null;
    endpoint?: string | null;
    region?: string | null;
    version?: string | null;
    selectedAt: string | null;
  };
}

// Mock data for model deployments
const mockModelDeployments: ModelDeployment[] = [
  {
    id: '1',
    name: 'production-claude',
    model: 'claude-3-sonnet-20240229',
    status: 'active',
    endpoint: 'https://api.anthropic.com/v1/messages',
    provider: 'Anthropic',
    region: 'us-east-1',
    lastUpdated: '2024-01-15T10:30:00Z',
    responseTime: 850,
    uptime: 99.9,
    description: 'Primary production deployment for customer-facing applications',
    version: 'v1.2.0',
    tags: ['production', 'stable'],
    maxTokens: 4096,
    rateLimit: 1000
  },
  {
    id: '2',
    name: 'staging-claude',
    model: 'claude-3-haiku-20240307',
    status: 'active',
    endpoint: 'https://api.anthropic.com/v1/messages',
    provider: 'Anthropic',
    region: 'us-west-2',
    lastUpdated: '2024-01-14T14:20:00Z',
    responseTime: 650,
    uptime: 99.5,
    description: 'Staging environment for testing new features and updates',
    version: 'v2.0.0-beta',
    tags: ['staging', 'testing'],
    maxTokens: 4096,
    rateLimit: 500
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
    description: 'OpenAI GPT-4 Turbo for comparison testing and evaluation',
    version: 'turbo-2024-04-09',
    tags: ['comparison', 'benchmark'],
    maxTokens: 8192,
    rateLimit: 200
  },
  {
    id: '4',
    name: 'gemini-pro',
    model: 'gemini-pro-1.5',
    status: 'active',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
    provider: 'Google',
    region: 'us-central',
    lastUpdated: '2024-01-13T11:45:00Z',
    responseTime: 780,
    uptime: 99.6,
    description: 'Google Gemini Pro for multimodal evaluation tasks',
    version: '1.5-latest',
    tags: ['multimodal', 'google'],
    maxTokens: 8192,
    rateLimit: 300
  },
  {
    id: '5',
    name: 'beta-test',
    model: 'claude-3-opus-20240229',
    status: 'inactive',
    endpoint: 'https://api.anthropic.com/v1/messages',
    provider: 'Anthropic',
    region: 'eu-west-1',
    lastUpdated: '2024-01-12T16:45:00Z',
    responseTime: 1200,
    uptime: 95.2,
    description: 'Beta testing environment - currently offline for maintenance',
    version: 'v0.9.0-beta',
    tags: ['beta', 'testing'],
    maxTokens: 4096,
    rateLimit: 100
  },
  {
    id: '6',
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
    version: 'v3.0.0-dev',
    tags: ['development', 'unstable'],
    maxTokens: 4096,
    rateLimit: 50
  },
  {
    id: '7',
    name: 'cohere-command',
    model: 'command-r-plus',
    status: 'active',
    endpoint: 'https://api.cohere.ai/v1/generate',
    provider: 'Cohere',
    region: 'us-east-1',
    lastUpdated: '2024-01-17T08:20:00Z',
    responseTime: 590,
    uptime: 99.7,
    description: 'Cohere Command R+ for enterprise text generation',
    version: 'r-plus-2024',
    tags: ['enterprise', 'generation'],
    maxTokens: 4096,
    rateLimit: 400
  },
  {
    id: '8',
    name: 'mistral-large',
    model: 'mistral-large-2402',
    status: 'active',
    endpoint: 'https://api.mistral.ai/v1/chat/completions',
    provider: 'Mistral',
    region: 'eu-west-1',
    lastUpdated: '2024-01-16T15:30:00Z',
    responseTime: 710,
    uptime: 99.4,
    description: 'Mistral Large for multilingual evaluation tasks',
    version: '2402-latest',
    tags: ['multilingual', 'european'],
    maxTokens: 8192,
    rateLimit: 250
  }
];

// Generate a unique identifier for model deployments
export function generateModelDeploymentUID(): string {
  return `model_deployment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// File operations (replace with API calls in production)
export async function loadModelDeployments(): Promise<ModelDeployment[]> {
  try {
    // In development, return mock data
    if (process.env.NODE_ENV === 'development') {
      return mockModelDeployments;
    }
    
    // TODO: Replace with API call
    return mockModelDeployments;
  } catch (error) {
    console.log('Using mock model deployments data');
    return mockModelDeployments;
  }
}

export async function addModelDeployment(deploymentData: any): Promise<boolean> {
  try {
    const newDeployment: ModelDeployment = {
      id: generateModelDeploymentUID(),
      name: deploymentData.name,
      model: deploymentData.model,
      status: deploymentData.status || 'inactive',
      endpoint: deploymentData.endpoint,
      provider: deploymentData.provider,
      region: deploymentData.region,
      lastUpdated: new Date().toISOString(),
      responseTime: deploymentData.responseTime || 0,
      uptime: deploymentData.uptime || 0,
      description: deploymentData.description || '',
      version: deploymentData.version,
      tags: deploymentData.tags || [],
      maxTokens: deploymentData.maxTokens,
      rateLimit: deploymentData.rateLimit
    };

    // TODO: Replace with API call
    console.log('Would save model deployment:', newDeployment);
    return true;
  } catch (error) {
    console.error('Failed to add model deployment:', error);
    return false;
  }
}

export async function updateModelDeployment(deploymentId: string, updates: Partial<ModelDeployment>): Promise<boolean> {
  try {
    // TODO: Replace with API call
    console.log('Would update model deployment:', deploymentId, updates);
    return true;
  } catch (error) {
    console.error('Failed to update model deployment:', error);
    return false;
  }
}

export async function deleteModelDeployment(deploymentId: string): Promise<boolean> {
  try {
    // TODO: Replace with API call
    console.log('Would delete model deployment:', deploymentId);
    return true;
  } catch (error) {
    console.error('Failed to delete model deployment:', error);
    return false;
  }
}

export async function loadEvaluationModelMetadata(): Promise<EvaluationModelMetadata> {
  try {
    // Try to load from localStorage first (temporary solution)
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('evaluationMetadata');
      if (stored) {
        return JSON.parse(stored);
      }
    }
    
    // Default metadata structure
    return {
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
      model: {
        uid: null,
        name: null,
        modelName: null,
        provider: null,
        endpoint: null,
        region: null,
        version: null,
        selectedAt: null
      }
    };
  } catch (error) {
    console.error('Failed to load evaluation model metadata:', error);
    return {
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
      model: {
        uid: null,
        name: null,
        modelName: null,
        provider: null,
        endpoint: null,
        region: null,
        version: null,
        selectedAt: null
      }
    };
  }
}

export async function saveEvaluationModelMetadata(metadata: EvaluationModelMetadata): Promise<boolean> {
  try {
    // Save to localStorage temporarily (replace with API call)
    if (typeof window !== 'undefined') {
      localStorage.setItem('evaluationMetadata', JSON.stringify(metadata));
    }
    
    // TODO: Replace with API call
    console.log('Evaluation model metadata saved:', metadata);
    return true;
  } catch (error) {
    console.error('Failed to save evaluation model metadata:', error);
    return false;
  }
}

export async function updateEvaluationModelSelection(deployment: ModelDeployment): Promise<boolean> {
  try {
    const metadata = await loadEvaluationModelMetadata();
    
    metadata.evaluationSession.lastModified = new Date().toISOString();
    metadata.evaluationSession.status = 'model_selected';
    
    if (!metadata.evaluationSession.id) {
      metadata.evaluationSession.id = `eval_session_${Date.now()}`;
      metadata.evaluationSession.createdAt = new Date().toISOString();
    }
    
    metadata.model = {
      uid: deployment.id,
      name: deployment.name,
      modelName: deployment.model,
      provider: deployment.provider,
      endpoint: deployment.endpoint,
      region: deployment.region,
      version: deployment.version,
      selectedAt: new Date().toISOString()
    };
    
    return await saveEvaluationModelMetadata(metadata);
  } catch (error) {
    console.error('Failed to update evaluation model selection:', error);
    return false;
  }
}