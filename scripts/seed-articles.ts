import { PrismaClient } from '@prisma/client';
import ZAI from 'z-ai-web-dev-sdk';

const prisma = new PrismaClient();

const categories = [
  { name: 'Artificial Intelligence', slug: 'artificial-intelligence', description: 'Explore the latest in AI technology, tools, and applications', icon: '🤖' },
  { name: 'Online Business', slug: 'online-business', description: 'Build and grow your online business empire', icon: '💼' },
  { name: 'Remote Jobs', slug: 'remote-jobs', description: 'Find remote work opportunities and thrive working from anywhere', icon: '🏠' },
  { name: 'Personal Finance', slug: 'personal-finance', description: 'Master your money with smart financial strategies', icon: '💰' },
  { name: 'Productivity', slug: 'productivity', description: 'Boost your productivity and get more done in less time', icon: '⚡' },
  { name: 'Technology Trends', slug: 'technology-trends', description: 'Stay ahead with the latest technology trends and innovations', icon: '🚀' },
  { name: 'Digital Marketing', slug: 'digital-marketing', description: 'Master digital marketing strategies for business growth', icon: '📈' },
  { name: 'Cyber Security', slug: 'cyber-security', description: 'Protect yourself and your business from cyber threats', icon: '🔒' },
  { name: 'Smartphone Tips', slug: 'smartphone-tips', description: 'Get the most out of your smartphone with expert tips', icon: '📱' },
  { name: 'Health & Wellness', slug: 'health-wellness', description: 'Achieve better health and wellness in the digital age', icon: '🌿' },
  { name: 'Education & Learning', slug: 'education-learning', description: 'Discover the best learning platforms and educational resources', icon: '📚' },
  { name: 'Freelancing', slug: 'freelancing', description: 'Launch and grow your freelance career successfully', icon: '✏️' },
  { name: 'Side Hustles', slug: 'side-hustles', description: 'Find profitable side hustles to boost your income', icon: '💡' },
  { name: 'Future Careers', slug: 'future-careers', description: 'Prepare for the jobs of tomorrow with career planning insights', icon: '🎯' },
  { name: 'Social Media Growth', slug: 'social-media-growth', description: 'Grow your social media presence and engagement', icon: '🔗' },
];

interface ArticleSpec {
  title: string;
  slug: string;
  category: string;
  categorySlug: string;
  focusKeyword: string;
  metaTitle: string;
  trending: boolean;
  featured: boolean;
  editorsPick: boolean;
}

