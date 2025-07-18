'use client'

import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '../../../components/ThemeToggle';
import { useToast } from '../../../hooks/useToast';
import { ToastContainer } from '../../../components/common/ToastNotification';
import { 
  loadEvaluationMetadata, 
  updateEvaluationMetadata,
  validateMetricsConfiguration,
  getMetricsSummary 
} from '../../../utils/evaluationUtils';
import type { EvaluationMetadata, MetricCategory, Deployment, EvaluationDataset } from '../../../utils/evaluationUtils';

// Import step components
import { EvaluationStepper } from '../../../components/evaluation-flow/EvaluationStepper';
import { DatasetSelectionStep } from '../../../components/evaluation-flow/DatasetSelectionStep';
import { ModelSelectionStep } from '../../../components/evaluation-flow/ModelSelectionStep';
import { MetricsConfigurationStep } from '../../../components/evaluation-flow/MetricsConfigurationStep';
import { ReviewAndRunStep } from '../../../components/evaluation-flow/ReviewAndRunStep';
import { Success } from '../../../components/evaluation-flow/success';

import { STEPS } from '../../../utils/config';

export default function EvaluationFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [metadata, setMetadata] = useState<EvaluationMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [evaluationData, setEvaluationData] = useState<any>(null);
  const { toasts, removeToast, showSuccess, showError, showWarning } = useToast();

  // Load metadata on component mount
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        setLoading(true);
        // Always start with fresh metadata - no persistence
        const freshMetadata = {
          evaluationSession: {
            id: null,
            createdAt: null,
            lastModified: null,
            status: 'not_started'
          },
          dataset: {
            uid: null,
            id: null,
            name: null,
            selectedAt: null,
            taskType: null,
            rows: null,
            columns: null
          },
          deployment: {
            id: null,
            name: null,
            model: null,
            provider: null,
            selectedAt: null
          },
          metrics: {
            categories: [],
            selectedCategory: null,
            totalSelected: 0,
            configuration: {
              evaluationModel: 'gpt-4',
              batchSize: 50,
              timeout: 30
            },
            configuredAt: null
          },
          execution: {
            startedAt: null,
            completedAt: null,
            status: null,
            results: null
          }
        };
        
        setMetadata(freshMetadata);
        setCurrentStep(1); // Always start from step 1
      } catch (err) {
        console.error('Error initializing evaluation:', err);
        setError('Failed to initialize evaluation');
      } finally {
        setLoading(false);
      }
    };

    loadMetadata();
  }, []);

  const handleStepComplete = async (stepKey: string, data: any) => {
    try {
      setLoading(true);
      
      // Update metadata in memory only - no persistence
      const updatedMetadata = { ...metadata };
      
      switch (stepKey) {
        case 'dataset':
          updatedMetadata.dataset = {
            uid: data.uid,
            id: data.id,
            name: data.name,
            selectedAt: new Date().toISOString(),
            taskType: data.taskType,
            rows: data.rows,
            columns: data.columns
          };
          showSuccess('Dataset selected successfully');
          break;
          
        case 'model':
          updatedMetadata.deployment = {
            id: data.id,
            name: data.name,
            model: data.model,
            provider: data.provider,
            selectedAt: new Date().toISOString()
          };
          showSuccess('Model deployment selected successfully');
          break;
          
        case 'metrics':
          updatedMetadata.metrics = {
            categories: data.categories,
            selectedCategory: data.selectedCategory,
            totalSelected: data.totalSelected,
            configuration: data.configuration,
            configuredAt: new Date().toISOString()
          };
          showSuccess(`Metrics configured with ${data.totalSelected} metrics selected`);
          break;
          
        case 'review':
          updatedMetadata.execution = {
            startedAt: new Date().toISOString(),
            status: 'running',
            completedAt: null,
            results: null
          };
          
          // Store evaluation data for success screen
          setEvaluationData({
            evaluationName: data.evaluationName,
            evaluationDescription: data.evaluationDescription,
            startedAt: data.startedAt,
            status: data.status
          });
          
          showSuccess('Evaluation started successfully');
          break;
      }
      
      // Update metadata in memory only
      setMetadata(updatedMetadata);
      
      // Move to next step
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
      }
    } catch (err) {
      console.error('Error updating step:', err);
      showError('Failed to save step data');
    } finally {
      setLoading(false);
    }
  };

  const handleStepBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    // Only allow clicking on completed steps or current step
    if (stepId <= currentStep) {
      setCurrentStep(stepId);
    }
  };

  const canProceedToStep = (stepId: number): boolean => {
    if (!metadata) return false;
    
    switch (stepId) {
      case 1:
        return true;
      case 2:
        return !!metadata.dataset?.selectedAt;
      case 3:
        return !!metadata.deployment?.selectedAt;
      case 4:
        return !!metadata.metrics?.configuredAt;
      case 5:
        return !!metadata.execution?.startedAt;
      default:
        return false;
    }
  };

  const handleViewProgress = () => {
    // Navigate to progress dashboard
    try {
      router.push('/dashboard/evaluations/progress');
    } catch (error) {
      // Fallback or alternative action
      console.log('Navigating to evaluation progress dashboard...');
    }
  };

  const handleReturnHome = () => {
    // Navigate to dashboard using Next.js router
    try {
      router.push('/dashboard');
    } catch (error) {
      // Fallback to window.location if router fails
      window.location.href = '/dashboard';
    }
  };

  const renderCurrentStep = () => {
    if (!metadata) return null;
    
    switch (currentStep) {
      case 1:
        return (
          <DatasetSelectionStep
            metadata={metadata}
            onComplete={(data) => handleStepComplete('dataset', data)}
            onBack={handleStepBack}
            canProceed={canProceedToStep(2)}
          />
        );
        
      case 2:
        return (
          <ModelSelectionStep
            metadata={metadata}
            onComplete={(data) => handleStepComplete('model', data)}
            onBack={handleStepBack}
            canProceed={canProceedToStep(3)}
          />
        );
        
      case 3:
        return (
          <MetricsConfigurationStep
            metadata={metadata}
            onComplete={(data) => handleStepComplete('metrics', data)}
            onBack={handleStepBack}
            canProceed={canProceedToStep(4)}
          />
        );
        
      case 4:
        return (
          <ReviewAndRunStep
            metadata={metadata}
            onComplete={(data) => handleStepComplete('review', data)}
            onBack={handleStepBack}
            canProceed={canProceedToStep(5)}
          />
        );
        
      case 5:
        return (
          <Success
            evaluationName={evaluationData?.evaluationName || 'New Evaluation'}
            evaluationDescription={evaluationData?.evaluationDescription || ''}
            metadata={metadata}
            onViewProgress={handleViewProgress}
            onReturnHome={handleReturnHome}
          />
        );
        
      default:
        return null;
    }
  };

  if (loading && !metadata) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading evaluation flow...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.76 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-lg font-semibold">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Fixed Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Fixed Stepper Header - Adjusted height */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <EvaluationStepper
            steps={STEPS}
            currentStep={currentStep}
            onStepClick={handleStepClick}
            metadata={metadata}
          />
        </div>
      </div>

      {/* Step Content with increased top padding */}
      <div className="pt-28 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {renderCurrentStep()}
        </div>
      </div>

      <ToastContainer
        toasts={toasts}
        removeToast={removeToast}
      />
    </div>
  );
}