import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import ZAI from 'z-ai-web-dev-sdk';

export const maxDuration = 120;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 60);
}

export async function POST(request: Request) {
  try {
    const { prompt, width = 1344, height = 768 } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const zai = await ZAI.create();

    const result = await zai.image.generate({
      prompt: `${prompt}. Professional, modern, vibrant, high quality, 4K resolution, editorial style`,
      width,
      height,
    });

    if (!result.image) {
      return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
    }

    // Save image to public directory
    const imageBuffer = Buffer.from(result.image, 'base64');
    const filename = `${slugify(prompt.substring(0, 50))}-${Date.now()}.jpg`;
    const publicDir = path.join(process.cwd(), 'public', 'images', 'articles');

    try {
      await mkdir(publicDir, { recursive: true });
    } catch {
      // Directory might already exist
    }

    const filePath = path.join(publicDir, filename);
    await writeFile(filePath, imageBuffer);

    const imageUrl = `/images/articles/${filename}`;

    return NextResponse.json({ url: imageUrl, filename });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}
