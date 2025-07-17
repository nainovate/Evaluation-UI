// Mock data for Nainovate-Dashboard development
import {
  EvaluationRun,
  EvaluationTask,
  TaskMetrics,
  SelectOption,
  DashboardStats
} from '../types'

import {
  Deployment,
  Organization,
  PayloadTemplate
} from '../types/evaluation'

// Mock Organizations
export const mockOrganizations: Organization[] = [
  {
    id: 'org-1',
    name: 'Acme Corporation',
    description: 'Leading AI solutions provider',
    activeDeployments: 5,
    totalEvaluations: 127
  },
  {
    id: 'org-2',
    name: 'TechFlow Inc',
    description: 'Enterprise software solutions',
    activeDeployments: 3,
    totalEvaluations: 89
  },
  {
    id: 'org-3',
    name: 'DataSync Labs',
    description: 'Data analytics and AI research',
    activeDeployments: 7,
    totalEvaluations: 203
  }
]

// Mock Deployments
export const mockDeployments: Deployment[] = [
  {
    id: 'deploy-1',
    name: 'GPT-4 Customer Support',
    description: 'Customer support chatbot deployment',
    version: 'v2.1.3',
    endpoint: 'https://api.acme.com/chat/support',
    status: 'active',
    lastUpdated: '2024-01-15T10:30:00Z',
    organization: 'org-1'
  },
  {
    id: 'deploy-2',
    name: 'Claude Content Generator',
    description: 'Marketing content generation system',
    version: 'v1.8.2',
    endpoint: 'https://api.techflow.com/content',
    status: 'active',
    lastUpdated: '2024-01-14T15:45:00Z',
    organization: 'org-2'
  },
  {
    id: 'deploy-3',
    name: 'Llama Code Assistant',
    description: 'AI-powered code completion and review',
    version: 'v3.0.1',
    endpoint: 'https://api.datasync.com/code',
    status: 'maintenance',
    lastUpdated: '2024-01-13T09:20:00Z',
    organization: 'org-3'
  }
]

// Mock Payload Templates
export const mockPayloadTemplates: PayloadTemplate[] = [
  {
    id: 'payload-1',
    name: 'Question Answering',
    description: 'Standard Q&A evaluation template',
    template: '{"question": "{{question}}", "context": "{{context}}"}',
    variables: [
      { name: 'question', type: 'string', required: true, description: 'The question to ask' },
      { name: 'context', type: 'string', required: false, description: 'Additional context' }
    ],
    category: 'QA'
  },
  {
    id: 'payload-2',
    name: 'Content Generation',
    description: 'Content creation evaluation template',
    template: '{"prompt": "{{prompt}}", "style": "{{style}}", "length": {{length}}}',
    variables: [
      { name: 'prompt', type: 'string', required: true, description: 'Content generation prompt' },
      { name: 'style', type: 'string', required: false, defaultValue: 'professional', description: 'Writing style' },
      { name: 'length', type: 'number', required: false, defaultValue: 500, description: 'Target length in words' }
    ],
    category: 'Generation'
  }
]

// Mock Evaluation Runs
export const mockEvaluationRuns: EvaluationRun[] = [
  {
    id: 'eval-1',
    name: 'Customer Support Bot Evaluation',
    deployment: 'GPT-4 Customer Support',
    organization: 'Acme Corporation',
    status: 'completed',
    createdAt: '2024-01-15T08:00:00Z',
    completedAt: '2024-01-15T08:45:00Z',
    totalTasks: 50,
    completedTasks: 48,
    failedTasks: 2,
    progress: 100,
    description: 'Comprehensive evaluation of customer support responses'
  },
  {
    id: 'eval-2',
    name: 'Content Quality Assessment',
    deployment: 'Claude Content Generator',
    organization: 'TechFlow Inc',
    status: 'in-progress',
    createdAt: '2024-01-15T10:15:00Z',
    totalTasks: 75,
    completedTasks: 32,
    failedTasks: 1,
    progress: 44,
    description: 'Evaluating marketing content generation quality'
  },
  {
    id: 'eval-3',
    name: 'Code Review Assistant Test',
    deployment: 'Llama Code Assistant',
    organization: 'DataSync Labs',
    status: 'failed',
    createdAt: '2024-01-15T07:30:00Z',
    totalTasks: 25,
    completedTasks: 8,
    failedTasks: 17,
    progress: 32,
    description: 'Testing code review and completion capabilities'
  },
  {
    id: 'eval-4',
    name: 'Multi-language Support Test',
    deployment: 'GPT-4 Customer Support',
    organization: 'Acme Corporation',
    status: 'pending',
    createdAt: '2024-01-15T11:00:00Z',
    totalTasks: 40,
    completedTasks: 0,
    failedTasks: 0,
    progress: 0,
    description: 'Testing support for multiple languages'
  }
]

