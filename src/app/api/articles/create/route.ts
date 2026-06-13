import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      content,
      excerpt,
      category,
      categorySlug,
      focusKeyword,
      metaTitle,
      metaDescription,
      featuredImage,
      author,
      trending,
      featured,
      editorsPick,
      faq,
    } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Title, content, and category are required' },
        { status: 400 }
      );
    }

    const slug = slugify(title);

    // Check if slug already exists
    const existing = await db.article.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: 'An article with this title already exists' },
        { status: 409 }
      );
    }

    const article = await db.article.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || content.substring(0, 200).replace(/[#*_\n]/g, ' ').trim(),
        metaTitle: metaTitle || `${title} | Digital Point Pro`,
        metaDescription: metaDescription || excerpt || content.substring(0, 160).replace(/[#*_\n]/g, ' ').trim(),
        focusKeyword: focusKeyword || title.split(' ').slice(0, 5).join(' '),
        featuredImage: featuredImage || '/images/placeholder.jpg',
        category,
        categorySlug: categorySlug || slugify(category),
        author: author || 'Digital Point Pro Team',
        readTime: Math.max(3, Math.ceil(content.split(/\s+/).length / 200)),
        trending: trending || false,
        featured: featured || false,
        editorsPick: editorsPick || false,
        faq: faq || '[]',
        published: true,
      },
    });

    // Ensure category exists
    const catSlug = categorySlug || slugify(category);
    const existingCat = await db.category.findUnique({ where: { slug: catSlug } });
    if (!existingCat) {
      await db.category.create({
        data: {
          name: category,
          slug: catSlug,
          description: `Articles about ${category}`,
          icon: '📝',
        },
      });
    }

    return NextResponse.json({ success: true, article });
  } catch (error: unknown) {
    console.error('Create article error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create article';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
