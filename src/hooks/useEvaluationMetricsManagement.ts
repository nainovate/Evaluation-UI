import { useState, useEffect, useCallback } from 'react';
import { updateEvaluationMetadata } from '../utils/evaluationUtils';
import type { MetricCategory, EvaluationMetadata } from '../utils/evaluationUtils';

export const useEvaluationMetricsManagement = () => {
  // Default metric categories with all blue colors
  const defaultCategories: MetricCategory[] = [
    {
      id: 'rag-metrics',
      name: 'RAG Metrics',
      description: 'Evaluate retrieval and generation quality in RAG systems',
      icon: '🔍',
      color: 'blue',
      selected: false,
      subMetrics: [
        {
          id: 'answer-relevancy',
          name: 'Answer Relevancy',
          description: 'Measures how relevant the answer is to the given question',
          enabled: false
        },
        {
          id: 'faithfulness',
          name: 'Faithfulness',
          description: 'Evaluates if the answer is grounded in the provided context',
          enabled: false
        },
        {
          id: 'contextual-relevancy',
          name: 'Contextual Relevancy',
          description: 'Assesses relevance of retrieved context to the question',
          enabled: false
        },
        {
          id: 'contextual-precision',
          name: 'Contextual Precision',
          description: 'Measures precision of context retrieval',
          enabled: false
        },
        {
          id: 'contextual-recall',
          name: 'Contextual Recall',
          description: 'Measures recall of context retrieval',
          enabled: false
        }
      ]
    },
    {
      id: 'safety-ethics',
      name: 'Safety & Ethics',
      description: 'Evaluate safety, bias, and toxicity in LLM outputs',
      icon: '🛡️',
      color: 'blue',
      selected: false,
      subMetrics: [
        {
          id: 'bias',
          name: 'Bias Detection',
          description: 'Identifies potential bias in generated responses',
          enabled: false
        },
        {
          id: 'toxicity',
          name: 'Toxicity Detection',
          description: 'Detects harmful or toxic content in outputs',
          enabled: false
        },
        {
          id: 'hallucination',
          name: 'Hallucination Detection',
          description: 'Identifies when the model generates false information',
          enabled: false
        }
      ]
    },
    {
      id: 'task-specific',
      name: 'Task-Specific Metrics',
      description: 'Metrics for specific NLP tasks like summarization',
      icon: '📝',
      color: 'blue',
      selected: false,
      subMetrics: [
        {
          id: 'summarization',
          name: 'Summarization Quality',
          description: 'Evaluates quality of generated summaries',
          enabled: false
        }
      ]
    },
    {
      id: 'custom-metrics',
      name: 'Custom Metrics',
      description: 'Flexible custom evaluation metrics using G-Eval',
      icon: '⚙️',
      color: 'blue',
      selected: false,
      subMetrics: [
        {
          id: 'g-eval',
          name: 'G-Eval',
          description: 'Custom evaluation using LLM-as-a-judge',
          enabled: false
        }
      ]
    }
  ];

  const [metricCategories, setMetricCategories] = useState<MetricCategory[]>(defaultCategories);
  const [selectedMetrics, setSelectedMetrics] = useState<MetricCategory[]>([]);
  const [evaluationModel, setEvaluationModel] = useState('gpt-4');
  const [batchSize, setBatchSize] = useState(50);
  const [timeout, setTimeout] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // ✅ ADD this useEffect to ensure categories are always loaded
useEffect(() => {
  // Initialize with default categories if we don't have any
  if (metricCategories.length === 0) {
    console.log('🔄 Initializing with default categories');
    setMetricCategories(defaultCategories);
  }
}, []);
  useEffect(() => {
    console.log('🔍 METRICS HOOK DEBUG:');
    console.log('  - defaultCategories.length:', defaultCategories.length);
    console.log('  - metricCategories.length:', metricCategories.length);
    console.log('  - metricCategories:', metricCategories);
    console.log('  - loading:', loading);
    console.log('  - error:', error);
  }, [metricCategories, loading, error]);
  const resetToDefaults = useCallback(() => {
  console.log('🔄 Resetting metrics to defaults');
  setMetricCategories(defaultCategories);
  setSelectedMetrics([]);
  setEvaluationModel('gpt-4');
  setBatchSize(50);
  setTimeout(30);
  setError(null);
}, []);
  const handleCategoryToggle = useCallback((categoryId: string) => {
    setMetricCategories(prev => {
      const newCategories = prev.map(category => ({
        ...category,
        selected: category.id === categoryId, // Only allow one category selected
        subMetrics: category.id === categoryId 
          ? category.subMetrics // Keep sub-metrics as they are for selected category
          : category.subMetrics.map(sm => ({ ...sm, enabled: false })) // Reset sub-metrics for unselected categories
      }));
      
      setSelectedMetrics(newCategories.filter(cat => cat.selected));
      return newCategories;
    });
  }, []);

  const handleSubMetricToggle = useCallback((categoryId: string, subMetricId: string) => {
    setMetricCategories(prev => {
      const newCategories = prev.map(category => 
        category.id === categoryId 
          ? {
              ...category,
              subMetrics: category.subMetrics.map(subMetric =>
                subMetric.id === subMetricId
                  ? { ...subMetric, enabled: !subMetric.enabled }
                  : subMetric
              )
            }
          : category
      );
      
      setSelectedMetrics(newCategories.filter(cat => cat.selected));
      return newCategories;
    });
  }, []);

  const handleEvaluationModelChange = useCallback((model: string) => {
    setEvaluationModel(model);
  }, []);

  const handleBatchSizeChange = useCallback((size: number) => {
    setBatchSize(size);
  }, []);

  const handleTimeoutChange = useCallback((timeoutValue: number) => {
    setTimeout(timeoutValue);
  }, []);

  const getTotalSelectedMetrics = useCallback(() => {
    return metricCategories
      .filter(category => category.selected)
      .reduce((total, category) => total + category.subMetrics.filter(sm => sm.enabled).length, 0);
  }, [metricCategories]);

  const getSelectedCategory = useCallback(() => {
    return metricCategories.find(category => category.selected) || null;
  }, [metricCategories]);

  const resetMetrics = useCallback(() => {
    setMetricCategories(prev => prev.map(category => ({
      ...category,
      selected: false,
      subMetrics: category.subMetrics.map(sm => ({ ...sm, enabled: false }))
    })));
    setSelectedMetrics([]);
  }, []);
  // ✅ REPLACE the restoreFromMetadata function with this safe version
const restoreFromMetadata = useCallback((savedMetrics: any) => {
  console.log('🔄 Restoring metrics from metadata:', savedMetrics);
  
  try {
    // ✅ ONLY restore if there are actual categories with data
    if (savedMetrics?.categories && savedMetrics.categories.length > 0) {
      // Check if categories have actual selection data
      const hasSelections = savedMetrics.categories.some((cat: any) => 
        cat.selected || (cat.subMetrics && cat.subMetrics.some((sm: any) => sm.enabled))
      );
      
      if (hasSelections) {
        console.log('  → Found valid category data, restoring...');
        setMetricCategories(savedMetrics.categories);
        setSelectedMetrics(savedMetrics.categories.filter((cat: any) => cat.selected));
      } else {
        console.log('  → Categories exist but no selections found, keeping defaults');
      }
    } else {
      console.log('  → No categories in metadata, keeping default categories');
    }
    
    // Restore configuration settings (always safe to restore)
    if (savedMetrics?.configuration) {
      console.log('  → Restoring configuration settings');
      if (savedMetrics.configuration.evaluationModel) {
        setEvaluationModel(savedMetrics.configuration.evaluationModel);
      }
      if (savedMetrics.configuration.batchSize) {
        setBatchSize(savedMetrics.configuration.batchSize);
      }
      if (savedMetrics.configuration.timeout) {
        setTimeout(savedMetrics.configuration.timeout);
      }
    }
    
    console.log('✅ Metrics restored successfully');
  } catch (error) {
    console.error('❌ Error restoring metrics:', error);
    // Keep existing categories on error
  }
}, []);
  const saveConfiguration = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);
    
    const selectedCategory = getSelectedCategory();
    if (!selectedCategory) {
      throw new Error('No category selected');
    }
    try {
      await updateEvaluationMetadata({
        metrics: {
          categories: metricCategories,
          selectedCategory: selectedCategory.id,
          totalSelected: getTotalSelectedMetrics(),
          configuration: {
            evaluationModel,
            batchSize,
            timeout
          },
          configuredAt: new Date().toISOString()
        }
      });
    } catch (metadataError) {
      console.log('Could not update main metadata, but local config will be handled by main system');
    }

    console.log('✅ Metrics configuration ready for main system');
  } catch (err) {
    console.error('❌ Error preparing metrics configuration:', err);
    setError('Failed to save configuration');
    throw err;
  } finally {
    setLoading(false);
  }
}, [metricCategories, evaluationModel, batchSize, timeout, getTotalSelectedMetrics, getSelectedCategory]);
  return {
    metricCategories,
    selectedMetrics,
    evaluationModel,
    batchSize,
    timeout,
    loading,
    error,
    handleCategoryToggle,
    handleSubMetricToggle,
    handleEvaluationModelChange,
    handleBatchSizeChange,
    handleTimeoutChange,
    getTotalSelectedMetrics,
    getSelectedCategory,
    resetMetrics,
    restoreFromMetadata,
    resetToDefaults,
    saveConfiguration
  };
};