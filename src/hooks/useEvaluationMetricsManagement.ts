import { useState, useEffect, useCallback } from 'react';
import { loadEvaluationMetadata, updateEvaluationMetadata } from '../utils/evaluationUtils';
import type { MetricCategory, EvaluationMetadata } from '../utils/evaluationUtils';

export const useEvaluationMetricsManagement = () => {
  const [metricCategories, setMetricCategories] = useState<MetricCategory[]>([
    {
      id: 'answer-quality',
      name: 'Answer Quality',
      description: 'Evaluate how well responses answer questions and stay grounded in context',
      icon: '🎯',
      color: 'indigo',
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
          id: 'hallucination-detection',
          name: 'Hallucination Detection',
          description: 'Identifies when the model generates false or unsupported information',
          enabled: false
        }
      ]
    },
    {
      id: 'context-understanding',
      name: 'Context Understanding',
      description: 'Measure how well models comprehend and utilize provided context',
      icon: '📊',
      color: 'green',
      selected: false,
      subMetrics: [
        {
          id: 'context-recall',
          name: 'Context Recall',
          description: 'Measures how well the model recalls information from the context',
          enabled: false
        },
        {
          id: 'factual-consistency',
          name: 'Factual Consistency',
          description: 'Evaluates consistency of facts between context and answer',
          enabled: false
        }
      ]
    },
    {
      id: 'similarity-accuracy',
      name: 'Similarity & Accuracy',
      description: 'Compare outputs against expected responses using similarity measures',
      icon: '⚖️',
      color: 'yellow',
      selected: false,
      subMetrics: [
        {
          id: 'exact-match',
          name: 'Exact Match',
          description: 'Checks if the answer exactly matches the expected response',
          enabled: false
        },
        {
          id: 'bert-score',
          name: 'BERTScore',
          description: 'Semantic similarity using BERT embeddings',
          enabled: false
        },
        {
          id: 'embedding-distance',
          name: 'Embedding Distance',
          description: 'Cosine similarity between answer and reference embeddings',
          enabled: false
        }
      ]
    },
    {
      id: 'language-quality',
      name: 'Language Quality',
      description: 'Assess linguistic quality, fluency, and coherence of generated text',
      icon: '📝',
      color: 'purple',
      selected: false,
      subMetrics: [
        {
          id: 'fluency',
          name: 'Fluency',
          description: 'Evaluates the natural flow and readability of the text',
          enabled: false
        },
        {
          id: 'coherence',
          name: 'Coherence',
          description: 'Measures logical consistency and clarity of the response',
          enabled: false
        },
        {
          id: 'conciseness',
          name: 'Conciseness',
          description: 'Assesses if the answer is appropriately brief and to the point',
          enabled: false
        }
      ]
    }
  ]);

  const [selectedMetrics, setSelectedMetrics] = useState<MetricCategory[]>([]);
  const [evaluationModel, setEvaluationModel] = useState('gpt-4');
  const [batchSize, setBatchSize] = useState(50);
  const [timeout, setTimeout] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing configuration on mount
  useEffect(() => {
    const loadConfiguration = async () => {
      try {
        setLoading(true);
        
        // Always start with fresh default categories - no persistence
        const defaultCategories = [
          {
            id: 'answer-quality',
            name: 'Answer Quality',
            description: 'Evaluate how well responses answer questions and stay grounded in context',
            icon: '🎯',
            color: 'indigo',
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
                id: 'hallucination-detection',
                name: 'Hallucination Detection',
                description: 'Identifies when the model generates false or unsupported information',
                enabled: false
              }
            ]
          },
          {
            id: 'context-understanding',
            name: 'Context Understanding',
            description: 'Measure how well models comprehend and utilize provided context',
            icon: '📊',
            color: 'green',
            selected: false,
            subMetrics: [
              {
                id: 'context-recall',
                name: 'Context Recall',
                description: 'Measures how well the model recalls information from the context',
                enabled: false
              },
              {
                id: 'factual-consistency',
                name: 'Factual Consistency',
                description: 'Evaluates consistency of facts between context and answer',
                enabled: false
              }
            ]
          },
          {
            id: 'similarity-accuracy',
            name: 'Similarity & Accuracy',
            description: 'Compare outputs against expected responses using similarity measures',
            icon: '⚖️',
            color: 'yellow',
            selected: false,
            subMetrics: [
              {
                id: 'exact-match',
                name: 'Exact Match',
                description: 'Checks if the answer exactly matches the expected response',
                enabled: false
              },
              {
                id: 'bert-score',
                name: 'BERTScore',
                description: 'Semantic similarity using BERT embeddings',
                enabled: false
              },
              {
                id: 'embedding-distance',
                name: 'Embedding Distance',
                description: 'Cosine similarity between answer and reference embeddings',
                enabled: false
              }
            ]
          },
          {
            id: 'language-quality',
            name: 'Language Quality',
            description: 'Assess linguistic quality, fluency, and coherence of generated text',
            icon: '📝',
            color: 'purple',
            selected: false,
            subMetrics: [
              {
                id: 'fluency',
                name: 'Fluency',
                description: 'Evaluates the natural flow and readability of the text',
                enabled: false
              },
              {
                id: 'coherence',
                name: 'Coherence',
                description: 'Measures logical consistency and clarity of the response',
                enabled: false
              },
              {
                id: 'conciseness',
                name: 'Conciseness',
                description: 'Assesses if the answer is appropriately brief and to the point',
                enabled: false
              }
            ]
          }
        ];

        setMetricCategories(defaultCategories);
        setSelectedMetrics([]);
        setEvaluationModel('gpt-4');
        setBatchSize(50);
        setTimeout(30);
      } catch (err) {
        console.error('Error loading metrics configuration:', err);
        setError('Failed to load existing configuration');
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
        selected: category.id === categoryId, // Only allow one category to be selected
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