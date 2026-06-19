import { redirect } from 'next/navigation'
import categoriesData from '@/data/categories.json'

/**
 * Clean URL route for categories.
 *
 * Google Search Console rejects query-param URLs (`/?category=slug`) with
 * "Could not fetch" errors. This clean path route (`/category/slug`) is
 * fetchable by Googlebot and redirects to the overlay-based homepage.
 *
 * Flow: /category/some-slug → /?category=some-slug → overlay opens
 */
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Validate slug exists — if not, redirect to homepage (no 404)
  const exists = categoriesData.some((c) => c.slug === slug)
  if (!exists) {
    redirect('/')
  }

  redirect(`/?category=${encodeURIComponent(slug)}`)
}
