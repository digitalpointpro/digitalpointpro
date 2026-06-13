import { getArticles } from '@/lib/static-data';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const trending = searchParams.get('trending') === 'true' ? true : undefined;
    const featured = searchParams.get('featured') === 'true' ? true : undefined;
    const editorsPick = searchParams.get('editorsPick') === 'true' ? true : undefined;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const result = getArticles({
      category,
      trending,
      featured,
      editorsPick,
      limit,
      offset,
    });

    // Return only list fields (no full content)
    const articles = result.articles.map(a => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      featuredImage: a.featuredImage,
      category: a.category,
      categorySlug: a.categorySlug,
      author: a.author,
      readTime: a.readTime,
      trending: a.trending,
      featured: a.featured,
      editorsPick: a.editorsPick,
      createdAt: a.createdAt,
    }));

    return NextResponse.json({ articles, total: result.total });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}
