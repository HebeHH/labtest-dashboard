import { loadLabData } from '@/utils/dataLoader';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await loadLabData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error loading lab data:', error);
    return NextResponse.json(
      { error: 'Failed to load lab data' },
      { status: 500 }
    );
  }
} 