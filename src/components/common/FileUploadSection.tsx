// src/components/common/FileUploadSection.tsx
import React from 'react';
import { Download, Info } from 'lucide-react';

// Updated task type configurations with new columns and structure
const TASK_TYPE_CONFIG = {
  'Question Answering': {
    description: 'Models answer questions with evaluation against expected answers',
    mandatory: ['question', 'expected_answer', 'generated_answer'],
    optional: ['context', 'reference', 'ground_truth', 'metadata'],
    example: {
      question: "What is the capital of France?",
      expected_answer: "Paris",
      generated_answer: "The capital of France is Paris.",
      context: "Geography knowledge",
      reference: "World Atlas 2024",
      ground_truth: "Paris",
      metadata: { difficulty: "easy", category: "geography" }
    }
  },
  'Summarization': {
    description: 'Models create summaries with evaluation against expected outputs',
    mandatory: ['input_text', 'expected_summary', 'generated_summary'],
    optional: ['reference_summary', 'metadata', 'source_title'],
    example: {
      input_text: "Long article about climate change impacts on agriculture...",
      expected_summary: "Climate change significantly affects crop yields and farming practices.",
      generated_summary: "Global warming is impacting agricultural productivity worldwide.",
      reference_summary: "Official IPCC summary on agriculture",
      metadata: { length_constraint: "50 words", domain: "science" },
      source_title: "Climate Change and Agriculture Report 2024"
    }
  },
  'Conversational QA': {
    description: 'Multi-turn conversation evaluation with context awareness',
    mandatory: ['conversation_history', 'question', 'expected_answer', 'generated_answer'],
    optional: ['context', 'turn_id', 'metadata'],
    example: {
      conversation_history: "User: Hello\\nBot: Hi! How can I help you today?\\nUser: I need help with my account",
      question: "How do I reset my password?",
      expected_answer: "Go to Settings > Security > Reset Password and follow the instructions.",
      generated_answer: "You can reset your password in the security settings.",
      context: "Customer support conversation",
      turn_id: 3,
      metadata: { session_id: "sess_123", user_type: "premium" }
    }
  },
  'Retrieval (RAG)': {
    description: 'Retrieval-Augmented Generation with document evaluation',
    mandatory: ['query', 'retrieved_documents', 'expected_answer', 'generated_answer'],
    optional: ['ground_truth_docs', 'reference', 'metadata'],
    example: {
      query: "What are the benefits of renewable energy?",
      retrieved_documents: ["doc_solar_2024.pdf", "doc_wind_energy.pdf"],
      expected_answer: "Renewable energy reduces carbon emissions and provides sustainable power.",
      generated_answer: "Renewable energy sources like solar and wind help reduce environmental impact.",
      ground_truth_docs: ["doc_solar_2024.pdf"],
      reference: "Environmental Protection Agency Report",
      metadata: { retrieval_score: 0.89, num_docs: 2 }
    }
  },
  'Classification': {
    description: 'Text classification with prediction evaluation',
    mandatory: ['input_text', 'expected_label', 'predicted_label'],
    optional: ['label_confidence', 'metadata', 'reasoning'],
    example: {
      input_text: "This product exceeded my expectations! Highly recommended.",
      expected_label: "positive",
      predicted_label: "positive",
      label_confidence: 0.95,
      metadata: { model_version: "v2.1", category: "sentiment" },
      reasoning: "Positive keywords: exceeded, highly recommended"
    }
  },
  'Structured Output Generation': {
    description: 'Generation of structured data with format validation',
    mandatory: ['input_instruction', 'expected_output', 'generated_output'],
    optional: ['format_schema', 'reference', 'metadata'],
    example: {
      input_instruction: "Extract person and company information from: John Doe works at ABC Corp",
      expected_output: { name: "John Doe", company: "ABC Corp", role: null },
      generated_output: { name: "John Doe", company: "ABC Corp" },
      format_schema: { type: "object", properties: { name: "string", company: "string" } },
      reference: "Information extraction guidelines",
      metadata: { extraction_confidence: 0.92 }
    }
  },
  'Open-ended Generation': {
    description: 'Creative or open-ended text generation evaluation',
    mandatory: ['prompt', 'generated_output'],
    optional: ['reference_output', 'feedback', 'toxicity_flag', 'metadata'],
    example: {
      prompt: "Write a short story about a robot learning to paint",
      generated_output: "In a small workshop, R2D7 discovered brushes and colors...",
      reference_output: "Example creative story about artistic robots",
      feedback: "Creative and engaging narrative",
      toxicity_flag: false,
      metadata: { creativity_score: 8.5, word_count: 245 }
    }
  }
};

