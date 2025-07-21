// src/app/evaluation/start/page.tsx - Updated to use clean config

'use client'

import React, { useState, useEffect } from 'react';
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
import type { EvaluationMetadata } from '../../../utils/evaluationUtils';

// Import flow utilities
import { 
  getSteps, 
  getNextStepId, 
  getPreviousStepId, 
  getStepComponent,
  getTotalSteps,
  FlowNavigator
} from '../../../utils/flowGenerator';

// Import step components
import { EvaluationStepper } from '../../../components/evaluation-flow/EvaluationStepper';
import { DatasetSelectionStep } from '../../../components/evaluation-flow/DatasetSelectionStep';
import { ModelSelectionStep } from '../../../components/evaluation-flow/ModelSelectionStep';
import { MetricsConfigurationStep } from '../../../components/evaluation-flow/MetricsConfigurationStep';
import { ReviewAndRunStep } from '../../../components/evaluation-flow/ReviewAndRunStep';
import { Success } from '../../../components/evaluation-flow/success';

// 🔹 COMPONENT MAPPING
const STEP_COMPONENTS = {
  'DatasetSelectionStep': DatasetSelectionStep,
  'ModelSelectionStep': ModelSelectionStep,
  'MetricsConfigurationStep': MetricsConfigurationStep,
  'ReviewAndRunStep': ReviewAndRunStep,
  'Success': Success
};

export default function EvaluationStartPage() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  
  // 🔸 STATE MANAGEMENT
  const [currentStep, setCurrentStep] = useState(1);
  const [metadata, setMetadata] = useState<EvaluationMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [flowNavigator] = useState(() => new FlowNavigator());

  // 🔸 LOAD EVALUATION METADATA
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Initialize fresh metadata
        const freshMetadata: EvaluationMetadata = {
          id: `eval_${Date.now()}`,
          name: '',
          description: '',
          status: 'created',
          createdAt: new Date().toISOString(),
          dataset: null,
          deployment: null,
          metrics: {
            categories: [],
            selectedCategory: null,
            totalSelected: 0,
            configuration: null,
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

  // 🔸 HANDLE STEP COMPLETION
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
            results: null
          };
          showSuccess('Metrics configuration saved successfully');
          break;
          
        case 'review':
          updatedMetadata.name = data.name;
          updatedMetadata.description = data.description;
          updatedMetadata.status = 'running';
          showSuccess('Evaluation started successfully');
          break;
      }
      
      setMetadata(updatedMetadata);
      
      // Move to next step using flow navigator
      const nextStepId = flowNavigator.getNextStepId(currentStep);
      if (nextStepId) {
        setCurrentStep(nextStepId);
      }
      
    } catch (err) {
      console.error('Error completing step:', err);
      showError('Failed to complete step');
    } finally {
      setLoading(false);
    }
  };

  // 🔸 HANDLE STEP NAVIGATION
  const handleStepClick = (stepId: number) => {
    // Allow navigation to previous steps or current step
    if (stepId <= currentStep) {
      setCurrentStep(stepId);
    }
  };

  const handleBack = () => {
    const prevStepId = flowNavigator.getPreviousStepId(currentStep);
    if (prevStepId) {
      setCurrentStep(prevStepId);
    }
  };

  // 🔸 RENDER CURRENT STEP
  const renderCurrentStep = () => {
    if (!metadata) return null;
    
    const currentStepConfig = flowNavigator.getStepById(currentStep);
    if (!currentStepConfig) return null;
    
    const StepComponent = STEP_COMPONENTS[currentStepConfig.component];
    if (!StepComponent) {
      console.error(`Component not found: ${currentStepConfig.component}`);
      return <div>Component not found: {currentStepConfig.component}</div>;
    }
    
    // Determine if step can proceed
    const canProceed = getCanProceed(currentStepConfig.key);
    
    return (
      <StepComponent
        metadata={metadata}
        onComplete={(data: any) => handleStepComplete(currentStepConfig.key, data)}
        onBack={handleBack}
        canProceed={canProceed}
        currentStep={currentStep}
        totalSteps={flowNavigator.getTotalSteps()}
      />
    );
  };

  // 🔸 DETERMINE IF STEP CAN PROCEED
  const getCanProceed = (stepKey: string): boolean => {
    if (!metadata) return false;
    
    switch (stepKey) {
      case 'dataset':
        return !!metadata.dataset?.id;
      case 'model':
        return !!metadata.deployment?.id;
      case 'metrics':
        return !!metadata.metrics?.configuration;
      case 'review':
        return !!(metadata.dataset && metadata.deployment && metadata.metrics?.configuration);
      case 'success':
        return true;
      default:
        return false;
    }
  };

  // 🔸 LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading evaluation...</p>
        </div>
      </div>
    );
  }

  // 🔸 ERROR STATE
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Theme Toggle - positioned absolutely */}
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        {/* Progress Stepper */}
        <div className="mb-8">
          <EvaluationStepper
            steps={flowNavigator.getSteps()}
            currentStep={currentStep}
            onStepClick={handleStepClick}
            metadata={metadata}
          />
        </div>

        {/* Step Content */}
        {renderCurrentStep()}
      </main>

      {/* Toast Notifications */}
      <ToastContainer toasts={[]} removeToast={function (id: string): void {
        throw new Error('Function not implemented.');
      } } />
    </div>
  );
}