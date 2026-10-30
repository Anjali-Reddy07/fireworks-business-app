export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { readdir, stat, copyFile, mkdir } from 'fs/promises';
import path from 'path';

const ALLOWED_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'];

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const rootDir = path.join(process.cwd(), 'products_img');
    const publicDir = path.join(process.cwd(), 'public', 'products_img');

    // Ensure both directories exist
    await mkdir(rootDir, { recursive: true });
    await mkdir(publicDir, { recursive: true });

    // Read files in root products_img
    const files = await readdir(rootDir);
    const images: Array<{
      filename: string;
      url: string;
      size: number;
      updatedAt: string;
    }> = [];

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (!ALLOWED_EXTS.includes(ext)) continue;

      const srcPath = path.join(rootDir, file);
      const destPath = path.join(publicDir, file);

      // Sync to public/products_img if needed
      try {
        await copyFile(srcPath, destPath);
      } catch {
        // ignore copy errors
      }

      const fileStat = await stat(srcPath);
      images.push({
        filename: file,
        url: `/products_img/${encodeURIComponent(file)}`,
        size: fileStat.size,
        updatedAt: fileStat.mtime.toISOString(),
      });
    }

    // Sort newest first
    images.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return NextResponse.json({ success: true, images });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error scanning products_img';
    console.error('Products-images API error:', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

