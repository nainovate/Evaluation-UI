import { useState, useEffect } from 'react';
import { 
  loadEvaluationDatasets, 
  addEvaluationDataset, 
  updateEvaluationDataset, 
  deleteEvaluationDataset, 
  updateEvaluationDatasetSelection, 
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
        const loadedDatasets = await loadEvaluationDatasets();
        setDatasets(loadedDatasets);
        setError(null);
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

  const handleDatasetSelect = async (datasetId: string) => {
    const dataset = datasets.find(d => d.id === datasetId);
    if (dataset) {
      setSelectedDataset(dataset);
      
      try {
        await updateEvaluationDatasetSelection(dataset);
        console.log('Evaluation Payload selection saved to metadata:', dataset.uid || dataset.id);
      } catch (error) {
        console.error('Failed to update evaluation metadata with Payload selection:', error);
      }
    }
  };

  const handleDatasetSave = async (datasetData: any): Promise<boolean> => {
    try {
      const success = await addEvaluationDataset(datasetData);
      if (success) {
        // Reload datasets to include the new one
        const updatedDatasets = await loadEvaluationDatasets();
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
      const success = await updateEvaluationDataset(datasetId, updates);
      if (success) {
        // Update local state
        setDatasets(prev => prev.map(d => 
          d.id === datasetId ? { ...d, ...updates } : d
        ));
        
        // Update selected dataset if it's the one being updated
        if (selectedDataset?.id === datasetId) {
          setSelectedDataset(prev => prev ? { ...prev, ...updates } : null);
        }
        
        console.log('Evaluation dataset updated successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update evaluation dataset:', error);
      setError('Failed to update evaluation dataset');
      return false;
    }
  };

  const handleDatasetDelete = async (datasetId: string): Promise<boolean> => {
    try {
      const success = await deleteEvaluationDataset(datasetId);
      if (success) {
        // Remove from local state
        setDatasets(prev => prev.filter(d => d.id !== datasetId));
        
        // Clear selection if deleted dataset was selected
        if (selectedDataset?.id === datasetId) {
          setSelectedDataset(null);
        }
        
        console.log('Evaluation dataset deleted successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete evaluation dataset:', error);
      setError('Failed to delete evaluation dataset');
      return false;
    }
  };

  const getSelectedDatasetData = (): EvaluationDataset | null => {
    return selectedDataset;
  };

  return {
    datasets,
    selectedDataset: selectedDataset?.id || null,
    loading,
    error,
    handleDatasetSelect,
    handleDatasetSave,
    handleDatasetUpdate,
    handleDatasetDelete,
    getSelectedDatasetData,
  };
}