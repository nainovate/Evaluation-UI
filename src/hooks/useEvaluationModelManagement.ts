import { useState, useEffect } from 'react';
import { getEvaluationDeployments, updateEvaluationMetadata, getEvaluationMetadata } from '../utils/evaluationUtils';
import type { Deployment } from '../types';

export function useEvaluationModelManagement() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDeployments();
    loadSelectedDeployment();
  }, []);

  const loadDeployments = async () => {
    try {
      setLoading(true);
      const data = await getEvaluationDeployments();
      setDeployments(data);
      setError(null);
    } catch (err) {
      setError('Failed to load deployments');
      console.error('Error loading deployments:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSelectedDeployment = async () => {
    try {
      const metadata = await getEvaluationMetadata();
      if (metadata.deployment.id) {
        const deploymentList = await getEvaluationDeployments();
        const deployment = deploymentList.find(d => d.id === metadata.deployment.id);
        if (deployment) {
          setSelectedDeployment(deployment);
        }
      }
    } catch (err) {
      console.error('Error loading selected deployment:', err);
    }
  };

  const handleDeploymentSelect = async (deployment: Deployment) => {
    setSelectedDeployment(deployment);
    
    // Update metadata
    try {
      await updateEvaluationMetadata({
        deployment: {
          id: deployment.id,
          name: deployment.name,
          model: deployment.model,
          provider: deployment.provider,
          selectedAt: new Date().toISOString()
        }
      });
    } catch (err) {
      console.error('Error updating deployment selection:', err);
    }
  };

  const getFilteredDeployments = (searchTerm: string, provider: string, status: string) => {
    return deployments.filter(deployment => {
      const matchesSearch = deployment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           deployment.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           deployment.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesProvider = provider === 'All Providers' || deployment.provider === provider;
      
      const matchesStatus = status === 'All Status' || deployment.status === status.toLowerCase();
      
      return matchesSearch && matchesProvider && matchesStatus;
    });
  };

  const addDeployment = async (newDeployment: Deployment) => {
    setDeployments(prev => [...prev, newDeployment]);
  };

  const removeDeployment = async (deploymentId: string) => {
    setDeployments(prev => prev.filter(d => d.id !== deploymentId));
    if (selectedDeployment?.id === deploymentId) {
      setSelectedDeployment(null);
    }
  };

  const providers = ['All Providers', ...Array.from(new Set(deployments.map(d => d.provider)))];

  return {
    deployments,
    providers,
    selectedDeployment,
    loading,
    error,
    handleDeploymentSelect,
    getFilteredDeployments,
    loadDeployments,
    addDeployment,
    removeDeployment
  };
}