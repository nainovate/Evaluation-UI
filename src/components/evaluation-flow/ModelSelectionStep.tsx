import React, { useState } from 'react';
import {
  SelectDeployment,
  DeploymentFilters,
  DeploymentSummaryPanel,
  AddDeploymentModal
} from '../evaluation-choose-model';
import { useEvaluationModelManagement } from '../../hooks';
import type { EvaluationMetadata } from '../../utils/evaluationUtils';

interface ModelSelectionStepProps {
  metadata: EvaluationMetadata;
  onComplete: (data: any) => void;
  onBack: () => void;
  canProceed: boolean;
}

export const ModelSelectionStep: React.FC<ModelSelectionStepProps> = ({
  metadata,
  onComplete,
  onBack,
  canProceed
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('All Providers');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  // REMOVED: const [showAddModal, setShowAddModal] = useState(false);

  const {
    deployments,
    providers,
    selectedDeployments,
    loading,
    error,
    handleDeploymentSelect,
    handleDeploymentDeselect,
    getFilteredDeployments,
  } = useEvaluationModelManagement();

  const filteredDeployments = getFilteredDeployments(searchTerm, selectedProvider, selectedStatus);

  const handleNext = async () => {
    if (selectedDeployments.length > 0) {
      onComplete({
        deployments: selectedDeployments.map(deployment => ({
          id: deployment.id,
          name: deployment.name,
          model: deployment.model,
          provider: deployment.provider
        }))
      });
    }
  };

  // UPDATED: Disabled Add Deployment handler
  const handleAddDeployment = () => {
    // TODO: Navigate to add deployment page later
    console.log('Add Deployment functionality will be integrated later');
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Choose Model Deployments
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select one or more model deployments to evaluate against your dataset
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            {/* Filters */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <DeploymentFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedProvider={selectedProvider}
                onProviderChange={setSelectedProvider}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                providers={providers}
                onAddDeployment={handleAddDeployment} // UPDATED: Uses disabled handler
              />
            </div>

            {/* Deployment Grid */}
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              ) : (
                <SelectDeployment
                  deployments={filteredDeployments}
                  selectedDeployments={selectedDeployments}
                  onDeploymentSelect={handleDeploymentSelect}
                  onDeploymentDeselect={handleDeploymentDeselect}
                  showWarning={(msg) => console.warn(msg)}
                  showSuccess={(msg) => console.log(msg)}
                  showError={(msg) => console.error(msg)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Summary Panel */}
        <div className="lg:col-span-1">
          <DeploymentSummaryPanel selectedDeployments={selectedDeployments} />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onBack}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Step 2 of 5
          </div>
          
          <button
            onClick={handleNext}
            disabled={selectedDeployments.length === 0}
            className="flex items-center px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next: Configure Metrics
          </button>
        </div>
      </div>

      {/* REMOVED: Add Deployment Modal */}
    </div>
  );
};