import { NextResponse } from 'next/server';
import evaluationsData from '@/data/evaluations.json';

export async function GET() {
  try {
    return NextResponse.json({
      datasets: evaluationsData.evaluationDatasets
    });
  } catch (error) {
    console.error('Error loading evaluation datasets:', error);
    return NextResponse.json({ datasets: [] });
  }
}