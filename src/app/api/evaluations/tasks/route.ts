// 2️⃣ src/app/api/evaluations/tasks/route.ts
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

async function readJSONFile(filename: string) {
  try {
    const filePath = path.join(process.cwd(), 'src/data', filename);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return null;
  }
}

export async function GET(request: Request) {
  try {
    console.log('📁 TASKS API: Reading tasks from JSON...');
    
    const { searchParams } = new URL(request.url);
    const evaluationId = searchParams.get('evaluationId');
    
    const evaluationsData = await readJSONFile('evaluations.json');
    let tasks = evaluationsData?.evaluationTasks || [];
    
    if (evaluationId) {
      tasks = tasks.filter(task => task.evaluationId === evaluationId);
    }

    console.log(`📊 Found ${tasks.length} tasks`);
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('❌ TASKS API Error:', error);
    return NextResponse.json({ tasks: [] });
  }
}