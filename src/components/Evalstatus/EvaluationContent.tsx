// src/components/evaluation/EvaluationContent.tsx
'use client'

import React from 'react';
import { 
  Calendar,
  User,
  Zap,
  HardDrive,
  Thermometer,
  Cpu,
  Database,
  Eye
} from 'lucide-react';
import { EvaluationData } from '../../types/evaluation';
import { EvaluationMetricsChart } from './EvaluationMetricsChart';
import { ResourceUsageChart } from './ResourceUsageChart';
import { SystemStatusGrid } from './SystemStatusGrid';

interface EvaluationContentProps {
  evaluation: EvaluationData;
  onUpdate?: (data: Partial<EvaluationData>) => void;
}

export const EvaluationContent: React.FC<EvaluationContentProps> = ({
  evaluation,
  onUpdate
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-600';
      case 'completed': return 'bg-green-600';
      case 'failed': return 'bg-red-600';
      case 'pending': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 truncate">
              {evaluation.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
              {evaluation.description}
            </p>
          </div>
          <div className={`ml-4 px-4 py-2 rounded-lg text-white font-medium ${getStatusColor(evaluation.status)}`}>
            {evaluation.status.charAt(0).toUpperCase() + evaluation.status.slice(1)}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-auto bg-gray-50 dark:bg-gray-900">
        {/* Meta Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">MODEL</div>
            <div className="font-semibold text-gray-900 dark:text-white truncate">
              {evaluation.model}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-500 truncate">
              {evaluation.modelVersion}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">DATASET</div>
            <div className="font-semibold text-gray-900 dark:text-white truncate">
              {evaluation.dataset}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-500 truncate">
              {evaluation.datasetSize}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">TIMING</div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-900 dark:text-white">Created: {evaluation.created}</span>
            </div>
            <div className="flex items-center gap-2 text-sm mt-1">
              <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400 truncate">Owner: {evaluation.owner}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-400">Overall Progress</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {Math.round(evaluation.progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${evaluation.progress}%` }}
            />
          </div>
        </div>

        {/* Tags */}
        {evaluation.tags && evaluation.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {evaluation.tags.map((tag, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <EvaluationMetricsChart evaluation={evaluation} />
          <ResourceUsageChart evaluation={evaluation} />
        </div>

        {/* Current System Status */}
        <SystemStatusGrid systemStatus={evaluation.systemStatus} />
      </div>
    </div>
  );
};