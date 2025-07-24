import React, { useState } from 'react';
import { Play, Database, Settings, BarChart3, Clock, Cpu, AlertCircle } from 'lucide-react';
import type { EvaluationMetadata } from '../../utils/evaluationUtils';

interface ReviewAndRunStepProps {
  metadata: EvaluationMetadata;
  onComplete: (data: any) => void;
  onBack: () => void;
  canProceed: boolean;
}

export const ReviewAndRunStep: React.FC<ReviewAndRunStepProps> = ({
  metadata,
  onComplete,
  onBack,
  canProceed
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [evaluationName, setEvaluationName] = useState('');
  const [evaluationDescription, setEvaluationDescription] = useState('');

  // Calculate estimated time based on dataset size and metrics
  React.useEffect(() => {
    if (metadata.dataset?.rows && metadata.metrics?.totalSelected) {
      const baseTimePerRow = 2; // 2 seconds per row per metric
      const totalTime = metadata.dataset.rows * metadata.metrics.totalSelected * baseTimePerRow;
      setEstimatedTime(Math.ceil(totalTime / 60)); // Convert to minutes
    }
  }, [metadata.dataset?.rows, metadata.metrics?.totalSelected]);

  const handleStartEvaluation = async () => {
    if (!evaluationName.trim()) {
      return; // Don't start if no name provided
    }
    
    setIsRunning(true);
    
    // Simulate starting evaluation
    setTimeout(() => {
      onComplete({
        startedAt: new Date().toISOString(),
        status: 'running',
        evaluationName: evaluationName.trim(),
        evaluationDescription: evaluationDescription.trim()
      });
    }, 1000);
  };

  const getMetricsList = () => {
    if (!metadata.metrics?.categories) return [];
    
    const selectedCategory = metadata.metrics.categories.find(cat => cat.selected);
    if (!selectedCategory) return [];
    
    return selectedCategory.subMetrics
      .filter(metric => metric.enabled)
      .map(metric => metric.name);
  };

  // Check if evaluation can start - only requires a name
  const canStartEvaluation = evaluationName.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Review & Run Evaluation
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Review your configuration and start the evaluation process
        </p>
      </div>
      
      {/* Evaluation Details Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Evaluation Details
        </h3>
        
        <div className="space-y-4">
          {/* Evaluation Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Evaluation Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={evaluationName}
              onChange={(e) => setEvaluationName(e.target.value)}
              placeholder="Enter a name for this evaluation"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              disabled={isRunning}
            />
            {!evaluationName.trim() && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                This field is required to start the evaluation
              </p>
            )}
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description (optional)
            </label>
            <textarea
              value={evaluationDescription}
              onChange={(e) => setEvaluationDescription(e.target.value)}
              placeholder="Describe the purpose or context of this evaluation"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
              disabled={isRunning}
            />
          </div>
        </div>
      </div>

      {/* Configuration Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center mb-6">
          <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Configuration Summary
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dataset Configuration */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Database className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Dataset Configuration
              </h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-blue-600 dark:text-blue-400">Dataset:</span>
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  {metadata.dataset?.name || 'Not selected'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-blue-600 dark:text-blue-400">Rows:</span>
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  {metadata.dataset?.rows || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-blue-600 dark:text-blue-400">Task Type:</span>
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  {metadata.dataset?.taskType || 'General'}
                </span>
              </div>
            </div>
          </div>

          {/* Model Configuration */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Cpu className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
              <h4 className="text-sm font-medium text-green-800 dark:text-green-200">
                Model Configuration
              </h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-green-600 dark:text-green-400">Deployment:</span>
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  {metadata.deployment?.name || 'Not selected'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-green-600 dark:text-green-400">Model:</span>
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  {metadata.deployment?.model || 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-green-600 dark:text-green-400">Provider:</span>
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  {metadata.deployment?.provider || 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          {/* Metrics Configuration */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
              <h4 className="text-sm font-medium text-purple-800 dark:text-purple-200">
                Metrics Configuration
              </h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-purple-600 dark:text-purple-400">Category:</span>
                <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                  {metadata.metrics?.categories?.find(cat => cat.selected)?.name || 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-purple-600 dark:text-purple-400">Metrics:</span>
                <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                  {metadata.metrics?.totalSelected || 0} selected
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-purple-600 dark:text-purple-400">Eval Model:</span>
                <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                  {metadata.metrics?.configuration?.evaluationModel || 'GPT-4'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Metrics List */}
        {getMetricsList().length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Selected Metrics ({getMetricsList().length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {getMetricsList().map((metric, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 rounded-full"
                >
                  {metric}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Execution Details */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center mb-6">
          <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Execution Details
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {estimatedTime}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Estimated Minutes
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {metadata.metrics?.configuration?.batchSize || 50}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Batch Size
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {metadata.metrics?.configuration?.timeout || 30}s
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Timeout
            </div>
          </div>
        </div>
      </div>

      {/* Cost Estimate */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mr-2 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Cost Estimate
            </h4>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              Based on {metadata.dataset?.rows || 0} rows and {metadata.metrics?.totalSelected || 0} metrics, 
              this evaluation will make approximately {((metadata.dataset?.rows || 0) * (metadata.metrics?.totalSelected || 0)).toLocaleString()} API calls.
              Estimated cost: ${((metadata.dataset?.rows || 0) * (metadata.metrics?.totalSelected || 0) * 0.001).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onBack}
          disabled={isRunning}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Back
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Step 4 of 5
          </div>
          
          <button
            onClick={handleStartEvaluation}
            disabled={isRunning || !canStartEvaluation}
            className="flex items-center px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRunning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Starting Evaluation...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Evaluation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};