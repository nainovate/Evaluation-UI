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
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
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

  

 // ✅ REPLACE the handleDatasetSelect function with this simplified version:
  const handleDatasetSelect = async (datasetId: string) => {
    const dataset = datasets.find(d => d.id === datasetId);
    if (dataset) {
      setSelectedDataset(datasetId);
      console.log('Dataset selected (component state only):', dataset.name);
      // ❌ REMOVE: Don't call updateEvaluationMetadata here anymore
      // The main page will handle persistence via onComplete()
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
      setDatasets(prev => prev.map(d => 
        d.id === datasetId ? { ...d, ...updates } : d
      ));
      
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
      setDatasets(prev => prev.filter(d => d.id !== datasetId));
      
      // Clear selected dataset if it's the one being deleted
      if (selectedDataset === datasetId) {
        setSelectedDataset(null);
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
    if (!selectedDataset) return null;
    return datasets.find(d => d.id === selectedDataset) || null;
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