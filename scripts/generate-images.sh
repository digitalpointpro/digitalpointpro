#!/bin/bash

# Generate featured images for all 30 articles
OUTPUT_DIR="/home/z/my-project/public/images/articles"
mkdir -p "$OUTPUT_DIR"

generate_image() {
  local slug="$1"
  local prompt="$2"
  local output="$OUTPUT_DIR/$slug.jpg"
  
  if [ -f "$output" ]; then
    echo "⏭️  Skipping $slug (already exists)"
    return
  fi
  
  echo "🖼️  Generating image for: $slug"
  z-ai image -p "$prompt" -o "$output" -s 1344x768 2>&1
  if [ $? -eq 0 ]; then
    echo "✅ Generated: $slug.jpg"
  else
    echo "❌ Failed: $slug"
  fi
}

echo "🎨 Starting image generation for 30 articles..."
echo "================================================"

generate_image "best-ai-tools-2026-complete-guide" "Futuristic AI workspace with holographic displays showing artificial intelligence tools, neural networks, and data visualizations, professional modern office, blue and green ambient lighting, ultra high quality, 4K"
generate_image "how-to-start-online-business-from-scratch" "Modern entrepreneur working on laptop at clean desk with online business dashboard, e-commerce graphs, digital marketing icons floating, professional workspace, bright natural lighting, ultra high quality, 4K"
generate_image "remote-work-skills-that-pay-well-2026" "Professional working remotely from modern home office with multiple monitors showing code and video call, plants, coffee, comfortable workspace, warm lighting, ultra high quality, 4K"
generate_image "smart-personal-finance-habits-build-wealth" "Financial growth concept with growing money plant, coins, charts showing upward trends, piggy bank, investment portfolio on tablet, clean professional style, ultra high quality, 4K"
generate_image "best-productivity-systems-maximum-output" "Clean organized desk with planner, timer, checklist, productivity tools, minimalist workspace, focused work environment, natural lighting, ultra high quality, 4K"
generate_image "top-technology-trends-shaping-future" "Futuristic technology landscape with smart city, drones, autonomous vehicles, IoT devices connected with glowing lines, modern tech environment, ultra high quality, 4K"
generate_image "digital-marketing-trends-cant-ignore" "Digital marketing concept with social media icons, analytics dashboard, content creation tools, SEO graphs, email marketing, vibrant modern design, ultra high quality, 4K"
generate_image "essential-cybersecurity-tips-everyone" "Cybersecurity shield protecting digital assets, lock icons, encrypted data, firewall concept, hacker protection, dark blue and green theme, professional, ultra high quality, 4K"
generate_image "smartphone-tips-tricks-need-know" "Modern smartphone showing useful apps and features, clean minimal design, phone surrounded by productivity icons, tips and tricks concept, bright lighting, ultra high quality, 4K"
generate_image "health-wellness-digital-age" "Person meditating with smartwatch tracking health metrics, peaceful nature background, wellness and technology fusion, calm serene atmosphere, ultra high quality, 4K"
generate_image "best-online-learning-platforms-2026" "Student using laptop and tablet for online learning, educational content on screens, books, graduation cap, modern study environment, bright lighting, ultra high quality, 4K"
generate_image "freelancing-beginners-complete-guide" "Freelancer working creatively in modern co-working space, laptop with design tools, coffee, headphones, independent work lifestyle, warm lighting, ultra high quality, 4K"
generate_image "side-hustles-actually-work-2026" "Person managing multiple income streams on laptop and phone, side hustle concept, creative projects, passive income graphs, modern workspace, ultra high quality, 4K"
generate_image "future-jobs-demand-career-planning" "Future career planning concept with holographic job titles, career path visualization, professional development, modern office with glass walls, ultra high quality, 4K"
generate_image "social-media-growth-strategies-work" "Social media growth concept with rising engagement graphs, content creation setup, ring light, smartphone on tripod, viral content, modern design, ultra high quality, 4K"

echo ""
echo "Batch 1 complete (15/30). Continuing..."
echo ""

generate_image "future-of-artificial-intelligence" "Advanced AI brain visualization with neural pathways, deep learning networks, futuristic AI laboratory, glowing circuits, blue and purple ambient light, ultra high quality, 4K"
generate_image "passive-income-ideas-long-term-wealth" "Passive income concept with money flowing automatically, investment portfolio, real estate, dividend stocks, automated systems, wealth building visualization, ultra high quality, 4K"
generate_image "high-income-skills-learn-this-year" "High income skills concept with coding, data analysis, design, marketing tools floating around professional, skill development, modern learning environment, ultra high quality, 4K"
generate_image "how-to-save-money-smart-expert-tips" "Smart saving concept with piggy bank, budget planner, calculator, growing savings graph, financial planning tools, clean professional layout, ultra high quality, 4K"
generate_image "ai-for-students-tools-resources" "Student using AI tools for learning, smart study assistant on tablet, educational AI applications, modern classroom with technology, bright environment, ultra high quality, 4K"
generate_image "best-tech-gadgets-need-2026" "Collection of latest tech gadgets, smartwatch, wireless earbuds, tablet, smart home devices, sleek modern product photography, dark background with accent lighting, ultra high quality, 4K"
generate_image "ai-for-businesses-transforming-operations" "AI transforming business operations with automation, robotic process, data analytics dashboard, smart factory, corporate innovation, professional blue theme, ultra high quality, 4K"
generate_image "how-to-build-personal-brand-online" "Personal branding concept with professional headshot, social media profiles, content creation, brand identity elements, logo design, modern creative workspace, ultra high quality, 4K"
generate_image "data-privacy-guide-protect-information" "Data privacy and protection concept with encrypted data, privacy shield, secure lock, personal information being protected, digital security, dark professional theme, ultra high quality, 4K"
generate_image "work-from-home-tips-maximum-productivity" "Perfect work from home setup with standing desk, ergonomic chair, dual monitors, plants, natural light, productive home office, clean organized space, ultra high quality, 4K"
generate_image "career-growth-tips-ambitious-professionals" "Career growth visualization with professional climbing success ladder, achievement milestones, promotion concept, corporate advancement, modern office, ultra high quality, 4K"
generate_image "email-marketing-strategies-convert" "Email marketing concept with inbox, newsletter design, open rate analytics, conversion funnel, marketing automation, professional colorful design, ultra high quality, 4K"
generate_image "freelance-writing-how-to-get-started" "Freelance writer at creative workspace with laptop showing article, coffee cup, notebook, creative writing tools, inspiring environment, warm lighting, ultra high quality, 4K"
generate_image "mindfulness-mental-health-connected-world" "Mindfulness and mental wellness concept with person in peaceful meditation, digital detox, balanced lifestyle, nature elements, calming atmosphere, soft colors, ultra high quality, 4K"
generate_image "how-to-make-money-social-media-2026" "Social media monetization concept with influencer creating content, revenue streams, brand deals, content creation studio, smartphone recording setup, modern vibrant design, ultra high quality, 4K"

echo ""
echo "================================================"
echo "🎉 Image generation complete! All 30 images processed."
