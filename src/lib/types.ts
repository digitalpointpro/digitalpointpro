export interface Article {
  id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  featuredImage: string;
  category: string;
  categorySlug?: string;
  author: string;
  readTime: number;
  published: boolean;
  featured: boolean;
  trending: boolean;
  editorsPick: boolean;
  faq?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  categorySlug?: string;
  author: string;
  readTime: number;
  trending?: boolean;
  featured?: boolean;
  editorsPick?: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  _count?: { articles: number };
  createdAt: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export type OverlayType = 'article' | 'about' | 'privacy' | 'disclaimer' | 'terms' | 'contact' | 'category' | 'admin' | null;

export interface NavigationState {
  overlayType: OverlayType;
  overlayData: string | null; // article slug or category slug
  isOverlayOpen: boolean;
  openArticle: (slug: string) => void;
  openPage: (type: OverlayType, data?: string) => void;
  closeOverlay: () => void;
}
