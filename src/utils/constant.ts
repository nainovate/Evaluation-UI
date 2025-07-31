// src/utils/constants.ts
import { Target, BarChart, Database, Brain, Search, FileText, Settings, Zap, Users } from 'lucide-react';
import { TipsConfig } from '@/components/common/DatasetTips';

// 🔹 EVALUATION DATASET CONFIGURATION
export const getEvaluationDatasetConfig = (): TipsConfig => ({
  title: "Evaluation Payload Guide",
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
});

// 🔹 FINE-TUNING DATASET CONFIGURATION
export const getFinetuningDatasetConfig = (): TipsConfig => ({
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
      description: "Ensure your payload follows the required format with proper input-output pairs and consistent structure."
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
});

// 🔹 RAG DATASET CONFIGURATION
export const getRagDatasetConfig = (): TipsConfig => ({
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
});