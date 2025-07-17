import React from 'react';
import { Lightbulb, Target, BarChart3, Settings, AlertCircle } from 'lucide-react';

export const EvaluationTips: React.FC = () => {
  const tips = [
    {
      icon: <Target className="w-5 h-5" />,
      title: "Choose Relevant Metrics",
      description: "Select metrics that align with your specific use case and quality requirements."
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: "Batch Size Impact",
      description: "Larger batch sizes process faster but use more API quota. Start with 50 for balance."
    },
    {
      icon: <AlertCircle className="w-5 h-5" />,
      title: "Model Selection",
      description: "GPT-4 provides the most accurate evaluations, while GPT-3.5 is more cost-effective."
    }
  ];

  const metricGuide = [
    {
      category: "Answer Quality",
      bestFor: "General Q&A, chatbots, content generation",
      metrics: ["Answer Relevancy", "Faithfulness", "Hallucination Detection"]
    },
    {
      category: "Context Understanding", 
      bestFor: "RAG systems, document Q&A, knowledge bases",
      metrics: ["Context Recall", "Factual Consistency"]
    },
    {
      category: "Similarity & Accuracy",
      bestFor: "Translation, summarization, specific answer matching",
      metrics: ["Exact Match", "BERTScore", "Embedding Distance"]
    },
    {
      category: "Language Quality",
      bestFor: "Creative writing, content generation, style transfer",
      metrics: ["Fluency", "Coherence", "Conciseness"]
    }
  ];

  return (
    <div className="space-y-6">
      

      {/* Metric Guide */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Metric Selection Guide
        </h3>
        <div className="space-y-4">
          {metricGuide.map((guide, index) => (
            <div key={index} className="border-l-4 border-indigo-500 pl-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                {guide.category}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Best for: {guide.bestFor}
              </p>
              <div className="mt-2">
                <div className="flex flex-wrap gap-1">
                  {guide.metrics.map((metric, metricIndex) => (
                    <span
                      key={metricIndex}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                    >
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

     
    </div>
  );
};