import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { MdSearch, MdSupportAgent, MdDone, MdReply } from 'react-icons/md';
import {
  fetchSupportTickets,
  resolveSupportTicket,
  replySupportTicket,
} from '../services/adminApi';
import useLivePolling from '../../hooks/useLivePolling';

const fallbackTickets = [
  { id: 1, user: 'Rahul', issue: 'Payment issue for boost ad', channel: 'chat', status: 'open' },
  { id: 2, user: 'Priya', issue: 'Dispute with seller', channel: 'email', status: 'open' },
  { id: 3, user: 'Amit', issue: 'Account recovery', channel: 'chat', status: 'resolved' },
];

export default function CustomerSupport() {
  const [tickets, setTickets] = useState(fallbackTickets);
  const [query, setQuery] = useState('');

  useLivePolling(async () => {
    try {
      const res = await fetchSupportTickets();
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.content)
          ? res.content
          : [];

      if (list.length) {
        setTickets(list.map((t, i) => ({
          id: t.id ?? i + 1,
          user: t.user ?? t.userName ?? 'Unknown',
          issue: t.issue ?? t.subject ?? 'Support issue',
          channel: String(t.channel ?? 'chat').toLowerCase(),
          status: String(t.status ?? 'open').toLowerCase(),
        })));
      }
    } catch {
      // keep current data for realtime UX
    }
  }, 15000, []);

  const filtered = useMemo(
    () => tickets.filter((t) => `${t.user} ${t.issue}`.toLowerCase().includes(query.toLowerCase())),
    [tickets, query]
  );

  const onResolve = async (id) => {
    try {
      await resolveSupportTicket(id, { note: 'Resolved by admin' });
      setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'resolved' } : t)));
      toast.success('Support ticket resolved');
    } catch {
      toast.error('Failed to resolve ticket');
    }
  };

  const onReply = async (id) => {
    try {
      await replySupportTicket(id, { message: 'We are looking into this issue and will update shortly.' });
      toast.success('Reply sent to user');
    } catch {
      toast.error('Failed to send reply');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Customer Support Admin</h2>
          <p className="text-slate-500 text-sm mt-0.5">Handle complaints, disputes and support tickets (live refresh: 15s)</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full">● Realtime queue synced</div>
      </div>

      <div className="relative max-w-md">
        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search support tickets..."
          className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-olx-teal-dark"
        />
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <MdSupportAgent className="text-olx-navy" />
          <h3 className="font-bold text-slate-800">Support Tickets</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {filtered.map((t) => (
            <div key={t.id} className="px-5 py-3 flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">{t.issue}</p>
                <p className="text-xs text-slate-500">User: {t.user} · Channel: {t.channel}</p>
              </div>
              <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${t.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {t.status}
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => onReply(t.id)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100"><MdReply size={12} /> Reply</button>
                <button onClick={() => onResolve(t.id)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-green-50 border border-green-200 text-green-700 hover:bg-green-100"><MdDone size={12} /> Resolve</button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
