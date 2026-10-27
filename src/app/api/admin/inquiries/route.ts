import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { devStore, isSupabaseConfigured, getAdminSupabase } from '@/lib/supabase';
import { Inquiry, InquiryStatus } from '@/types';

// GET all customer inquiries
export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  if (isSupabaseConfigured) {
    const adminClient = getAdminSupabase();
    if (adminClient) {
      const { data, error } = await adminClient
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const inquiries: Inquiry[] = data.map((d: any) => ({
          id: d.id,
          refId: d.ref_id,
          customerName: d.customer_name,
          phone: d.phone,
          email: d.email,
          visitDate: d.visit_date,
          requirementType: d.requirement_type,
          notes: d.notes,
          status: d.status,
          createdAt: d.created_at,
        }));
        return NextResponse.json({ inquiries });
      }
    }
  }

  return NextResponse.json({ inquiries: devStore.getInquiries() });
}

// PATCH update status of an inquiry
export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Inquiry ID and new status are required.' }, { status: 400 });
    }

    if (isSupabaseConfigured) {
      const adminClient = getAdminSupabase();
      if (adminClient) {
        await adminClient.from('inquiries').update({ status }).eq('id', id);
      }
    }

    const updated = devStore.updateInquiryStatus(id, status as InquiryStatus);
    return NextResponse.json({ success: true, inquiry: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error updating inquiry';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
