import React, { useState, useEffect } from 'react';
import {
  FileUploadSection,
  ExistingDatasets,
  DatasetPreviewModal,
  DatasetEditModal
} from '../evaluation-dataset-selection';
import { DatasetTips } from '../common/DatasetTips';
import { getEvaluationDatasetConfig } from '../../utils/constant';
import { getDatasetTipsConfigByPath, getFileUploadConfigByPath } from '../../utils/FileUploadConfig';
import {
  useEvaluationDatasetManagement,
  useTagManagement,
  useFileUpload,
  useModalState
} from '../../hooks';
import { validateEvaluationColumns } from '../../utils/evaluationUtils';
import type { EvaluationDataset, EvaluationMetadata } from '../../utils/evaluationUtils';


interface DatasetSelectionStepProps {
  metadata: EvaluationMetadata;
  onComplete: (data: any) => void;
  onBack: () => void;
  canProceed: boolean;
}

export const DatasetSelectionStep: React.FC<DatasetSelectionStepProps> = ({
  metadata,
  onComplete,
  onBack,
  canProceed
}) => {
  const [taskType, setTaskType] = useState<string>('');
  const pathname = '/evaluation/dataset-selection';
  
  const fileUploadConfig = getFileUploadConfigByPath(pathname);
  const datasetTipsConfig = getDatasetTipsConfigByPath(pathname);

  const {
    datasets,
    selectedDataset,
    loading: datasetsLoading,
    error: datasetsError,
    handleDatasetSelect,
    handleDatasetSave,
    handleDatasetUpdate,
    handleDatasetDelete,
    getSelectedDatasetData,
  } = useEvaluationDatasetManagement();

  const {
    selectedTags,
    customTag,
    isAddingTag,
    setCustomTag,
    setSelectedTags,
    handleTagToggle,
    handleAddCustomTag,
    handleStartAddingTag,
    handleCancelAddingTag,
    handleRemoveTag,
    handleKeyPress,
    resetTags,
  } = useTagManagement();

  const {
    uploadedFile,
    uploadProgress,
    isUploading,
    previewData,
    title,
    description,
    previewError,
    usedBackend,
    setTitle,
    setDescription,
    setPreviewData,
    handleFileUpload,
    resetUpload,
  } = useFileUpload();

  const {
    showPreview,
    showEditModal,
    editingDataset,
    validationErrors,
    openPreview,
    closePreview,
    openEditModal,
    closeEditModal,
    setErrors,
    clearErrors,
  } = useModalState();

  const taskTags = {
    'Question Answering': ['factual-qa', 'reading-comprehension', 'knowledge-based', 'multi-choice'],
    'Summarization': ['abstractive', 'extractive', 'news-summary', 'document-summary'],
    'Classification': ['sentiment', 'topic-classification', 'intent-classification', 'spam-detection'],
    'Structured Output': ['json-generation', 'table-extraction', 'form-filling', 'data-parsing'],
    'Conversational QA': ['multi-turn', 'context-aware', 'dialogue-qa', 'chat-evaluation'],
    'Retrieval': ['document-retrieval', 'passage-ranking', 'semantic-search', 'information-retrieval'],
  };

  // ✅ ADD this useEffect after your existing hooks
// ✅ ADD this useEffect after your existing hooks
  // ✅ UPDATE this useEffect
  // ✅ REPLACE the existing useEffect with this fixed version
// ✅ REPLACE your useEffect with this debug version
useEffect(() => {
  console.log('🔍 COMPONENT INITIALIZATION DEBUG:');
  console.log('  - datasetsLoading:', datasetsLoading);
  console.log('  - datasets.length:', datasets.length);
  console.log('  - metadata?.dataset:', metadata?.dataset);
  console.log('  - selectedDataset:', selectedDataset);

  // Wait for datasets to be loaded
  if (datasetsLoading) {
    console.log('  → Datasets still loading, waiting...');
    return;
  }

  // Initialize from persisted metadata when datasets are ready
  if (metadata?.dataset && metadata.dataset.id && !selectedDataset && datasets.length > 0) {
    console.log('  → Attempting to initialize from metadata...');
    console.log('  → Looking for dataset ID:', metadata.dataset.id);
    console.log('  → Available dataset IDs:', datasets.map(d => d.id));
    
    const persistedDataset = datasets.find(d => d.id === metadata.dataset.id);
    if (persistedDataset) {
      console.log('  → ✅ Found persisted dataset, selecting:', persistedDataset.name);
      handleDatasetSelect(metadata.dataset.id);
    } else {
      console.log('  → ❌ Persisted dataset NOT found!');
    }
    
    if (metadata.dataset.taskType) {
      console.log('  → Restoring taskType:', metadata.dataset.taskType);
      setTaskType(metadata.dataset.taskType);
    }
  } else {
    console.log('  → Skipping initialization because:');
    console.log('    - metadata?.dataset exists:', !!metadata?.dataset);
    console.log('    - metadata.dataset.id exists:', !!metadata?.dataset?.id);
    console.log('    - selectedDataset is null:', !selectedDataset);
    console.log('    - datasets.length > 0:', datasets.length > 0);
  }
}, [metadata?.dataset, datasets, selectedDataset, handleDatasetSelect, datasetsLoading]);
//   ↑ Added datasetsLoading to dependencies

  const handleNext = async () => {
    const selectedDatasetData = getSelectedDatasetData();
    if (selectedDatasetData) {
      onComplete({
        uid: selectedDatasetData.uid || selectedDatasetData.id,
        id: selectedDatasetData.id,
        name: selectedDatasetData.name,
        taskType: selectedDatasetData.taskType,
        rows: selectedDatasetData.rows,
        columns: selectedDatasetData.columns
      });
    }
  };

  const handleTaskTypeChange = (newTaskType: string) => {
    setTaskType(newTaskType);
    setSelectedTags([]);
  };

  const handleDatasetPreview = async (dataset: EvaluationDataset) => {
    try {
      clearErrors();
      
      const mockPreviewData = {
        filename: dataset.name,
        columns: dataset.columns,
        data: generateMockPreviewData(dataset),
        isNewUpload: false,
        datasetId: dataset.id,
        statistics: {
          total_rows: dataset.rows,
          total_columns: dataset.columns.length,
          file_size_kb: Math.round(dataset.size / 1024),
          preview_rows: 5,
          has_required_columns: validateEvaluationColumns(dataset.columns).length === 0
        }
      };
      
      setPreviewData(mockPreviewData);
      const errors = validateEvaluationColumns(dataset.columns, dataset.taskType);
      setErrors(errors);
      openPreview();
    } catch (error) {
      console.error('Failed to load dataset preview:', error);
      setErrors(['Failed to load dataset preview']);
    }
  };

  const generateMockPreviewData = (dataset: EvaluationDataset) => {
    const sampleData: { [key: string]: any[] } = {
      'eval_dataset_001': [
        { 
          question: 'How do I reset my password?', 
          expected_answer: 'Go to settings and click forgot password', 
          context: 'User account management', 
          category: 'authentication' 
        },
        { 
          question: 'What are your business hours?', 
          expected_answer: 'We are open 9 AM to 5 PM EST', 
          context: 'General information', 
          category: 'hours' 
        }
      ]
    };
    
    return sampleData[dataset.uid || dataset.id] || [
      { input: 'Sample input', expected_output: 'Sample expected output' }
    ];
  };

  const handleDatasetSaveAndProceed = async (datasetData: any) => {
    try {
      const saved = await handleDatasetSave(datasetData);
      if (saved) {
        const newDataset = datasets.find(d => d.name === datasetData.name);
        if (newDataset) {
          await handleDatasetSelect(newDataset.id);
        }
        
        closePreview();
        resetUpload();
        resetTags();
        setTaskType('');
        clearErrors();
      }
    } catch (error) {
      console.error('Failed to save evaluation dataset:', error);
    }
  };

  const handleClearUpload = () => {
    resetUpload();
    resetTags();
    setTaskType('');
    clearErrors();
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Select Evaluation Payload
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose a payload to evaluate your model's performance
        </p>
      </div>

      {/* Main Content Grid - matching your existing structure */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <FileUploadSection
            config={fileUploadConfig}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            taskType={taskType}
            selectedTags={selectedTags}
            isAddingTag={isAddingTag}
            customTag={customTag}
            taskTags={taskTags}
            uploadedFile={uploadedFile}
            title={title}
            description={description}
            previewError={previewError}
            usedBackend={usedBackend}
            onFileUpload={handleFileUpload}
            onTaskTypeChange={handleTaskTypeChange}
            onTagToggle={handleTagToggle}
            onStartAddingTag={handleStartAddingTag}
            onCancelAddingTag={handleCancelAddingTag}
            onCustomTagChange={setCustomTag}
            onAddCustomTag={handleAddCustomTag}
            onKeyPress={handleKeyPress}
            onRemoveTag={handleRemoveTag}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onSaveDataset={() => {
              if (previewData) {
                setPreviewData({ ...previewData, isNewUpload: true });
                openPreview();
              }
            }}
            onClearUpload={handleClearUpload}
          />

          <ExistingDatasets
            datasets={datasets}
            selectedDataset={selectedDataset}
            loading={datasetsLoading}
            error={datasetsError}
            onDatasetSelect={handleDatasetSelect}
            onDatasetPreview={handleDatasetPreview}
            onDatasetEdit={openEditModal}
            onDatasetDelete={handleDatasetDelete}
          />
        </div>

        {/* Fixed Sidebar - Adjusted positioning */}
        <div className="lg:col-span-1">
          <div className="hidden lg:block fixed top-32 w-80 max-h-[calc(100vh-10rem)] overflow-y-auto z-30" style={{ left: 'calc(75% + 1rem)' }}>
            <DatasetTips config={datasetTipsConfig} />
          </div>
          {/* Mobile/tablet version - normal flow */}
          <div className="lg:hidden">
            <DatasetTips config={datasetTipsConfig} />
          </div>
        </div>
      </div>

      {/* Navigation with proper spacing - matching your existing structure */}
      <div className="lg:mr-80 xl:mr-96">
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onBack}
            disabled={true}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg cursor-not-allowed"
          >
            Back
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Step 1 of 5
            </div>
            
            <button
              onClick={handleNext}
              disabled={!selectedDataset}
              className="flex items-center px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DatasetPreviewModal
        isOpen={showPreview}
        previewData={previewData}
        validationErrors={validationErrors}
        taskType={taskType}
        selectedTags={selectedTags}
        title={title}
        description={description}
        datasetId={previewData?.datasetId}
        onSave={handleDatasetSaveAndProceed}
        onNext={(datasetIdOrData) => {
          if (previewData?.isNewUpload) {
            handleDatasetSaveAndProceed(datasetIdOrData);
          } else {
            if (typeof datasetIdOrData === 'string') {
              handleDatasetSelect(datasetIdOrData);
              closePreview();
            }
          }
        }}
        onClose={closePreview}
      />

      <DatasetEditModal
        isOpen={showEditModal}
        dataset={editingDataset}
        onSave={handleDatasetUpdate}
        onClose={closeEditModal}
      />
    </div>
  );
};