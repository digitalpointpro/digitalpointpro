import { create } from 'zustand';
import { NavigationState, OverlayType } from './types';

export const useNavigation = create<NavigationState>((set, get) => ({
  overlayType: null,
  overlayData: null,
  isOverlayOpen: false,
  previousOverlayType: null,
  previousOverlayData: null,

  openArticle: (slug: string) => {
    const state = get();
    // Store current overlay as previous so we can go back to it
    if (state.isOverlayOpen && state.overlayType) {
      set({
        previousOverlayType: state.overlayType,
        previousOverlayData: state.overlayData,
      });
    } else {
      set({ previousOverlayType: null, previousOverlayData: null });
    }
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
    // Reset previous when opening a new page directly
    set({ overlayType: type, overlayData: data || null, isOverlayOpen: true, previousOverlayType: null, previousOverlayData: null });
    document.body.style.overflow = 'hidden';
  },

  goBack: () => {
    const state = get();
    if (state.previousOverlayType) {
      // Go back to previous overlay (e.g., the category or latest-news page)
      const prevType = state.previousOverlayType;
      const prevData = state.previousOverlayData;
      let path = `/${prevType}`;
      if (prevType === 'category' && prevData) {
        path = `/category/${prevData}`;
      } else if (prevType === 'latest-news') {
        path = '/latest-news';
      }
      window.history.pushState({ overlay: prevType, data: prevData }, '', path);
      set({
        overlayType: prevType,
        overlayData: prevData,
        isOverlayOpen: true,
        previousOverlayType: null,
        previousOverlayData: null,
      });
    } else {
      // No previous overlay, close to home
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
