import { create } from 'zustand';
import { NavigationState, OverlayType } from './types';

export const useNavigation = create<NavigationState>((set) => ({
  overlayType: null,
  overlayData: null,
  isOverlayOpen: false,

  openArticle: (slug: string) => {
    window.history.pushState({ overlay: 'article', slug }, '', `/article/${slug}`);
    set({ overlayType: 'article', overlayData: slug, isOverlayOpen: true });
    document.body.style.overflow = 'hidden';
  },

  openPage: (type: OverlayType, data?: string) => {
    if (!type) return;
    let path = `/${type}`;
    if (type === 'category' && data) {
      path = `/category/${data}`;
    } else if (type === 'latest-news') {
      path = '/latest-news';
    } else if (type === 'legal') {
      path = data ? `/legal/${data}` : '/legal';
    }
    window.history.pushState({ overlay: type, data }, '', path);
    set({ overlayType: type, overlayData: data || null, isOverlayOpen: true });
    document.body.style.overflow = 'hidden';
  },

  closeOverlay: () => {
    window.history.pushState({}, '', '/');
    set({ overlayType: null, overlayData: null, isOverlayOpen: false });
    document.body.style.overflow = '';
  },
}));
