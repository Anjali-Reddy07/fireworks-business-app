import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { isSupabaseConfigured, getAdminSupabase } from '@/lib/supabase';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

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

    // Validate MIME type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file format. Only JPEG, PNG, and WebP images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File size exceeds maximum permitted limit of 5MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Unique filename
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);
    const uniqueFileName = `fw_${Date.now()}_${cleanName}.${ext}`;

    // 1. If Supabase is configured, upload to Supabase Storage bucket 'fireworks-products'
    if (isSupabaseConfigured) {
      const adminClient = getAdminSupabase();
      if (adminClient) {
        const { error: uploadError } = await adminClient.storage
          .from('fireworks-products')
          .upload(uniqueFileName, buffer, {
            contentType: file.type,
            upsert: false,
          });

        if (!uploadError) {
          const { data: publicUrlData } = adminClient.storage
            .from('fireworks-products')
            .getPublicUrl(uniqueFileName);

          return NextResponse.json({
            success: true,
            imageUrl: publicUrlData.publicUrl,
            storagePath: uniqueFileName,
          });
        } else {
          console.warn('[Supabase Storage Warning]: Falling back to local upload.', uploadError);
        }
      }
    }

    // 2. Local public storage fallback
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });
    const localFilePath = path.join(uploadDir, uniqueFileName);
    await writeFile(localFilePath, buffer);

    const localUrl = `/uploads/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      imageUrl: localUrl,
      storagePath: uniqueFileName,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error uploading image';
    console.error('[Upload Exception]:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