const articleSpecs: ArticleSpec[] = [
  { title: 'Best AI Tools in 2026: Complete Guide for Professionals', slug: 'best-ai-tools-2026-complete-guide', category: 'Artificial Intelligence', categorySlug: 'artificial-intelligence', focusKeyword: 'best AI tools 2026', metaTitle: 'Best AI Tools in 2026: Complete Professional Guide | Digital Point Pro', trending: true, featured: true, editorsPick: false },
  { title: 'How to Start an Online Business from Scratch', slug: 'how-to-start-online-business-from-scratch', category: 'Online Business', categorySlug: 'online-business', focusKeyword: 'start online business', metaTitle: 'How to Start an Online Business from Scratch | Digital Point Pro', trending: false, featured: false, editorsPick: true },
  { title: 'Remote Work Skills That Pay Well in 2026', slug: 'remote-work-skills-that-pay-well-2026', category: 'Remote Jobs', categorySlug: 'remote-jobs', focusKeyword: 'remote work skills 2026', metaTitle: 'Remote Work Skills That Pay Well in 2026 | Digital Point Pro', trending: false, featured: true, editorsPick: false },
  { title: 'Smart Personal Finance Habits That Build Wealth', slug: 'smart-personal-finance-habits-build-wealth', category: 'Personal Finance', categorySlug: 'personal-finance', focusKeyword: 'personal finance habits build wealth', metaTitle: 'Smart Personal Finance Habits That Build Wealth | Digital Point Pro', trending: false, featured: false, editorsPick: false },
  { title: 'Best Productivity Systems for Maximum Output', slug: 'best-productivity-systems-maximum-output', category: 'Productivity', categorySlug: 'productivity', focusKeyword: 'best productivity systems', metaTitle: 'Best Productivity Systems for Maximum Output | Digital Point Pro', trending: false, featured: false, editorsPick: true },
  { title: 'Top Technology Trends Shaping Our Future', slug: 'top-technology-trends-shaping-future', category: 'Technology Trends', categorySlug: 'technology-trends', focusKeyword: 'technology trends 2026', metaTitle: 'Top Technology Trends Shaping Our Future | Digital Point Pro', trending: true, featured: false, editorsPick: false },
  { title: "Digital Marketing Trends You Can't Ignore", slug: 'digital-marketing-trends-you-cant-ignore', category: 'Digital Marketing', categorySlug: 'digital-marketing', focusKeyword: 'digital marketing trends 2026', metaTitle: "Digital Marketing Trends You Can't Ignore | Digital Point Pro", trending: false, featured: false, editorsPick: false },
  { title: 'Essential Cybersecurity Tips for Everyone', slug: 'essential-cybersecurity-tips-everyone', category: 'Cyber Security', categorySlug: 'cyber-security', focusKeyword: 'cybersecurity tips', metaTitle: 'Essential Cybersecurity Tips for Everyone | Digital Point Pro', trending: false, featured: true, editorsPick: false },
  { title: 'Smartphone Tips and Tricks You Need to Know', slug: 'smartphone-tips-and-tricks-you-need-to-know', category: 'Smartphone Tips', categorySlug: 'smartphone-tips', focusKeyword: 'smartphone tips and tricks', metaTitle: 'Smartphone Tips and Tricks You Need to Know | Digital Point Pro', trending: false, featured: false, editorsPick: false },
  { title: 'Health and Wellness in the Digital Age', slug: 'health-and-wellness-in-the-digital-age', category: 'Health & Wellness', categorySlug: 'health-wellness', focusKeyword: 'health wellness digital age', metaTitle: 'Health and Wellness in the Digital Age | Digital Point Pro', trending: false, featured: false, editorsPick: false },
  { title: 'Best Online Learning Platforms for 2026', slug: 'best-online-learning-platforms-2026', category: 'Education & Learning', categorySlug: 'education-learning', focusKeyword: 'best online learning platforms 2026', metaTitle: 'Best Online Learning Platforms for 2026 | Digital Point Pro', trending: false, featured: false, editorsPick: false },
  { title: 'Freelancing for Beginners: Complete Guide', slug: 'freelancing-for-beginners-complete-guide', category: 'Freelancing', categorySlug: 'freelancing', focusKeyword: 'freelancing for beginners', metaTitle: 'Freelancing for Beginners: Complete Guide | Digital Point Pro', trending: false, featured: false, editorsPick: true },
  { title: 'Side Hustles That Actually Work in 2026', slug: 'side-hustles-that-actually-work-2026', category: 'Side Hustles', categorySlug: 'side-hustles', focusKeyword: 'side hustles that work 2026', metaTitle: 'Side Hustles That Actually Work in 2026 | Digital Point Pro', trending: true, featured: false, editorsPick: false },
  { title: 'Future Jobs in Demand: Career Planning Guide', slug: 'future-jobs-in-demand-career-planning', category: 'Future Careers', categorySlug: 'future-careers', focusKeyword: 'future jobs in demand', metaTitle: 'Future Jobs in Demand: Career Planning Guide | Digital Point Pro', trending: true, featured: false, editorsPick: false },
  { title: 'Social Media Growth Strategies That Work', slug: 'social-media-growth-strategies-that-work', category: 'Social Media Growth', categorySlug: 'social-media-growth', focusKeyword: 'social media growth strategies', metaTitle: 'Social Media Growth Strategies That Work | Digital Point Pro', trending: false, featured: false, editorsPick: false },
  { title: 'The Future of Artificial Intelligence: What to Expect', slug: 'future-of-artificial-intelligence-what-to-expect', category: 'Artificial Intelligence', categorySlug: 'artificial-intelligence', focusKeyword: 'future of artificial intelligence', metaTitle: 'The Future of Artificial Intelligence: What to Expect | Digital Point Pro', trending: true, featured: false, editorsPick: false },
  { title: 'Passive Income Ideas for Long-Term Wealth', slug: 'passive-income-ideas-long-term-wealth', category: 'Online Business', categorySlug: 'online-business', focusKeyword: 'passive income ideas', metaTitle: 'Passive Income Ideas for Long-Term Wealth | Digital Point Pro', trending: false, featured: true, editorsPick: false },
  { title: 'High-Income Skills to Learn This Year', slug: 'high-income-skills-to-learn-this-year', category: 'Remote Jobs', categorySlug: 'remote-jobs', focusKeyword: 'high income skills 2026', metaTitle: 'High-Income Skills to Learn This Year | Digital Point Pro', trending: false, featured: false, editorsPick: false },
  { title: 'How to Save Money Smart: Expert Tips', slug: 'how-to-save-money-smart-expert-tips', category: 'Personal Finance', categorySlug: 'personal-finance', focusKeyword: 'how to save money smart', metaTitle: 'How to Save Money Smart: Expert Tips | Digital Point Pro', trending: false, featured: false, editorsPick: true },
  { title: 'AI for Students: Tools and Resources', slug: 'ai-for-students-tools-and-resources', category: 'Artificial Intelligence', categorySlug: 'artificial-intelligence', focusKeyword: 'AI tools for students', metaTitle: 'AI for Students: Tools and Resources | Digital Point Pro', trending: true, featured: false, editorsPick: false },
  { title: 'Best Tech Gadgets You Need in 2026', slug: 'best-tech-gadgets-you-need-2026', category: 'Technology Trends', categorySlug: 'technology-trends', focusKeyword: 'best tech gadgets 2026', metaTitle: 'Best Tech Gadgets You Need in 2026 | Digital Point Pro', trending: false, featured: false, editorsPick: false },
  { title: 'AI for Businesses: Transforming Operations', slug: 'ai-for-businesses-transforming-operations', category: 'Artificial Intelligence', categorySlug: 'artificial-intelligence', focusKeyword: 'AI for business operations', metaTitle: 'AI for Businesses: Transforming Operations | Digital Point Pro', trending: true, featured: false, editorsPick: false },
  { title: 'How to Build a Personal Brand Online', slug: 'how-to-build-personal-brand-online', category: 'Digital Marketing', categorySlug: 'digital-marketing', focusKeyword: 'build personal brand online', metaTitle: 'How to Build a Personal Brand Online | Digital Point Pro', trending: false, featured: false, editorsPick: false },
  { title: 'Data Privacy Guide: Protect Your Information', slug: 'data-privacy-guide-protect-your-information', category: 'Cyber Security', categorySlug: 'cyber-security', focusKeyword: 'data privacy guide', metaTitle: 'Data Privacy Guide: Protect Your Information | Digital Point Pro', trending: false, featured: true, editorsPick: false },
  { title: 'Work From Home Tips for Maximum Productivity', slug: 'work-from-home-tips-maximum-productivity', category: 'Productivity', categorySlug: 'productivity', focusKeyword: 'work from home productivity tips', metaTitle: 'Work From Home Tips for Maximum Productivity | Digital Point Pro', trending: false, featured: false, editorsPick: false },
  { title: 'Career Growth Tips for Ambitious Professionals', slug: 'career-growth-tips-ambitious-professionals', category: 'Future Careers', categorySlug: 'future-careers', focusKeyword: 'career growth tips', metaTitle: 'Career Growth Tips for Ambitious Professionals | Digital Point Pro', trending: false, featured: false, editorsPick: false },
  { title: 'Email Marketing Strategies That Convert', slug: 'email-marketing-strategies-that-convert', category: 'Digital Marketing', categorySlug: 'digital-marketing', focusKeyword: 'email marketing strategies', metaTitle: 'Email Marketing Strategies That Convert | Digital Point Pro', trending: false, featured: false, editorsPick: true },
  { title: 'Freelance Writing: How to Get Started', slug: 'freelance-writing-how-to-get-started', category: 'Freelancing', categorySlug: 'freelancing', focusKeyword: 'freelance writing getting started', metaTitle: 'Freelance Writing: How to Get Started | Digital Point Pro', trending: false, featured: false, editorsPick: false },
  { title: 'Mindfulness and Mental Health in a Connected World', slug: 'mindfulness-and-mental-health-connected-world', category: 'Health & Wellness', categorySlug: 'health-wellness', focusKeyword: 'mindfulness mental health digital age', metaTitle: 'Mindfulness and Mental Health in a Connected World | Digital Point Pro', trending: false, featured: false, editorsPick: false },
  { title: 'How to Make Money on Social Media in 2026', slug: 'how-to-make-money-on-social-media-2026', category: 'Social Media Growth', categorySlug: 'social-media-growth', focusKeyword: 'make money social media 2026', metaTitle: 'How to Make Money on Social Media in 2026 | Digital Point Pro', trending: true, featured: false, editorsPick: false },
];

