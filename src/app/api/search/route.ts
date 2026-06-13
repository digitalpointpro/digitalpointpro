import { searchArticles } from '@/lib/static-data';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    const result = searchArticles(q || '');
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error searching articles:', error);
    return NextResponse.json({ error: 'Failed to search articles' }, { status: 500 });
  }
}
