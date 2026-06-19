import { redirect } from 'next/navigation'

/**
 * Clean URL route for the Latest News hub.
 *
 * Flow: /news → /?news=1 → latest-news overlay opens
 */
export default function NewsPage() {
  redirect('/?news=1')
}
