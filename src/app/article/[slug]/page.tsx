import { redirect } from 'next/navigation'
import articlesData from '@/data/articles.json'

/**
 * Clean URL route for articles.
 *
 * Google Search Console rejects query-param URLs (`/?article=slug`) with
 * "Could not fetch" errors. This clean path route (`/article/slug`) is
 * fetchable by Googlebot and redirects to the overlay-based homepage.
 *
 * Flow:
 *   User/Googlebot visits /article/some-slug
 *     → server checks slug exists
 *     → 302 redirect to /?article=some-slug
 *     → homepage hydrates overlay from query param (no 404)
 *
 * The 302 (not 301) is intentional: we want Google to index the CLEAN
 * /article/slug URL, not the query-param version. 302 tells Google the
 * clean URL is the canonical one.
 */
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Validate slug exists — if not, redirect to homepage (no 404)
  const exists = articlesData.some((a) => a.slug === slug && a.published)
  if (!exists) {
    redirect('/')
  }

  redirect(`/?article=${encodeURIComponent(slug)}`)
}
