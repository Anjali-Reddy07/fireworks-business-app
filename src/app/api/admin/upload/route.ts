export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image file provided.' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file format. Only JPEG, PNG, and WebP images are allowed.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File size exceeds maximum permitted limit of 10MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Keep clean, recognizable filename
    const ext = path.extname(file.name) || '.jpg';
    const baseName = path.basename(file.name, ext).replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_');
    const safeFileName = `${baseName || 'item'}_${Date.now()}${ext.toLowerCase()}`;

    // 1. Save to root products_img/
    const rootUploadDir = path.join(process.cwd(), 'products_img');
    await mkdir(rootUploadDir, { recursive: true });
    await writeFile(path.join(rootUploadDir, safeFileName), buffer);

    // 2. Save to public/products_img/ for Next.js web serving
    const publicUploadDir = path.join(process.cwd(), 'public', 'products_img');
    await mkdir(publicUploadDir, { recursive: true });
    await writeFile(path.join(publicUploadDir, safeFileName), buffer);

    const imageUrl = `/products_img/${encodeURIComponent(safeFileName)}`;

    return NextResponse.json({
      success: true,
      imageUrl,
      filename: safeFileName,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error uploading image';
    console.error('[Upload Exception]:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
