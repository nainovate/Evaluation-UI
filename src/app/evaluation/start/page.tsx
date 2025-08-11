// src/app/evaluation/start/page.tsx - Complete page with auth integration

'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '../../../components/ThemeToggle';
import { ToastContainer } from '../../../components/common/ToastNotification';

// ✅ Auth imports
import { PrivateRoute } from '../../../components/auth/PrivateRoute';
import { useAuth } from '../../../components/providers/AuthProvider';

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

// ✅ Import the persistent state hook
import { usePersistedEvaluationState } from '../../../hooks/usePersistedEvaluationState';

// 🔹 COMPONENT MAPPING
const STEP_COMPONENTS = {
  'DatasetSelectionStep': DatasetSelectionStep,
  'ModelSelectionStep': ModelSelectionStep,
  'MetricsConfigurationStep': MetricsConfigurationStep,
  'ReviewAndRunStep': ReviewAndRunStep,
  'Success': Success
};

// ✅ Main content component (all your existing logic)
function EvaluationStartPageContent() {
  const router = useRouter();
  
  // ✅ Optional: Access user data
  const { user } = useAuth();
  
  // ----- Toast notifications state -----
  const [toasts, setToasts] = useState([]);
  const addToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  // ----- End toast notifications state -----

  // ----- ✅ Your persistent state management -----
  const {
    currentStep,
    setCurrentStep,
    metadata,
    setMetadata,
    clearPersistedState,
    markEvaluationCompleted,
    isHydrated
  } = usePersistedEvaluationState();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flowNavigator] = useState(() => new FlowNavigator());

  // ✅ Your initialization logic
  useEffect(() => {
    // Wait for the persistent hook to be hydrated and attempt to load data
    if (!isHydrated) {
      console.log('🔍 MAIN PAGE: Waiting for hydration...');
      return;
    }

    // Only initialize if metadata is still null after hydration
    if (!metadata) {
      console.log('🔍 MAIN PAGE: No persisted data found, initializing fresh metadata');
      const freshMetadata: EvaluationMetadata = {
        id: `eval_${Date.now()}`,
        name: '',
        description: '',
        status: 'created',
        createdAt: new Date().toISOString(),
        dataset: {
          uid: null,
          id: null,
          name: null,
          selectedAt: null,
          taskType: null,
          rows: null,
          columns: null
        },
        deployment: undefined,
        metrics: {
          categories: [],
          selectedCategory: null,
          totalSelected: 0,
          configuration: null,
          results: null
        }
      };
      setMetadata(freshMetadata);
    } else {
      console.log('🔍 MAIN PAGE: Using persisted metadata with dataset:', metadata.dataset?.name);
    }
  }, [metadata, setMetadata, isHydrated]);

  // 🔸 HANDLE STEP COMPLETION
  const handleStepComplete = async (stepKey: string, data: any) => {
    try {
      setLoading(true);
      
      // Update metadata with step data
      const updatedMetadata = { ...metadata, [stepKey]: data } as EvaluationMetadata;
      
      if (stepKey === 'model') {
        // Store both single deployment (legacy) and multiple deployments (new)
        const firstDeployment = data.deployments?.[0];
        
        updatedMetadata.deployment = firstDeployment
          ? {
              id: firstDeployment.id,
              name: firstDeployment.name,
              model: firstDeployment.model || firstDeployment.name,
              provider: firstDeployment.provider || 'Unknown',
              selectedAt: new Date().toISOString()
            }
          : null;
        
        updatedMetadata.deployments = data.deployments?.map(d => ({
          id: d.id,
          name: d.name,
          model: d.model || d.name,
          provider: d.provider || 'Unknown',
          selectedAt: new Date().toISOString()
        })) || [];
        
        addToast('Model deployment selected successfully', 'success');
      }
      
      setMetadata(updatedMetadata);
      
      // Move to next step
      const nextStepId = flowNavigator.getNextStepId(currentStep);
      if (nextStepId) {
        setCurrentStep(nextStepId);
      }
      
    } catch (err) {
      console.error('Error completing step:', err);
      addToast('Failed to complete step', 'error');
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
    console.log('🔍 MAIN PAGE RENDER DEBUG:');
    console.log('  - currentStep:', currentStep);
    console.log('  - metadata:', metadata);
    console.log('  - metadata?.dataset:', metadata?.dataset);
    
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
      {/* Optional: User info display */}
      {user && (
        <div className="fixed top-4 left-4 z-20 bg-white dark:bg-gray-800 px-3 py-1 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Logged in as <span className="font-medium text-gray-900 dark:text-gray-200">{user.userName}</span>
          </div>
        </div>
      )}

      {/* Fixed header for the EvaluationStepper */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-gray-50 dark:bg-gray-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EvaluationStepper
            steps={flowNavigator.getSteps()}
            currentStep={currentStep}
            onStepClick={handleStepClick}
            metadata={metadata}
          />
        </div>
      </header>

      {/* Main Content with top padding to offset fixed header */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 py-8">
        {/* Theme Toggle */}
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        {/* Step Content */}
        {renderCurrentStep()}
      </main>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

// ✅ Main export with PrivateRoute protection
export default function EvaluationStartPage() {
  return (
    <PrivateRoute>
      <EvaluationStartPageContent />
    </PrivateRoute>
  );
}