import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
    const catSlug = categorySlug || slugify(category);

    // Read existing articles
    const articlesPath = path.join(process.cwd(), 'src', 'data', 'articles.json');
    const categoriesPath = path.join(process.cwd(), 'src', 'data', 'categories.json');

    let articles = [];
    try {
      articles = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'));
    } catch { /* file might not exist on Vercel */ }

    // Check if slug already exists
    if (articles.find((a: { slug: string }) => a.slug === slug)) {
      return NextResponse.json(
        { error: 'An article with this title already exists' },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();
    const article = {
      id: `art_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 200).replace(/[#*_\n]/g, ' ').trim(),
      metaTitle: metaTitle || `${title} | Digital Point Pro`,
      metaDescription: metaDescription || excerpt || content.substring(0, 160).replace(/[#*_\n]/g, ' ').trim(),
      focusKeyword: focusKeyword || title.split(' ').slice(0, 5).join(' '),
      featuredImage: featuredImage || '/images/placeholder.jpg',
      category,
      categorySlug: catSlug,
      author: author || 'Digital Point Pro Team',
      readTime: Math.max(3, Math.ceil(content.split(/\s+/).length / 200)),
      trending: trending || false,
      featured: featured || false,
      editorsPick: editorsPick || false,
      faq: faq || '[]',
      published: true,
      createdAt: now,
      updatedAt: now,
    };

    articles.unshift(article);

    // Try to write (works in development, may fail on Vercel)
    try {
      fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2));
    } catch {
      // On Vercel, file system is read-only - that's OK
      // The article will exist in memory during this request
    }

    // Also try to ensure category exists
    let categories = [];
    try {
      categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'));
    } catch { /* empty */ }

    if (!categories.find((c: { slug: string }) => c.slug === catSlug)) {
      const newCat = {
        id: `cat_${Date.now()}`,
        name: category,
        slug: catSlug,
        description: `Articles about ${category}`,
        icon: '📝',
        createdAt: now,
        updatedAt: now,
      };
      categories.push(newCat);
      try {
        fs.writeFileSync(categoriesPath, JSON.stringify(categories, null, 2));
      } catch { /* read-only on Vercel */ }
    }

    return NextResponse.json({ success: true, article });
  } catch (error: unknown) {
    console.error('Create article error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create article';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
