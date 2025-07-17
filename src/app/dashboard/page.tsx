'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BaseLayout } from '../../components/layouts/BaseLayout'

export default function NainovateDashboard() {
  const router = useRouter()
  const [currentJobIndex, setCurrentJobIndex] = useState(0)
  const [pastEvaluationIndex, setPastEvaluationIndex] = useState(0) // New state for past evaluations

  const handleCreateNewEvaluation = () => {
    router.push('/evaluation/start')
  }

  const handleViewEvaluationDetails = (evaluationName: string) => {
    router.push(`/evaluation/status?name=${encodeURIComponent(evaluationName)}`)
  }

  const handleViewAllEvaluations = () => {
    console.log('View all evaluations')
  }

  const scrollJobs = (direction: 'left' | 'right') => {
    const maxIndex = 2
    if (direction === 'left' && currentJobIndex > 0) {
      setCurrentJobIndex(currentJobIndex - 1)
    } else if (direction === 'right' && currentJobIndex < maxIndex) {
      setCurrentJobIndex(currentJobIndex + 1)
    }
  }

  // New function for past evaluations scrolling
  const scrollPastEvaluations = (direction: 'left' | 'right') => {
    const maxIndex = 3 // We have 6 cards, showing 3 at a time, so max index is 3
    if (direction === 'left' && pastEvaluationIndex > 0) {
      setPastEvaluationIndex(pastEvaluationIndex - 1)
    } else if (direction === 'right' && pastEvaluationIndex < maxIndex) {
      setPastEvaluationIndex(pastEvaluationIndex + 1)
    }
  }

  // Past evaluations data with enhanced structure
  const pastEvaluations = [
    {
      name: 'Customer Support Baseline',
      status: 'completed',
      completedDate: '7/8/2025',
      model: 'Claude-3 Sonnet',
      dataset: 'Customer Support Conversations v1',
      metrics: { accuracy: '94.2%', relevancy: '92.8%' },
      tags: ['customer-service', 'baseline']
    },
    {
      name: 'Content Generation Eval',
      status: 'completed',
      completedDate: '7/6/2025',
      model: 'GPT-4 Turbo',
      dataset: 'Content Generation Benchmark',
      metrics: { coherence: '89.5%', fluency: '96.1%' },
      tags: ['content', 'generation']
    },
    {
      name: 'Bias Detection Test',
      status: 'failed',
      completedDate: '7/4/2025',
      model: 'GPT-3.5 Turbo',
      dataset: 'Bias Detection Dataset',
      error: 'Dataset validation failed',
      tags: ['bias', 'safety']
    },
    {
      name: 'Code Quality Assessment',
      status: 'completed',
      completedDate: '7/2/2025',
      model: 'Claude-3 Opus',
      dataset: 'Code Review Evaluation Suite',
      metrics: { correctness: '91.7%', efficiency: '87.3%' },
      tags: ['code', 'quality']
    },
    {
      name: 'Multilingual Translation',
      status: 'completed',
      completedDate: '6/30/2025',
      model: 'GPT-4',
      dataset: 'Translation Quality Benchmark',
      metrics: { bleu: '84.6', accuracy: '90.2%' },
      tags: ['translation', 'multilingual']
    },
    {
      name: 'Sentiment Analysis Benchmark',
      status: 'completed',
      completedDate: '6/28/2025',
      model: 'Claude-3 Haiku',
      dataset: 'Sentiment Analysis Dataset',
      metrics: { f1Score: '0.923', precision: '94.1%' },
      tags: ['sentiment', 'classification']
    }
  ]

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          badge: 'bg-green-500',
          label: 'Completed'
        };
      case 'failed':
        return {
          badge: 'bg-red-500',
          label: 'Failed'
        };
      default:
        return {
          badge: 'bg-gray-500',
          label: 'Unknown'
        };
    }
  }

  return (
    <BaseLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto p-8">
          
          {/* Welcome Section */}
          <div className="dashboard-welcome bg-white dark:bg-gray-800 rounded-2xl p-12 mb-8 text-center border border-gray-200 dark:border-gray-700 transition-all duration-300">
            <h1 className="text-4xl font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">
              Welcome back, Alex
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 transition-colors duration-300">
              Here's what's happening with your evaluation projects today
            </p>
            <button 
              onClick={handleCreateNewEvaluation}
              className="dashboard-cta bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 inline-flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-lg"
            >
              + Create New Evaluation
            </button>
          </div>

          {/* Enhanced Statistics Cards */}
          <div className="dashboard-stats grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="stat-card bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="stat-number text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">12</div>
              <div className="stat-label text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Active Evaluations</div>
              <div className="stat-change positive bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-lg text-xs font-medium">
                3 running, 9 queued
              </div>
            </div>

            <div className="stat-card bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="stat-number text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">847</div>
              <div className="stat-label text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Completed Evaluations</div>
              <div className="stat-change positive bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-lg text-xs font-medium">
                +23 from last week
              </div>
            </div>

            <div className="stat-card bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="stat-number text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">24</div>
              <div className="stat-label text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Total Datasets</div>
              <div className="stat-change positive bg-green-100 dark:bg-green-700/50 text-green-700 dark:text-green-300 px-2 py-1 rounded-lg text-xs font-medium">
                + 1 this month
              </div>
            </div>

            <div className="stat-card bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="stat-number text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">94.8%</div>
              <div className="stat-label text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Evaluation Success Rate</div>
              <div className="stat-change positive bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-lg text-xs font-medium">
                +1.2% this week
              </div>
            </div>
          </div>

          {/* Current Evaluations Section */}
          <div className="dashboard-section-title text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Current Evaluations
          </div>

          <div className="jobs-container relative mb-12">
            {/* Navigation Buttons */}
            <button 
              onClick={() => scrollJobs('left')}
              disabled={currentJobIndex === 0}
              className="jobs-nav-btn prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed z-10"
            >
              ‹
            </button>
            
            <button 
              onClick={() => scrollJobs('right')}
              disabled={currentJobIndex === 2}
              className="jobs-nav-btn next absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed z-10"
            >
              ›
            </button>

            {/* Jobs Grid */}
            <div className="jobs-scroll-wrapper overflow-hidden mx-8">
              <div 
                className="jobs-grid flex gap-6 transition-transform duration-300"
                style={{ transform: `translateX(-${currentJobIndex * 350}px)` }}
              >
                {/* Current Job Cards - keeping original cards */}
                <div 
                  className="job-card flex-shrink-0 w-80 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                  onClick={() => handleViewEvaluationDetails('Customer Support Evaluation')}
                >
                  <div className="job-header flex justify-between items-start mb-4">
                    <div className="job-title text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Customer Support Evaluation
                    </div>
                    <span className="job-status status-running bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      running
                    </span>
                  </div>
                  
                  <div className="job-details space-y-2 mb-4">
                    <div className="job-detail text-sm text-gray-600 dark:text-gray-400">Model: Claude-3.5 Sonnet</div>
                    <div className="job-detail text-sm text-gray-600 dark:text-gray-400">Dataset: Customer Support Conversations v2</div>
                    <div className="job-detail text-sm text-gray-600 dark:text-gray-400">Started: 6/30/2025</div>
                    <div className="job-detail text-sm text-gray-600 dark:text-gray-400">Metrics: Answer Relevancy, Faithfulness</div>
                  </div>
                  
                  <div className="job-progress">
                    <div className="progress-label flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">75%</span>
                    </div>
                    <div className="progress-bar w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="progress-fill bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Add all your other current job cards here... */}
                <div 
                  className="job-card flex-shrink-0 w-80 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                  onClick={() => handleViewEvaluationDetails('Content Quality Assessment')}
                >
                  <div className="job-header flex justify-between items-start mb-4">
                    <div className="job-title text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Content Quality Assessment
                    </div>
                    <span className="job-status status-queued bg-yellow-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      queued
                    </span>
                  </div>
                  
                  <div className="job-details space-y-2 mb-4">
                    <div className="job-detail text-sm text-gray-600 dark:text-gray-400">Model: GPT-4 Turbo</div>
                    <div className="job-detail text-sm text-gray-600 dark:text-gray-400">Dataset: Content Generation Benchmark</div>
                    <div className="job-detail text-sm text-gray-600 dark:text-gray-400">Started: 6/30/2025</div>
                    <div className="job-detail text-sm text-gray-600 dark:text-gray-400">Metrics: Coherence, Contextual Relevancy</div>
                  </div>
                </div>

                {/* Continue with other current job cards... (add remaining 3 cards) */}
                <div 
                  className="job-card flex-shrink-0 w-80 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                  onClick={() => handleViewEvaluationDetails('Code Review Analysis')}
                >
                  <div className="job-header flex justify-between items-start mb-4">
                    <div className="job-title text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Code Review Analysis
                    </div>
                    <span className="job-status status-created bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      created
                    </span>
                  </div>
                  
                  <div className="job-details space-y-2 mb-4">
                    <div className="job-detail text-sm text-gray-600 dark:text-gray-400">Model: Claude-3 Opus</div>
                    <div className="job-detail text-sm text-gray-600 dark:text-gray-400">Dataset: Code Review Evaluation Suite</div>
                    <div className="job-detail text-sm text-gray-600 dark:text-gray-400">Started: 7/1/2025</div>
                    <div className="job-detail text-sm text-gray-600 dark:text-gray-400">Metrics: Correctness, Efficiency</div>
                  </div>
                </div>

                <div 
                  className="job-card flex-shrink-0 w-80 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                  onClick={() => handleViewEvaluationDetails('Medical Response Accuracy')}
                >
                  <div className="job-header flex justify-between items-start mb-4">
                    <div className="job-title text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Medical Response Accuracy
                    </div>
                    <span className="job-status status-running bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      running
                    </span>
                  </div>
                  
                  <div className="job-details space-y-2 mb-4">
                    <div className="job-detail text-sm text-gray-600 dark:text-gray-400">Model: Claude-3 Sonnet</div>
                    <div className="job-detail text-sm text-gray-600 dark:text-gray-400">Dataset: Medical QA Evaluation</div>
                    <div className="job-detail text-sm text-gray-600 dark:text-gray-400">Started: 6/29/2025</div>
                    <div className="job-detail text-sm text-gray-600 dark:text-gray-400">Metrics: Medical Accuracy, Safety</div>
                  </div>
                  
                  <div className="job-progress">
                    <div className="progress-label flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">42%</span>
                    </div>
                    <div className="progress-bar w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="progress-fill bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                </div>

                <div 
                  className="job-card flex-shrink-0 w-80 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                  onClick={() => handleViewEvaluationDetails('Translation Quality Check')}
                >
                  <div className="job-header flex justify-between items-start mb-4">
                    <div className="job-title text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Translation Quality Check
                    </div>
                    <span className="job-status status-queued bg-yellow-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      queued
                    </span>
                  </div>
                  
                  <div className="job-details space-y-2 mb-4">
                    <div className="job-detail text-sm text-gray-600 dark:text-gray-400">Model: GPT-4</div>
                    <div className="job-detail text-sm text-gray-600 dark:text-gray-400">Dataset: Translation Quality Benchmark</div>
                    <div className="job-detail text-sm text-gray-600 dark:text-gray-400">Created: 6/28/2025</div>
                    <div className="job-detail text-sm text-gray-600 dark:text-gray-400">Metrics: BLEU Score, Fluency</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Past Evaluations Section - Updated with Side Arrow Navigation */}
          <div className="past-evaluations-section">
            <div className="section-header flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Past Evaluations</h2>
            </div>
            
            {/* Past Evaluations Container with Navigation */}
            <div className="past-evaluations-container relative">
              {/* Navigation Buttons */}
              <button 
                onClick={() => scrollPastEvaluations('left')}
                disabled={pastEvaluationIndex === 0}
                className="past-nav-btn prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed z-10"
              >
                ‹
              </button>
              
              <button 
                onClick={() => scrollPastEvaluations('right')}
                disabled={pastEvaluationIndex === 3}
                className="past-nav-btn next absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed z-10"
              >
                ›
              </button>

              {/* Past Evaluations Grid with Scroll */}
              <div className="past-evaluations-scroll-wrapper overflow-hidden mx-8">
                <div 
                  className="past-evaluations-grid flex gap-6 transition-transform duration-300"
                  style={{ transform: `translateX(-${pastEvaluationIndex * 350}px)` }}
                >
                  {pastEvaluations.map((evaluation, index) => {
                    const statusConfig = getStatusConfig(evaluation.status);
                    
                    return (
                      <div 
                        key={index}
                        className="job-card flex-shrink-0 w-80 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                        onClick={() => handleViewEvaluationDetails(evaluation.name)}
                      >
                        {/* Job Header */}
                        <div className="job-header flex justify-between items-start mb-4">
                          <div className="job-title text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {evaluation.name}
                          </div>
                          <span className={`job-status ${statusConfig.badge} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                            {statusConfig.label}
                          </span>
                        </div>
                        
                        {/* Job Details */}
                        <div className="job-details space-y-2 mb-4">
                          <div className="job-detail text-sm text-gray-600 dark:text-gray-400">
                            🤖 {evaluation.model}
                          </div>
                          <div className="job-detail text-sm text-gray-600 dark:text-gray-400">
                            📊 {evaluation.dataset}
                          </div>
                          <div className="job-detail text-sm text-gray-600 dark:text-gray-400">
                            📅 Completed: {evaluation.completedDate}
                          </div>
                          {evaluation.status === 'completed' && evaluation.metrics && (
                            <div className="job-detail text-sm text-gray-600 dark:text-gray-400">
                              🎯 Metrics: {Object.keys(evaluation.metrics).join(', ')}
                            </div>
                          )}
                        </div>

                        {/* Tags */}
                        {evaluation.tags && (
                          <div className="job-tags flex gap-1 items-center mb-3">
                            {evaluation.tags.slice(0, 2).map((tag, tagIndex) => (
                              <span key={tagIndex} className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                            {evaluation.tags.length > 2 && (
                              <span className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                                +{evaluation.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Metrics Results or Error */}
                        {evaluation.status === 'completed' && evaluation.metrics ? (
                          <div className="metrics-results">
                            <div className="metrics-grid grid grid-cols-2 gap-2">
                              {Object.entries(evaluation.metrics).map(([key, value], metricIndex) => (
                                <div key={metricIndex} className="metric-item bg-gray-50 dark:bg-gray-700 rounded p-2">
                                  <div className="metric-label text-xs text-gray-600 dark:text-gray-400">
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                  </div>
                                  <div className="metric-value text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    {value}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : evaluation.status === 'failed' && (
                          <div className="error-info bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                            <div className="error-label text-xs text-red-600 dark:text-red-400 font-medium mb-1">
                              Error Details
                            </div>
                            <div className="error-message text-sm text-red-700 dark:text-red-300">
                              {evaluation.error}
                            </div>
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
      </div>
    </BaseLayout>
  )
}