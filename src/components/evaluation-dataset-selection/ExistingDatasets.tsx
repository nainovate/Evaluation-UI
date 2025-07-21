import React from 'react';
import { Eye, Edit, Trash2, Check, AlertCircle, FileText, Database } from 'lucide-react';
import type { EvaluationDataset } from '../../utils/evaluationUtils';

interface ExistingDatasetsProps {
  datasets: EvaluationDataset[];
  selectedDataset: string | null;
  loading: boolean;
  error: string | null;
  onDatasetSelect: (datasetId: string) => void;
  onDatasetPreview: (dataset: EvaluationDataset) => void;
  onDatasetEdit: (dataset: EvaluationDataset) => void;
  onDatasetDelete: (datasetId: string) => void;
}

export const ExistingDatasets: React.FC<ExistingDatasetsProps> = ({
  datasets,
  selectedDataset,
  loading,
  error,
  onDatasetSelect,
  onDatasetPreview,
  onDatasetEdit,
  onDatasetDelete
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'invalid':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <FileText className="h-5 w-5 text-yellow-500" />;
      default:
        return <Database className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center py-8">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Existing Evaluation Datasets ({datasets.length})
      </h2>
      
      {datasets.length === 0 ? (
        <div className="text-center py-8">
          <Database className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400">No evaluation datasets found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Upload your first evaluation dataset to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {datasets.map((dataset) => (
            <div
              key={dataset.id}
              className={`border rounded-lg p-4 transition-all cursor-pointer ${
                dataset.status === 'invalid'
                  ? 'opacity-60 border-gray-200 dark:border-gray-600'
                  : selectedDataset === dataset.id
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
              onClick={() => dataset.status === 'valid' && onDatasetPreview(dataset)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="mt-1">
                    {getStatusIcon(dataset.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {dataset.name}
                      </h3>
                      {dataset.taskType && (
                        <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 text-xs rounded">
                          {dataset.taskType}
                        </span>
                      )}
                      {selectedDataset === dataset.id && (
                        <span className="inline-block bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 text-xs rounded">
                          Selected
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {dataset.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <span>{dataset.rows.toLocaleString()} samples</span>
                      <span>{formatFileSize(dataset.size)}</span>
                      <span>Uploaded {formatDate(dataset.uploadedAt)}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {dataset.columns.slice(0, 4).map((column) => (
                        <span
                          key={column}
                          className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 text-xs rounded"
                        >
                          {column}
                        </span>
                      ))}
                      {dataset.columns.length > 4 && (
                        <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 text-xs rounded">
                          +{dataset.columns.length - 4} more
                        </span>
                      )}
                    </div>
                    
                    {dataset.tags && dataset.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {dataset.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-block bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 text-xs rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="ml-4 flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDatasetPreview(dataset);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    title="Preview dataset"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDatasetEdit(dataset);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title="Edit dataset"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Are you sure you want to delete "${dataset.name}"?`)) {
                        onDatasetDelete(dataset.id);
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title="Delete dataset"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  
                  {/* Updated status indicator section - Option 1 implementation */}
                  {dataset.status === 'invalid' && (
                    <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                      Invalid
                    </span>
                  )}
                  
                  {dataset.status === 'valid' && (
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                      Valid
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};