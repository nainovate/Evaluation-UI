// src/app/api/evaluations/route.ts
import { NextRequest, NextResponse } from 'next/server'

// Default data - will be loaded from JSON files when they exist
const defaultDashboardStats = {
  totalEvaluations: 859,
  activeEvaluations: 12,
  completedEvaluations: 847,
  failedEvaluations: 24,
  averageSuccessRate: 94.8,
  totalDatasets: 24,
  activeDetails: {
    running: 3,
    queued: 9
  },
  trends: {
    completedChange: "+23 from last week",
    datasetsChange: "+ 1 this month",
    successRateChange: "+1.2% this week"
  }
}

const defaultEvaluationRuns = [
  {
    "id": "eval-001",
    "name": "Customer Support Evaluation",
    "deployment": "Claude-3.5 Sonnet",
    "organization": "Nainovate",
    "status": "in-progress",
    "createdAt": "2025-06-30T10:00:00Z",
    "totalTasks": 2400,
    "completedTasks": 1800,
    "failedTasks": 0,
    "progress": 75,
    "model": "Claude-3.5 Sonnet",
    "dataset": "Customer Support Conversations v2",
    "metrics": ["Answer Relevancy", "Faithfulness"],
    "startedAt": "2025-06-30T10:00:00Z",
    "timeInfo": "Started 8 mins ago",
    "extraInfo": "75% completed",
    "testCases": "2,400 test cases",
    "cost": "$12.45"
  },
  {
    "id": "eval-002", 
    "name": "Content Quality Assessment",
    "deployment": "GPT-4 Turbo",
    "organization": "Nainovate",
    "status": "pending",
    "createdAt": "2025-06-30T08:00:00Z",
    "totalTasks": 1800,
    "completedTasks": 0,
    "failedTasks": 0,
    "progress": 0,
    "model": "GPT-4 Turbo",
    "dataset": "Content Generation Benchmark",
    "metrics": ["Coherence", "Contextual Relevancy"],
    "timeInfo": "2 hours ago",
    "extraInfo": "Queued for processing",
    "testCases": "1,800 test cases",
    "cost": "$8.90"
  },
  {
    "id": "eval-003",
    "name": "Medical QA Evaluation", 
    "deployment": "Claude-3 Haiku",
    "organization": "Nainovate",
    "status": "in-progress",
    "createdAt": "2025-06-29T14:00:00Z",
    "totalTasks": 3200,
    "completedTasks": 1344,
    "failedTasks": 0,
    "progress": 42,
    "model": "Claude-3 Haiku",
    "dataset": "Medical QA Evaluation",
    "metrics": ["Medical Accuracy", "Safety"],
    "startedAt": "2025-06-29T14:00:00Z",
    "timeInfo": "Started yesterday",
    "extraInfo": "42% completed",
    "testCases": "3,200 test cases",
    "cost": "$15.75"
  },
  {
    "id": "eval-004",
    "name": "Translation Quality Check",
    "deployment": "GPT-4",
    "organization": "Nainovate", 
    "status": "pending",
    "createdAt": "2025-06-28T16:00:00Z",
    "totalTasks": 2600,
    "completedTasks": 0,
    "failedTasks": 0,
    "progress": 0,
    "model": "GPT-4",
    "dataset": "Translation Quality Benchmark",
    "metrics": ["BLEU Score", "Fluency"],
    "timeInfo": "2 days ago",
    "extraInfo": "Queued for processing",
    "testCases": "2,600 test cases", 
    "cost": "$11.20"
  },
  {
    "id": "eval-005",
    "name": "Customer Support Baseline",
    "deployment": "Claude-3 Sonnet",
    "organization": "Nainovate",
    "status": "completed",
    "createdAt": "2025-07-08T09:00:00Z",
    "completedAt": "2025-07-08T11:30:00Z",
    "totalTasks": 2000,
    "completedTasks": 2000,
    "failedTasks": 0,
    "progress": 100,
    "model": "Claude-3 Sonnet",
    "dataset": "Customer Support Conversations v1",
    "metrics": {
      "accuracy": "94.2%",
      "relevancy": "92.8%"
    },
    "tags": ["customer-service", "baseline"],
    "completedDate": "7/8/2025"
  },
  {
    "id": "eval-006",
    "name": "Content Generation Eval",
    "deployment": "GPT-4 Turbo",
    "organization": "Nainovate",
    "status": "completed",
    "createdAt": "2025-07-06T10:00:00Z",
    "completedAt": "2025-07-06T14:00:00Z",
    "totalTasks": 1500,
    "completedTasks": 1500, 
    "failedTasks": 0,
    "progress": 100,
    "model": "GPT-4 Turbo",
    "dataset": "Content Generation Benchmark",
    "metrics": {
      "coherence": "89.5%",
      "fluency": "96.1%"
    },
    "tags": ["content", "generation"],
    "completedDate": "7/6/2025"
  },
  {
    "id": "eval-007",
    "name": "Bias Detection Test",
    "deployment": "GPT-3.5 Turbo",
    "organization": "Nainovate",
    "status": "failed",
    "createdAt": "2025-07-04T13:00:00Z",
    "totalTasks": 800,
    "completedTasks": 0,
    "failedTasks": 800,
    "progress": 0,
    "model": "GPT-3.5 Turbo",
    "dataset": "Bias Detection Dataset",
    "error": "Dataset validation failed",
    "tags": ["bias", "safety"],
    "completedDate": "7/4/2025"
  },
  {
    "id": "eval-008",
    "name": "Code Quality Assessment",
    "deployment": "Claude-3 Opus",
    "organization": "Nainovate", 
    "status": "completed",
    "createdAt": "2025-07-02T11:00:00Z",
    "completedAt": "2025-07-02T16:00:00Z",
    "totalTasks": 2200,
    "completedTasks": 2200,
    "failedTasks": 0,
    "progress": 100,
    "model": "Claude-3 Opus",
    "dataset": "Code Review Evaluation Suite",
    "metrics": {
      "correctness": "91.7%",
      "efficiency": "87.3%"
    },
    "tags": ["code", "quality"],
    "completedDate": "7/2/2025"
  }
]

export async function GET(request: NextRequest) {
  try {
    // Simulate API delay for realistic experience
    await new Promise(resolve => setTimeout(resolve, 300))

    // Return the data in the format expected by your existing functions
    return NextResponse.json({
      success: true,
      data: {
        dashboardStats: defaultDashboardStats,
        evaluationRuns: defaultEvaluationRuns
      }
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch evaluations data',
        data: {
          dashboardStats: defaultDashboardStats,
          evaluationRuns: []
        }
      },
      { status: 200 } // Return 200 instead of 500 so it still works
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Create new evaluation
    const newEvaluation = {
      id: `eval-${Date.now()}`,
      ...body,
      status: 'pending',
      createdAt: new Date().toISOString(),
      progress: 0,
      totalTasks: 0,
      completedTasks: 0,
      failedTasks: 0
    }

    return NextResponse.json({
      success: true,
      data: newEvaluation
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create evaluation',
        data: null
      },
      { status: 500 }
    )
  }
}