import { useState, useEffect } from 'react';
import { 
  getEvaluationDatasets, // 🔥 CHANGED: Now uses API-based function
  addEvaluationDataset, 
  updateEvaluationMetadata,
  getEvaluationMetadata,
  type EvaluationDataset 
} from '../utils/evaluationUtils';

export function useEvaluationDatasetManagement() {
  const [datasets, setDatasets] = useState<EvaluationDataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<EvaluationDataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load datasets on mount
  useEffect(() => {
    const loadInitialDatasets = async () => {
      try {
        setLoading(true);
        console.log('Loading evaluation datasets from API...');
        
        // 🔥 CHANGED: Now uses API-based function instead of hardcoded data
        const loadedDatasets = await getEvaluationDatasets();
        setDatasets(loadedDatasets);
        setError(null);
        
        console.log('Successfully loaded datasets:', loadedDatasets.length);
      } catch (err) {
        console.error('Failed to load evaluation datasets:', err);
        setError('Failed to load evaluation datasets');
        setDatasets([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialDatasets();
  }, []);

  // Load selected dataset from metadata
  useEffect(() => {
    const loadSelectedDataset = async () => {
      try {
        const metadata = await getEvaluationMetadata();
        if (metadata.dataset?.id) {
          const dataset = datasets.find(d => d.id === metadata.dataset.id);
          if (dataset) {
            setSelectedDataset(dataset);
          }
        }
      } catch (err) {
        console.error('Error loading selected dataset:', err);
      }
    };
    
    if (datasets.length > 0) {
      loadSelectedDataset();
    }
  }, [datasets]);

  const handleDatasetSelect = async (datasetId: string) => {
    const dataset = datasets.find(d => d.id === datasetId);
    if (dataset) {
      setSelectedDataset(dataset);
      
      try {
        await updateEvaluationMetadata({
          dataset: {
            uid: dataset.uid || dataset.id,
            id: dataset.id,
            name: dataset.name,
            selectedAt: new Date().toISOString(),
            taskType: dataset.taskType,
            rows: dataset.rows,
            columns: dataset.columns
          },
          selectedDataset: dataset
        });
        console.log('Dataset selection saved to metadata:', dataset.uid || dataset.id);
      } catch (error) {
        console.error('Failed to update metadata with dataset selection:', error);
      }
    }
  };

  const handleDatasetSave = async (datasetData: any): Promise<boolean> => {
    try {
      const success = await addEvaluationDataset(datasetData);
      if (success) {
        // 🔥 CHANGED: Reload datasets using API function
        const updatedDatasets = await getEvaluationDatasets();
        setDatasets(updatedDatasets);
        console.log('Evaluation dataset saved successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to save evaluation dataset:', error);
      setError('Failed to save evaluation dataset');
      return false;
    }
  };

  const handleDatasetUpdate = async (datasetId: string, updates: Partial<EvaluationDataset>): Promise<boolean> => {
    try {
      // For now, just update local state since we don't have a real update API
      setDatasets(prev => prev.map(d => 
        d.id === datasetId ? { ...d, ...updates } : d
      ));
      
      // Update selected dataset if it's the one being updated
      if (selectedDataset?.id === datasetId) {
        setSelectedDataset(prev => prev ? { ...prev, ...updates } : null);
      }
      
      console.log('Dataset updated successfully');
      return true;
    } catch (error) {
      console.error('Failed to update dataset:', error);
      setError('Failed to update dataset');
      return false;
    }
  };

  const handleDatasetDelete = async (datasetId: string): Promise<boolean> => {
    try {
      // For now, just remove from local state since we don't have a real delete API
      setDatasets(prev => prev.filter(d => d.id !== datasetId));
      
      // Clear selected dataset if it's the one being deleted
      if (selectedDataset?.id === datasetId) {
        setSelectedDataset(null);
        await updateEvaluationMetadata({
          dataset: {
            uid: null,
            id: null,
            name: null,
            selectedAt: null,
            taskType: null,
            rows: null,
            columns: null
          },
          selectedDataset: undefined
        });
      }
      
      console.log('Dataset deleted successfully');
      return true;
    } catch (error) {
      console.error('Failed to delete dataset:', error);
      setError('Failed to delete dataset');
      return false;
    }
  };

  const getSelectedDatasetData = () => {
    return selectedDataset;
  };

  // 🔥 NEW: Refresh datasets from API
  const refreshDatasets = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Refreshing datasets from API...');
      
      const updatedDatasets = await getEvaluationDatasets();
      setDatasets(updatedDatasets);
      
      console.log('Successfully refreshed datasets');
    } catch (err) {
      console.error('Failed to refresh datasets:', err);
      setError('Failed to refresh datasets');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 NEW: Get dataset statistics
  const getDatasetStats = () => {
    const totalDatasets = datasets.length;
    const validDatasets = datasets.filter(d => d.status === 'valid').length;
    const invalidDatasets = datasets.filter(d => d.status === 'invalid').length;
    const pendingDatasets = datasets.filter(d => d.status === 'pending').length;
    
    const totalSize = datasets.reduce((sum, d) => sum + d.size, 0);
    const totalRows = datasets.reduce((sum, d) => sum + d.rows, 0);
    
    return {
      totalDatasets,
      validDatasets,
      invalidDatasets,
      pendingDatasets,
      totalSize,
      totalRows
    };
  };

  // 🔥 NEW: Filter datasets by task type
  const getDatasetsByTaskType = (taskType: string) => {
    return datasets.filter(d => d.taskType === taskType);
  };

  return {
    // State
    datasets,
    selectedDataset,
    loading,
    error,

    // Actions
    handleDatasetSelect,
    handleDatasetSave,
    handleDatasetUpdate,
    handleDatasetDelete,
    
    // Utilities
    getSelectedDatasetData,
    refreshDatasets, // 🔥 NEW
    getDatasetStats, // 🔥 NEW
    getDatasetsByTaskType, // 🔥 NEW
  };
}