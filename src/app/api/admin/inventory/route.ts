import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { devStore, isSupabaseConfigured, getAdminSupabase } from '@/lib/supabase';
import { StockMovement } from '@/types';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  if (isSupabaseConfigured) {
    const adminClient = getAdminSupabase();
    if (adminClient) {
      const { data, error } = await adminClient
        .from('stock_movements')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const movements: StockMovement[] = data.map((d: any) => ({
          id: d.id,
          productId: d.product_id,
          productName: d.product_name,
          type: d.movement_type,
          quantityChange: d.quantity_change,
          newStockCount: d.new_stock_count,
          reason: d.reason,
          createdAt: d.created_at,
        }));
        return NextResponse.json({ movements });
      }
    }
  }

  return NextResponse.json({ movements: devStore.getStockMovements() });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const { productId, quantityChange, type, reason } = await req.json();

    if (!productId || typeof quantityChange !== 'number') {
      return NextResponse.json({ error: 'Product ID and numeric quantity change are required.' }, { status: 400 });
    }

    const updated = devStore.updateStock(productId, quantityChange, type || 'adjustment', reason || 'Stock adjustment');

    if (!updated) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    // If Supabase configured, update stock in DB too
    if (isSupabaseConfigured) {
      const adminClient = getAdminSupabase();
      if (adminClient) {
        await adminClient
          .from('products')
          .update({ stock_quantity: updated.stockQuantity, updated_at: new Date().toISOString() })
          .eq('id', productId);

        await adminClient.from('stock_movements').insert({
          product_id: updated.id,
          product_name: updated.name,
          movement_type: type || 'adjustment',
          quantity_change: quantityChange,
          new_stock_count: updated.stockQuantity,
          reason: reason || 'Stock adjustment',
        });
      }
    }

    return NextResponse.json({
      success: true,
      product: updated,
      movements: devStore.getStockMovements(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error adjusting inventory';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
