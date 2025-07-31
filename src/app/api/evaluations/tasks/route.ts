import { NextResponse } from 'next/server';
import evaluationsData from '@/data/evaluations.json';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const evaluationId = searchParams.get('evaluationId');
    
    let tasks = evaluationsData.evaluationTasks;
    
    if (evaluationId) {
      tasks = tasks.filter(task => task.evaluationId === evaluationId);
    }

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error loading evaluation tasks:', error);
    return NextResponse.json({ tasks: [] });
  }
}