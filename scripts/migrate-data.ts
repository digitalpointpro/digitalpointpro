import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface CategoryJSON {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

interface ArticleJSON {
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
  categorySlug: string;
  author: string;
  readTime: number;
  published: boolean;
  featured: boolean;
  trending: boolean;
  editorsPick: boolean;
  faq: string;
  createdAt: string;
  updatedAt: string;
}

async function main() {
  console.log('🚀 Starting data migration from JSON to SQLite...\n');

  // Read JSON files
  const categoriesPath = path.join(__dirname, '..', 'src', 'data', 'categories.json');
  const articlesPath = path.join(__dirname, '..', 'src', 'data', 'articles.json');

  console.log(`📄 Reading categories from: ${categoriesPath}`);
  console.log(`📄 Reading articles from: ${articlesPath}\n`);

  const categoriesRaw: CategoryJSON[] = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'));
  const articlesRaw: ArticleJSON[] = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'));

  console.log(`📊 Found ${categoriesRaw.length} categories and ${articlesRaw.length} articles\n`);

  // Step 1: Insert categories using upsert
  console.log('📁 Migrating categories...');
  let categoriesInserted = 0;
  let categoriesSkipped = 0;

  for (const cat of categoriesRaw) {
    const result = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        updatedAt: new Date(cat.updatedAt),
      },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        createdAt: new Date(cat.createdAt),
        updatedAt: new Date(cat.updatedAt),
      },
    });

    if (result.createdAt.getTime() === result.updatedAt.getTime()) {
      categoriesInserted++;
      console.log(`  ✅ Created: ${cat.name} (${cat.slug})`);
    } else {
      categoriesSkipped++;
      console.log(`  ⏭️  Already exists: ${cat.name} (${cat.slug})`);
    }
  }

  console.log(`\n📁 Categories: ${categoriesInserted} inserted, ${categoriesSkipped} skipped\n`);

  // Step 2: Insert articles using upsert
  console.log('📝 Migrating articles...');
  let articlesInserted = 0;
  let articlesSkipped = 0;

  for (const art of articlesRaw) {
    const result = await prisma.article.upsert({
      where: { slug: art.slug },
      update: {
        title: art.title,
        content: art.content,
        excerpt: art.excerpt,
        metaTitle: art.metaTitle,
        metaDescription: art.metaDescription,
        focusKeyword: art.focusKeyword,
        featuredImage: art.featuredImage,
        category: art.category,
        categorySlug: art.categorySlug,
        author: art.author,
        readTime: art.readTime,
        published: art.published,
        featured: art.featured,
        trending: art.trending,
        editorsPick: art.editorsPick,
        faq: art.faq,
        updatedAt: new Date(art.updatedAt),
      },
      create: {
        id: art.id,
        title: art.title,
        slug: art.slug,
        content: art.content,
        excerpt: art.excerpt,
        metaTitle: art.metaTitle,
        metaDescription: art.metaDescription,
        focusKeyword: art.focusKeyword,
        featuredImage: art.featuredImage,
        category: art.category,
        categorySlug: art.categorySlug,
        author: art.author,
        readTime: art.readTime,
        published: art.published,
        featured: art.featured,
        trending: art.trending,
        editorsPick: art.editorsPick,
        faq: art.faq,
        createdAt: new Date(art.createdAt),
        updatedAt: new Date(art.updatedAt),
      },
    });

    if (result.createdAt.getTime() === result.updatedAt.getTime()) {
      articlesInserted++;
      console.log(`  ✅ Created: ${art.title.substring(0, 60)}...`);
    } else {
      articlesSkipped++;
      console.log(`  ⏭️  Already exists: ${art.title.substring(0, 60)}...`);
    }
  }

  console.log(`\n📝 Articles: ${articlesInserted} inserted, ${articlesSkipped} skipped\n`);

  // Step 3: Verify counts
  const dbCategoryCount = await prisma.category.count();
  const dbArticleCount = await prisma.article.count();

  console.log('📊 Final database counts:');
  console.log(`  Categories: ${dbCategoryCount}`);
  console.log(`  Articles: ${dbArticleCount}`);

  // Verify all categorySlug values reference valid categories
  const articlesWithInvalidCategory = await prisma.article.findMany({
    where: {
      categorySlug: { not: null },
    },
    select: { slug: true, categorySlug: true },
  });

  const allCategorySlugs = new Set(categoriesRaw.map(c => c.slug));
  const invalidRefs = articlesWithInvalidCategory.filter(
    a => a.categorySlug && !allCategorySlugs.has(a.categorySlug)
  );

  if (invalidRefs.length > 0) {
    console.warn(`\n⚠️  Found ${invalidRefs.length} articles with invalid categorySlug references:`);
    invalidRefs.forEach(a => console.warn(`  - ${a.slug} → ${a.categorySlug}`));
  } else {
    console.log('✅ All categorySlug references are valid');
  }

  console.log('\n🎉 Migration completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
