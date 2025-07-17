import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ProgressStepperProps {
  currentStep: number;
  steps: string[];
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({
  currentStep,
  steps
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 py-6 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-center space-x-4 overflow-x-auto pb-0">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                index + 1 === currentStep
                  ? 'bg-indigo-600 text-white'
                  : index + 1 < currentStep
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                {index + 1 < currentStep ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span className={`ml-2 text-sm font-medium whitespace-nowrap transition-colors ${
                index + 1 === currentStep
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : index + 1 < currentStep
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {step}
              </span>
              {index < steps.length - 1 && (
                <ChevronRight className="ml-4 h-4 w-4 text-gray-400 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};