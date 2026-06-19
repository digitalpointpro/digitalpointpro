import { NextResponse } from 'next/server';
import articlesData from '@/data/articles.json';
import categoriesData from '@/data/categories.json';
import { SITE_CONFIG } from '@/lib/site-config';

/**
 * Alternate sitemap at /sitemap-news.xml
 *
 * THIRD fresh URL strategy — Google has never seen this URL, so 100% fresh fetch.
 * Compact single-line XML format. Same 61 URLs as other sitemaps.
 */
export async function GET() {
  const base = SITE_CONFIG.url;
  const now = new Date().toISOString();

  const entries: string[] = [];

  entries.push(`<url><loc>${base}/</loc><lastmod>${now}</lastmod><changefreq>hourly</changefreq><priority>1.0</priority></url>`);

  for (const article of articlesData) {
    if (!article.published) continue;
    const lastmod = new Date(article.updatedAt || article.createdAt).toISOString();
    entries.push(`<url><loc>${base}/article/${encodeURIComponent(article.slug)}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`);
  }

  for (const cat of categoriesData) {
    const lastmod = new Date(cat.updatedAt || cat.createdAt).toISOString();
    entries.push(`<url><loc>${base}/category/${encodeURIComponent(cat.slug)}</loc><lastmod>${lastmod}</lastmod><changefreq>daily</changefreq><priority>0.7</priority></url>`);
  }

  entries.push(`<url><loc>${base}/news</loc><lastmod>${now}</lastmod><changefreq>hourly</changefreq><priority>0.9</priority></url>`);

  for (const slug of ['about', 'contact', 'privacy', 'terms', 'disclaimer']) {
    entries.push(`<url><loc>${base}/legal/${slug}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.4</priority></url>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join('')}</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