const SYSTEM_PROMPT = `You are a professional content writer for Digital Point Pro, a premium knowledge and trends website. Write comprehensive, SEO-optimized articles that are conversational yet professional, easy to read, and provide actionable information. Include proper headings (## for H2, ### for H3), bullet points, and numbered lists where appropriate. Write in a natural, engaging tone.`;

function extractFAQ(content: string): { question: string; answer: string }[] {
  const faqItems: { question: string; answer: string }[] = [];
  const faqRegex = /\*\*Q:\s*(.+?)\*\*\s*\n+\s*\*\*A:\s*(.+?)\*\*/g;
  let match;
  while ((match = faqRegex.exec(content)) !== null) {
    faqItems.push({
      question: match[1].trim(),
      answer: match[2].trim(),
    });
  }
  return faqItems;
}

function extractMetaDescription(content: string): string {
  const metaRegex = /Meta Description:\s*(.+)/i;
  const match = content.match(metaRegex);
  return match ? match[1].trim().substring(0, 160) : '';
}

function extractExcerpt(content: string): string {
  // Get the first paragraph after any heading
  const lines = content.split('\n');
  let excerpt = '';
  let foundFirstContent = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('#')) {
      if (foundFirstContent) break;
      continue;
    }
    if (!foundFirstContent) {
      foundFirstContent = true;
    }
    excerpt += trimmed + ' ';
    if (excerpt.length >= 200) break;
  }
  return excerpt.trim().substring(0, 200);
}

