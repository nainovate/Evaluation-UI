// src/components/evaluation/EvaluationSidebar.tsx
'use client'

import React from 'react';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  Activity,
  RefreshCw,
  ChevronDown
} from 'lucide-react';
import { EvaluationData } from '../types/evaluation';

interface EvaluationSidebarProps {
  evaluation: EvaluationData;
  isLive: boolean;
  onToggleLive: () => void;
  onBack: () => void;
}

export const EvaluationSidebar: React.FC<EvaluationSidebarProps> = ({
  evaluation,
  isLive,
  onToggleLive,
  onBack
}) => {
  const getStageIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-white" />;
      case 'running':
        return <Activity className="w-4 h-4 text-white" />;
      default:
        return <Clock className="w-4 h-4 text-white" />;
    }
  };

  const getStageColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600';
      case 'running':
        return 'bg-blue-600';
      default:
        return 'bg-gray-400 dark:bg-gray-600';
    }
  };

  return (
    <div className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500' : 'bg-gray-500'}`}></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {isLive ? 'Live' : 'Paused'}
          </span>
          <button
            onClick={onToggleLive}
            className={`ml-auto p-1 rounded transition-colors ${
              isLive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-500'
            }`}
            title={isLive ? 'Pause live updates' : 'Enable live updates'}
          >
            <RefreshCw className={`w-4 h-4 ${isLive ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Evaluation Stages */}
      <div className="flex-1 p-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Evaluation Stages
        </h3>
        
        <div className="space-y-6">
          {evaluation.stages.map((stage, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getStageColor(stage.status)}`}>
                {getStageIcon(stage.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 dark:text-white mb-1 truncate">
                  {stage.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {stage.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evaluation Logs Section */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full flex items-center justify-between mb-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Evaluation Logs
          </span>
          <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-500" />
        </button>
        
        <div className="text-xs text-gray-500 dark:text-gray-500">
          Real-time evaluation progress and system logs
        </div>
      </div>
    </div>
  );
};