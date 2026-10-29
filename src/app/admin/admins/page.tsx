'use client';

import React, { useEffect, useState } from 'react';
import {
  UserPlus, Trash2, Pencil, X, Check, Loader2, AlertCircle,
  ShieldCheck, Users, KeyRound, AtSign, User, Eye, EyeOff,
} from 'lucide-react';
import { AdminUser } from '@/lib/auth';

interface AdminEntry extends AdminUser {
  isCurrent?: boolean;
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Invite modal
  const [showInvite, setShowInvite] = useState(false);
  const [invite, setInvite] = useState({ username: '', email: '', password: '', confirm: '' });
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [showInvitePwd, setShowInvitePwd] = useState(false);

  // Edit modal
  const [editTarget, setEditTarget] = useState<AdminEntry | null>(null);
  const [edit, setEdit] = useState({ username: '', email: '', password: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [showEditPwd, setShowEditPwd] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<AdminEntry | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/admins');
      if (!res.ok) throw new Error('Failed to load admins');
      const data = await res.json();
      const list: AdminEntry[] = (data.admins || []).map((a: AdminUser) => ({
        ...a,
        isCurrent: a.id === data.currentId,
      }));
      setAdmins(list);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdmins(); }, []);

  // ── Invite ────────────────────────────────────────────────────────────────
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError(null);
    if (invite.password !== invite.confirm) {
      setInviteError('Passwords do not match.');
      return;
    }
    setInviteLoading(true);
    try {
      const res = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: invite.username,
          email: invite.email,
          password: invite.password,
          confirmPassword: invite.confirm,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create admin');
      setShowInvite(false);
      setInvite({ username: '', email: '', password: '', confirm: '' });
      fetchAdmins();
    } catch (e: unknown) {
      setInviteError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setInviteLoading(false);
    }
  };

  // ── Edit ─────────────────────────────────────────────────────────────────
  const openEdit = (admin: AdminEntry) => {
    setEditTarget(admin);
    setEdit({ username: admin.username, email: admin.email, password: '' });
    setEditError(null);
    setShowEditPwd(false);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    setEditError(null);
    setEditLoading(true);
    try {
      const body: Record<string, string> = {
        id: editTarget.id,
        username: edit.username,
        email: edit.email,
      };
      if (edit.password) body.password = edit.password;

      const res = await fetch('/api/admin/admins', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      setEditTarget(null);
      fetchAdmins();
    } catch (e: unknown) {
      setEditError(e instanceof Error ? e.message : 'Update failed');
    } finally {
      setEditLoading(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetch('/api/admin/admins', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteTarget.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      setDeleteTarget(null);
      fetchAdmins();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Delete failed');
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Admin Account Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage who has access to this control center. All changes are immediate.
          </p>
        </div>
        <button
          onClick={() => { setShowInvite(true); setInviteError(null); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite New Admin</span>
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/25 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Admin List */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Administrator Accounts</p>
            <p className="text-xs text-slate-500">{admins.length} account{admins.length !== 1 ? 's' : ''} with dashboard access</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-7 h-7 text-amber-400 animate-spin" />
          </div>
        ) : admins.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-12">No admin accounts found.</p>
        ) : (
          <div className="divide-y divide-slate-800/70">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="flex items-center justify-between px-3.5 sm:px-6 py-3 sm:py-4 hover:bg-slate-800/30 transition-colors gap-3"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-red-500/10 border border-slate-700 flex items-center justify-center text-amber-300 font-bold text-sm shrink-0 uppercase">
                    {admin.username.slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{admin.username}</span>
                      {admin.isCurrent && (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-amber-500/10 border border-amber-500/25 text-amber-400 px-2 py-0.5 rounded-full font-semibold">
                          <ShieldCheck className="w-3 h-3" /> You
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">{admin.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden sm:block text-[11px] text-slate-600">
                    Since {new Date(admin.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <button
                    onClick={() => openEdit(admin)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  {!admin.isCurrent && (
                    <button
                      onClick={() => setDeleteTarget(admin)}
                      className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-950/70 text-rose-400 hover:text-rose-300 border border-rose-500/25 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Invite Modal ───────────────────────────────────────────────────── */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white">Invite New Admin</h2>
              </div>
              <button onClick={() => setShowInvite(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="p-6 space-y-4">
              {inviteError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-500/25 text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {inviteError}
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5"><User className="w-3.5 h-3.5" />Username</label>
                <input required type="text" value={invite.username} onChange={(e) => setInvite({ ...invite, username: e.target.value })}
                  placeholder="e.g. manager" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/60 transition-all" />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5"><AtSign className="w-3.5 h-3.5" />Email</label>
                <input required type="email" value={invite.email} onChange={(e) => setInvite({ ...invite, email: e.target.value })}
                  placeholder="email@example.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/60 transition-all" />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5"><KeyRound className="w-3.5 h-3.5" />Password</label>
                <div className="relative">
                  <input required type={showInvitePwd ? 'text' : 'password'} value={invite.password}
                    onChange={(e) => setInvite({ ...invite, password: e.target.value })}
                    placeholder="Min. 8 characters"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/60 transition-all" />
                  <button type="button" onClick={() => setShowInvitePwd(!showInvitePwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showInvitePwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5"><KeyRound className="w-3.5 h-3.5" />Confirm Password</label>
                <input required type={showInvitePwd ? 'text' : 'password'} value={invite.confirm}
                  onChange={(e) => setInvite({ ...invite, confirm: e.target.value })}
                  placeholder="Repeat password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/60 transition-all" />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button type="button" onClick={() => setShowInvite(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-xs text-slate-400 hover:text-white hover:border-slate-600 transition-colors cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={inviteLoading}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer">
                  {inviteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Modal ─────────────────────────────────────────────────────── */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white">Edit Admin — <span className="text-amber-400">{editTarget.username}</span></h2>
              </div>
              <button onClick={() => setEditTarget(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEdit} className="p-6 space-y-4">
              {editError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-500/25 text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {editError}
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5"><User className="w-3.5 h-3.5" />Username</label>
                <input type="text" value={edit.username} onChange={(e) => setEdit({ ...edit, username: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/60 transition-all" />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5"><AtSign className="w-3.5 h-3.5" />Email</label>
                <input type="email" value={edit.email} onChange={(e) => setEdit({ ...edit, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/60 transition-all" />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5"><KeyRound className="w-3.5 h-3.5" />New Password <span className="text-slate-600 font-normal">(leave blank to keep current)</span></label>
                <div className="relative">
                  <input type={showEditPwd ? 'text' : 'password'} value={edit.password}
                    onChange={(e) => setEdit({ ...edit, password: e.target.value })}
                    placeholder="Leave blank to keep unchanged"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/60 transition-all" />
                  <button type="button" onClick={() => setShowEditPwd(!showEditPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showEditPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button type="button" onClick={() => setEditTarget(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-xs text-slate-400 hover:text-white hover:border-slate-600 transition-colors cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={editLoading}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer">
                  {editLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ─────────────────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-rose-500/20 rounded-3xl overflow-hidden shadow-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-950/60 border border-rose-500/30 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Remove Admin?</h3>
              <p className="text-xs text-slate-400 mt-1">
                <span className="text-rose-300 font-semibold">@{deleteTarget.username}</span> will lose all access immediately.
                This cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleteLoading}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer">
                {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>Remove Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
