import React from 'react';
import { Server, Activity, Clock, Globe, AlertCircle } from 'lucide-react';
import type { Deployment } from '../../types';

interface DeploymentSummaryPanelProps {
  selectedDeployment: Deployment | null;
}

export default function DeploymentSummaryPanel({ selectedDeployment }: DeploymentSummaryPanelProps) {
  if (!selectedDeployment) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center">
          <Server className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Deployment Selected
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Choose a deployment to see detailed information and performance metrics.
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 dark:text-green-400';
      case 'inactive':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Selected Deployment
        </h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Basic Info */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            {selectedDeployment.name}
          </h4>
          <span className={`text-sm font-medium capitalize ${getStatusColor(selectedDeployment.status)}`}>
            {selectedDeployment.status}
          </span>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Description
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {selectedDeployment.description}
          </p>
        </div>

        {/* Model Details */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Model Information
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-500 dark:text-gray-400">Model</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white text-right max-w-[180px] break-words">
                {selectedDeployment.model}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Provider</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {selectedDeployment.provider}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Version</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {selectedDeployment.version || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Region</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {selectedDeployment.region}
              </span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Performance Metrics
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Response Time</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {selectedDeployment.responseTime}ms
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Uptime</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {selectedDeployment.uptime}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Last Updated</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white text-right">
                {formatDate(selectedDeployment.lastUpdated)}
              </span>
            </div>
          </div>
        </div>

        {/* Endpoint */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Endpoint
          </h4>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <code className="text-xs text-gray-800 dark:text-gray-200 break-all">
              {selectedDeployment.endpoint}
            </code>
          </div>
        </div>

        {/* Status Warnings */}
        {selectedDeployment.status === 'inactive' && (
          <div className="flex items-start space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Deployment Inactive
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                This deployment is currently inactive but can still be used for evaluation.
              </p>
            </div>
          </div>
        )}

        {selectedDeployment.status === 'error' && (
          <div className="flex items-start space-x-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Connection Issues
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                This deployment is experiencing connection issues and cannot be selected.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}