// 🔹 CONFIGURATION INTERFACES
interface FileUploadConfig {
  title: string;                    // Section title
  acceptedFormats: string[];        // File extensions (e.g., ['.yaml', '.yml'])
  acceptAttribute: string;          // HTML accept attribute (e.g., '.yaml,.yml')
  maxSize: number;                 // Max file size in MB
  description: string;             // Description text
  buttonText: string;              // Upload button text
  supportText: string;             // Support text under description
  fileTypeDisplay: string;         // Display name for file type
}

// 🔹 MAIN COMPONENT PROPS
interface FileUploadSectionProps {
  config: FileUploadConfig;        // Configuration object
  isUploading: boolean;
  uploadProgress: number;
  taskType: string;
  selectedTags: string[];
  isAddingTag: boolean;
  customTag: string;
  taskTags: Record<string, string[]>;
  uploadedFile: File | null;
  title: string;
  description: string;
  previewError?: string | null;
  usedBackend?: boolean;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTaskTypeChange: (taskType: string) => void;
  onTagToggle: (tag: string) => void;
  onStartAddingTag: () => void;
  onCancelAddingTag: () => void;
  onCustomTagChange: (tag: string) => void;
  onAddCustomTag: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onRemoveTag: (tag: string) => void;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onSaveDataset: () => void;
  onClearUpload: () => void;
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  config,
  isUploading,
  uploadProgress,
  taskType,
  selectedTags,
  isAddingTag,
  customTag,
  taskTags,
  uploadedFile,
  title,
  description,
  previewError,
  usedBackend,
  onFileUpload,
  onTaskTypeChange,
  onTagToggle,
  onStartAddingTag,
  onCancelAddingTag,
  onCustomTagChange,
  onAddCustomTag,
  onKeyPress,
  onRemoveTag,
  onTitleChange,
  onDescriptionChange,
  onSaveDataset,
  onClearUpload
}) => {
  const canSave = uploadedFile && title.trim().length > 0;

  // 🔸 HELPER FUNCTION: Get file type display
  const getFileTypeFromName = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (config.acceptedFormats.some(format => format.replace('.', '') === extension)) {
      return config.fileTypeDisplay;
    }
    return extension?.toUpperCase() || 'Unknown';
  };

  // 🔸 YAML TEMPLATE GENERATION FUNCTIONS
  const convertToYaml = (obj: any, indent = 0): string => {
    let yaml = '';
    const spaces = '  '.repeat(indent);
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        yaml += `${spaces}${key}:\n`;
        yaml += convertToYaml(value, indent + 1);
      } else if (Array.isArray(value)) {
        yaml += `${spaces}${key}:\n`;
        value.forEach(item => {
          if (typeof item === 'object') {
            yaml += `${spaces}- \n`;
            yaml += convertToYaml(item, indent + 2);
          } else {
            yaml += `${spaces}- ${item}\n`;
          }
        });
      } else {
        const yamlValue = typeof value === 'string' ? `"${value}"` : value;
        yaml += `${spaces}${key}: ${yamlValue}\n`;
      }
    }
    
    return yaml;
  };

  const generateYamlTemplate = (): string => {
    const taskConfig = TASK_TYPE_CONFIG[taskType as keyof typeof TASK_TYPE_CONFIG];
    if (!taskConfig) return '';
    
    const template = {
      task_type: taskType,
      description: taskConfig.description,
      data: [taskConfig.example]
    };
    
    return convertToYaml(template);
  };

  const downloadYamlTemplate = (): void => {
    const taskConfig = TASK_TYPE_CONFIG[taskType as keyof typeof TASK_TYPE_CONFIG];
    if (!taskConfig) return;
    
    const yamlContent = generateYamlTemplate();
    const blob = new Blob([yamlContent], { type: 'text/yaml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${taskType.toLowerCase().replace(/[\s()]/g, '_')}_template.yaml`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {config.title}
      </h2>
      
      {/* 🔸 FORM FIELDS - Correct Order: Title → Description → Task Type → Upload */}
      <div className="space-y-4">
        {/* 1. Dataset Title - FIRST */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Dataset Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter a name for your dataset..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* 2. Description - SECOND */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Describe your dataset..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* 3. Task Type Selection - THIRD */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Task Type <span className="text-red-500">*</span>
          </label>
          <select
            value={taskType}
            onChange={(e) => onTaskTypeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Select a task type...</option>
            {Object.keys(TASK_TYPE_CONFIG).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          {/* Column Requirements Display */}
          {taskType && TASK_TYPE_CONFIG[taskType as keyof typeof TASK_TYPE_CONFIG] && (
            <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                  Column Requirements for {taskType}
                </h4>
                <button
                  onClick={downloadYamlTemplate}
                  className="inline-flex items-center px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download YAML Template
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-xs font-medium text-red-700 dark:text-red-300 mb-2 flex items-center">
                    🟢 Mandatory Columns
                  </h5>
                  <div className="space-y-1">
                    {TASK_TYPE_CONFIG[taskType as keyof typeof TASK_TYPE_CONFIG].mandatory.map(col => (
                      <code key={col} className="block text-xs bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded text-red-800 dark:text-red-200">
                        {col}
                      </code>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-xs font-medium text-yellow-700 dark:text-yellow-300 mb-2 flex items-center">
                    🟡 Optional Columns
                  </h5>
                  <div className="space-y-1">
                    {TASK_TYPE_CONFIG[taskType as keyof typeof TASK_TYPE_CONFIG].optional.map(col => (
                      <code key={col} className="block text-xs bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded text-yellow-800 dark:text-yellow-200">
                        {col}
                      </code>
                    ))}
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                {TASK_TYPE_CONFIG[taskType as keyof typeof TASK_TYPE_CONFIG].description}
              </p>
            </div>
          )}
        </div>

        {/* Tags Section */}
        {taskType && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags (Optional)
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Select relevant tags or add custom ones to categorize your dataset
            </p>
            
            {/* Predefined Tags and Add Button */}
            <div className="flex flex-wrap gap-2">
              {taskTags[taskType as keyof typeof taskTags]?.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onTagToggle(tag)}
                  className={`px-3 py-1 text-sm rounded-full border transition-all duration-200 ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-100 dark:bg-blue-900 border-blue-500 text-blue-700 dark:text-blue-300'
                      : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  {tag}
                </button>
              ))}
              
              {/* Add Custom Tag Button/Input */}
              {isAddingTag ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customTag}
                    onChange={(e) => onCustomTagChange(e.target.value)}
                    onKeyPress={onKeyPress}
                    placeholder="Enter custom tag..."
                    className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={onAddCustomTag}
                    className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={onCancelAddingTag}
                    className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onStartAddingTag}
                  className="px-3 py-1 text-sm border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-full hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                >
                  + Add custom tag
                </button>
              )}
            </div>

            {/* Selected Tags Display */}
            {selectedTags.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Selected tags:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => onRemoveTag(tag)}
                        className="ml-1 hover:text-blue-500 dark:hover:text-blue-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. Upload File Section - FOURTH AND LAST */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Upload Dataset File
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
            {uploadedFile ? (
              // 🔸 UPLOADED FILE DISPLAY
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <svg className="w-12 h-12 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                    File Uploaded Successfully
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">File:</span> {uploadedFile.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Size:</span> {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Type:</span> {getFileTypeFromName(uploadedFile.name)}
                  </p>
                  
                  {/* Backend Status Indicator */}
                  {usedBackend !== undefined && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Preview:</span> 
                      <span className={`ml-1 ${usedBackend ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {usedBackend ? 'Server processed' : 'Client fallback'}
                      </span>
                    </p>
                  )}
                </div>
                
                {/* Error Display */}
                {previewError && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                    <p className="text-sm text-red-600 dark:text-red-400">{previewError}</p>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={onClearUpload}
                    className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Remove File
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Upload Icon */}
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                
                {/* Upload Text */}
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {config.description}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {config.supportText}
                </p>
                
                {/* File Input */}
                <input
                  type="file"
                  id="file-upload"
                  accept={config.acceptAttribute}
                  onChange={onFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors"
                >
                  {config.buttonText}
                </label>
              </>
            )}
            
            {/* 🔸 UPLOAD PROGRESS */}
            {isUploading && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Save Button - AT THE VERY BOTTOM */}
        {uploadedFile && (
          <div className="flex justify-end">
            <button
              onClick={onSaveDataset}
              disabled={!canSave}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                canSave
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              Preview & Save Dataset
            </button>
          </div>
        )}
      </div>
    </div>
  );
};