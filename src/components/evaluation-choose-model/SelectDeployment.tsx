import React from 'react';
import { Server, AlertCircle, Activity, Clock, Globe, Check } from 'lucide-react';
import type { Deployment } from '../../types';

interface SelectDeploymentProps {
  deployments: Deployment[];
  selectedDeployments: Deployment[];
  onDeploymentSelect: (deployment: Deployment) => void;
  onDeploymentDeselect: (deployment: Deployment) => void;
  showWarning: (message: string) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

export default function SelectDeployment({
  deployments,
  selectedDeployments,
  onDeploymentSelect,
  onDeploymentDeselect,
  showWarning,
  showSuccess,
  showError
}: SelectDeploymentProps) {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <div className="w-5 h-5 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'inactive':
        return (
          <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
            ⏸
          </div>
        );
      case 'error':
        return (
          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
            !
          </div>
        );
      default:
        return <Server className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300`;
      case 'inactive':
        return `${baseClasses} bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300`;
      case 'error':
        return `${baseClasses} bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300`;
      default:
        return `${baseClasses} bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300`;
    }
  };

  const handleDeploymentClick = (deployment: Deployment) => {
    if (deployment.status === 'error') {
      showError('This deployment is currently unavailable due to connection issues');
      return;
    }

    if (deployment.status === 'inactive') {
      showWarning('This deployment is currently inactive. You can still select it for evaluation.');
    }

    const isSelected = selectedDeployments.some(d => d.id === deployment.id);
    
    if (isSelected) {
      onDeploymentDeselect(deployment);
      showSuccess(`Removed deployment: ${deployment.name}`);
    } else {
      onDeploymentSelect(deployment);
      showSuccess(`Added deployment: ${deployment.name}`);
    }
  };

  const isDeploymentSelected = (deployment: Deployment) => {
    return selectedDeployments.some(d => d.id === deployment.id);
  };

  if (deployments.length === 0) {
    return (
      <div className="text-center py-12">
        <Server className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No deployments found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          No deployments match your current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Selection Summary */}
      {selectedDeployments.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                {selectedDeployments.length} Inference{selectedDeployments.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              Click on inferences to add/remove them
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deployments.map((deployment) => {
          const isSelected = isDeploymentSelected(deployment);
          
          return (
            <div
              key={deployment.id}
              className={`border rounded-lg p-6 transition-all cursor-pointer ${
                deployment.status === 'error'
                  ? 'opacity-60 cursor-not-allowed border-gray-200 dark:border-gray-600'
                  : isSelected
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-lg'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md'
              }`}
              onClick={() => handleDeploymentClick(deployment)}
            >
              {/* REMOVED: Selection Indicator (blue checkmark) */}

              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(deployment.status)}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        {deployment.name}
                      </h4>
                      <span className={getStatusBadge(deployment.status)}>
                        {deployment.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {deployment.description}
                </p>
                
                {/* Model Info */}
                <div className="space-y-2">
                  <div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block">Model</span>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">{deployment.model}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block">Provider</span>
                      <span className="text-sm text-gray-900 dark:text-white">{deployment.provider}</span>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block">Region</span>
                      <span className="text-sm text-gray-900 dark:text-white">{deployment.region}</span>
                    </div>
                  </div>
                </div>
                
                {/* Performance Metrics */}
                <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{deployment.responseTime}ms</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Activity className="w-3 h-3" />
                      <span>{deployment.uptime}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Globe className="w-3 h-3" />
                      <span>{formatDate(deployment.lastUpdated)}</span>
                    </div>
                  </div>
                </div>

                {/* Error Status */}
                {deployment.status === 'error' && (
                  <div className="text-center">
                    <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                      Unavailable - Connection Issues
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}