import React from 'react';
import { ChevronDown, ChevronRight, Info } from 'lucide-react';
import type { MetricCategory } from '../../utils/evaluationUtils';

interface MetricsSelectionProps {
  metricCategories: MetricCategory[];
  onCategoryToggle: (categoryId: string) => void;
  onSubMetricToggle: (categoryId: string, subMetricId: string) => void;
  loading?: boolean;
}

export const MetricsSelection: React.FC<MetricsSelectionProps> = ({
  metricCategories,
  onCategoryToggle,
  onSubMetricToggle,
  loading = false
}) => {
  const getSelectedCount = (category: MetricCategory) => {
    return category.subMetrics.filter(sm => sm.enabled).length;
  };

  const getTotalSelectedMetrics = () => {
    return metricCategories
      .filter(category => category.selected)
      .reduce((total, category) => total + getSelectedCount(category), 0);
  };

  const getColorClasses = (color: string, selected: boolean) => {
    // Always use blue/indigo colors regardless of the color prop
    return {
      icon: selected ? 'text-indigo-600' : 'text-gray-500',
      border: selected ? 'border-indigo-500' : 'border-gray-200 dark:border-gray-600',
      bg: selected ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'bg-white dark:bg-gray-800',
      badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-200'
    };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Evaluation Metrics
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Select one category • {getTotalSelectedMetrics()} sub-metrics selected
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {metricCategories.map((category) => {
          const colorClasses = getColorClasses(category.color, category.selected);
          const selectedCount = getSelectedCount(category);
          
          return (
            <div
              key={category.id}
              className={`border-2 rounded-lg transition-all duration-200 ${colorClasses.border} ${colorClasses.bg} hover:shadow-md`}
            >
              {/* Category Header */}
              <div
                className="p-6 cursor-pointer"
                onClick={() => onCategoryToggle(category.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${colorClasses.icon}`}>
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {category.name}
                        </h4>
                        {category.selected && selectedCount > 0 && (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses.badge}`}>
                            {selectedCount} selected
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {category.selected ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Sub-metrics */}
              {category.selected && (
                <div className="border-t border-gray-200 dark:border-gray-600 p-6 pt-4 space-y-3">
                  {category.subMetrics.map((subMetric) => (
                    <div
                      key={subMetric.id}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={subMetric.enabled}
                          onChange={() => onSubMetricToggle(category.id, subMetric.id)}
                          className={`mt-1 w-4 h-4 appearance-none border-2 rounded focus:ring-indigo-500 focus:ring-2 focus:ring-offset-0 transition-colors ${
                            subMetric.enabled 
                              ? 'bg-indigo-600 border-indigo-600' 
                              : 'bg-white border-gray-300 hover:border-gray-400'
                          }`}
                        />
                        {subMetric.enabled && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <svg className="w-3 h-3 text-white mt-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {subMetric.name}
                          </span>
                          <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {subMetric.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};