import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface PreviewData {
  filename: string;
  columns: string[];
  data: any[];
  isNewUpload?: boolean;
  datasetId?: string;
  validation_errors?: string[];
  statistics?: {
    total_rows: number;
    total_columns: number;
    file_size_kb: number;
    preview_rows: number;
    has_required_columns: boolean;
  };
}

interface DatasetPreviewModalProps {
  isOpen: boolean;
  previewData: PreviewData | null;
  validationErrors: string[];
  taskType?: string;
  selectedTags?: string[];
  title?: string;
  description?: string;
  datasetId?: string;
  onSave?: (datasetData: any) => void;
  onNext?: (datasetData?: any) => void;
  onClose: () => void;
}

export const DatasetPreviewModal: React.FC<DatasetPreviewModalProps> = ({
  isOpen,
  previewData,
  validationErrors,
  taskType,
  selectedTags,
  title,
  description,
  datasetId,
  onSave,
  onNext,
  onClose
}) => {
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);

  if (!isOpen || !previewData) return null;

  // Check if required columns exist for evaluation based on task type
  const currentTaskType = taskType || previewData.taskType;
  let hasRequiredColumns = false;
  let missingColumns: string[] = [];

  if (currentTaskType) {
    // Task-specific validation
    const taskConfig = {
      'Question Answering': {
        mandatory: ['question', 'expected_answer', 'generated_answer'],
        optional: ['context', 'reference', 'ground_truth', 'metadata']
      },
      'Summarization': {
        mandatory: ['input_text', 'expected_summary', 'generated_summary'],
        optional: ['reference_summary', 'metadata', 'source_title']
      },
      'Conversational QA': {
        mandatory: ['conversation_history', 'question', 'expected_answer', 'generated_answer'],
        optional: ['context', 'turn_id', 'metadata']
      },
      'Retrieval (RAG)': {
        mandatory: ['query', 'retrieved_documents', 'expected_answer', 'generated_answer'],
        optional: ['ground_truth_docs', 'reference', 'metadata']
      },
      'Classification': {
        mandatory: ['input_text', 'expected_label', 'predicted_label'],
        optional: ['label_confidence', 'metadata', 'reasoning']
      },
      'Structured Output Generation': {
        mandatory: ['input_instruction', 'expected_output', 'generated_output'],
        optional: ['format_schema', 'reference', 'metadata']
      },
      'Open-ended Generation': {
        mandatory: ['prompt', 'generated_output'],
        optional: ['reference_output', 'feedback', 'toxicity_flag', 'metadata']
      }
    }[currentTaskType];

    if (taskConfig) {
      missingColumns = taskConfig.mandatory.filter(col =>
        !previewData.columns.some(dataCol => dataCol.toLowerCase() === col.toLowerCase())
      );
      hasRequiredColumns = missingColumns.length === 0;
    }
  } else {
    // General validation - updated to check for generated output
    const hasInputColumn = previewData.columns.some(col =>
      col.toLowerCase().includes('input') ||
      col.toLowerCase().includes('question') ||
      col.toLowerCase().includes('text') ||
      col.toLowerCase().includes('prompt') ||
      col.toLowerCase().includes('query') ||
      col.toLowerCase().includes('conversation') ||
      col.toLowerCase().includes('instruction')
    );

    const hasExpectedColumn = previewData.columns.some(col =>
      col.toLowerCase().includes('expected') ||
      col.toLowerCase().includes('reference') ||
      col.toLowerCase().includes('target') ||
      col.toLowerCase().includes('ground_truth')
    );

    const hasGeneratedColumn = previewData.columns.some(col =>
      col.toLowerCase().includes('generated') ||
      col.toLowerCase().includes('predicted') ||
      col.toLowerCase().includes('output')
    );

    hasRequiredColumns = hasInputColumn && hasExpectedColumn && hasGeneratedColumn;
    if (!hasInputColumn) missingColumns.push('input column');
    if (!hasExpectedColumn) missingColumns.push('expected output column');
    if (!hasGeneratedColumn) missingColumns.push('generated output column');
  }

  const canProceed = hasRequiredColumns;
  const canSave = previewData.isNewUpload ? hasRequiredColumns : true;

  const handleSave = () => {
    if (canSave && previewData.isNewUpload && onSave) {
      const datasetData = {
        name: title || previewData.filename.replace(/\.[^/.]+$/, ""),
        description: description || `Uploaded evaluation dataset from ${previewData.filename}`,
        format: previewData.filename.toLowerCase().endsWith('.csv') ? 'CSV' :
          previewData.filename.toLowerCase().endsWith('.json') ? 'JSON' : 'YAML',
        taskType: taskType || 'General Evaluation',
        samples: previewData.data.length,
        size: previewData.statistics?.file_size_kb ? previewData.statistics.file_size_kb * 1024 : previewData.data.length * 100,
        tags: selectedTags || [],
        columns: previewData.columns,
        preview: previewData.data.slice(0, 10),
        filePath: `./uploads/${previewData.filename}`,
        originalFileName: previewData.filename
      };
      onSave(datasetData);
    }
  };

  const handleNext = () => {
    if (canProceed && onNext) {
      if (previewData.isNewUpload) {
        // For new uploads, pass the dataset data to be saved
        const datasetData = {
          name: title || previewData.filename.replace(/\.[^/.]+$/, ""),
          description: description || `Uploaded evaluation dataset from ${previewData.filename}`,
          format: previewData.filename.toLowerCase().endsWith('.csv') ? 'CSV' :
            previewData.filename.toLowerCase().endsWith('.json') ? 'JSON' : 'YAML',
          taskType: taskType || 'General Evaluation',
          samples: previewData.data.length,
          size: previewData.statistics?.file_size_kb ? previewData.statistics.file_size_kb * 1024 : previewData.data.length * 100,
          tags: selectedTags || [],
          columns: previewData.columns,
          preview: previewData.data.slice(0, 10),
          filePath: `./uploads/${previewData.filename}`,
          originalFileName: previewData.filename
        };
        onNext(datasetData);
      } else {
        // For existing datasets, pass the dataset ID to select it
        onNext(previewData.datasetId);
      }
    }
  };

  const handleClose = () => {
    if (previewData.isNewUpload && title && !showUnsavedWarning) {
      setShowUnsavedWarning(true);
      return;
    }
    setShowUnsavedWarning(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Dataset Preview: {previewData.filename}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Validation Status */}
          <div className="mb-6">
            {!hasRequiredColumns && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                      Invalid Dataset Structure
                    </h3>
                    <div className="mt-1 text-sm text-red-700 dark:text-red-300">
                      <p className="mb-2">This dataset cannot be used for evaluation:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {missingColumns.map((col, index) => (
                          <li key={index}>Missing: {col}</li>
                        ))}
                      </ul>
                      {currentTaskType && (
                        <p className="mt-2 text-xs">
                          Required columns for {currentTaskType}: {
                            {
                              'Question Answering': 'question, expected_answer, generated_answer',
                              'Summarization': 'input_text, expected_summary, generated_summary',
                              'Conversational QA': 'conversation_history, question, expected_answer, generated_answer',
                              'Retrieval (RAG)': 'query, retrieved_documents, expected_answer, generated_answer',
                              'Classification': 'input_text, expected_label, predicted_label',
                              'Structured Output Generation': 'input_instruction, expected_output, generated_output',
                              'Open-ended Generation': 'prompt, generated_output'
                            }[currentTaskType]
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {hasRequiredColumns && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4 mb-4">
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                      Dataset Ready for Evaluation
                    </h3>
                    <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                      This dataset contains the required input and expected output columns for evaluation.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {validationErrors.length > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 mb-4">
                <div className="flex">
                  <Info className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Additional Validation Notes
                    </h3>
                    <ul className="mt-1 text-sm text-yellow-700 dark:text-yellow-300 list-disc list-inside">
                      {validationErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dataset Statistics */}
          {previewData.statistics && (
            <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Total Rows</div>
                <div className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                  {previewData.statistics.total_rows.toLocaleString()}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Columns</div>
                <div className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                  {previewData.statistics.total_columns}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">File Size</div>
                <div className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                  {(previewData.statistics.file_size_kb / 1024).toFixed(1)} MB
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Preview Rows</div>
                <div className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                  {previewData.statistics.preview_rows}
                </div>
              </div>
            </div>
          )}

          {/* Column Information */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
              Columns ({previewData.columns.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {previewData.columns.map((column) => {
                const isInputCol = column.toLowerCase().includes('input') ||
                  column.toLowerCase().includes('question') ||
                  column.toLowerCase().includes('text') ||
                  column.toLowerCase().includes('prompt');
                const isOutputCol = column.toLowerCase().includes('output') ||
                  column.toLowerCase().includes('answer') ||
                  column.toLowerCase().includes('expected') ||
                  column.toLowerCase().includes('reference');

                return (
                  <span
                    key={column}
                    className={`inline-block px-3 py-1 text-sm rounded-full ${isInputCol
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
                        : isOutputCol
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                  >
                    {column}
                    {isInputCol && ' (Input)'}
                    {isOutputCol && ' (Expected)'}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Data Preview */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
              Sample Data (First {Math.min(previewData.data.length, 5)} rows)
            </h3>
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    {previewData.columns.map((column) => (
                      <th
                        key={column}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {previewData.data.slice(0, 5).map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      {previewData.columns.map((column) => (
                        <td
                          key={column}
                          className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
                        >
                          <div className="max-w-xs truncate" title={String(row[column] || '')}>
                            {String(row[column] || '')}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>

          {previewData.isNewUpload ? (
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`px-4 py-2 rounded-md transition-colors ${canProceed
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
            >
              Save & Select Dataset
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`px-4 py-2 rounded-md transition-colors ${canProceed
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
            >
              Select Dataset
            </button>
          )}
        </div>

        {/* Unsaved Warning Modal */}
        {showUnsavedWarning && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Unsaved Changes
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You have unsaved changes. Are you sure you want to close without saving?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowUnsavedWarning(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Keep Editing
                </button>
                <button
                  onClick={() => {
                    setShowUnsavedWarning(false);
                    onClose();
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Close Without Saving
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};