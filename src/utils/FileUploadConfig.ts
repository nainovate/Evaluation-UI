// src/utils/FileUploadConfig.ts - Updated with new task types

export interface FileUploadConfig {
  title: string;
  description: string;
  acceptedFormats: string[];
  maxFileSize: number;
  taskTypes: string[];
  supportedExtensions: string[];
  placeholders: {
    name: string;
    description: string;
  };
  validation: {
    required: string[];
    optional: string[];
  };
}

// Updated task types and file upload configuration
const FILE_UPLOAD_CONFIGS: Record<string, FileUploadConfig> = {
  '/evaluation/dataset-selection': {
    title: 'Upload Evaluation Dataset',
    description: 'Upload your YAML dataset for model evaluation with proper task-specific columns',
    acceptedFormats: ['YAML', 'YML'],
    maxFileSize: 10, // MB
    taskTypes: [
      'Question Answering',
      'Summarization', 
      'Conversational QA',
      'Retrieval (RAG)',
      'Classification',
      'Structured Output Generation',
      'Open-ended Generation'
    ],
    supportedExtensions: ['.yaml', '.yml'],
    placeholders: {
      name: 'Customer Support QA Evaluation',
      description: 'Dataset for evaluating question-answering performance with expected and generated outputs'
    },
    validation: {
      required: ['name'],
      optional: ['description', 'taskType', 'tags']
    }
  }
};

// Task-specific tag suggestions
const TASK_TAG_MAPPING: Record<string, string[]> = {
  'Question Answering': ['qa', 'question-answering', 'evaluation', 'knowledge-base'],
  'Summarization': ['summarization', 'text-generation', 'evaluation', 'content'],
  'Conversational QA': ['conversational', 'multi-turn', 'dialogue-qa', 'evaluation', 'chat'],
  'Retrieval (RAG)': ['rag', 'retrieval', 'document-retrieval', 'evaluation', 'search'],
  'Classification': ['classification', 'text-classification', 'evaluation', 'categorization'],
  'Structured Output Generation': ['structured-output', 'json-generation', 'evaluation', 'extraction'],
  'Open-ended Generation': ['generation', 'creative', 'open-ended', 'evaluation', 'content-creation']
};

