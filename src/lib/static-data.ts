import articlesData from '@/data/articles.json';
import categoriesData from '@/data/categories.json';

export interface StaticArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  featuredImage: string;
  category: string;
  author: string;
  readTime: number;
  published: boolean;
  featured: boolean;
  trending: boolean;
  editorsPick: boolean;
  categorySlug: string | null;
  faq: string;
  createdAt: string;
  updatedAt: string;
}

export interface StaticCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
}

const articles = articlesData as StaticArticle[];
const categories = categoriesData as StaticCategory[];

// Get all articles with optional filtering
export function getArticles(options?: {
  category?: string;
  trending?: boolean;
  featured?: boolean;
  editorsPick?: boolean;
  limit?: number;
  offset?: number;
  published?: boolean;
}) {
  let filtered = [...articles];

  if (options?.published !== false) {
    filtered = filtered.filter(a => a.published);
  }
  if (options?.category) {
    filtered = filtered.filter(a => a.categorySlug === options.category);
  }
  if (options?.trending) {
    filtered = filtered.filter(a => a.trending);
  }
  if (options?.featured) {
    filtered = filtered.filter(a => a.featured);
  }
  if (options?.editorsPick) {
    filtered = filtered.filter(a => a.editorsPick);
  }

  // Sort by createdAt desc
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const total = filtered.length;
  const offset = options?.offset || 0;
  const limit = options?.limit || 20;
  const paginated = filtered.slice(offset, offset + limit);

  return { articles: paginated, total };
}

// Get single article by slug
export function getArticleBySlug(slug: string) {
  const article = articles.find(a => a.slug === slug);
  if (!article) return null;

  // Get related articles
  const related = articles
    .filter(a => a.categorySlug === article.categorySlug && a.slug !== slug && a.published)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)
    .map(a => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      featuredImage: a.featuredImage,
      category: a.category,
      author: a.author,
      readTime: a.readTime,
      createdAt: a.createdAt,
    }));

  return { article, related };
}

// Get all categories with article counts
export function getCategories() {
  return categories.map(cat => ({
    ...cat,
    _count: {
      articles: articles.filter(a => a.categorySlug === cat.slug && a.published).length,
    },
  }));
}

// Search articles
export function searchArticles(query: string) {
  if (!query || query.trim().length === 0) return { articles: [], total: 0 };

  const q = query.toLowerCase();
  const results = articles
    .filter(a => {
      if (!a.published) return false;
      return (
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.focusKeyword.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 20)
    .map(a => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      featuredImage: a.featuredImage,
      category: a.category,
      categorySlug: a.categorySlug,
      author: a.author,
      readTime: a.readTime,
      createdAt: a.createdAt,
    }));

  return { articles: results, total: results.length };
}
