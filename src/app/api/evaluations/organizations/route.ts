import { NextResponse } from 'next/server';
import evaluationsData from '@/data/evaluations.json';

export async function GET() {
  try {
    return NextResponse.json({
      organizations: evaluationsData.organizations
    });
  } catch (error) {
    console.error('Error loading organizations:', error);
    return NextResponse.json({ organizations: [] });
  }
}