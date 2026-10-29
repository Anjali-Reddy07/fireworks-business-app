import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { devStore, isSupabaseConfigured, getAdminSupabase } from '@/lib/supabase';
import { collection, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Inquiry, InquiryStatus } from '@/types';

// GET all customer inquiries
export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
  }

  // Check Firebase Firestore first
  try {
    const snapshot = await getDocs(collection(db, 'inquiries'));
    if (!snapshot.empty) {
      const inquiries: Inquiry[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          refId: data.refId || `INQ-${d.id.slice(0, 8).toUpperCase()}`,
          customerName: data.customerName || 'Customer',
          phone: data.phone || '',
          email: data.email || '',
          festivalDate: data.festivalDate || data.visitDate || '',
          requirementType: data.requirementType || 'Diwali Festive Family Pack',
          notes: data.notes || '',
          status: (data.status as InquiryStatus) || 'Pending',
          createdAt: data.createdAt || new Date().toISOString(),
        };
      });
      inquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return NextResponse.json({ inquiries });
    }
  } catch (err) {
    console.warn('[Firestore GET Inquiries Warning]:', err);
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
          festivalDate: d.visit_date,
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

    // Update in Firebase Firestore
    try {
      await updateDoc(doc(db, 'inquiries', id), { status, updatedAt: new Date().toISOString() });
    } catch {
      await setDoc(doc(db, 'inquiries', id), { status, updatedAt: new Date().toISOString() }, { merge: true });
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
