import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { devStore, isSupabaseConfigured, getAdminSupabase } from '@/lib/supabase';
import { Product } from '@/types';

// GET all products
export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
  }

  if (isSupabaseConfigured) {
    const adminClient = getAdminSupabase();
    if (adminClient) {
      const { data, error } = await adminClient
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mappedProducts: Product[] = data.map((d: any) => ({
          id: d.id,
          name: d.name,
          categoryId: d.category_id,
          categoryName: d.category_name,
          description: d.description,
          retailPrice: Number(d.retail_price),
          stockQuantity: Number(d.stock_quantity),
          soundLevel: d.sound_level,
          durationSeconds: d.duration_seconds,
          piecesPerPack: Number(d.pieces_per_pack),
          isGreenCracker: Boolean(d.is_green_cracker),
          greenCrackerCode: d.green_cracker_code,
          safetyDistanceMeters: Number(d.safety_distance_meters),
          imageUrl: d.image_url,
          active: Boolean(d.active),
          featured: Boolean(d.featured),
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        }));
        return NextResponse.json({ products: mappedProducts });
      }
    }
  }

  return NextResponse.json({ products: devStore.getProducts() });
}

// POST create product
export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const productData = await req.json();

    if (!productData.name || !productData.categoryId || !productData.retailPrice) {
      return NextResponse.json({ error: 'Name, Category, and Retail Price are required.' }, { status: 400 });
    }

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: productData.name,
      categoryId: productData.categoryId,
      categoryName: productData.categoryName || 'General Fireworks',
      description: productData.description || '',
      retailPrice: Number(productData.retailPrice),
      stockQuantity: Number(productData.stockQuantity || 0),
      soundLevel: productData.soundLevel || 'Low / Muffled',
      durationSeconds: Number(productData.durationSeconds || 0),
      piecesPerPack: Number(productData.piecesPerPack || 1),
      isGreenCracker: Boolean(productData.isGreenCracker ?? true),
      greenCrackerCode: productData.greenCrackerCode || 'NEERI-GC-2026',
      safetyDistanceMeters: Number(productData.safetyDistanceMeters || 5),
      imageUrl: productData.imageUrl || 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80',
      active: productData.active ?? true,
      featured: productData.featured ?? false,
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      const adminClient = getAdminSupabase();
      if (adminClient) {
        const { error } = await adminClient.from('products').insert({
          id: newProd.id,
          name: newProd.name,
          category_id: newProd.categoryId,
          category_name: newProd.categoryName,
          description: newProd.description,
          retail_price: newProd.retailPrice,
          stock_quantity: newProd.stockQuantity,
          sound_level: newProd.soundLevel,
          duration_seconds: newProd.durationSeconds,
          pieces_per_pack: newProd.piecesPerPack,
          is_green_cracker: newProd.isGreenCracker,
          green_cracker_code: newProd.greenCrackerCode,
          safety_distance_meters: newProd.safetyDistanceMeters,
          image_url: newProd.imageUrl,
          active: newProd.active,
          featured: newProd.featured,
        });

        if (error) {
          console.error('[Supabase Add Product Error]:', error);
        }
      }
    }

    const saved = devStore.saveProduct(newProd);
    return NextResponse.json({ success: true, product: saved });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error creating product';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PUT update product
export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const productData = await req.json();
    if (!productData.id) {
      return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
    }

    if (isSupabaseConfigured) {
      const adminClient = getAdminSupabase();
      if (adminClient) {
        await adminClient
          .from('products')
          .update({
            name: productData.name,
            category_id: productData.categoryId,
            category_name: productData.categoryName,
            description: productData.description,
            retail_price: productData.retailPrice,
            stock_quantity: productData.stockQuantity,
            sound_level: productData.soundLevel,
            duration_seconds: productData.durationSeconds,
            pieces_per_pack: productData.piecesPerPack,
            is_green_cracker: productData.isGreenCracker,
            green_cracker_code: productData.greenCrackerCode,
            safety_distance_meters: productData.safetyDistanceMeters,
            image_url: productData.imageUrl,
            active: productData.active,
            featured: productData.featured,
            updated_at: new Date().toISOString(),
          })
          .eq('id', productData.id);
      }
    }

    const updated = devStore.saveProduct(productData);
    return NextResponse.json({ success: true, product: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error updating product';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID required in query parameter.' }, { status: 400 });
    }

    if (isSupabaseConfigured) {
      const adminClient = getAdminSupabase();
      if (adminClient) {
        await adminClient.from('products').delete().eq('id', id);
      }
    }

    const success = devStore.deleteProduct(id);
    return NextResponse.json({ success });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error deleting product';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
