import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export const maxDuration = 300;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function POST(request: Request) {
  try {
    const { topic, category, focusKeyword } = await request.json();

    if (!topic || !category) {
      return NextResponse.json({ error: 'Topic and category are required' }, { status: 400 });
    }

    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: 'You are a professional content writer for Digital Point Pro, a premium knowledge and trends website. Write comprehensive, SEO-optimized articles that are conversational yet professional, easy to read, and provide actionable information. Use proper markdown formatting with ## for H2 and ### for H3 headings. Write in a natural, engaging tone. Each article must be 1000-1500 words.',
        },
        {
          role: 'user',
          content: `Write a comprehensive article about: "${topic}"\n\nCategory: ${category}${focusKeyword ? `\nFocus Keyword: ${focusKeyword}` : ''}\n\nFormat the article in markdown with these sections:\n1. An engaging introduction paragraph\n2. 5-7 main sections with ## headings and detailed content with practical tips and actionable advice\n3. A "## Conclusion" section summarizing key takeaways\n4. A "## Frequently Asked Questions" section with 4 Q&A items formatted as:\n   **Q: [question]**\n   **A: [answer]**\n\nMake the article informative, engaging, and valuable for readers. Include specific examples, tips, and recommendations.`,
        },
      ],
      thinking: { type: 'disabled' },
    });

    const content = completion.choices[0]?.message?.content || '';

    if (!content || content.length < 200) {
      return NextResponse.json({ error: 'AI failed to generate sufficient content' }, { status: 500 });
    }

    // Extract title from first H1 or first line
    const titleMatch = content.match(/^#\s+(.+)/m);
    const title = titleMatch?.[1] || topic;

    // Extract FAQ
    const faqMatches = content.match(/\*\*Q:\s*(.+?)\*\*\s*\n\*\*A:\s*(.+?)\*\*/g) || [];
    const faqs = faqMatches.map(match => {
      const qMatch = match.match(/\*\*Q:\s*(.+?)\*\*/);
      const aMatch = match.match(/\*\*A:\s*(.+?)\*\*/);
      return { question: qMatch?.[1] || '', answer: aMatch?.[1] || '' };
    });

    // Generate excerpt
    const excerptMatch = content.match(/^[^#].+/m);
    const excerpt = excerptMatch?.[0]?.substring(0, 200) || content.substring(0, 200).replace(/[#*_\n]/g, ' ').trim();

    return NextResponse.json({
      success: true,
      article: {
        title,
        content,
        excerpt,
        faqs,
        readTime: Math.max(5, Math.ceil(content.split(/\s+/).length / 200)),
        metaTitle: `${title} | Digital Point Pro`,
        metaDescription: excerpt,
        focusKeyword: focusKeyword || title.split(' ').slice(0, 5).join(' '),
      },
    });
  } catch (error) {
    console.error('AI generate article error:', error);
    return NextResponse.json({ error: 'Failed to generate article' }, { status: 500 });
  }
}
