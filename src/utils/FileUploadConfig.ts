// src/utils/constants.ts
import { Target, BarChart, Database, Brain, Search, FileText, Settings, Zap, Users } from 'lucide-react';

// 🔹 INTERFACES (same as before)
interface TipSection {
  icon: any;
  iconColor: string;
  title: string;
  description: string;
}

interface TaskType {
  name: string;
}

interface BestPractice {
  title: string;
  description: string;
  bgColor: string;
  borderColor: string;
  titleColor: string;
  textColor: string;
}

export interface TipsConfig {
  title: string;
  sections: TipSection[];
  taskTypes: TaskType[];
  bestPractices: BestPractice;
}

export interface FileUploadConfig {
  title: string;
  acceptedFormats: string[];
  acceptAttribute: string;
  maxSize: number;
  description: string;
  buttonText: string;
  supportText: string;
  fileTypeDisplay: string;
}

// 🔹 PATH-BASED ROUTE MAPPING
interface RouteConfig {
  fileUpload: FileUploadConfig;
  datasetTips: TipsConfig;
}

const ROUTE_CONFIGS: Record<string, RouteConfig> = {
  // 🔸 EVALUATION ROUTES
  '/evaluation': {
    fileUpload: {
      title: "Upload New Evaluation Dataset",
      acceptedFormats: ['.yaml', '.yml'],
      acceptAttribute: '.yaml,.yml',
      maxSize: 100,
      description: "Drop your YAML dataset file here",
      buttonText: "Choose YAML File",
      supportText: "Currently supports YAML files up to 100MB",
      fileTypeDisplay: "YAML"
    },
    datasetTips: {
      title: "Evaluation Dataset Guide",
      sections: [
        {
          icon: Target,
          iconColor: "text-blue-500",
          title: "Dataset Requirements",
          description: "Your evaluation dataset must contain input samples and expected outputs or reference answers for comparison."
        },
        {
          icon: BarChart,
          iconColor: "text-green-500",
          title: "Sample Size",
          description: "Use 100-1000 samples for reliable evaluation metrics. Larger datasets provide more statistical confidence."
        }
      ],
      taskTypes: [
        { name: "Question Answering" },
        { name: "Summarization" },
        { name: "Classification" },
        { name: "Structured Output" },
        { name: "Conversational QA" },
        { name: "Retrieval" }
      ],
      bestPractices: {
        title: "Best Practices",
        description: "Include diverse examples, edge cases, and representative samples from your target domain for comprehensive evaluation.",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        borderColor: "border-blue-200 dark:border-blue-800",
        titleColor: "text-blue-800 dark:text-blue-200",
        textColor: "text-blue-700 dark:text-blue-300"
      }
    }
  },

  // 🔸 FINE-TUNING ROUTES
  '/finetuning': {
    fileUpload: {
      title: "Upload New Training Dataset",
      acceptedFormats: ['.csv'],
      acceptAttribute: '.csv',
      maxSize: 500,
      description: "Drop your CSV training file here",
      buttonText: "Choose CSV File",
      supportText: "Currently supports CSV files up to 500MB",
      fileTypeDisplay: "CSV"
    },
    datasetTips: {
      title: "Fine-tuning Dataset Guide",
      sections: [
        {
          icon: Database,
          iconColor: "text-indigo-500",
          title: "Training Data Quality",
          description: "Use high-quality, diverse training examples that represent your target task and domain distribution."
        },
        {
          icon: Settings,
          iconColor: "text-red-500",
          title: "Data Format",
          description: "Ensure your dataset follows the required format with proper input-output pairs and consistent structure."
        },
        {
          icon: BarChart,
          iconColor: "text-green-500",
          title: "Dataset Size",
          description: "Use 1000-10000+ samples for effective fine-tuning. More data generally leads to better model performance."
        },
        {
          icon: Zap,
          iconColor: "text-yellow-500",
          title: "Data Validation",
          description: "Validate your dataset for completeness, consistency, and quality before starting the fine-tuning process."
        }
      ],
      taskTypes: [
        { name: "Text Classification" },
        { name: "Named Entity Recognition" },
        { name: "Sentiment Analysis" },
        { name: "Text Generation" },
        { name: "Translation" },
        { name: "Summarization" },
        { name: "Instruction Following" },
        { name: "Code Generation" }
      ],
      bestPractices: {
        title: "Dataset Best Practices",
        description: "Split data into train/validation sets, ensure balanced classes, and clean your data thoroughly before training.",
        bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
        borderColor: "border-indigo-200 dark:border-indigo-800",
        titleColor: "text-indigo-800 dark:text-indigo-200",
        textColor: "text-indigo-700 dark:text-indigo-300"
      }
    }
  },

  // 🔸 RAG ROUTES
  '/rag': {
    fileUpload: {
      title: "Upload Knowledge Base Documents",
      acceptedFormats: ['.pdf', '.doc', '.docx', '.txt', '.md'],
      acceptAttribute: '.pdf,.doc,.docx,.txt,.md',
      maxSize: 200,
      description: "Drop your document files here",
      buttonText: "Choose Documents",
      supportText: "Supports PDF, DOC, DOCX, TXT, and MD files up to 200MB each",
      fileTypeDisplay: "Document"
    },
    datasetTips: {
      title: "RAG Dataset Guide",
      sections: [
        {
          icon: Database,
          iconColor: "text-purple-500",
          title: "Knowledge Base Documents",
          description: "Prepare comprehensive documents that contain the knowledge needed to answer your target questions."
        },
        {
          icon: Search,
          iconColor: "text-orange-500",
          title: "Query-Answer Pairs",
          description: "Create question-answer pairs that test retrieval accuracy and generation quality from your knowledge base."
        },
        {
          icon: Brain,
          iconColor: "text-green-500",
          title: "Document Chunking",
          description: "Split documents into optimal chunks (200-800 tokens) to improve retrieval precision and context relevance."
        },
        {
          icon: Users,
          iconColor: "text-blue-500",
          title: "Evaluation Queries",
          description: "Design diverse evaluation queries that test different aspects of your RAG system's capabilities."
        }
      ],
      taskTypes: [
        { name: "Document Q&A" },
        { name: "Knowledge Retrieval" },
        { name: "Factual Answering" },
        { name: "Multi-document Synthesis" },
        { name: "Citation Generation" },
        { name: "Context-aware Chat" },
        { name: "Research Assistance" },
        { name: "Technical Documentation" }
      ],
      bestPractices: {
        title: "RAG Dataset Best Practices",
        description: "Use diverse document types, create challenging queries, and ensure ground truth answers are derivable from your knowledge base.",
        bgColor: "bg-purple-50 dark:bg-purple-900/20",
        borderColor: "border-purple-200 dark:border-purple-800",
        titleColor: "text-purple-800 dark:text-purple-200",
        textColor: "text-purple-700 dark:text-purple-300"
      }
    }
  }
};

