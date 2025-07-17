import React, { useState, useEffect } from 'react';
import { Eye, Home, Clock, CheckCircle, AlertCircle, Loader, PlayCircle, Database, Cpu, BarChart3, Calendar, Target, Zap, TrendingUp, Users, Activity } from 'lucide-react';

interface JobData {
  id: string;
  title: string;
  status: 'running' | 'completed' | 'pending' | 'failed' | 'queued' | 'created';
  model: string;
  dataset: string;
  progress?: number;
  timeInfo: string;
  extraInfo: string;
  created: string;
  metrics: string;
  score?: string;
  testCases?: string;
  cost?: string;
}

interface SuccessProps {
  evaluationName?: string;
  evaluationDescription?: string;
  onViewProgress?: () => void;
  onReturnHome?: () => void;
  metadata?: {
    dataset?: { name: string; rows: number; taskType: string };
    deployment?: { name: string; model: string; provider: string };
    metrics?: { totalSelected: number; configuration?: { evaluationModel: string; batchSize: number; timeout: number } };
  };
}

export const Success: React.FC<SuccessProps> = ({
  evaluationName = 'Customer Support Quality Assessment',
  evaluationDescription = 'Comprehensive evaluation of customer support responses',
  onViewProgress,
  onReturnHome,
  metadata
}) => {
  const [jobs, setJobs] = useState<JobData[]>([
    {
      id: '1',
      title: 'Customer Support Evaluation',
      status: 'running',
      model: 'Claude-3.5 Sonnet',
      dataset: 'Customer Support Conversations v2',
      progress: 75,
      timeInfo: 'Started 8 mins ago',
      extraInfo: '75% completed',
      created: '6/30/2025',
      metrics: 'Answer Relevancy, Faithfulness',
      testCases: '2,400 test cases',
      cost: '$12.45'
    },
    {
      id: '2',
      title: 'Content Quality Assessment',
      status: 'queued',
      model: 'GPT-4 Turbo',
      dataset: 'Content Generation Benchmark',
      timeInfo: '2 hours ago',
      extraInfo: 'Queued for processing',
      created: '6/30/2025',
      metrics: 'Coherence, Contextual Relevancy',
      testCases: '1,800 test cases',
      cost: '$8.90'
    },
    {
      id: '3',
      title: evaluationName,
      status: 'created',
      model: metadata?.deployment?.model || 'GPT-4 Turbo',
      dataset: metadata?.dataset?.name || 'Custom Evaluation Dataset',
      timeInfo: 'Just created',
      extraInfo: 'Starting soon',
      created: new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }),
      metrics: 'Custom Metrics',
      testCases: `${metadata?.dataset?.rows || 1500} test cases`,
      cost: `$${((metadata?.dataset?.rows || 1500) * (metadata?.metrics?.totalSelected || 3) * 0.001).toFixed(2)}`
    },
    {
      id: '4',
      title: 'Medical Response Accuracy',
      status: 'running',
      model: 'Claude-3 Sonnet',
      dataset: 'Medical QA Evaluation',
      progress: 42,
      timeInfo: 'Started 2 hours ago',
      extraInfo: '42% completed',
      created: '6/29/2025',
      metrics: 'Medical Accuracy, Safety',
      testCases: '3,200 test cases',
      cost: '$15.60'
    },
    {
      id: '5',
      title: 'Multilingual Translation Quality',
      status: 'completed',
      model: 'GPT-4',
      dataset: 'Translation Quality Benchmark',
      timeInfo: 'Completed 1 hour ago',
      extraInfo: 'Completed successfully',
      created: '6/28/2025',
      metrics: 'BLEU Score, Fluency',
      score: '91.7% BLEU score',
      testCases: '5,000 test cases',
      cost: '$22.15'
    },
    {
      id: '6',
      title: 'Bias Detection Evaluation',
      status: 'failed',
      model: 'GPT-3.5 Turbo',
      dataset: 'Bias Detection Suite',
      timeInfo: 'Failed 30 mins ago',
      extraInfo: 'Dataset validation failed',
      created: '6/27/2025',
      metrics: 'Bias Detection, Fairness',
      testCases: '800 test cases',
      cost: '$0.00'
    }
  ]);

  const [cardsVisible, setCardsVisible] = useState(false);
  const [stats, setStats] = useState({
    active: 0,
    queued: 0,
    completed: 0,
    successRate: 0
  });

  useEffect(() => {
    const timer = setTimeout(() => setCardsVisible(true), 100);

    // Calculate stats
    const activeJobs = jobs.filter(job => job.status === 'running').length;
    const queuedJobs = jobs.filter(job => job.status === 'queued' || job.status === 'created').length;
    const completedJobs = jobs.filter(job => job.status === 'completed').length;
    const totalJobs = jobs.length;
    const successRate = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;

    setStats({
      active: activeJobs,
      queued: queuedJobs,
      completed: completedJobs,
      successRate
    });

    // Update job progress
    const interval = setInterval(() => {
      setJobs(prevJobs => 
        prevJobs.map(job => {
          if (job.status === 'running' && job.progress && job.progress < 100) {
            const newProgress = Math.min(job.progress + Math.random() * 2, 100);
            const remainingMinutes = Math.max(0, Math.round((100 - newProgress) / 15));
            
            return {
              ...job,
              progress: newProgress,
              extraInfo: `${Math.round(newProgress)}% completed`,
              timeInfo: newProgress >= 100 ? 'Just completed' : 
                remainingMinutes > 0 ? `Est. ${remainingMinutes} mins remaining` : 'Completing...'
            };
          }
          return job;
        })
      );
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [jobs.length]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'running':
        return {
          badge: 'bg-blue-600',
          label: 'running',
          icon: <Activity className="w-3 h-3" />
        };
      case 'completed':
        return {
          badge: 'bg-green-600',
          label: 'completed',
          icon: <CheckCircle className="w-3 h-3" />
        };
      case 'queued':
        return {
          badge: 'bg-yellow-600',
          label: 'queued',
          icon: <Clock className="w-3 h-3" />
        };
      case 'created':
        return {
          badge: 'bg-purple-600',
          label: 'created',
          icon: <PlayCircle className="w-3 h-3" />
        };
      case 'pending':
        return {
          badge: 'bg-gray-600',
          label: 'pending',
          icon: <Clock className="w-3 h-3" />
        };
      case 'failed':
        return {
          badge: 'bg-red-600',
          label: 'failed',
          icon: <AlertCircle className="w-3 h-3" />
        };
      default:
        return {
          badge: 'bg-gray-600',
          label: 'unknown',
          icon: <AlertCircle className="w-3 h-3" />
        };
    }
  };

  const handleViewProgress = () => {
    if (onViewProgress) {
      onViewProgress();
    } else {
      console.log('Navigating to evaluation progress dashboard...');
    }
  };

  const handleReturnHome = () => {
    if (onReturnHome) {
      onReturnHome();
    } else {
      console.log('Returning to main dashboard...');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Evaluation Created Successfully
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your evaluation has been queued and will start processing shortly
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                "{evaluationName}"
              </h3>
              {evaluationDescription && (
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {evaluationDescription}
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center">
                  <Database className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {metadata?.dataset?.rows || 1500} test cases
                  </span>
                </div>
                <div className="flex items-center">
                  <Cpu className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {metadata?.deployment?.model || 'GPT-4 Turbo'}
                  </span>
                </div>
                <div className="flex items-center">
                  <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {metadata?.metrics?.totalSelected || 3} metrics
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleViewProgress}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Progress
              </button>
              <button
                onClick={handleReturnHome}
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Home className="w-4 h-4" />
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Jobs</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.active}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">In Queue</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.queued}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.completed}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.successRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Evaluations */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Current Evaluations
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {jobs.length} evaluations
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, index) => {
              const statusConfig = getStatusConfig(job.status);
              
              return (
                <div
                  key={job.id}
                  className={`bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-300 cursor-pointer ${
                    cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
                      {job.title}
                    </h4>
                    <div className={`${statusConfig.badge} text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
                      {statusConfig.icon}
                      {statusConfig.label}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Cpu className="w-4 h-4 mr-2" />
                      Model: {job.model}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Database className="w-4 h-4 mr-2" />
                      Dataset: {job.dataset}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      Created: {job.created}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Target className="w-4 h-4 mr-2" />
                      Metrics: {job.metrics}
                    </div>
                  </div>
                  
                  {job.progress !== undefined && job.status === 'running' && (
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {Math.round(job.progress)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {job.timeInfo}
                    </span>
                    <span className="text-gray-500 dark:text-gray-500">
                      {job.testCases}
                    </span>
                  </div>
                  
                  {job.score && (
                    <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                      {job.score}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};