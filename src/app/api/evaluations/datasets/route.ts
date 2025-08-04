// 5️⃣ src/app/api/evaluations/datasets/route.ts
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

export async function GET() {
  try {
    console.log('📁 DATASETS API: Reading datasets from JSON...');
    
    const evaluationsData = await readJSONFile('evaluations.json');
    const datasets = evaluationsData?.evaluationDatasets || [];
    
    console.log(`📊 Found ${datasets.length} datasets`);
    return NextResponse.json({ datasets });
  } catch (error) {
    console.error('❌ DATASETS API Error:', error);
    return NextResponse.json({ datasets: [] });
  }
}