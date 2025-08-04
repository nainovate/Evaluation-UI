import React from 'react';
import { Server, CheckCircle, Activity, Clock, Globe } from 'lucide-react';
import type { Deployment } from '../../types';

interface DeploymentSummaryPanelProps {
  selectedDeployments: Deployment[]; // CHANGED: Multiple deployments
}

export default function DeploymentSummaryPanel({ selectedDeployments }: DeploymentSummaryPanelProps) {
  if (selectedDeployments.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center py-8">
          <Server className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Inferences Selected
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select one or more inferences to see their details here.
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Selected Inferences ({selectedDeployments.length})
        </h3>
      </div>

      <div className="space-y-6">
        {selectedDeployments.map((deployment, index) => (
          <div 
            key={deployment.id}
            className={`${index !== selectedDeployments.length - 1 ? 'border-b border-gray-200 dark:border-gray-600 pb-6' : ''}`}
          >
            {/* Deployment Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {deployment.name}
                </h4>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    deployment.status === 'active'
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                      : deployment.status === 'inactive'
                      ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                      : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                  }`}>
                    {deployment.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Model Details */}
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-500 dark:text-gray-400">Model</span>
                <span className="text-xs font-medium text-gray-900 dark:text-white text-right max-w-[120px] break-words">
                  {deployment.model}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">Provider</span>
                <span className="text-xs font-medium text-gray-900 dark:text-white">
                  {deployment.provider}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">Region</span>
                <span className="text-xs font-medium text-gray-900 dark:text-white">
                  {deployment.region}
                </span>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{deployment.responseTime}ms</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-500 dark:text-gray-400">
                    <Activity className="w-3 h-3" />
                    <span>{deployment.uptime}%</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-500 dark:text-gray-400">
                    <Globe className="w-3 h-3" />
                    <span>{formatDate(deployment.lastUpdated)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}