import React from 'react';
import { Check, Database, Settings, BarChart3, Play, CheckCircle } from 'lucide-react';
import type { EvaluationMetadata } from '../../utils/evaluationUtils';

interface Step {
  id: number;
  name: string;
  key: string;
}

interface EvaluationStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
  metadata: EvaluationMetadata | null;
}

export const EvaluationStepper: React.FC<EvaluationStepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  metadata
}) => {
  const getStepIcon = (step: Step, isCurrentStep: boolean = false) => {
    const iconColor = isCurrentStep ? 'text-white' : 'text-gray-500 dark:text-gray-400';

    switch (step.key) {
      case 'dataset':
        return <Database className={`w-5 h-5 ${iconColor}`} />;
      case 'model':
        return <Settings className={`w-5 h-5 ${iconColor}`} />;
      case 'metrics':
        return <BarChart3 className={`w-5 h-5 ${iconColor}`} />;
      case 'review':
        return <Play className={`w-5 h-5 ${iconColor}`} />;
      case 'success':
        return <CheckCircle className={`w-5 h-5 ${iconColor}`} />;
      default:
        return <span className="text-sm font-medium">{step.id}</span>;
    }
  };

  const getStepStatus = (step: Step) => {
    if (step.id < currentStep) return 'completed';
    if (step.id === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepDescription = (step: Step) => {
    // Return empty string - no descriptions needed
    return '';
  };

  const canClickStep = (step: Step) => {
    // Can click on completed steps or current step
    return step.id <= currentStep;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(step);
          const isClickable = canClickStep(step);

          return (
            <React.Fragment key={step.id}>
              <div
                className={`flex flex-col items-center ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                onClick={() => isClickable && onStepClick(step.id)}
              >
                {/* Step Circle */}
                <div
                  className={`
                    flex items-center justify-center w-12 h-12 rounded-full text-sm font-medium transition-all duration-200
                    ${status === 'completed'
                      ? 'bg-green-600 text-white shadow-lg'
                      : status === 'current'
                        ? step.key === 'success'
                          ? 'bg-green-600 text-white shadow-lg ring-4 ring-green-600 ring-opacity-20'
                          : 'bg-indigo-600 text-white shadow-lg ring-4 ring-indigo-600 ring-opacity-20'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }
                    ${isClickable ? 'hover:shadow-md' : ''}
                  `}
                >
                  {(status === 'completed' || (status === 'current' && step.key === 'success')) ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    getStepIcon(step, status === 'current')
                  )}

                </div>

                {/* Step Label */}
                <div className="text-center mt-3 max-w-32">
                  <p
                    className={`
                      text-sm font-medium
                      ${status === 'current'
                        ? step.key === 'success'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-indigo-600 dark:text-indigo-400'
                        : status === 'completed'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }
                    `}
                  >
                    {step.name}
                  </p>

                  {/* Step Description - Hidden */}
                  <div className="text-center mt-3 max-w-32" style={{ display: 'none' }}>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {getStepDescription(step)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-4 mt-[-24px]">
                  <div
                    className={`
                      h-full transition-all duration-300
                      ${step.id < currentStep
                        ? 'bg-green-600'
                        : step.id === currentStep
                          ? step.key === 'success'
                            ? 'bg-green-600'
                            : 'bg-gradient-to-r from-indigo-600 to-gray-300 dark:to-gray-600'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }
                    `}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};