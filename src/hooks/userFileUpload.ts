import { useState } from 'react';

export function useFileUpload() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [usedBackend, setUsedBackend] = useState<boolean>(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setPreviewError(null);
    
    try {
      // Simulate upload progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 20;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(progressInterval);
        }
      }, 100);

      // Simulate file processing delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Clear progress
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Store the file
      setUploadedFile(file);
      
      // Generate mock preview data based on file type
      let mockPreviewData;
      if (file.name.toLowerCase().includes('qa') || file.name.toLowerCase().includes('question')) {
        mockPreviewData = {
          filename: file.name,
          columns: ['question', 'expected_answer', 'context'],
          data: [
            { question: 'What is AI?', expected_answer: 'Artificial Intelligence is...', context: 'Technology' },
            { question: 'How to reset password?', expected_answer: 'Go to settings...', context: 'Support' }
          ],
          isNewUpload: true
        };
      } else if (file.name.toLowerCase().includes('summary')) {
        mockPreviewData = {
          filename: file.name,
          columns: ['input_text', 'reference_summary'],
          data: [
            { input_text: 'Long article text...', reference_summary: 'Short summary...' },
            { input_text: 'Another article...', reference_summary: 'Another summary...' }
          ],
          isNewUpload: true
        };
      } else {
        mockPreviewData = {
          filename: file.name,
          columns: ['input', 'expected_output'],
          data: [
            { input: 'Sample input text', expected_output: 'Sample expected output' },
            { input: 'Another input', expected_output: 'Another output' }
          ],
          isNewUpload: true
        };
      }
      
      setPreviewData(mockPreviewData);
      setUsedBackend(false); // Using mock data
      
      // Auto-fill title from filename if not set
      if (!title) {
        const baseName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
        setTitle(baseName);
      }
      
      console.log('File upload simulated with mock preview data');
      
    } catch (error) {
      console.error('File upload error:', error);
      setPreviewError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000); // Clear progress after delay
    }
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setPreviewData(null);
    setTitle('');
    setDescription('');
    setUploadProgress(0);
    setIsUploading(false);
    setPreviewError(null);
    setUsedBackend(false);
  };

  return {
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
  };
}