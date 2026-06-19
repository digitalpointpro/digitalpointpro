import { redirect } from 'next/navigation'

/**
 * Clean URL route for legal/static pages.
 *
 * Flow: /legal/about → /?legal=about → legal overlay opens
 */
const VALID_LEGAL = ['about', 'contact', 'privacy', 'terms', 'disclaimer']

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  if (!VALID_LEGAL.includes(slug)) {
    redirect('/')
  }

  redirect(`/?legal=${encodeURIComponent(slug)}`)
}
