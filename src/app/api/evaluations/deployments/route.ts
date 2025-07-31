import { NextResponse } from 'next/server';
import evaluationsData from '@/data/evaluations.json';

export async function GET() {
  try {
    return NextResponse.json({
      deployments: evaluationsData.deployments
    });
  } catch (error) {
    console.error('Error loading deployments:', error);
    return NextResponse.json({ deployments: [] });
  }
}