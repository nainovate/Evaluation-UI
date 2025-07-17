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
  const [showAddModal, setShowAddModal] = useState(false);

  const {
    deployments,
    providers,
    selectedDeployment,
    loading,
    error,
    handleDeploymentSelect,
    getFilteredDeployments,
  } = useEvaluationModelManagement();

  const filteredDeployments = getFilteredDeployments(searchTerm, selectedProvider, selectedStatus);

  const handleNext = async () => {
    if (selectedDeployment) {
      onComplete({
        id: selectedDeployment.id,
        name: selectedDeployment.name,
        model: selectedDeployment.model,
        provider: selectedDeployment.provider
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Choose Model Deployment
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select a model deployment to evaluate against your dataset
        </p>
      </div>


      {/* Main Content - Restored to original grid */}
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
                onAddDeployment={() => setShowAddModal(true)}
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
                  selectedDeployment={selectedDeployment}
                  onDeploymentSelect={handleDeploymentSelect}
                  showWarning={() => {}}
                  showSuccess={() => {}}
                  showError={() => {}}
                />
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Fixed sticky positioning like dataset guide */}
        <div className="lg:col-span-1">
          <div className="hidden lg:block fixed top-32 w-80 max-h-[calc(100vh-10rem)] overflow-y-auto z-30" style={{ left: 'calc(75% + 1rem)' }}>
            <DeploymentSummaryPanel selectedDeployment={selectedDeployment} />
          </div>
          {/* Mobile/tablet version - normal flow */}
          <div className="lg:hidden">
            <DeploymentSummaryPanel selectedDeployment={selectedDeployment} />
          </div>
        </div>
      </div>

      {/* Navigation with proper spacing */}
      <div className="lg:mr-80 xl:mr-96">
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onBack}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            Back to Dataset Selection
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Step 2 of 5
            </div>
            
            <button
              onClick={handleNext}
              disabled={!selectedDeployment}
              className="flex items-center px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next: Configure Metrics
            </button>
          </div>
        </div>
      </div>

      {/* Add Deployment Modal */}
      {showAddModal && (
        <AddDeploymentModal
          onClose={() => setShowAddModal(false)}
          onAdd={(deployment) => {
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
};