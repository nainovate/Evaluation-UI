import React from 'react';
import { Settings } from 'lucide-react';

interface ConfigurationSettingsProps {
  evaluationModel: string;
  batchSize: number;
  timeout: number;
  onEvaluationModelChange: (model: string) => void;
  onBatchSizeChange: (size: number) => void;
  onTimeoutChange: (timeout: number) => void;
}

export const ConfigurationSettings: React.FC<ConfigurationSettingsProps> = ({
  evaluationModel,
  batchSize,
  timeout,
  onEvaluationModelChange,
  onBatchSizeChange,
  onTimeoutChange
}) => {
  const evaluationModels = [
    { value: 'gpt-4', label: 'GPT-4 (Recommended)', description: 'Most accurate evaluations' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', description: 'Faster, cost-effective' },
    { value: 'claude-3-opus', label: 'Claude-3 Opus', description: 'High-quality reasoning' },
    { value: 'claude-3-sonnet', label: 'Claude-3 Sonnet', description: 'Balanced performance' }
  ];

  const batchSizes = [
    { value: 10, label: '10', description: 'Fastest processing' },
    { value: 25, label: '25', description: 'Good balance' },
    { value: 50, label: '50', description: 'Standard batch size' },
    { value: 100, label: '100', description: 'Largest batch size' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
        <Settings className="w-5 h-5 mr-2" />
        Evaluation Configuration
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Evaluation Model */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Evaluation Model
          </label>
          <select
            value={evaluationModel}
            onChange={(e) => onEvaluationModelChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {evaluationModels.map((model) => (
              <option key={model.value} value={model.value}>
                {model.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {evaluationModels.find(m => m.value === evaluationModel)?.description}
          </p>
        </div>
        
        {/* Batch Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Batch Size
          </label>
          <select
            value={batchSize}
            onChange={(e) => onBatchSizeChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {batchSizes.map((size) => (
              <option key={size.value} value={size.value}>
                {size.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {batchSizes.find(s => s.value === batchSize)?.description}
          </p>
        </div>
        
        {/* Timeout */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Timeout (seconds)
          </label>
          <input
            type="number"
            value={timeout}
            onChange={(e) => onTimeoutChange(Number(e.target.value))}
            min="5"
            max="300"
            step="5"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Maximum time to wait for each evaluation
          </p>
        </div>
      </div>

      {/* Advanced Configuration Hint */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Configuration Tips
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Higher batch sizes process more evaluations simultaneously but use more resources. 
              Lower timeout values fail faster but may miss slower evaluations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};