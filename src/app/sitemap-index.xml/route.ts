import { NextResponse } from 'next/server';
import articlesData from '@/data/articles.json';
import categoriesData from '@/data/categories.json';
import { SITE_CONFIG } from '@/lib/site-config';

/**
 * Compact sitemap at /sitemap-index.xml
 *
 * PURPOSE: Fresh URL to bypass Google's stale 404 cache for /sitemap.xml.
 * COMPACT FORMAT: Single-line XML entries (no extra whitespace/newlines)
 * to ensure Google's strict XML parser reads it without issues.
 *
 * Returns same 61 URLs as /sitemap.xml but in compact format with no-cache headers.
 */
export async function GET() {
  const base = SITE_CONFIG.url;
  const now = new Date().toISOString();

  // Build compact XML entries (single line each — no leading whitespace)
  const entries: string[] = [];

  // Homepage
  entries.push(`<url><loc>${base}/</loc><lastmod>${now}</lastmod><changefreq>hourly</changefreq><priority>1.0</priority></url>`);

  // All published articles — clean path /article/slug
  for (const article of articlesData) {
    if (!article.published) continue;
    const lastmod = new Date(article.updatedAt || article.createdAt).toISOString();
    entries.push(`<url><loc>${base}/article/${encodeURIComponent(article.slug)}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`);
  }

  // All categories — clean path /category/slug
  for (const cat of categoriesData) {
    const lastmod = new Date(cat.updatedAt || cat.createdAt).toISOString();
    entries.push(`<url><loc>${base}/category/${encodeURIComponent(cat.slug)}</loc><lastmod>${lastmod}</lastmod><changefreq>daily</changefreq><priority>0.7</priority></url>`);
  }

  // Latest news hub
  entries.push(`<url><loc>${base}/news</loc><lastmod>${now}</lastmod><changefreq>hourly</changefreq><priority>0.9</priority></url>`);

  // Legal / static pages
  for (const slug of ['about', 'contact', 'privacy', 'terms', 'disclaimer']) {
    entries.push(`<url><loc>${base}/legal/${slug}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.4</priority></url>`);
  }

  // Compact single-line XML — no whitespace between tags
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join('')}</urlset>`;

  // Aggressive no-cache headers
  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-Robots-Tag': 'all',
      'X-Sitemap-Version': '3',
    },
  });
}
