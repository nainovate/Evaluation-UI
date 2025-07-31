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
    title: 'Upload Evaluation Payload',
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
      { name: 'expected_answer', description: 'The correct/reference answer' }
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
      context: "Geography and world capitals",
      reference: "World Atlas 2024",
      metadata: { difficulty: "easy", category: "geography" }
    }
  },
  'Summarization': {
    mandatory: [
      { name: 'input_text', description: 'The text to be summarized' },
      { name: 'expected_summary', description: 'The reference/expected summary' }
    ],
    optional: [
      { name: 'reference_summary', description: 'Alternative reference summary' },
      { name: 'metadata', description: 'Additional metadata (JSON object)' },
      { name: 'source_title', description: 'Title of the source document' },
      { name: 'length_constraint', description: 'Target summary length' }
    ],
    example: {
      input_text: "Long article about artificial intelligence and its applications in modern society...",
      expected_summary: "AI is transforming modern society across multiple domains.",
      reference_summary: "Alternative summary for comparison",
      source_title: "AI in Society Report",
      length_constraint: "50 words",
      metadata: { domain: "technology", complexity: "medium" }
    }
  },
  'Conversational QA': {
    mandatory: [
      { name: 'conversation_history', description: 'Previous conversation turns' },
      { name: 'question', description: 'Current question in the conversation' },
      { name: 'expected_answer', description: 'Expected response' }
    ],
    optional: [
      { name: 'context', description: 'Additional context information' },
      { name: 'turn_id', description: 'Turn identifier in conversation' },
      { name: 'metadata', description: 'Additional metadata (JSON object)' }
    ],
    example: {
      conversation_history: "User: Hello\nAssistant: Hi! How can I help you today?",
      question: "I need help with my account",
      expected_answer: "I'd be happy to help with your account. What specific issue are you facing?",
      context: "Customer support conversation",
      turn_id: "turn_2",
      metadata: { session_id: "sess_123", user_type: "premium" }
    }
  },
  'Retrieval (RAG)': {
    mandatory: [
      { name: 'query', description: 'Search query or question' },
      { name: 'retrieved_documents', description: 'Documents retrieved for the query' },
      { name: 'expected_answer', description: 'Expected answer based on documents' }
    ],
    optional: [
      { name: 'ground_truth_docs', description: 'Ground truth relevant documents' },
      { name: 'reference', description: 'Reference source information' },
      { name: 'metadata', description: 'Additional metadata (JSON object)' }
    ],
    example: {
      query: "How does photosynthesis work?",
      retrieved_documents: "Document 1: Plants convert sunlight... Document 2: Chlorophyll process...",
      expected_answer: "Photosynthesis is the process by which plants convert sunlight into energy.",
      ground_truth_docs: "doc_456, doc_789",
      reference: "Biology textbook Chapter 12",
      metadata: { search_engine: "vector_db", confidence: 0.95 }
    }
  },
  'Classification': {
    mandatory: [
      { name: 'input_text', description: 'Text to be classified' },
      { name: 'expected_label', description: 'Correct classification label' }
    ],
    optional: [
      { name: 'label_confidence', description: 'Confidence score for label' },
      { name: 'metadata', description: 'Additional metadata (JSON object)' },
      { name: 'reasoning', description: 'Explanation for the classification' }
    ],
    example: {
      input_text: "I absolutely love this product! It exceeded my expectations.",
      expected_label: "positive",
      label_confidence: 0.92,
      reasoning: "Contains positive sentiment words like 'love' and 'exceeded expectations'",
      metadata: { domain: "product_reviews", language: "en" }
    }
  },
  'Structured Output Generation': {
    mandatory: [
      { name: 'input_instruction', description: 'Instruction for structured output generation' },
      { name: 'expected_output', description: 'Expected structured output' }
    ],
    optional: [
      { name: 'format_schema', description: 'Schema definition for output format' },
      { name: 'reference', description: 'Reference example or documentation' },
      { name: 'metadata', description: 'Additional metadata (JSON object)' }
    ],
    example: {
      input_instruction: "Extract person information from: John Doe works at ABC Corp as Software Engineer",
      expected_output: '{"name": "John Doe", "company": "ABC Corp", "position": "Software Engineer"}',
      format_schema: "person_info_schema",
      reference: "Entity extraction guidelines v2.1",
      metadata: { extraction_type: "person_info", difficulty: "medium" }
    }
  },
  'Open-ended Generation': {
    mandatory: [
      { name: 'prompt', description: 'Generation prompt or instruction' }
    ],
    optional: [
      { name: 'reference_output', description: 'Reference or example output' },
      { name: 'feedback', description: 'Human feedback or evaluation notes' },
      { name: 'toxicity_flag', description: 'Flag for toxic content detection' },
      { name: 'metadata', description: 'Additional metadata (JSON object)' }
    ],
    example: {
      prompt: "Write a short story about a robot learning to paint",
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
    title: 'Evaluation Payload Guide',
    sections: [
      {
        icon: 'Target',
        iconColor: 'text-blue-500',
        title: 'YAML Format Required',
        description: 'Upload payloads in YAML format with proper task-specific column structure'
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
      description: 'Ensure your payload includes both expected and generated outputs for accurate evaluation metrics. Use metadata fields for additional context and evaluation parameters.',
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