async function generateArticle(zai: any, spec: ArticleSpec, retries = 3): Promise<string | null> {
  const userPrompt = `Write a comprehensive article titled "${spec.title}" for the ${spec.category} category.

Requirements:
- Write 1000-1500 words
- Use proper H2 (##) and H3 (###) headings
- Include an introduction paragraph
- Cover at least 5 main sections with detailed content
- Include practical tips and actionable advice
- Add a conclusion section titled "Conclusion"
- End with a FAQ section (3-5 questions with answers) formatted as:
  **Q: [question]**
  **A: [answer]**

SEO Details:
- Focus Keyword: ${spec.focusKeyword}
- Meta Title: ${spec.metaTitle}
- Meta Description: Write a compelling 150-160 character description`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const completion = await zai.chat.completions.create({
        messages: [
          { role: 'assistant', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        thinking: { type: 'disabled' },
      });
      const content = completion.choices[0]?.message?.content;
      if (content && content.length > 500) {
        return content;
      }
      console.log(`  ⚠️ Article "${spec.title}" generated short content (${content?.length || 0} chars), retrying...`);
    } catch (error: any) {
      console.log(`  ⚠️ Attempt ${attempt}/${retries} failed for "${spec.title}": ${error.message}`);
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 5000 * attempt));
      }
    }
  }
  return null;
}

