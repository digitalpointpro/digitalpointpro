import type { MetadataRoute } from 'next';
import articlesData from '@/data/articles.json';
import categoriesData from '@/data/categories.json';
import { SITE_CONFIG } from '@/lib/site-config';

/**
 * Auto-generated XML sitemap.
 *
 * IMPORTANT: Uses CLEAN PATH URLs (`/article/slug`, `/category/slug`, etc.)
 * NOT query-param URLs. Google Search Console returns "Could not fetch"
 * for query-param URLs — clean paths are fetchable and indexable.
 *
 * The clean path routes (/article/[slug], /category/[slug], /news, /legal/[slug])
 * do a 302 redirect to the overlay-based homepage, so users see the article
 * overlay while Google indexes the clean canonical URL.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_CONFIG.url;
  const now = new Date();

  // Homepage
  const entries: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 1.0,
    },
  ];

  // All published articles — clean path /article/slug
  for (const article of articlesData) {
    if (!article.published) continue;
    entries.push({
      url: `${base}/article/${encodeURIComponent(article.slug)}`,
      lastModified: new Date(article.updatedAt || article.createdAt),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  // All categories — clean path /category/slug
  for (const cat of categoriesData) {
    entries.push({
      url: `${base}/category/${encodeURIComponent(cat.slug)}`,
      lastModified: new Date(cat.updatedAt || cat.createdAt),
      changeFrequency: 'daily',
      priority: 0.7,
    });
  }

  // Latest news hub — clean path /news
  entries.push({
    url: `${base}/news`,
    lastModified: now,
    changeFrequency: 'hourly',
    priority: 0.9,
  });

  // Legal / static pages — clean path /legal/slug
  const legalPages = ['about', 'contact', 'privacy', 'terms', 'disclaimer'];
  for (const slug of legalPages) {
    entries.push({
      url: `${base}/legal/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    });
  }

  return entries;
}
