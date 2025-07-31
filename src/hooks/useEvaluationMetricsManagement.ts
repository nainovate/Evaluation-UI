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

  // Load existing configuration on mount (simplified)
  useEffect(() => {
    const loadConfiguration = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to load from localStorage
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('evaluationMetrics');
          if (stored) {
            const data = JSON.parse(stored);
            if (data.categories) {
              setMetricCategories(data.categories);
              setSelectedMetrics(data.categories.filter((cat: MetricCategory) => cat.selected));
            }
            if (data.configuration) {
              setEvaluationModel(data.configuration.evaluationModel || 'gpt-4');
              setBatchSize(data.configuration.batchSize || 50);
              setTimeout(data.configuration.timeout || 30);
            }
          }
        }
        
      } catch (err) {
        console.error('Error loading metrics configuration:', err);
        // Don't set error state, just use defaults
      } finally {
        setLoading(false);
      }
    };

    loadConfiguration();
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

  const saveConfiguration = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const selectedCategory = getSelectedCategory();
      if (!selectedCategory) {
        throw new Error('No category selected');
      }

      const configData = {
        categories: metricCategories,
        selectedCategory: selectedCategory.id,
        totalSelected: getTotalSelectedMetrics(),
        configuration: {
          evaluationModel,
          batchSize,
          timeout
        },
        configuredAt: new Date().toISOString()
      };

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('evaluationMetrics', JSON.stringify(configData));
      }

      // Also try to update main metadata
      try {
        await updateEvaluationMetadata({
          metrics: configData
        });
      } catch (metadataError) {
        console.log('Could not update main metadata, but local config saved');
      }

      console.log('✅ Metrics configuration saved successfully');
    } catch (err) {
      console.error('❌ Error saving metrics configuration:', err);
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
    saveConfiguration
  };
};