// 1️⃣ src/app/api/evaluations/route.ts - MAIN ENDPOINT
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'

async function readJSONFile(filename: string) {
  try {
    const filePath = path.join(process.cwd(), 'src/data', filename);
    console.log(`📁 Attempting to read: ${filePath}`);
    
    // Check if file exists first
    await fs.access(filePath);
    
    const data = await fs.readFile(filePath, 'utf-8');
    const parsedData = JSON.parse(data);
    
    console.log(`✅ Successfully read ${filename}`);
    return parsedData;
  } catch (error) {
    console.error(`❌ Error reading ${filename}:`, error.message);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 MAIN API: Reading evaluation data from JSON files...');
    
    let evaluationRuns = [];
    let dashboardStats = null;

    // Try multiple file locations
    const evaluationsData = await readJSONFile('evaluations.json');
    const evaluationRunsData = await readJSONFile('evaluationRuns.json');

    if (evaluationsData?.evaluationRuns) {
      evaluationRuns = evaluationsData.evaluationRuns;
      dashboardStats = evaluationsData.dashboardStats;
      console.log(`📊 Found ${evaluationRuns.length} evaluations in evaluations.json`);
    } else if (evaluationRunsData?.evaluationRuns) {
      evaluationRuns = evaluationRunsData.evaluationRuns;
      console.log(`📊 Found ${evaluationRuns.length} evaluations in evaluationRuns.json`);
    }

    // Generate dashboard stats if not found
    if (!dashboardStats && evaluationRuns.length > 0) {
      const activeCount = evaluationRuns.filter(e => e.status === 'in-progress' || e.status === 'running').length;
      const completedCount = evaluationRuns.filter(e => e.status === 'completed').length;
      const failedCount = evaluationRuns.filter(e => e.status === 'failed').length;
      
      dashboardStats = {
        totalEvaluations: evaluationRuns.length,
        activeEvaluations: activeCount,
        completedEvaluations: completedCount,
        failedEvaluations: failedCount,
        averageSuccessRate: evaluationRuns.length > 0 ? Math.round((completedCount / evaluationRuns.length) * 100) : 0
      };
    }

    console.log('📋 Evaluation names found:', evaluationRuns.map(e => e.name));
    console.log('📊 Dashboard stats:', dashboardStats);

    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json({
      success: true,
      data: {
        dashboardStats: dashboardStats || {
          totalEvaluations: 0,
          activeEvaluations: 0,
          completedEvaluations: 0,
          failedEvaluations: 0,
          averageSuccessRate: 0
        },
        evaluationRuns
      }
    });
    
  } catch (error) {
    console.error('❌ MAIN API Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      data: {
        dashboardStats: {
          totalEvaluations: 0,
          activeEvaluations: 0,
          completedEvaluations: 0,
          failedEvaluations: 0,
          averageSuccessRate: 0
        },
        evaluationRuns: []
      }
    });
  }
}