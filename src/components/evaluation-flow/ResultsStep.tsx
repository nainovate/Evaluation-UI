import React, { useState, useEffect } from 'react';
import { CheckCircle, Download, RefreshCw, BarChart3, TrendingUp, AlertCircle, Clock, Zap } from 'lucide-react';
import type { EvaluationMetadata } from '../../utils/evaluationUtils';

interface ResultsStepProps {
  metadata: EvaluationMetadata;
  onRestart: () => void;
}

export const ResultsStep: React.FC<ResultsStepProps> = ({
  metadata,
  onRestart
}) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [currentStage, setCurrentStage] = useState('Initializing...');

  // Simulate evaluation progress
  useEffect(() => {
    const stages = [
      'Initializing evaluation...',
      'Loading dataset...',
      'Preparing model deployment...',
      'Running metrics evaluation...',
      'Calculating scores...',
      'Generating report...',
      'Completed!'
    ];

    let progressInterval: NodeJS.Timeout;
    let stageIndex = 0;

    const updateProgress = () => {
      setProgress(prev => {
        const newProgress = Math.min(prev + Math.random() * 15, 100);
        
        // Update stage based on progress
        const stageProgress = Math.floor((newProgress / 100) * stages.length);
        if (stageIndex < stageProgress && stageIndex < stages.length - 1) {
          stageIndex = stageProgress;
          setCurrentStage(stages[stageIndex]);
        }
        
        if (newProgress >= 100) {
          setIsComplete(true);
          setCurrentStage('Completed!');
          clearInterval(progressInterval);
        }
        
        return newProgress;
      });
    };

    if (metadata.execution?.status === 'running') {
      progressInterval = setInterval(updateProgress, 800);
    } else if (metadata.execution?.status === 'completed') {
      setProgress(100);
      setIsComplete(true);
      setCurrentStage('Completed!');
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [metadata.execution?.status]);

  // Mock results data
  const mockResults = {
    overallScore: 85.2,
    metrics: [
      { name: 'Answer Relevancy', score: 87.3, status: 'good' },
      { name: 'Faithfulness', score: 82.1, status: 'good' },
      { name: 'Hallucination Detection', score: 88.7, status: 'excellent' }
    ],
    performance: {
      totalSamples: metadata.dataset?.rows || 500,
      completedSamples: metadata.dataset?.rows || 500,
      averageResponseTime: 2.3,
      errorRate: 0.02
    },
    insights: [
      'Model performs well on factual questions',
      'Slight hallucination detected in 2% of responses',
      'Response quality is consistent across different topics'
    ]
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 90) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    if (score >= 80) return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    if (score >= 70) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  };

  if (!isComplete) {
    return (
      <div className="space-y-6">
        {/* Step Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Evaluation in Progress
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we evaluate your model performance
          </p>
        </div>

        {/* Progress Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center mb-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {currentStage}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round(progress)}% complete
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-6">
            <div
              className="bg-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Evaluation Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {metadata.dataset?.rows || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Samples
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {metadata.metrics?.totalSelected || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Metrics Running
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ~{Math.ceil(((metadata.dataset?.rows || 0) * (metadata.metrics?.totalSelected || 0) * 2) / 60)}m
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Estimated Time
              </div>
            </div>
          </div>
        </div>

        {/* Tips while waiting */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                While you wait...
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                You can leave this page and return later. The evaluation will continue running in the background.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Evaluation Complete!
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Your model evaluation has finished successfully
        </p>
      </div>

      {/* Overall Score */}
      <div className={`rounded-xl shadow-sm border p-6 ${getScoreBackground(mockResults.overallScore)}`}>
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">
            <span className={getScoreColor(mockResults.overallScore)}>
              {mockResults.overallScore}
            </span>
            <span className="text-2xl text-gray-500 dark:text-gray-400">/100</span>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            Overall Evaluation Score
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Based on {mockResults.metrics.length} metrics across {mockResults.performance.totalSamples} samples
          </p>
        </div>
      </div>

      {/* Metrics Results */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center mb-6">
          <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Detailed Metrics
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockResults.metrics.map((metric, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {metric.name}
                </h4>
                <span className={`text-lg font-bold ${getScoreColor(metric.score)}`}>
                  {metric.score}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    metric.score >= 90 ? 'bg-green-500' :
                    metric.score >= 80 ? 'bg-blue-500' :
                    metric.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${metric.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center mb-6">
          <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Performance Statistics
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {mockResults.performance.completedSamples}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Samples Processed
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {mockResults.performance.averageResponseTime}s
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Avg Response Time
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {(mockResults.performance.errorRate * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Error Rate
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(((Date.now() - new Date(metadata.execution?.startedAt || Date.now()).getTime()) / 1000 / 60))}m
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Time
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center mb-6">
          <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Key Insights
          </h3>
        </div>

        <div className="space-y-3">
          {mockResults.insights.map((insight, index) => (
            <div key={index} className="flex items-start">
              <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {insight}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => {
            // Mock download functionality
            const data = JSON.stringify(mockResults, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `evaluation-results-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="flex items-center px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </button>
        
        <button
          onClick={onRestart}
          className="flex items-center px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Start New Evaluation
        </button>
      </div>
    </div>
  );
};