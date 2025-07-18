// src/components/evaluation/EvaluationMetricsChart.tsx
'use client'

import React from 'react';
import { EvaluationData } from '../../types/evaluation';

interface EvaluationMetricsChartProps {
  evaluation: EvaluationData;
  className?: string;
}

export const EvaluationMetricsChart: React.FC<EvaluationMetricsChartProps> = ({
  evaluation,
  className = ""
}) => {
  // Generate mock historical data points for visualization
  const generateMetricsData = () => {
    const dataPoints = [];
    const currentTask = evaluation.metrics.currentTask;
    const interval = Math.max(1, Math.floor(currentTask / 20)); // Show ~20 data points
    
    for (let i = 0; i <= currentTask; i += interval) {
      const progress = i / evaluation.metrics.totalTasks;
      dataPoints.push({
        task: i,
        relevance: Math.max(0.75, evaluation.metrics.answerRelevance - (Math.random() * 0.1)),
        coherence: Math.max(0.70, evaluation.metrics.coherence - (Math.random() * 0.1)),
        helpfulness: Math.max(0.75, evaluation.metrics.helpfulness - (Math.random() * 0.1)),
        accuracy: Math.max(0.80, evaluation.metrics.accuracy - (Math.random() * 0.1))
      });
    }
    return dataPoints;
  };

  const metricsData = generateMetricsData();

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Evaluation Metrics
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {evaluation.metrics.currentTask} / {evaluation.metrics.totalTasks} tasks
        </div>
      </div>

      {/* Current Metrics Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {(evaluation.metrics.answerRelevance * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-300">Relevance</div>
        </div>
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {(evaluation.metrics.coherence * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-green-700 dark:text-green-300">Coherence</div>
        </div>
        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {(evaluation.metrics.helpfulness * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-purple-700 dark:text-purple-300">Helpfulness</div>
        </div>
        <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {(evaluation.metrics.accuracy * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-yellow-700 dark:text-yellow-300">Accuracy</div>
        </div>
      </div>

      {/* Chart Visualization */}
      <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 relative overflow-hidden">
        {/* Chart Background Grid */}
        <div className="absolute inset-4 opacity-20">
          {[...Array(5)].map((_, i) => (
            <div 
              key={`h-${i}`} 
              className="border-b border-gray-300 dark:border-gray-600 h-1/5"
            />
          ))}
          {[...Array(6)].map((_, i) => (
            <div 
              key={`v-${i}`} 
              className="border-r border-gray-300 dark:border-gray-600 w-1/6 h-full absolute" 
              style={{ left: `${i * 16.666}%` }}
            />
          ))}
        </div>
        
        {/* Chart Lines */}
        <div className="relative h-full">
          {/* Answer Relevance Line */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 240" preserveAspectRatio="none">
            <path
              d="M 0 60 Q 80 45 160 40 T 320 35"
              stroke="#3B82F6"
              strokeWidth="3"
              fill="none"
              className="animate-pulse"
            />
          </svg>
          
          {/* Coherence Line */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 240" preserveAspectRatio="none">
            <path
              d="M 0 80 Q 80 70 160 65 T 320 55"
              stroke="#10B981"
              strokeWidth="3"
              fill="none"
              className="animate-pulse"
              style={{ animationDelay: '0.5s' }}
            />
          </svg>
          
          {/* Helpfulness Line */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 240" preserveAspectRatio="none">
            <path
              d="M 0 70 Q 80 60 160 50 T 320 45"
              stroke="#8B5CF6"
              strokeWidth="3"
              fill="none"
              className="animate-pulse"
              style={{ animationDelay: '1s' }}
            />
          </svg>
          
          {/* Accuracy Line */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 240" preserveAspectRatio="none">
            <path
              d="M 0 50 Q 80 40 160 35 T 320 30"
              stroke="#F59E0B"
              strokeWidth="3"
              fill="none"
              className="animate-pulse"
              style={{ animationDelay: '1.5s' }}
            />
          </svg>
        </div>
        
        {/* Chart Legend */}
        <div className="absolute bottom-2 left-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-blue-500" />
            <span className="text-gray-600 dark:text-gray-300">Answer Relevance</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-green-500" />
            <span className="text-gray-600 dark:text-gray-300">Coherence</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-purple-500" />
            <span className="text-gray-600 dark:text-gray-300">Helpfulness</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-yellow-500" />
            <span className="text-gray-600 dark:text-gray-300">Accuracy</span>
          </div>
        </div>
      </div>

      {/* Chart Footer */}
      <div className="flex justify-between items-center mt-4 text-xs text-gray-500 dark:text-gray-400">
        <span>Evaluation Progress</span>
        <span>Last updated: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};