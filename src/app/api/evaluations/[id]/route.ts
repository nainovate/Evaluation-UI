import { NextResponse } from 'next/server';
import evaluationsData from '@/data/evaluations.json';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const evaluation = evaluationsData.evaluationRuns.find(
      (eval) => eval.id === params.id
    );
    
    if (!evaluation) {
      return NextResponse.json(
        { error: 'Evaluation not found' },
        { status: 404 }
      );
    }

    // Get related tasks
    const tasks = evaluationsData.evaluationTasks.filter(
      (task) => task.evaluationId === params.id
    );

    return NextResponse.json({
      evaluation,
      tasks
    });
  } catch (error) {
    console.error('Error loading evaluation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch evaluation' },
      { status: 500 }
    );
  }
}