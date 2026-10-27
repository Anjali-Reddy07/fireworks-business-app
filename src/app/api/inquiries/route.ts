import { NextRequest, NextResponse } from 'next/server';
import { devStore, isSupabaseConfigured, getAdminSupabase } from '@/lib/supabase';
import { sendInquiryNotification } from '@/lib/notifications';
import { RequirementType } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, phone, email, visitDate, requirementType, notes, productName } = body;

    // Server-side validation
    if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
      return NextResponse.json({ error: 'Customer full name is required.' }, { status: 400 });
    }

    const cleanPhone = String(phone || '').replace(/[^\d]/g, '');
    if (cleanPhone.length < 10) {
      return NextResponse.json({ error: 'A valid 10-digit phone number is required.' }, { status: 400 });
    }

    if (!visitDate) {
      return NextResponse.json({ error: 'Estimated store visit date is required.' }, { status: 400 });
    }

    const inquiryPayload = {
      customerName: customerName.trim(),
      phone: `+91 ${cleanPhone.slice(-10)}`,
      email: email ? String(email).trim() : undefined,
      visitDate: String(visitDate),
      requirementType: (requirementType as RequirementType) || 'General In-Store Visit',
      notes: notes ? String(notes).trim() : productName ? `Inquiring for product: ${productName}` : undefined,
    };

    let createdInquiry;

    // Save to persistent database
    if (isSupabaseConfigured) {
      const adminClient = getAdminSupabase();
      if (adminClient) {
        const randomDigits = Math.floor(1000 + Math.random() * 9000);
        const refId = `INQ-2026-${randomDigits}`;

        const { data, error } = await adminClient
          .from('inquiries')
          .insert({
            ref_id: refId,
            customer_name: inquiryPayload.customerName,
            phone: inquiryPayload.phone,
            email: inquiryPayload.email,
            visit_date: inquiryPayload.visitDate,
            requirement_type: inquiryPayload.requirementType,
            notes: inquiryPayload.notes,
            status: 'Pending',
          })
          .select()
          .single();

        if (error) {
          console.error('[Supabase Insert Inquiry Error]:', error);
          // Fallback to devStore on db error to prevent customer loss
          createdInquiry = devStore.saveInquiry(inquiryPayload);
        } else {
          createdInquiry = {
            id: data.id,
            refId: data.ref_id,
            customerName: data.customer_name,
            phone: data.phone,
            email: data.email,
            visitDate: data.visit_date,
            requirementType: data.requirement_type,
            notes: data.notes,
            status: data.status,
            createdAt: data.created_at,
          };
        }
      } else {
        createdInquiry = devStore.saveInquiry(inquiryPayload);
      }
    } else {
      // Dev store
      createdInquiry = devStore.saveInquiry(inquiryPayload);
    }

    // Dispatch WhatsApp mobile notification asynchronously
    // Does not fail the user transaction if WhatsApp API network times out
    sendInquiryNotification(createdInquiry).catch((notifError) => {
      console.error('[Background Notification Error]:', notifError);
    });

    return NextResponse.json({
      success: true,
      refId: createdInquiry.refId,
      inquiry: createdInquiry,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal server error';
    console.error('[Inquiry API Error]:', errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
