// 3️⃣ src/app/api/evaluations/organizations/route.ts
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
    console.log('📁 ORGS API: Reading organizations from JSON...');
    
    const evaluationsData = await readJSONFile('evaluations.json');
    const organizations = evaluationsData?.organizations || [];
    
    console.log(`📊 Found ${organizations.length} organizations`);
    return NextResponse.json({ organizations });
  } catch (error) {
    console.error('❌ ORGS API Error:', error);
    return NextResponse.json({ organizations: [] });
  }
}