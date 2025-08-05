import React, { useEffect } from 'react';
import {
  MetricsSelection,
  ConfigurationSettings,
  EvaluationTips
} from '../evaluation-configure-metrics';
import { useEvaluationMetricsManagement } from '../../hooks';
import type { EvaluationMetadata } from '../../utils/evaluationUtils';

interface MetricsConfigurationStepProps {
  metadata: EvaluationMetadata;
  onComplete: (data: any) => void;
  onBack: () => void;
  canProceed: boolean;
}

export const MetricsConfigurationStep: React.FC<MetricsConfigurationStepProps> = ({
  metadata,
  onComplete,
  onBack,
  canProceed
}) => {
  const {
    metricCategories,
    selectedMetrics,
    setSelectedMetrics, // NEW: added setter for selectedMetrics
    evaluationModel,
    batchSize,
    timeout,
    loading,
    error,
    handleCategoryToggle,
    handleSubMetricToggle,
    handleEvaluationModelChange,
    handleBatchSizeChange,
    handleTimeoutChange,
    getTotalSelectedMetrics,
    restoreFromMetadata,
    getSelectedCategory,
    saveConfiguration
  } = useEvaluationMetricsManagement();

 

useEffect(() => {
  console.log('🔍 METRICS COMPONENT INITIALIZATION DEBUG:');
  console.log('  - loading:', loading);
  console.log('  - metricCategories.length:', metricCategories.length);
  console.log('  - metadata?.metrics:', metadata?.metrics);
  console.log('  - selectedMetrics.length:', selectedMetrics.length);
  console.log('  - metricCategories:', metricCategories);
  console.log('  - metricCategories.length:', metricCategories.length);
  console.log('  - selectedMetrics.length:', selectedMetrics.length);
  console.log('  - error:', error);
  console.log('  - metadata?.metrics:', metadata?.metrics);

  // Wait for metrics to be loaded
  if (loading) {
    console.log('  → Metrics still loading, waiting...');
    return;
  }

  // Initialize from persisted metadata when metrics are ready
  if (metadata?.metrics && metricCategories.length > 0 && selectedMetrics.length === 0) {
    console.log('  → Calling restoreFromMetadata');
    restoreFromMetadata(metadata.metrics);
  }
}, [metadata?.metrics, metricCategories, selectedMetrics, loading, restoreFromMetadata]);
  const handleNext = async () => {
    const selectedCategory = getSelectedCategory();
    const totalMetrics = getTotalSelectedMetrics();
    
    if (!selectedCategory || totalMetrics === 0) {
      return;
    }

    try {
      await saveConfiguration();
      onComplete({
        categories: metricCategories,
        selectedCategory: selectedCategory.id,
        totalSelected: totalMetrics,
        configuration: {
          evaluationModel,
          batchSize,
          timeout
        }
      });
    } catch (error) {
      console.error('Configuration save error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Configure Evaluation Metrics
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose the metrics and configuration settings for your model evaluation
        </p>
      </div>

      {/* Previous Steps Summary */}
      

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.76 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-red-800 dark:text-red-200">{error}</span>
          </div>
        </div>
      )}

      {/* Main Content - Restored to original grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          {/* Metrics Selection */}
          <MetricsSelection
            metricCategories={metricCategories}
            onCategoryToggle={handleCategoryToggle}
            onSubMetricToggle={handleSubMetricToggle}
            loading={loading}
          />

          {/* Configuration Settings */}
          <ConfigurationSettings
            evaluationModel={evaluationModel}
            batchSize={batchSize}
            timeout={timeout}
            onEvaluationModelChange={handleEvaluationModelChange}
            onBatchSizeChange={handleBatchSizeChange}
            onTimeoutChange={handleTimeoutChange}
          />
        </div>

        {/* Sidebar - Fixed sticky positioning like dataset guide */}
        <div className="lg:col-span-1">
          <div className="hidden lg:block fixed top-32 w-80 max-h-[calc(100vh-10rem)] overflow-y-auto z-30" style={{ left: 'calc(75% + 1rem)' }}>
            <EvaluationTips />
          </div>
          {/* Mobile/tablet version - normal flow */}
          <div className="lg:hidden">
            <EvaluationTips />
          </div>
        </div>
      </div>

      {/* Navigation with proper spacing */}
      <div className="lg:mr-80 xl:mr-96">
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onBack}
            disabled={loading}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Back 
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Step 3 of 5
            </div>
            
            <button
              onClick={handleNext}
              disabled={getTotalSelectedMetrics() === 0 || !getSelectedCategory() || loading}
              className="flex items-center px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};