// Column requirement details for each task type
const TASK_COLUMN_REQUIREMENTS: Record<string, {
  mandatory: { name: string; description: string }[];
  optional: { name: string; description: string }[];
  example: Record<string, any>;
}> = {
  'Question Answering': {
    mandatory: [
      { name: 'question', description: 'The question to be answered' },
      { name: 'expected_answer', description: 'The correct/reference answer' },
      { name: 'generated_answer', description: 'The model-generated answer' }
    ],
    optional: [
      { name: 'context', description: 'Relevant context information' },
      { name: 'reference', description: 'Reference source or citation' },
      { name: 'ground_truth', description: 'Ground truth validation data' },
      { name: 'metadata', description: 'Additional metadata (JSON object)' }
    ],
    example: {
      question: "What is the capital of France?",
      expected_answer: "Paris",
      generated_answer: "The capital of France is Paris.",
      context: "Geography knowledge base",
      metadata: { difficulty: "easy", category: "geography" }
    }
  },
  'Summarization': {
    mandatory: [
      { name: 'input_text', description: 'The text to be summarized' },
      { name: 'expected_summary', description: 'The reference summary' },
      { name: 'generated_summary', description: 'The model-generated summary' }
    ],
    optional: [
      { name: 'reference_summary', description: 'Alternative reference summary' },
      { name: 'metadata', description: 'Additional metadata (JSON object)' },
      { name: 'source_title', description: 'Title of source document' }
    ],
    example: {
      input_text: "Long article about climate change impacts on agriculture...",
      expected_summary: "Climate change significantly affects crop yields globally.",
      generated_summary: "Global warming impacts agricultural productivity worldwide.",
      source_title: "Climate Change Agriculture Report 2024",
      metadata: { length_constraint: "50 words", domain: "science" }
    }
  },
  'Conversational QA': {
    mandatory: [
      { name: 'conversation_history', description: 'Previous conversation turns' },
      { name: 'question', description: 'Current user question' },
      { name: 'expected_answer', description: 'Expected response' },
      { name: 'generated_answer', description: 'Model-generated response' }
    ],
    optional: [
      { name: 'context', description: 'Additional context' },
      { name: 'turn_id', description: 'Turn number in conversation' },
      { name: 'metadata', description: 'Additional metadata (JSON object)' }
    ],
    example: {
      conversation_history: "User: Hello\nBot: Hi! How can I help you today?",
      question: "I need help with my account",
      expected_answer: "I can help you with account issues. What specifically do you need?",
      generated_answer: "Sure, I can help with your account. What's the problem?",
      turn_id: 2,
      metadata: { session_id: "sess_123", user_type: "premium" }
    }
  },
  'Retrieval (RAG)': {
    mandatory: [
      { name: 'query', description: 'Search query' },
      { name: 'retrieved_documents', description: 'Retrieved document IDs/names' },
      { name: 'expected_answer', description: 'Expected answer from documents' },
      { name: 'generated_answer', description: 'Model-generated answer' }
    ],
    optional: [
      { name: 'ground_truth_docs', description: 'Ground truth relevant documents' },
      { name: 'reference', description: 'Reference sources' },
      { name: 'metadata', description: 'Additional metadata (JSON object)' }
    ],
    example: {
      query: "What are the benefits of renewable energy?",
      retrieved_documents: ["doc_solar_2024.pdf", "doc_wind_energy.pdf"],
      expected_answer: "Renewable energy reduces carbon emissions and provides sustainable power.",
      generated_answer: "Renewable sources like solar and wind help reduce environmental impact.",
      ground_truth_docs: ["doc_solar_2024.pdf"],
      metadata: { retrieval_score: 0.89, num_docs: 2 }
    }
  },
  'Classification': {
    mandatory: [
      { name: 'input_text', description: 'Text to classify' },
      { name: 'expected_label', description: 'True classification label' },
      { name: 'predicted_label', description: 'Model-predicted label' }
    ],
    optional: [
      { name: 'label_confidence', description: 'Prediction confidence score' },
      { name: 'metadata', description: 'Additional metadata (JSON object)' },
      { name: 'reasoning', description: 'Model reasoning/explanation' }
    ],
    example: {
      input_text: "This product exceeded my expectations! Highly recommended.",
      expected_label: "positive",
      predicted_label: "positive",
      label_confidence: 0.95,
      reasoning: "Positive keywords: exceeded, highly recommended",
      metadata: { model_version: "v2.1", category: "sentiment" }
    }
  },
  'Structured Output Generation': {
    mandatory: [
      { name: 'input_instruction', description: 'Instruction for data extraction' },
      { name: 'expected_output', description: 'Expected structured output' },
      { name: 'generated_output', description: 'Model-generated structured output' }
    ],
    optional: [
      { name: 'format_schema', description: 'JSON schema for output format' },
      { name: 'reference', description: 'Reference guidelines' },
      { name: 'metadata', description: 'Additional metadata (JSON object)' }
    ],
    example: {
      input_instruction: "Extract person and company information from: John Doe works at ABC Corp",
      expected_output: { name: "John Doe", company: "ABC Corp", role: null },
      generated_output: { name: "John Doe", company: "ABC Corp" },
      format_schema: { type: "object", properties: { name: "string", company: "string" } },
      metadata: { extraction_confidence: 0.92 }
    }
  },
  'Open-ended Generation': {
    mandatory: [
      { name: 'prompt', description: 'Generation prompt/instruction' },
      { name: 'generated_output', description: 'Model-generated content' }
    ],
    optional: [
      { name: 'reference_output', description: 'Reference/example output' },
      { name: 'feedback', description: 'Human feedback on quality' },
      { name: 'toxicity_flag', description: 'Toxicity detection flag' },
      { name: 'metadata', description: 'Additional metadata (JSON object)' }
    ],
    example: {
      prompt: "Write a short story about a robot learning to paint",
      generated_output: "In a small workshop, R2D7 discovered brushes and colors for the first time...",
      reference_output: "Example creative story about artistic robots",
      feedback: "Creative and engaging narrative with good character development",
      toxicity_flag: false,
      metadata: { creativity_score: 8.5, word_count: 245 }
    }
  }
};

