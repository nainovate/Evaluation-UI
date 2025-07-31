import React from 'react';
import { FileText, Shield, BarChart3, Cog } from 'lucide-react';

export const EvaluationTips: React.FC = () => {
  const metricGuide = [
    {
      category: "RAG Systems",
      bestFor: "Retrieval-Augmented Generation, document Q&A, knowledge bases",
      metrics: ["Answer Relevancy", "Faithfulness", "Contextual Relevancy", "Contextual Precision", "Contextual Recall"],
      icon: <FileText className="w-4 h-4" />
    },
    {
      category: "Safety & Content Moderation", 
      bestFor: "Customer-facing applications, content generation, chatbots",
      metrics: ["Bias Detection", "Toxicity Detection", "Hallucination Detection"],
      icon: <Shield className="w-4 h-4" />
    },
    {
      category: "Task-Specific Evaluation",
      bestFor: "Document summarization, meeting notes, content condensation",
      metrics: ["Summarization Quality"],
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      category: "Custom Requirements",
      bestFor: "Domain-specific evaluation, complex criteria, subjective assessment",
      metrics: ["G-Eval (Custom)"],
      icon: <Cog className="w-4 h-4" />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Metric Selection Guide */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Metric Selection Guide
        </h3>
        <div className="space-y-4">
          {metricGuide.map((guide, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-blue-500">
                  {guide.icon}
                </div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {guide.category}
                </h4>
              </div>
              
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                <span className="font-medium">Best for:</span> {guide.bestFor}
              </p>
              
              <div className="flex flex-wrap gap-1">
                {guide.metrics.map((metric, metricIndex) => (
                  <span
                    key={metricIndex}
                    className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-300 rounded font-medium"
                  >
                    {metric}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};