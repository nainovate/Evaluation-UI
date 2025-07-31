import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Home, Clock, CheckCircle, AlertCircle, Loader, PlayCircle, Database, Cpu, BarChart3, Calendar, Target, Zap, TrendingUp, Users, Activity, ArrowRight } from 'lucide-react';
import { useEvaluationData } from '../../hooks/useEvaluationData';

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
  const router = useRouter();

  // Get API data (but keep original hardcoded jobs for now to maintain functionality)
  const { evaluationRuns, loading: apiLoading } = useEvaluationData();

  // 🔥 FIXED: Keep original hardcoded jobs but add API data as additional items
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
    }
  ]);

  const [cardsVisible, setCardsVisible] = useState(false);
  const [checkmarkVisible, setCheckmarkVisible] = useState(false);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [stats, setStats] = useState({
    active: 0,
    queued: 0,
    completed: 0,
    successRate: 0
  });

  useEffect(() => {
    // Trigger checkmark animation first
    const checkmarkTimer = setTimeout(() => setCheckmarkVisible(true), 300);
    
    // Then show cards after checkmark animation
    const cardsTimer = setTimeout(() => setCardsVisible(true), 1000);

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

    return () => {
      clearTimeout(checkmarkTimer);
      clearTimeout(cardsTimer);
    };
  }, [jobs]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          badge: 'bg-green-600',
          label: 'completed',
          icon: <CheckCircle className="w-3 h-3" />
        };
      case 'running':
        return {
          badge: 'bg-blue-600',
          label: 'running',
          icon: <Loader className="w-3 h-3 animate-spin" />
        };
      case 'queued':
      case 'created':
        return {
          badge: 'bg-yellow-600',
          label: 'queued',
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

  // 🔥 FIXED: Enhanced handleViewProgress function with debug logging
  const handleViewProgress = () => {
    console.log('View Progress clicked, evaluationName:', evaluationName);
    console.log('onViewProgress prop:', onViewProgress);
    
    if (onViewProgress) {
      console.log('Using onViewProgress callback');
      onViewProgress();
    } else {
      const targetUrl = `/evaluation/status?name=${encodeURIComponent(evaluationName)}`;
      console.log('Navigating to:', targetUrl);
      router.push(targetUrl);
    }
  };

  const handleReturnHome = () => {
    if (onReturnHome) {
      onReturnHome();
    } else {
      router.push('/dashboard');
    }
  };

  const handleViewAllEvaluations = () => {
    router.push('/dashboard');
  };

  const handleJobCardClick = (job: JobData) => {
    console.log('Job card clicked:', job.title);
    if (job.id === '3' || job.title === evaluationName) {
      handleViewProgress();
    } else {
      router.push(`/evaluation/status?name=${encodeURIComponent(job.title)}`);
    }
  };

  const scrollJobs = (direction: 'left' | 'right') => {
    const maxIndex = Math.max(0, jobs.length - 3);
    if (direction === 'left' && currentJobIndex > 0) {
      setCurrentJobIndex(currentJobIndex - 1);
    } else if (direction === 'right' && currentJobIndex < maxIndex) {
      setCurrentJobIndex(currentJobIndex + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <div className="flex items-center justify-center mb-6">
            <div 
              className={`w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center transition-all duration-700 ${
                checkmarkVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
              }`}
              style={{
                background: checkmarkVisible ? 'linear-gradient(135deg, #10b981, #059669)' : '',
                boxShadow: checkmarkVisible ? '0 8px 32px rgba(16, 185, 129, 0.3)' : '',
              }}
            >
              <CheckCircle 
                className={`w-10 h-10 text-white transition-all duration-500 ${
                  checkmarkVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                }`}
                style={{
                  animationDelay: '0.3s',
                  animation: checkmarkVisible ? 'checkmark-bounce 0.6s ease-out 0.3s both' : 'none'
                }}
              />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Evaluation Created Successfully! 🎉
            </h1>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                {evaluationName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {evaluationDescription}
              </p>
            </div>
          </div>

          {/* Action Buttons - 🔥 ADDED DEBUG INFO */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleViewProgress}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
              title={`Navigate to evaluation status for: ${evaluationName}`}
            >
              <Eye className="w-5 h-5" />
              View Progress
            </button>
            
            <button
              onClick={handleReturnHome}
              className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              Return to Dashboard
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
            Evaluation Pipeline Status
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="stat-card bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <Activity className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.active}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">Active</div>
                </div>
              </div>
            </div>

            <div className="stat-card bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {stats.queued}
                  </div>
                  <div className="text-sm text-yellow-700 dark:text-yellow-300">Queued</div>
                </div>
              </div>
            </div>

            <div className="stat-card bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                <div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats.completed}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">Completed</div>
                </div>
              </div>
            </div>

            <div className="stat-card bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                <div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {stats.successRate}%
                  </div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">Success Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Jobs Carousel */}
          <div className="relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Recent Evaluations
              </h3>
              <button 
                onClick={handleViewAllEvaluations}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Buttons */}
            <button 
              onClick={() => scrollJobs('left')}
              disabled={currentJobIndex === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white dark:bg-gray-700 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed z-10"
            >
              ‹
            </button>
            
            <button 
              onClick={() => scrollJobs('right')}
              disabled={currentJobIndex >= Math.max(0, jobs.length - 3)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white dark:bg-gray-700 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed z-10"
            >
              ›
            </button>

            {/* Jobs Grid */}
            <div className={`overflow-hidden transition-all duration-1000 ${cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div 
                className="flex gap-6 transition-transform duration-300"
                style={{ 
                  transform: `translateX(-${currentJobIndex * 320}px)`,
                  paddingLeft: '20px',
                  paddingRight: '20px'
                }}
              >
                {jobs.map((job, index) => {
                  const statusConfig = getStatusConfig(job.status);
                  
                  return (
                    <div
                      key={job.id}
                      className="job-card flex-shrink-0 w-72 bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                      onClick={() => handleJobCardClick(job)}
                      style={{
                        animationDelay: `${index * 150}ms`
                      }}
                    >
                      {/* Job Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="job-title text-base font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                          {job.title}
                        </div>
                        <span className={`job-status ${statusConfig.badge} text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      </div>

                      {/* Job Details */}
                      <div className="job-details space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Cpu className="w-4 h-4" />
                          {job.model}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Database className="w-4 h-4" />
                          {job.dataset}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          {job.created}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Target className="w-4 h-4" />
                          {job.testCases}
                        </div>
                      </div>

                      {/* Progress Bar (for running jobs) */}
                      {job.status === 'running' && job.progress !== undefined && (
                        <div className="progress-section mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Progress</span>
                            <span className="text-xs text-gray-600 dark:text-gray-400">{job.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${job.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Job Footer */}
                      <div className="job-footer flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-600">
                        <div className="time-info text-xs text-gray-500 dark:text-gray-400">
                          {job.timeInfo}
                        </div>
                        <div className="cost-info text-xs font-medium text-gray-700 dark:text-gray-300">
                          {job.cost}
                        </div>
                      </div>

                      {job.score && (
                        <div className="score-badge mt-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs font-medium text-center">
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
      </div>

      <style jsx>{`
        @keyframes checkmark-bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0, 0, 0);
          }
          40%, 43% {
            transform: translate3d(0, -6px, 0);
          }
          70% {
            transform: translate3d(0, -3px, 0);
          }
          90% {
            transform: translate3d(0, -1px, 0);
          }
        }
      `}</style>
    </div>
  );
};