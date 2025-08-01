// src/app/api/dashboard/config/route.ts
import { NextResponse } from 'next/server'
import { dataService } from '@/services/data.service'

interface DashboardConfig {
  dashboard: {
    title: string
    subtitle: string
    refreshInterval: number
    pagination: {
      cardsPerView: number
      autoScroll: boolean
    }
    features: {
      realTimeUpdates: boolean
      notifications: boolean
      exportData: boolean
    }
  }
  navigation: {
    scrollSpeed: number
    animationDuration: number
    enableKeyboard: boolean
  }
  display: {
    showProgress: boolean
    showMetrics: boolean
    showTags: boolean
    maxTagsVisible: number
  }
  routes: {
    createEvaluation: string
    evaluationDetails: string
    evaluationList: string
  }
}

export async function GET() {
  try {
    // Ensure data directory exists
    await dataService.ensureDataDirectory()

    // Read dashboard configuration from JSON file
    const config = await dataService.readJSONFile<DashboardConfig>('dashboard-config.json')

    return NextResponse.json(config)
  } catch (error) {
    console.error('Error loading dashboard config:', error)
    
    // Return a minimal fallback config if file doesn't exist
    return NextResponse.json({
      dashboard: {
        title: "Evaluation Dashboard",
        subtitle: "Monitor and manage your AI model evaluations",
        refreshInterval: 30000,
        pagination: {
          cardsPerView: 3,
          autoScroll: false
        },
        features: {
          realTimeUpdates: true,
          notifications: true,
          exportData: true
        }
      },
      navigation: {
        scrollSpeed: 350,
        animationDuration: 300,
        enableKeyboard: true
      },
      display: {
        showProgress: true,
        showMetrics: true,
        showTags: true,
        maxTagsVisible: 2
      },
      routes: {
        createEvaluation: "/evaluation/start",
        evaluationDetails: "/evaluation/status",
        evaluationList: "/evaluations"
      }
    })
  }
}