// 🔹 PATH-BASED HELPER FUNCTIONS

/**
 * Get configuration based on the current pathname
 * @param pathname - Current route pathname (e.g., "/evaluation/dataset-selection")
 * @returns Configuration object for the route
 */
export const getConfigByPath = (pathname: string): RouteConfig => {
  // Extract the main route segment (e.g., "/evaluation" from "/evaluation/dataset-selection")
  const mainRoute = '/' + pathname.split('/')[1];
  
  // Return configuration for the route, or default to evaluation
  return ROUTE_CONFIGS[mainRoute] || ROUTE_CONFIGS['/evaluation'];
};

/**
 * Get file upload configuration based on pathname
 * @param pathname - Current route pathname
 * @returns FileUploadConfig object
 */
export const getFileUploadConfigByPath = (pathname: string): FileUploadConfig => {
  return getConfigByPath(pathname).fileUpload;
};

/**
 * Get dataset tips configuration based on pathname
 * @param pathname - Current route pathname
 * @returns TipsConfig object
 */
export const getDatasetTipsConfigByPath = (pathname: string): TipsConfig => {
  return getConfigByPath(pathname).datasetTips;
};

// 🔹 BACKWARD COMPATIBILITY (keep the old individual functions)
export const getEvaluationFileUploadConfig = (): FileUploadConfig => 
  ROUTE_CONFIGS['/evaluation'].fileUpload;

export const getFinetuningFileUploadConfig = (): FileUploadConfig => 
  ROUTE_CONFIGS['/finetuning'].fileUpload;

export const getRagFileUploadConfig = (): FileUploadConfig => 
  ROUTE_CONFIGS['/rag'].fileUpload;

export const getEvaluationDatasetConfig = (): TipsConfig => 
  ROUTE_CONFIGS['/evaluation'].datasetTips;

export const getFinetuningDatasetConfig = (): TipsConfig => 
  ROUTE_CONFIGS['/finetuning'].datasetTips;

export const getRagDatasetConfig = (): TipsConfig => 
  ROUTE_CONFIGS['/rag'].datasetTips;