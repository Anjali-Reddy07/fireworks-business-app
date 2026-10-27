import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { devStore, isSupabaseConfigured, getAdminSupabase } from '@/lib/supabase';
import { ActivityLog } from '@/types';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  if (isSupabaseConfigured) {
    const adminClient = getAdminSupabase();
    if (adminClient) {
      const { data, error } = await adminClient
        .from('activity_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (!error && data) {
        const logs: ActivityLog[] = data.map((d: any) => ({
          id: d.id,
          action: d.action,
          details: d.details,
          adminUser: d.admin_user,
          timestamp: d.timestamp,
        }));
        return NextResponse.json({ logs });
      }
    }
  }

  return NextResponse.json({ logs: devStore.getLogs() });
}
