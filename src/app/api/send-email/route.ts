import { NextRequest, NextResponse } from 'next/server';
import {
  sendAdminEmail,
  productEmailHtml,
  orderEmailHtml,
  inquiryEmailHtml,
  OrderPayload,
} from '@/lib/email';

/**
 * POST /api/send-email
 *   • product: { type: 'product', action: 'created'|'updated', product }
 *   • order:   { type: 'order', order }
 *   • inquiry: { type: 'inquiry', inquiry }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.type === 'product') {
      const { action, product } = body;
      const subject = action === 'created' ? 'New Product Added' : 'Product Updated';
      const html = productEmailHtml(product, action);
      await sendAdminEmail(subject, html);
      return NextResponse.json({ success: true });
    } else if (body.type === 'order') {
      const { order } = body as { order: OrderPayload };
      const subject = 'New Order Received';
      const html = orderEmailHtml(order);
      await sendAdminEmail(subject, html);
      return NextResponse.json({ success: true });
    } else if (body.type === 'inquiry') {
      const { inquiry } = body;
      const subject = 'New Inquiry Received';
      const html = inquiryEmailHtml(inquiry);
      await sendAdminEmail(subject, html);
      return NextResponse.json({ success: true });
    }

    // Unknown payload type
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  } catch (e) {
    console.error('Email route error', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}












