import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const EVALUATION_METADATA_FILE = path.join(process.cwd(), 'src/data/evaluation-metadata.json');

export async function GET() {
  try {
    const data = await fs.readFile(EVALUATION_METADATA_FILE, 'utf-8');
    const metadata = JSON.parse(data);
    
    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Error reading evaluation metadata:', error);
    
    // Return default metadata structure if file doesn't exist
    const defaultMetadata = {
      evaluationSession: {
        id: null,
        createdAt: null,
        lastModified: null,
        status: 'not_started'
      },
      dataset: {
        uid: null,
        id: null,
        name: null,
        selectedAt: null,
        taskType: null,
        rows: null,
        columns: null
      },
      model: {
        uid: null,
        modelName: null,
        provider: null,
        selectedAt: null
      },
      metrics: {
        selectedMetrics: [],
        customMetrics: [],
        configuredAt: null
      }
    };
    
    return NextResponse.json(defaultMetadata);
  }
}

export async function POST(request: NextRequest) {
  try {
    const metadata = await request.json();
    
    // Validate metadata structure
    if (!metadata.evaluationSession || !metadata.dataset) {
      return NextResponse.json(
        { error: 'Invalid metadata structure' },
        { status: 400 }
      );
    }
    
    // Ensure directory exists
    const dir = path.dirname(EVALUATION_METADATA_FILE);
    await fs.mkdir(dir, { recursive: true });
    
    // Write metadata to file
    await fs.writeFile(EVALUATION_METADATA_FILE, JSON.stringify(metadata, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      message: 'Evaluation metadata saved successfully' 
    });
  } catch (error) {
    console.error('Error saving evaluation metadata:', error);
    return NextResponse.json(
      { error: 'Failed to save evaluation metadata' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updates = await request.json();
    
    // Read existing metadata
    let existingMetadata;
    try {
      const data = await fs.readFile(EVALUATION_METADATA_FILE, 'utf-8');
      existingMetadata = JSON.parse(data);
    } catch {
      // If file doesn't exist, create default structure
      existingMetadata = {
        evaluationSession: {
          id: null,
          createdAt: null,
          lastModified: null,
          status: 'not_started'
        },
        dataset: {
          uid: null,
          id: null,
          name: null,
          selectedAt: null,
          taskType: null,
          rows: null,
          columns: null
        },
        model: {
          uid: null,
          modelName: null,
          provider: null,
          selectedAt: null
        },
        metrics: {
          selectedMetrics: [],
          customMetrics: [],
          configuredAt: null
        }
      };
    }
    
    // Merge updates with existing metadata
    const updatedMetadata = {
      ...existingMetadata,
      ...updates,
      evaluationSession: {
        ...existingMetadata.evaluationSession,
        ...updates.evaluationSession,
        lastModified: new Date().toISOString()
      }
    };
    
    // Ensure directory exists
    const dir = path.dirname(EVALUATION_METADATA_FILE);
    await fs.mkdir(dir, { recursive: true });
    
    // Write updated metadata to file
    await fs.writeFile(EVALUATION_METADATA_FILE, JSON.stringify(updatedMetadata, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      message: 'Evaluation metadata updated successfully',
      metadata: updatedMetadata
    });
  } catch (error) {
    console.error('Error updating evaluation metadata:', error);
    return NextResponse.json(
      { error: 'Failed to update evaluation metadata' },
      { status: 500 }
    );
  }
}