async function main() {
  const log = (msg: string) => { console.error(msg); };
  log('🚀 Starting LLM-powered article generation seed...');
  log('⏳ This may take a while (30 articles x ~45s each = ~22 minutes)\n');

  // Initialize ZAI SDK
  const zai = await ZAI.create();
  log('✅ ZAI SDK initialized');

  // Create categories
  log('📁 Creating categories...');
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, icon: cat.icon },
      create: cat,
    });
  }
  log(`✅ Created ${categories.length} categories`);

  // Generate articles
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < articleSpecs.length; i++) {
    const spec = articleSpecs[i];
    log(`\n📝 [${i + 1}/${articleSpecs.length}] Generating: "${spec.title}"`);

    const content = await generateArticle(zai, spec);

    if (!content) {
      log(`  ❌ Failed to generate article: "${spec.title}"`);
      failCount++;
      continue;
    }

    // Parse the generated content
    const faqItems = extractFAQ(content);
    const metaDescription = extractMetaDescription(content) || `Comprehensive guide about ${spec.focusKeyword}. Learn strategies, tips, and expert insights.`;
    const excerpt = extractExcerpt(content);
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    try {
      await prisma.article.upsert({
        where: { slug: spec.slug },
        update: {
          title: spec.title,
          content: content,
          excerpt: excerpt,
          metaTitle: spec.metaTitle,
          metaDescription: metaDescription,
          focusKeyword: spec.focusKeyword,
          featuredImage: `/images/articles/${spec.slug}.jpg`,
          category: spec.category,
          categorySlug: spec.categorySlug,
          author: 'Digital Point Pro Team',
          readTime: readTime,
          published: true,
          featured: spec.featured,
          trending: spec.trending,
          editorsPick: spec.editorsPick,
          faq: JSON.stringify(faqItems),
        },
        create: {
          title: spec.title,
          slug: spec.slug,
          content: content,
          excerpt: excerpt,
          metaTitle: spec.metaTitle,
          metaDescription: metaDescription,
          focusKeyword: spec.focusKeyword,
          featuredImage: `/images/articles/${spec.slug}.jpg`,
          category: spec.category,
          categorySlug: spec.categorySlug,
          author: 'Digital Point Pro Team',
          readTime: readTime,
          published: true,
          featured: spec.featured,
          trending: spec.trending,
          editorsPick: spec.editorsPick,
          faq: JSON.stringify(faqItems),
        },
      });
      log(`  ✅ Saved (${wordCount} words, ${readTime} min read, ${faqItems.length} FAQs)`);
      successCount++;
    } catch (error: any) {
      log(`  ❌ Database error: ${error.message}`);
      failCount++;
    }

    // Small delay between API calls
    if (i < articleSpecs.length - 1) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  // Summary
  const totalArticles = await prisma.article.count();
  const totalCategories = await prisma.category.count();
  const trendingCount = await prisma.article.count({ where: { trending: true } });
  const featuredCount = await prisma.article.count({ where: { featured: true } });
  const editorsPickCount = await prisma.article.count({ where: { editorsPick: true } });

  log('\n📊 Final Database Summary:');
  log(`   Categories: ${totalCategories}`);
  log(`   Articles: ${totalArticles}`);
  log(`   Trending: ${trendingCount}`);
  log(`   Featured: ${featuredCount}`);
  log(`   Editor's Picks: ${editorsPickCount}`);
  log(`   Generated successfully: ${successCount}`);
  log(`   Failed: ${failCount}`);
  log('\n🎉 LLM seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e); process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
