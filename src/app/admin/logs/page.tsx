'use client';

import React, { useEffect, useState } from 'react';
import { ClipboardList, RefreshCw, ShieldCheck, User } from 'lucide-react';
import { ActivityLog } from '@/types';

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Administrative Activity Audit Logs</h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable audit trail of inventory updates, product catalogue edits, and administrative actions
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">Timestamp (IST)</th>
                <th className="px-5 py-3.5">Action Event</th>
                <th className="px-5 py-3.5">Details & Impact</th>
                <th className="px-5 py-3.5 text-right">User / Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3.5 text-slate-400 font-mono whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-amber-950/80 text-amber-300 border border-amber-500/30 font-semibold">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-200">
                    {log.details}
                  </td>
                  <td className="px-5 py-3.5 text-right text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-500" />
                      <span>{log.adminUser}</span>
                    </span>
                  </td>
                </tr>
              ))}

              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-slate-500">
                    No activity logs recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
