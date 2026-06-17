import React from 'react';

/**
 * Renders a JSON-LD <script> tag for structured data (Schema.org).
 * Used for Organization, WebSite, NewsArticle, BreadcrumbList, etc.
 *
 * Helps Google understand the content → rich results + Google News indexing.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * NewsArticle structured data — injected when an article overlay is open.
 * This is what Google News requires to feature articles.
 */
export function NewsArticleJsonLd({
  title,
  description,
  image,
  url,
  datePublished,
  dateModified,
  author,
  publisher,
  category,
}: {
  title: string;
  description: string;
  image: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  publisher: string;
  category?: string;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description: description,
    image: [image],
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: publisher,
      logo: {
        '@type': 'ImageObject',
        url: image,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: category,
    inLanguage: 'en',
  };
  return <JsonLd data={data} />;
}

/**
 * BreadcrumbList structured data — helps Google show breadcrumbs in search.
 */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return <JsonLd data={data} />;
}
