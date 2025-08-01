'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BaseLayout } from '../../components/layouts/BaseLayout'

export default function NainovateDashboard() {
  const router = useRouter()
  const [currentJobIndex, setCurrentJobIndex] = useState(0)
  const [pastEvaluationIndex, setPastEvaluationIndex] = useState(0)

  // API Data State - NO hardcoded values
  const [dashboardData, setDashboardData] = useState({
    stats: null as any,
    currentJobs: [] as any[],
    pastEvaluations: [] as any[]
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Call API directly
        const response = await fetch('/api/evaluations')
        
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`)
        }
        
        const apiData = await response.json()
        
        if (!apiData.success || !apiData.data) {
          throw new Error('Invalid API response format')
        }

        const { dashboardStats, evaluationRuns } = apiData.data

        // Separate current jobs (in-progress/pending) from past evaluations (completed/failed)
        const currentJobs = evaluationRuns.filter((run: any) => 
          run.status === 'in-progress' || run.status === 'pending'
        )
        const pastEvaluations = evaluationRuns.filter((run: any) => 
          run.status === 'completed' || run.status === 'failed'
        )

        setDashboardData({
          stats: dashboardStats,
          currentJobs,
          pastEvaluations
        })

      } catch (err) {
        console.error('Error loading dashboard:', err)
        setError(err instanceof Error ? err.message : 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleCreateNewEvaluation = () => {
    router.push('/evaluation/start')
  }

  const handleViewEvaluationDetails = (evaluationName: string) => {
    router.push(`/evaluation/status?name=${encodeURIComponent(evaluationName)}`)
  }

  const scrollJobs = (direction: 'left' | 'right') => {
    const maxIndex = Math.max(0, dashboardData.currentJobs.length - 3)
    if (direction === 'left' && currentJobIndex > 0) {
      setCurrentJobIndex(currentJobIndex - 1)
    } else if (direction === 'right' && currentJobIndex < maxIndex) {
      setCurrentJobIndex(currentJobIndex + 1)
    }
  }

  const scrollPastEvaluations = (direction: 'left' | 'right') => {
    const maxIndex = Math.max(0, dashboardData.pastEvaluations.length - 3)
    if (direction === 'left' && pastEvaluationIndex > 0) {
      setPastEvaluationIndex(pastEvaluationIndex - 1)
    } else if (direction === 'right' && pastEvaluationIndex < maxIndex) {
      setPastEvaluationIndex(pastEvaluationIndex + 1)
    }
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return { badge: 'bg-green-500', label: 'Completed' }
      case 'failed':
        return { badge: 'bg-red-500', label: 'Failed' }
      case 'in-progress':
        return { badge: 'status-running bg-blue-600', label: 'running' }
      case 'pending':
        return { badge: 'status-queued bg-yellow-600', label: 'queued' }
      default:
        return { badge: 'bg-gray-500', label: 'Unknown' }
    }
  }

  if (loading) {
    return (
      <BaseLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <div className="max-w-7xl mx-auto p-8">
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
              </div>
            </div>
          </div>
        </div>
      </BaseLayout>
    )
  }

  if (error || !dashboardData.stats) {
    return (
      <BaseLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <div className="max-w-7xl mx-auto p-8">
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Failed to load dashboard'}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </BaseLayout>
    )
  }

  return (
    <BaseLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto p-8">
          
          {/* ORIGINAL Welcome Section - EXACT LAYOUT */}
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

          {/* ORIGINAL Statistics Cards - Using API data, NO hardcoded values */}
          <div className="dashboard-stats grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="stat-card bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="stat-number text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {dashboardData.stats.activeEvaluations}
              </div>
              <div className="stat-label text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
                Active Evaluations
              </div>
              <div className="stat-change positive bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-lg text-xs font-medium">
                {dashboardData.stats.activeDetails?.running || 0} running, {dashboardData.stats.activeDetails?.queued || 0} queued
              </div>
            </div>

            <div className="stat-card bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="stat-number text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {dashboardData.stats.completedEvaluations}
              </div>
              <div className="stat-label text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
                Completed Evaluations
              </div>
              <div className="stat-change positive bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-lg text-xs font-medium">
                {dashboardData.stats.trends?.completedChange || 'No data'}
              </div>
            </div>

            <div className="stat-card bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="stat-number text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {dashboardData.stats.totalDatasets}
              </div>
              <div className="stat-label text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
                Total Datasets
              </div>
              <div className="stat-change positive bg-green-100 dark:bg-green-700/50 text-green-700 dark:text-green-300 px-2 py-1 rounded-lg text-xs font-medium">
                {dashboardData.stats.trends?.datasetsChange || 'No data'}
              </div>
            </div>

            <div className="stat-card bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="stat-number text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {dashboardData.stats.averageSuccessRate}%
              </div>
              <div className="stat-label text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
                Evaluation Success Rate
              </div>
              <div className="stat-change positive bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-lg text-xs font-medium">
                {dashboardData.stats.trends?.successRateChange || 'No data'}
              </div>
            </div>
          </div>

          {/* ORIGINAL Current Evaluations Section */}
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
              disabled={currentJobIndex >= Math.max(0, dashboardData.currentJobs.length - 3)}
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
                {/* Dynamic Current Job Cards */}
                {dashboardData.currentJobs.map((evaluation: any) => {
                  const statusConfig = getStatusConfig(evaluation.status)
                  
                  return (
                    <div 
                      key={evaluation.id}
                      className="job-card flex-shrink-0 w-80 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                      onClick={() => handleViewEvaluationDetails(evaluation.name)}
                    >
                      <div className="job-header flex justify-between items-start mb-4">
                        <div className="job-title text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {evaluation.name}
                        </div>
                        <span className={`job-status ${statusConfig.badge} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      
                      <div className="job-details space-y-2 mb-4">
                        <div className="job-detail text-sm text-gray-600 dark:text-gray-400">
                          Model: {evaluation.model}
                        </div>
                        <div className="job-detail text-sm text-gray-600 dark:text-gray-400">
                          Dataset: {evaluation.dataset}
                        </div>
                        <div className="job-detail text-sm text-gray-600 dark:text-gray-400">
                          Started: {new Date(evaluation.createdAt).toLocaleDateString()}
                        </div>
                        {evaluation.metrics && Array.isArray(evaluation.metrics) && (
                          <div className="job-detail text-sm text-gray-600 dark:text-gray-400">
                            Metrics: {evaluation.metrics.join(', ')}
                          </div>
                        )}
                      </div>
                      
                      {evaluation.status === 'in-progress' && (
                        <div className="job-progress">
                          <div className="progress-label flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {evaluation.progress}%
                            </span>
                          </div>
                          <div className="progress-bar w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="progress-fill bg-blue-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${evaluation.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ORIGINAL Past Evaluations Section */}
          <div className="past-evaluations-section">
            <div className="section-header flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Past Evaluations</h2>
            </div>
            
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
                disabled={pastEvaluationIndex >= Math.max(0, dashboardData.pastEvaluations.length - 3)}
                className="past-nav-btn next absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed z-10"
              >
                ›
              </button>

              {/* Past Evaluations Grid */}
              <div className="past-evaluations-scroll-wrapper overflow-hidden mx-8">
                <div 
                  className="past-evaluations-grid flex gap-6 transition-transform duration-300"
                  style={{ transform: `translateX(-${pastEvaluationIndex * 350}px)` }}
                >
                  {dashboardData.pastEvaluations.map((evaluation: any) => {
                    const statusConfig = getStatusConfig(evaluation.status)
                    
                    return (
                      <div 
                        key={evaluation.id}
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
                            📅 Completed: {evaluation.completedDate || new Date(evaluation.createdAt).toLocaleDateString()}
                          </div>
                          {evaluation.status === 'completed' && evaluation.metrics && typeof evaluation.metrics === 'object' && (
                            <div className="job-detail text-sm text-gray-600 dark:text-gray-400">
                              🎯 Metrics: {Object.keys(evaluation.metrics).join(', ')}
                            </div>
                          )}
                        </div>

                        {/* Tags */}
                        {evaluation.tags && (
                          <div className="job-tags flex gap-1 items-center mb-3">
                            {evaluation.tags.slice(0, 2).map((tag: string, tagIndex: number) => (
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
                        {evaluation.status === 'completed' && evaluation.metrics && typeof evaluation.metrics === 'object' ? (
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
                    )
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