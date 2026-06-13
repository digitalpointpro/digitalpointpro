import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const trending = searchParams.get('trending');
    const featured = searchParams.get('featured');
    const editorsPick = searchParams.get('editorsPick');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = { published: true };

    if (category) where.categorySlug = category;
    if (trending === 'true') where.trending = true;
    if (featured === 'true') where.featured = true;
    if (editorsPick === 'true') where.editorsPick = true;

    const articles = await db.article.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        category: true,
        categorySlug: true,
        author: true,
        readTime: true,
        trending: true,
        featured: true,
        editorsPick: true,
        createdAt: true,
      },
    });

    const total = await db.article.count({ where });

    return NextResponse.json({ articles, total });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}
