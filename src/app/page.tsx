'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Database, Zap, Activity, Moon, Sun } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useAuth } from '../components/providers/AuthProvider'
import { AUTH_CONFIG } from '../lib/auth-config'

export default function EvaluationStartPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  // ✅ ADD: Clear localStorage when landing page loads
  useEffect(() => {
    // Clear all evaluation-related localStorage data when user visits landing page
    const clearEvaluationData = () => {
      if (typeof window !== 'undefined') {
        try {
          console.log('🏠 Landing page: Clearing all evaluation data for fresh start');
          
          // Clear all evaluation-related localStorage keys
          localStorage.removeItem('evaluation_current_step');
          localStorage.removeItem('evaluation_metadata');
          localStorage.removeItem('evaluation_timestamp');
          localStorage.removeItem('evaluationMetrics');
          
          // Optional: Clear completed evaluations history too
          // localStorage.removeItem('completed_evaluations');
          
          console.log('✅ All evaluation data cleared from landing page');
        } catch (error) {
          console.warn('Failed to clear evaluation data:', error);
        }
      }
    };

    clearEvaluationData();
  }, []); // Run once when landing page loads

  const handleStartEvaluation = () => {
    if (AUTH_CONFIG.ENABLED && !isAuthenticated) {
      router.push(`${AUTH_CONFIG.LOGIN_PAGE}?redirect=/evaluation/start`)
    } else {
      router.push('/evaluation/start')
    }
  }


  const handleViewDashboard = () => {
    router.push('/dashboard')
  }

  const handleDashboardNavigation = () => {
    router.push('/dashboard')
  }

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Dataset Evaluation Processing",
      description: "Advanced dataset validation, real-time preprocessing, and rich metric analysis—all in one streamlined workflow.",
      status: "Production Ready",
      statusColor: "ready"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Model Assessment Framework",
      description: "Robust model evaluation powered by customizable metrics and automated scoring for objective results.",
      status: "Production Ready", 
      statusColor: "ready"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Multi-Parameter Evaluation",
      description: "Evolving to support dynamic, multi-parameter configurations--enabling deeper and more flexible model evaluation.",
      status: "In Development",
      statusColor: "development"
    }
  ]

  const stats = [
    {
      number: "90%",
      label: "Evaluation Time Saved",
      description: "From weeks to hours—cut setup time dramatically.",
      color: "blue"
    },
    {
      number: "$75K+",
      label: "Cost Reduction", 
      description: "Slash evaluation costs compared to manual processes.",
      color: "green"
    },
    {
      number: "95%",
      label: "Accuracy Rate",
      description: "Research-grade evaluations with guided, structured workflows.",
      color: "purple"
    },
    {
      number: "3x",
      label: "Faster Results",
      description: "Make critical decisions with actionable data, faster.",
      color: "orange"
    }
  ]

  const statsDetails = [
    {
      number: "3-5 days → 2-4 hours",
      title: "Evaluation Setup Time: From initial data preparation to first evaluation run",
      description: "Complete evaluation pipeline setup including data validation, metric configuration, and model assessment"
    },
    {
      number: "$100K → $25K", 
      title: "Average Project Cost: Typical enterprise AI evaluation project budget reduction",
      description: "Comprehensive evaluation suite with multiple metrics, automated reporting, and expert insights"
    },
    {
      number: "4 months → 2 weeks",
      title: "Time to Insights: From concept to actionable evaluation results", 
      description: "Complete evaluation workflow including model assessment, performance analysis, and recommendation generation"
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Navigation */}
      <nav className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            {/* Logo */}
            <div className="flex items-center">
              <div className="h-10 w-auto">
                {/* Light mode logo */}
                <img 
                  src="/icons/Nainovate_Logo.svg" 
                  alt="Nainovate Logo" 
                  className="h-12 w-auto transition-all duration-300 dark:hidden"
                />
                {/* Dark mode logo - you'll need a dark version */}
                <img 
                  src="/icons/Nainovate_DarkLogo.svg" 
                  alt="Nainovate Logo" 
                  className="h-12 w-auto transition-all duration-300 hidden dark:block"
                />
              </div>
            </div>
            
            {/* Navigation Links and Theme Toggle */}
            <div className="flex items-center space-x-8">
              <div className="hidden md:flex items-center space-x-8">
                <button
                  onClick={handleDashboardNavigation}
                  className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium transition-colors"
                >
                  Dashboard
                </button>
                <button className="text-slate-900 dark:text-white font-medium">
                  Evaluation
                </button>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-8 leading-tight tracking-tight">
              AI model evaluation
              <br />
              <span className="text-slate-500 dark:text-slate-400">made simple</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Transform your model outputs into comprehensive evaluations with our intuitive platform. No coding required.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={handleStartEvaluation}
                className="inline-flex items-center px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-200 shadow-lg hover:shadow-xl hover-lift group"
              >
                Start evaluation
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={handleViewDashboard}
                className="inline-flex items-center px-8 py-4 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
              >
                View dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">
                Everything you need to evaluate AI models
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                From data processing to model evaluation analysis, our platform handles the
                complexity so you can focus on your use case.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 hover-lift glass-effect"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-slate-900 transition-all duration-200">
                      {feature.icon}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        feature.statusColor === 'ready' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{feature.status}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">
              Accelerate Your AI Evaluation
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Our platform dramatically reduces evaluation time and costs while
              increasing accuracy and insights
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-5xl lg:text-6xl font-black mb-2 ${
                  stat.color === 'blue' ? 'text-blue-600' :
                  stat.color === 'green' ? 'text-emerald-600' :
                  stat.color === 'purple' ? 'text-purple-600' : 'text-amber-600'
                }`}>
                  {stat.number}
                </div>
                <div className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  {stat.label}
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>

          {/* Stats Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {statsDetails.map((detail, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300"
              >
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  {detail.number}
                </div>
                <div className="text-lg font-semibold text-slate-900 dark:text-white">
                  {detail.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="p-12 rounded-3xl border border-slate-200 dark:border-slate-800 glass-effect">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Ready to start evaluating?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join the future of AI assessment—launch your first evaluation in minutes.
            </p>
            <button
              onClick={handleStartEvaluation}
              className="inline-flex items-center px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-200 shadow-lg hover:shadow-xl group"
            >
              Get started for free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            © 2025 Nainovate AI. Building the future of accessible AI.
          </p>
        </div>
      </footer>
    </div>
  )
}