// Helper functions
export function getFileUploadConfigByPath(path: string): FileUploadConfig {
  return FILE_UPLOAD_CONFIGS[path] || FILE_UPLOAD_CONFIGS['/evaluation/dataset-selection'];
}

export function getTaskTagsByType(taskType: string): string[] {
  return TASK_TAG_MAPPING[taskType] || [];
}

export function getTaskColumnRequirements(taskType: string) {
  return TASK_COLUMN_REQUIREMENTS[taskType];
}

export function getAllTaskTypes(): string[] {
  return Object.keys(TASK_COLUMN_REQUIREMENTS);
}

export function validateTaskTypeColumns(columns: string[], taskType: string): {
  isValid: boolean;
  missingMandatory: string[];
  presentOptional: string[];
} {
  const requirements = getTaskColumnRequirements(taskType);
  if (!requirements) {
    return { isValid: false, missingMandatory: [], presentOptional: [] };
  }

  const missingMandatory = requirements.mandatory
    .map(req => req.name)
    .filter(col => !columns.some(dataCol => dataCol.toLowerCase() === col.toLowerCase()));

  const presentOptional = requirements.optional
    .map(req => req.name)
    .filter(col => columns.some(dataCol => dataCol.toLowerCase() === col.toLowerCase()));

  return {
    isValid: missingMandatory.length === 0,
    missingMandatory,
    presentOptional
  };
}

// Dataset Tips Configuration
export interface DatasetTipsConfig {
  title: string;
  sections: Array<{
    icon: any;
    iconColor: string;
    title: string;
    description: string;
  }>;
  taskTypes: Array<{
    name: string;
  }>;
  bestPractices: {
    title: string;
    description: string;
    bgColor: string;
    borderColor: string;
    titleColor: string;
    textColor: string;
  };
}

const DATASET_TIPS_CONFIGS: Record<string, DatasetTipsConfig> = {
  '/evaluation/dataset-selection': {
    title: 'Evaluation Dataset Guide',
    sections: [
      {
        icon: 'Target',
        iconColor: 'text-blue-500',
        title: 'YAML Format Required',
        description: 'Upload datasets in YAML format with proper task-specific column structure'
      },
      {
        icon: 'BarChart',
        iconColor: 'text-green-500',
        title: 'Mandatory vs Optional',
        description: 'Each task type has required columns (🟢) and optional enhancement columns (🟡)'
      },
      {
        icon: 'FileText',
        iconColor: 'text-purple-500',
        title: 'Quality Evaluation',
        description: 'Include both expected outputs and generated outputs for comprehensive evaluation'
      }
    ],
    taskTypes: [
      { name: 'Question Answering' },
      { name: 'Summarization' },
      { name: 'Conversational QA' },
      { name: 'Retrieval (RAG)' },
      { name: 'Classification' },
      { name: 'Structured Output Generation' },
      { name: 'Open-ended Generation' }
    ],
    bestPractices: {
      title: 'Best Practices',
      description: 'Ensure your dataset includes both expected and generated outputs for accurate evaluation metrics. Use metadata fields for additional context and evaluation parameters.',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      borderColor: 'border-amber-200 dark:border-amber-800',
      titleColor: 'text-amber-800 dark:text-amber-200',
      textColor: 'text-amber-700 dark:text-amber-300'
    }
  }
};

// Helper function for dataset tips config
export function getDatasetTipsConfigByPath(path: string): DatasetTipsConfig {
  return DATASET_TIPS_CONFIGS[path] || DATASET_TIPS_CONFIGS['/evaluation/dataset-selection'];
}

export { FILE_UPLOAD_CONFIGS, TASK_TAG_MAPPING, TASK_COLUMN_REQUIREMENTS, DATASET_TIPS_CONFIGS };