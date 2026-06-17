import { create } from 'zustand';
import { NavigationState, OverlayType } from './types';

/**
 * Navigation store.
 *
 * IMPORTANT (SEO fix): We use QUERY-PARAM based URLs (`/?article=slug`,
 * `/?category=slug`, `/?news=1`, `/?legal=slug`) instead of path-based URLs
 * (`/article/slug`). Path-based URLs 404 on direct visit because there are no
 * matching Next.js routes, which breaks social sharing and SEO indexing.
 * Query-param URLs always resolve to the single `/` route and the overlay is
 * hydrated from the query param on mount (see page.tsx).
 */

function buildUrl(params: Record<string, string>): string {
  const sp = new URLSearchParams(params);
  const qs = sp.toString();
  return qs ? `/?${qs}` : '/';
}

export const useNavigation = create<NavigationState>((set, get) => ({
  overlayType: null,
  overlayData: null,
  isOverlayOpen: false,
  previousOverlayType: null,
  previousOverlayData: null,

  openArticle: (slug: string) => {
    const state = get();
    const previousOverlayType = state.isOverlayOpen && state.overlayType ? state.overlayType : null;
    const previousOverlayData = state.isOverlayOpen && state.overlayType ? state.overlayData : null;
    window.history.pushState({ overlay: 'article', slug }, '', buildUrl({ article: slug }));
    set({
      overlayType: 'article',
      overlayData: slug,
      isOverlayOpen: true,
      previousOverlayType,
      previousOverlayData,
    });
    document.body.style.overflow = 'hidden';
  },

  openPage: (type: OverlayType, data?: string) => {
    if (!type) return;
    let url = '/';
    if (type === 'category' && data) {
      url = buildUrl({ category: data });
    } else if (type === 'latest-news') {
      url = buildUrl({ news: '1' });
    } else if (type === 'legal') {
      url = data ? buildUrl({ legal: data }) : '/';
    }
    window.history.pushState({ overlay: type, data }, '', url);
    set({ overlayType: type, overlayData: data || null, isOverlayOpen: true, previousOverlayType: null, previousOverlayData: null });
    document.body.style.overflow = 'hidden';
  },

  goBack: () => {
    const state = get();
    if (state.previousOverlayType) {
      const prevType = state.previousOverlayType;
      const prevData = state.previousOverlayData;
      let url = '/';
      if (prevType === 'category' && prevData) {
        url = buildUrl({ category: prevData });
      } else if (prevType === 'latest-news') {
        url = buildUrl({ news: '1' });
      }
      window.history.pushState({ overlay: prevType, data: prevData }, '', url);
      set({
        overlayType: prevType,
        overlayData: prevData,
        isOverlayOpen: true,
        previousOverlayType: null,
        previousOverlayData: null,
      });
    } else {
      window.history.pushState({}, '', '/');
      set({ overlayType: null, overlayData: null, isOverlayOpen: false, previousOverlayType: null, previousOverlayData: null });
      document.body.style.overflow = '';
    }
  },

  closeOverlay: () => {
    window.history.pushState({}, '', '/');
    set({ overlayType: null, overlayData: null, isOverlayOpen: false, previousOverlayType: null, previousOverlayData: null });
    document.body.style.overflow = '';
  },
}));

/**
 * Parse the current URL query params into an overlay state.
 * Used on initial mount to hydrate the overlay from a shared/bookmarked URL.
 */
export function getOverlayFromUrl(): {
  type: OverlayType;
  data: string | null;
} | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const article = params.get('article');
  if (article) return { type: 'article', data: article };
  const category = params.get('category');
  if (category) return { type: 'category', data: category };
  const news = params.get('news');
  if (news === '1') return { type: 'latest-news', data: null };
  const legal = params.get('legal');
  if (legal) return { type: 'legal', data: legal };
  return null;
}
