import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export const maxDuration = 300;

const articleTopics = [
  {
    slug: 'best-ai-tools-2026-complete-guide',
    title: 'Best AI Tools in 2026: Complete Guide for Professionals',
    category: 'Artificial Intelligence',
    prompt: 'Write a comprehensive article about the best AI tools in 2026 for professionals. Cover AI writing tools, data analysis, creative tools, development assistants, and business automation. Include specific tool names, features, pricing tiers, and practical use cases. End with a conclusion and 4 FAQ items.',
  },
  {
    slug: 'how-to-start-online-business-from-scratch',
    title: 'How to Start an Online Business from Scratch',
    category: 'Online Business',
    prompt: 'Write a comprehensive guide on starting an online business from scratch. Cover choosing a business model, market research, building your website, marketing strategies, financial planning, and scaling. Include actionable steps, real examples, and practical tips. End with a conclusion and 4 FAQ items.',
  },
  {
    slug: 'remote-work-skills-that-pay-well-2026',
    title: 'Remote Work Skills That Pay Well in 2026',
    category: 'Remote Jobs',
    prompt: 'Write a comprehensive article about the highest-paying remote work skills in 2026. Cover software development, digital marketing, data science, project management, UX design, and content creation. Include salary ranges, skill development paths, and job platforms. End with a conclusion and 4 FAQ items.',
  },
  {
    slug: 'smart-personal-finance-habits-build-wealth',
    title: 'Smart Personal Finance Habits That Build Wealth',
    category: 'Personal Finance',
    prompt: 'Write a comprehensive article about smart personal finance habits for building long-term wealth. Cover budgeting, saving strategies, investing basics, debt management, emergency funds, and retirement planning. Include specific numbers, tools, and actionable advice. End with a conclusion and 4 FAQ items.',
  },
  {
    slug: 'best-productivity-systems-maximum-output',
    title: 'Best Productivity Systems for Maximum Output',
    category: 'Productivity',
    prompt: 'Write a comprehensive article about the best productivity systems and methods. Cover GTD, Pomodoro, time blocking, Eisenhower Matrix, deep work, and digital tools. Include implementation guides, comparison of methods, and tips for different work styles. End with a conclusion and 4 FAQ items.',
  },
  {
    slug: 'top-technology-trends-shaping-future',
    title: 'Top Technology Trends Shaping Our Future',
    category: 'Technology Trends',
    prompt: 'Write a comprehensive article about the top technology trends shaping our future in 2026 and beyond. Cover AI, quantum computing, blockchain, IoT, AR/VR, green tech, and biotechnology. Include current state, future predictions, and industry impact. End with a conclusion and 4 FAQ items.',
  },
  {
    slug: 'digital-marketing-trends-cant-ignore',
    title: 'Digital Marketing Trends You Can\'t Ignore',
    category: 'Digital Marketing',
    prompt: 'Write a comprehensive article about digital marketing trends in 2026. Cover AI-driven marketing, video content, voice search, personalization, social commerce, influencer marketing, and privacy-first strategies. Include case studies and implementation tips. End with a conclusion and 4 FAQ items.',
  },
  {
    slug: 'essential-cybersecurity-tips-everyone',
    title: 'Essential Cybersecurity Tips for Everyone',
    category: 'Cyber Security',
    prompt: 'Write a comprehensive article about essential cybersecurity tips for everyday internet users. Cover password management, two-factor authentication, phishing prevention, safe browsing, data backup, VPNs, and social media security. Include practical step-by-step guides. End with a conclusion and 4 FAQ items.',
  },
  {
    slug: 'smartphone-tips-tricks-need-know',
    title: 'Smartphone Tips and Tricks You Need to Know',
    category: 'Smartphone Tips',
    prompt: 'Write a comprehensive article about smartphone tips and tricks. Cover battery optimization, storage management, privacy settings, productivity apps, camera tips, hidden features for iOS and Android, and security settings. Include specific steps and app recommendations. End with a conclusion and 4 FAQ items.',
  },
  {
    slug: 'health-wellness-digital-age',
    title: 'Health and Wellness in the Digital Age',
    category: 'Health & Wellness',
    prompt: 'Write a comprehensive article about maintaining health and wellness in the digital age. Cover digital detox, screen time management, ergonomic setup, fitness apps, mental health resources, nutrition tracking, and sleep hygiene. Include science-backed tips and tool recommendations. End with a conclusion and 4 FAQ items.',
  },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const batch = body.batch || 0;
    const startIdx = batch * 10;
    const batchTopics = articleTopics.slice(startIdx, startIdx + 10);

    const zai = await ZAI.create();
    const results: { slug: string; success: boolean }[] = [];

    for (const topic of batchTopics) {
      try {
        const completion = await zai.chat.completions.create({
          messages: [
            {
              role: 'assistant',
              content: 'You are a professional content writer for Digital Point Pro, a premium knowledge and trends website. Write comprehensive, SEO-optimized articles that are conversational yet professional, easy to read, and provide actionable information. Use proper markdown formatting with ## for H2 and ### for H3 headings. Write in a natural, engaging tone. Each article must be 1000-1500 words.',
            },
            {
              role: 'user',
              content: `${topic.prompt}\n\nFormat the article in markdown with these sections:\n1. Introduction paragraph\n2. 5-7 main sections with ## headings and detailed content\n3. A "## Conclusion" section\n4. A "## Frequently Asked Questions" section with 4 Q&A items formatted as:\n   **Q: [question]**\n   **A: [answer]**`,
            },
          ],
          thinking: { type: 'disabled' },
        });

        const content = completion.choices[0]?.message?.content || '';

        const faqMatches = content.match(/\*\*Q:\s*(.+?)\*\*\s*\n\*\*A:\s*(.+?)\*\*/g) || [];
        const faqs = faqMatches.map(match => {
          const qMatch = match.match(/\*\*Q:\s*(.+?)\*\*/);
          const aMatch = match.match(/\*\*A:\s*(.+?)\*\*/);
          return { question: qMatch?.[1] || '', answer: aMatch?.[1] || '' };
        });

        const excerptMatch = content.match(/^[^#].+/m);
        const excerpt = excerptMatch?.[0]?.substring(0, 200) || '';

        await db.article.update({
          where: { slug: topic.slug },
          data: {
            content,
            excerpt,
            faq: JSON.stringify(faqs),
            readTime: Math.max(5, Math.ceil(content.split(/\s+/).length / 200)),
          },
        });

        results.push({ slug: topic.slug, success: true });
      } catch (err) {
        results.push({ slug: topic.slug, success: false });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate articles' }, { status: 500 });
  }
}