// Mock Evaluation Tasks
export const mockEvaluationTasks: EvaluationTask[] = [
  {
    id: 'task-1',
    evaluationId: 'eval-1',
    name: 'Billing Question Response',
    status: 'completed',
    progress: 100,
    startedAt: '2024-01-15T08:05:00Z',
    completedAt: '2024-01-15T08:07:00Z',
    metrics: {
      answerRelevance: {
        score: 0.92,
        comments: 'Response directly addresses the billing question with accurate information',
        threshold: 0.8,
        passed: true
      },
      coherence: {
        score: 0.88,
        comments: 'Well-structured response with logical flow',
        threshold: 0.75,
        passed: true
      },
      helpfulness: {
        score: 0.85,
        comments: 'Provides actionable steps for the customer',
        threshold: 0.7,
        passed: true
      },
      category: 'Customer Support',
      subCategory: 'Billing',
      expectedOutput: 'Clear explanation of billing process with next steps',
      actualOutput: 'Your billing cycle starts on the 1st of each month. To view your current charges, please log into your account and navigate to the billing section. If you need assistance, our billing team is available 24/7.'
    }
  },
  {
    id: 'task-2',
    evaluationId: 'eval-1',
    name: 'Technical Support Query',
    status: 'completed',
    progress: 100,
    startedAt: '2024-01-15T08:10:00Z',
    completedAt: '2024-01-15T08:13:00Z',
    metrics: {
      answerRelevance: {
        score: 0.78,
        comments: 'Response covers the technical issue but lacks specific troubleshooting steps',
        threshold: 0.8,
        passed: false
      },
      coherence: {
        score: 0.91,
        comments: 'Very clear and well-organized response',
        threshold: 0.75,
        passed: true
      },
      helpfulness: {
        score: 0.72,
        comments: 'Somewhat helpful but could provide more detailed guidance',
        threshold: 0.7,
        passed: true
      },
      category: 'Customer Support',
      subCategory: 'Technical',
      expectedOutput: 'Step-by-step troubleshooting guide for connection issues',
      actualOutput: 'Connection issues can be caused by various factors. Please check your internet connection and try restarting your device. If the problem persists, contact our technical support team.'
    }
  },
  {
    id: 'task-3',
    evaluationId: 'eval-2',
    name: 'Blog Post Generation',
    status: 'running',
    progress: 65,
    startedAt: '2024-01-15T10:20:00Z'
  },
  {
    id: 'task-4',
    evaluationId: 'eval-2',
    name: 'Social Media Content',
    status: 'pending',
    progress: 0,
    startedAt: '2024-01-15T10:25:00Z'
  },
  {
    id: 'task-5',
    evaluationId: 'eval-3',
    name: 'Code Review Analysis',
    status: 'failed',
    progress: 0,
    startedAt: '2024-01-15T07:35:00Z',
    error: 'API endpoint timeout - unable to process code review request'
  }
]

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalEvaluations: 156,
  activeEvaluations: 3,
  completedEvaluations: 128,
  failedEvaluations: 25,
  averageSuccessRate: 87.2
}

// Dropdown Options
export const organizationOptions: SelectOption[] = mockOrganizations.map(org => ({
  value: org.id,
  label: org.name
}))

export const deploymentOptions: SelectOption[] = mockDeployments.map(deploy => ({
  value: deploy.id,
  label: deploy.name,
  disabled: deploy.status !== 'active'
}))

export const payloadOptions: SelectOption[] = mockPayloadTemplates.map(template => ({
  value: template.id,
  label: template.name
}))

// Helper functions to get mock data
export const getMockEvaluationById = (id: string): EvaluationRun | undefined => {
  return mockEvaluationRuns.find(evaluation => evaluation.id === id)
}

export const getMockTasksByEvaluationId = (evaluationId: string): EvaluationTask[] => {
  return mockEvaluationTasks.filter(task => task.evaluationId === evaluationId)
}

export const getMockTaskById = (id: string): EvaluationTask | undefined => {
  return mockEvaluationTasks.find(task => task.id === id)
}

// Generate additional mock data for testing
export const generateMockEvaluation = (overrides: Partial<EvaluationRun> = {}): EvaluationRun => {
  const randomId = `eval-${Date.now()}`
  return {
    id: randomId,
    name: `Test Evaluation ${randomId}`,
    deployment: mockDeployments[0].name,
    organization: mockOrganizations[0].name,
    status: 'pending',
    createdAt: new Date().toISOString(),
    totalTasks: 10,
    completedTasks: 0,
    failedTasks: 0,
    progress: 0,
    ...overrides
  }
}