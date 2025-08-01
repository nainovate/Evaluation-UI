import { useState, useEffect } from 'react';
import { 
  getEvaluationDeployments, // 🔥 CHANGED: Now uses API-based function
  updateEvaluationMetadata, 
  getEvaluationMetadata 
} from '../utils/evaluationUtils';
import type { Deployment } from '../utils/evaluationUtils';

export function useEvaluationModelManagement() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [selectedDeployments, setSelectedDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDeployments();
    loadSelectedDeployments();
  }, []);

  // 🔥 CHANGED: Now uses API-based function instead of hardcoded data
  const loadDeployments = async () => {
    try {
      setLoading(true);
      console.log('Loading deployments from API...');
      
      const data = await getEvaluationDeployments();
      setDeployments(data);
      setError(null);
      
      console.log('Successfully loaded deployments:', data.length);
    } catch (err) {
      setError('Failed to load deployments');
      console.error('Error loading deployments:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load multiple selected deployments from metadata
  const loadSelectedDeployments = async () => {
    try {
      const metadata = await getEvaluationMetadata();
      
      // Check for new multiple deployments format
      if (metadata.deployments && Array.isArray(metadata.deployments) && metadata.deployments.length > 0) {
        const deploymentList = await getEvaluationDeployments();
        const selected = deploymentList.filter(d => 
          metadata.deployments!.some((md: any) => md.id === d.id)
        );
        setSelectedDeployments(selected);
      }
      // Fallback: Check for legacy single deployment format for backward compatibility
      else if (metadata.deployment && metadata.deployment.id) {
        const deploymentList = await getEvaluationDeployments();
        const deployment = deploymentList.find(d => d.id === metadata.deployment!.id);
        if (deployment) {
          setSelectedDeployments([deployment]); // Convert single to array
        }
      }
    } catch (err) {
      console.error('Error loading selected deployments:', err);
    }
  };

  // Handle selecting a deployment (add to array)
  const handleDeploymentSelect = async (deployment: Deployment) => {
    // Check if deployment is already selected
    const isAlreadySelected = selectedDeployments.some(d => d.id === deployment.id);
    if (isAlreadySelected) {
      return; // Don't add duplicates
    }

    const newSelected = [...selectedDeployments, deployment];
    setSelectedDeployments(newSelected);
    
    // Update metadata with multiple deployments
    try {
      await updateEvaluationMetadata({
        deployments: newSelected.map(d => ({
          id: d.id,
          name: d.name,
          model: d.model || d.name,
          provider: d.provider || 'Unknown',
          selectedAt: new Date().toISOString()
        })),
        // Keep legacy single deployment for backward compatibility
        deployment: {
          id: newSelected[0].id,
          name: newSelected[0].name,
          model: newSelected[0].model || newSelected[0].name,
          provider: newSelected[0].provider || 'Unknown',
          selectedAt: new Date().toISOString()
        }
      });
      
      console.log('Deployment selection updated:', deployment.name);
    } catch (err) {
      console.error('Error updating deployment selection:', err);
      // Revert on error
      setSelectedDeployments(selectedDeployments);
    }
  };

  // Handle deselecting a deployment (remove from array)
  const handleDeploymentDeselect = async (deployment: Deployment) => {
    const newSelected = selectedDeployments.filter(d => d.id !== deployment.id);
    setSelectedDeployments(newSelected);
    
    // Update metadata
    try {
      const updateData: any = {
        deployments: newSelected.map(d => ({
          id: d.id,
          name: d.name,
          model: d.model || d.name,
          provider: d.provider || 'Unknown',
          selectedAt: new Date().toISOString()
        }))
      };

      // Update legacy single deployment field
      if (newSelected.length > 0) {
        updateData.deployment = {
          id: newSelected[0].id,
          name: newSelected[0].name,
          model: newSelected[0].model || newSelected[0].name,
          provider: newSelected[0].provider || 'Unknown',
          selectedAt: new Date().toISOString()
        };
      } else {
        // Clear legacy deployment if no selections
        updateData.deployment = null;
      }

      await updateEvaluationMetadata(updateData);
      console.log('Deployment deselection updated');
    } catch (err) {
      console.error('Error updating deployment selection:', err);
      // Revert on error
      setSelectedDeployments([...selectedDeployments, deployment]);
    }
  };

  // Clear all selected deployments
  const handleClearAllDeployments = async () => {
    try {
      setSelectedDeployments([]);
      await updateEvaluationMetadata({
        deployments: [],
        deployment: null
      });
      console.log('All deployments cleared');
    } catch (err) {
      console.error('Error clearing deployment selections:', err);
    }
  };

  // Select all filtered deployments
  const handleSelectAllDeployments = async (filteredDeployments: Deployment[]) => {
    // Only select deployments that aren't already selected
    const newDeployments = filteredDeployments.filter(fd => 
      !selectedDeployments.some(sd => sd.id === fd.id)
    );
    
    if (newDeployments.length === 0) {
      return; // No new deployments to add
    }

    const newSelected = [...selectedDeployments, ...newDeployments];
    setSelectedDeployments(newSelected);
    
    try {
      await updateEvaluationMetadata({
        deployments: newSelected.map(d => ({
          id: d.id,
          name: d.name,
          model: d.model || d.name,
          provider: d.provider || 'Unknown',
          selectedAt: new Date().toISOString()
        })),
        deployment: {
          id: newSelected[0].id,
          name: newSelected[0].name,
          model: newSelected[0].model || newSelected[0].name,
          provider: newSelected[0].provider || 'Unknown',
          selectedAt: new Date().toISOString()
        }
      });
      console.log('All deployments selected');
    } catch (err) {
      console.error('Error selecting all deployments:', err);
      // Revert on error
      setSelectedDeployments(selectedDeployments);
    }
  };

  // Filter deployments with enhanced search
  const getFilteredDeployments = (searchTerm: string, provider: string, status: string) => {
    return deployments.filter(deployment => {
      const matchesSearch = deployment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (deployment.model || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (deployment.provider || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           deployment.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesProvider = provider === 'All Providers' || deployment.provider === provider;
      
      const matchesStatus = status === 'All Status' || 
                           deployment.status.toLowerCase() === status.toLowerCase();
      
      return matchesSearch && matchesProvider && matchesStatus;
    });
  };

  // Get deployment selection statistics
  const getSelectionStats = () => {
    const total = deployments.length;
    const selected = selectedDeployments.length;
    const activeSelected = selectedDeployments.filter(d => d.status === 'active').length;
    const inactiveSelected = selectedDeployments.filter(d => d.status === 'inactive').length;
    const errorSelected = selectedDeployments.filter(d => d.status === 'error').length;

    return {
      total,
      selected,
      activeSelected,
      inactiveSelected,
      errorSelected,
      selectionPercentage: total > 0 ? Math.round((selected / total) * 100) : 0
    };
  };

  // Check if a deployment is selected
  const isDeploymentSelected = (deploymentId: string): boolean => {
    return selectedDeployments.some(d => d.id === deploymentId);
  };

  // Get providers from selected deployments
  const getSelectedProviders = (): string[] => {
    return [...new Set(selectedDeployments.map(d => d.provider || 'Unknown'))];
  };

  // Get unique providers from all deployments
  const getAllProviders = (): string[] => {
    return [...new Set(deployments.map(d => d.provider || 'Unknown'))];
  };

  // Validate if current selection is valid for evaluation
  const validateSelection = () => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (selectedDeployments.length === 0) {
      errors.push('At least one deployment must be selected');
    }

    const errorDeployments = selectedDeployments.filter(d => d.status === 'error');
    if (errorDeployments.length > 0) {
      errors.push(`${errorDeployments.length} selected deployment(s) have errors and cannot be used`);
    }

    const inactiveDeployments = selectedDeployments.filter(d => d.status === 'inactive' || d.status === 'maintenance');
    if (inactiveDeployments.length > 0) {
      warnings.push(`${inactiveDeployments.length} selected deployment(s) are inactive`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };

  // 🔥 NEW: Refresh deployments from API
  const refreshDeployments = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Refreshing deployments from API...');
      
      const data = await getEvaluationDeployments();
      setDeployments(data);
      
      console.log('Successfully refreshed deployments');
    } catch (err) {
      console.error('Failed to refresh deployments:', err);
      setError('Failed to refresh deployments');
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    deployments,
    selectedDeployments,
    loading,
    error,

    // Actions
    handleDeploymentSelect,
    handleDeploymentDeselect,
    handleClearAllDeployments,
    handleSelectAllDeployments,
    
    // Utilities
    getFilteredDeployments,
    isDeploymentSelected,
    getSelectionStats,
    getSelectedProviders,
    getAllProviders,
    validateSelection,
    refreshDeployments, // 🔥 NEW

    // Computed values
    providers: getAllProviders(),
    
    // Legacy compatibility (for backward compatibility)
    selectedDeployment: selectedDeployments.length > 0 ? selectedDeployments[0] : null
  };
}