import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = '/home/z/my-project/public/images/articles';

const imagePrompts: { slug: string; prompt: string }[] = [
  { slug: 'best-productivity-systems-maximum-output', prompt: 'Clean organized desk with planner, timer, checklist, productivity tools, minimalist workspace, focused work environment, natural lighting, ultra high quality, 4K' },
  { slug: 'top-technology-trends-shaping-future', prompt: 'Futuristic technology landscape with smart city, drones, autonomous vehicles, IoT devices connected with glowing lines, modern tech environment, ultra high quality, 4K' },
  { slug: 'digital-marketing-trends-cant-ignore', prompt: 'Digital marketing concept with social media icons, analytics dashboard, content creation tools, SEO graphs, email marketing, vibrant modern design, ultra high quality, 4K' },
  { slug: 'essential-cybersecurity-tips-everyone', prompt: 'Cybersecurity shield protecting digital assets, lock icons, encrypted data, firewall concept, hacker protection, dark blue and green theme, professional, ultra high quality, 4K' },
  { slug: 'smartphone-tips-tricks-need-know', prompt: 'Modern smartphone showing useful apps and features, clean minimal design, phone surrounded by productivity icons, bright lighting, ultra high quality, 4K' },
  { slug: 'health-wellness-digital-age', prompt: 'Person meditating with smartwatch tracking health metrics, peaceful nature background, wellness and technology fusion, calm serene atmosphere, ultra high quality, 4K' },
  { slug: 'best-online-learning-platforms-2026', prompt: 'Student using laptop and tablet for online learning, educational content on screens, books, graduation cap, modern study environment, bright lighting, ultra high quality, 4K' },
  { slug: 'freelancing-beginners-complete-guide', prompt: 'Freelancer working creatively in modern co-working space, laptop with design tools, coffee, headphones, independent work lifestyle, warm lighting, ultra high quality, 4K' },
  { slug: 'side-hustles-actually-work-2026', prompt: 'Person managing multiple income streams on laptop and phone, side hustle concept, creative projects, passive income graphs, modern workspace, ultra high quality, 4K' },
  { slug: 'future-jobs-demand-career-planning', prompt: 'Future career planning concept with holographic job titles, career path visualization, professional development, modern office, ultra high quality, 4K' },
  { slug: 'social-media-growth-strategies-work', prompt: 'Social media growth concept with rising engagement graphs, content creation setup, ring light, smartphone on tripod, viral content, modern design, ultra high quality, 4K' },
  { slug: 'future-of-artificial-intelligence', prompt: 'Advanced AI brain visualization with neural pathways, deep learning networks, futuristic AI laboratory, glowing circuits, blue and purple ambient light, ultra high quality, 4K' },
  { slug: 'passive-income-ideas-long-term-wealth', prompt: 'Passive income concept with money flowing automatically, investment portfolio, real estate, dividend stocks, automated systems, wealth building visualization, ultra high quality, 4K' },
  { slug: 'high-income-skills-learn-this-year', prompt: 'High income skills concept with coding, data analysis, design, marketing tools floating around professional, skill development, modern learning environment, ultra high quality, 4K' },
  { slug: 'how-to-save-money-smart-expert-tips', prompt: 'Smart saving concept with piggy bank, budget planner, calculator, growing savings graph, financial planning tools, clean professional layout, ultra high quality, 4K' },
  { slug: 'ai-for-students-tools-resources', prompt: 'Student using AI tools for learning, smart study assistant on tablet, educational AI applications, modern classroom with technology, bright environment, ultra high quality, 4K' },
  { slug: 'best-tech-gadgets-need-2026', prompt: 'Collection of latest tech gadgets, smartwatch, wireless earbuds, tablet, smart home devices, sleek modern product photography, dark background with accent lighting, ultra high quality, 4K' },
  { slug: 'ai-for-businesses-transforming-operations', prompt: 'AI transforming business operations with automation, robotic process, data analytics dashboard, smart factory, corporate innovation, professional blue theme, ultra high quality, 4K' },
  { slug: 'how-to-build-personal-brand-online', prompt: 'Personal branding concept with professional headshot, social media profiles, content creation, brand identity elements, logo design, modern creative workspace, ultra high quality, 4K' },
  { slug: 'data-privacy-guide-protect-information', prompt: 'Data privacy and protection concept with encrypted data, privacy shield, secure lock, personal information being protected, digital security, dark professional theme, ultra high quality, 4K' },
  { slug: 'work-from-home-tips-maximum-productivity', prompt: 'Perfect work from home setup with standing desk, ergonomic chair, dual monitors, plants, natural light, productive home office, clean organized space, ultra high quality, 4K' },
  { slug: 'career-growth-tips-ambitious-professionals', prompt: 'Career growth visualization with professional climbing success ladder, achievement milestones, promotion concept, corporate advancement, modern office, ultra high quality, 4K' },
  { slug: 'email-marketing-strategies-convert', prompt: 'Email marketing concept with inbox, newsletter design, open rate analytics, conversion funnel, marketing automation, professional colorful design, ultra high quality, 4K' },
  { slug: 'freelance-writing-how-to-get-started', prompt: 'Freelance writer at creative workspace with laptop showing article, coffee cup, notebook, creative writing tools, inspiring environment, warm lighting, ultra high quality, 4K' },
  { slug: 'mindfulness-mental-health-connected-world', prompt: 'Mindfulness and mental wellness concept with person in peaceful meditation, digital detox, balanced lifestyle, nature elements, calming atmosphere, soft colors, ultra high quality, 4K' },
  { slug: 'how-to-make-money-social-media-2026', prompt: 'Social media monetization concept with influencer creating content, revenue streams, brand deals, content creation studio, smartphone recording setup, modern vibrant design, ultra high quality, 4K' },
];

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(`🎨 Generating ${imagePrompts.length} images...`);

  const zai = await ZAI.create();

  for (let i = 0; i < imagePrompts.length; i++) {
    const { slug, prompt } = imagePrompts[i];
    const outputPath = path.join(OUTPUT_DIR, `${slug}.jpg`);

    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  Skipping ${slug} (already exists)`);
      continue;
    }

    try {
      console.log(`🖼️  [${i + 1}/${imagePrompts.length}] Generating: ${slug}`);
      const response = await zai.images.generations.create({
        prompt,
        size: '1344x768',
      });

      const imageBase64 = response.data[0].base64;
      const buffer = Buffer.from(imageBase64, 'base64');
      fs.writeFileSync(outputPath, buffer);
      console.log(`✅ Saved: ${slug}.jpg (${(buffer.length / 1024).toFixed(0)}KB)`);
    } catch (error: any) {
      console.error(`❌ Failed: ${slug} - ${error.message}`);
      // Wait and retry once
      await new Promise(r => setTimeout(r, 3000));
      try {
        console.log(`🔄 Retrying: ${slug}`);
        const response = await zai.images.generations.create({
          prompt,
          size: '1344x768',
        });
        const imageBase64 = response.data[0].base64;
        const buffer = Buffer.from(imageBase64, 'base64');
        fs.writeFileSync(outputPath, buffer);
        console.log(`✅ Saved on retry: ${slug}.jpg`);
      } catch (retryError: any) {
        console.error(`❌ Retry failed: ${slug} - ${retryError.message}`);
      }
    }

    // Small delay between requests
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('\n🎉 Image generation complete!');
}

main().catch(console.error);
