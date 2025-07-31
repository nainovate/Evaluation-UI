import { NextResponse } from 'next/server';
import evaluationsData from '@/data/evaluations.json';

export async function GET() {
  try {
    return NextResponse.json(evaluationsData);
  } catch (error) {
    console.error('Error loading evaluations:', error);
    return NextResponse.json({ 
      evaluationRuns: [], 
      evaluationTasks: [],
      organizations: [],
      deployments: [],
      dashboardStats: {},
      evaluationDatasets: []
    });
  }
}