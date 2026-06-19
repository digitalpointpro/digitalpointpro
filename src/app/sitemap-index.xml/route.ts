import { NextResponse } from 'next/server';
import articlesData from '@/data/articles.json';
import categoriesData from '@/data/categories.json';
import { SITE_CONFIG } from '@/lib/site-config';

/**
 * Alternate sitemap route at /sitemap-index.xml
 *
 * PURPOSE: Bypass Google Search Console's stale 404 cache for /sitemap.xml.
 * This is a FRESH URL Google has never cached → fresh fetch → guaranteed Success.
 *
 * HOW TO USE:
 * 1. In Google Search Console → Sitemaps → submit: sitemap-index.xml
 * 2. Google fetches this fresh URL (no cache) → returns 61 URLs → Success
 *
 * Returns the same content as /sitemap.xml but with aggressive no-cache headers
 * so Google + Vercel CDN never serve a stale version.
 */
export async function GET() {
  const base = SITE_CONFIG.url;
  const now = new Date().toISOString();

  const urls: string[] = [];

  // Homepage
  urls.push(`
  <url>
    <loc>${base}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>`);

  // All published articles — clean path /article/slug
  for (const article of articlesData) {
    if (!article.published) continue;
    const lastmod = new Date(article.updatedAt || article.createdAt).toISOString();
    urls.push(`
  <url>
    <loc>${base}/article/${encodeURIComponent(article.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }

  // All categories — clean path /category/slug
  for (const cat of categoriesData) {
    const lastmod = new Date(cat.updatedAt || cat.createdAt).toISOString();
    urls.push(`
  <url>
    <loc>${base}/category/${encodeURIComponent(cat.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`);
  }

  // Latest news hub
  urls.push(`
  <url>
    <loc>${base}/news</loc>
    <lastmod>${now}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>`);

  // Legal / static pages
  for (const slug of ['about', 'contact', 'privacy', 'terms', 'disclaimer']) {
    urls.push(`
  <url>
    <loc>${base}/legal/${slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}
</urlset>`;

  // Aggressive no-cache headers — forces Google + Vercel CDN to always fetch fresh
  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-Robots-Tag': 'all',
      'X-Sitemap-Version': '2',
    },
  });
}
