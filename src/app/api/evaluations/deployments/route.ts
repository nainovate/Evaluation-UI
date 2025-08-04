// 4️⃣ src/app/api/evaluations/deployments/route.ts
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
    console.log('📁 DEPLOYMENTS API: Reading deployments from JSON...');
    
    const evaluationsData = await readJSONFile('evaluations.json');
    const deployments = evaluationsData?.deployments || [];
    
    console.log(`📊 Found ${deployments.length} deployments`);
    return NextResponse.json({ deployments });
  } catch (error) {
    console.error('❌ DEPLOYMENTS API Error:', error);
    return NextResponse.json({ deployments: [] });
  }
}
