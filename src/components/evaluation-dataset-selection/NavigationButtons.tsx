import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationButtonsProps {
  onBack: () => void;
  onNext: () => void;
  canProceed: boolean;
  nextLabel?: string;
  backLabel?: string;
  isLoading?: boolean;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onBack,
  onNext,
  canProceed,
  nextLabel = "Next",
  backLabel = "Back",
  isLoading = false
}) => {
  return (
    <div className="flex justify-between items-center mt-10 pt-10 border-t border-gray-200 dark:border-gray-700">
      <button
        onClick={onBack}
        className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>{backLabel}</span>
      </button>
      
      <button
        onClick={onNext}
        disabled={!canProceed || isLoading}
        className={`px-6 py-3 font-medium rounded-lg transition-colors flex items-center space-x-2 ${
          canProceed && !isLoading
            ? 'bg-indigo-500 text-white hover:bg-indigo-600'
            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
        }`}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>{nextLabel}</span>
            <ChevronRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
};