import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { MdSecurity, MdSearch, MdBlock, MdGavel, MdFactCheck } from 'react-icons/md';
import {
  fetchSuspiciousUsers,
  fetchFraudReports,
  blockFraudUser,
  investigateFraudCase,
  closeFraudCase,
} from '../services/adminApi';
import useLivePolling from '../../hooks/useLivePolling';

const fallbackUsers = [
  { id: 1, name: 'Suspicious Seller A', riskScore: 92, reason: 'Multiple fake listings', status: 'open' },
  { id: 2, name: 'Seller B', riskScore: 84, reason: 'Chargeback complaints', status: 'open' },
];

const fallbackCases = [
  { id: 101, title: 'Fake iPhone scam', reportedBy: 'Rahul', severity: 'high', status: 'open' },
  { id: 102, title: 'Advance payment fraud', reportedBy: 'Priya', severity: 'medium', status: 'investigating' },
];

export default function FraudSafety() {
  const [users, setUsers] = useState(fallbackUsers);
  const [cases, setCases] = useState(fallbackCases);
  const [query, setQuery] = useState('');

  useLivePolling(async () => {
    try {
      const [userRes, caseRes] = await Promise.all([
        fetchSuspiciousUsers(),
        fetchFraudReports(),
      ]);

      const usersList = Array.isArray(userRes)
        ? userRes
        : Array.isArray(userRes?.content)
          ? userRes.content
          : [];

      const casesList = Array.isArray(caseRes)
        ? caseRes
        : Array.isArray(caseRes?.content)
          ? caseRes.content
          : [];

      if (usersList.length) {
        setUsers(usersList.map((u, i) => ({
          id: u.id ?? i + 1,
          name: u.name ?? u.username ?? 'Unknown',
          riskScore: Number(u.riskScore ?? 0),
          reason: u.reason ?? u.flagReason ?? 'Suspicious activity',
          status: String(u.status ?? 'open').toLowerCase(),
        })));
      }

      if (casesList.length) {
        setCases(casesList.map((c, i) => ({
          id: c.id ?? i + 100,
          title: c.title ?? c.reason ?? 'Fraud report',
          reportedBy: c.reportedBy ?? c.userName ?? 'Unknown',
          severity: String(c.severity ?? 'medium').toLowerCase(),
          status: String(c.status ?? 'open').toLowerCase(),
        })));
      }
    } catch {
      // keep fallback/previous data for uninterrupted realtime UI
    }
  }, 15000, []);

  const filteredUsers = useMemo(
    () => users.filter((u) =>
      `${u.name} ${u.reason}`.toLowerCase().includes(query.toLowerCase())
    ),
    [users, query]
  );

  const filteredCases = useMemo(
    () => cases.filter((c) =>
      `${c.title} ${c.reportedBy}`.toLowerCase().includes(query.toLowerCase())
    ),
    [cases, query]
  );

  const handleBlock = async (id) => {
    try {
      await blockFraudUser(id);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: 'blocked' } : u)));
      toast.success('Fraudulent account blocked');
    } catch {
      toast.error('Failed to block account');
    }
  };

  const handleInvestigate = async (id) => {
    try {
      await investigateFraudCase(id);
      setCases((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'investigating' } : c)));
      toast.success('Case marked as investigating');
    } catch {
      toast.error('Failed to update case');
    }
  };

  const handleClose = async (id) => {
    try {
      await closeFraudCase(id);
      setCases((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'closed' } : c)));
      toast.success('Case closed');
    } catch {
      toast.error('Failed to close case');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Fraud & Safety Admin</h2>
          <p className="text-slate-500 text-sm mt-0.5">Investigate suspicious users, fraud reports and scam patterns (live refresh: 15s)</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full">● Real-time monitoring ON</div>
      </div>

      <div className="relative max-w-md">
        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search suspicious users or cases..."
          className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-olx-teal-dark"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <MdSecurity className="text-red-500" />
            <h3 className="font-bold text-slate-800">Suspicious Users</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {filteredUsers.map((u) => (
              <div key={u.id} className="px-5 py-3 flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">{u.name}</p>
                  <p className="text-xs text-slate-500">{u.reason}</p>
                  <p className="text-xs mt-1"><span className="font-semibold text-red-600">Risk:</span> {u.riskScore}%</p>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${u.status === 'blocked' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                  {u.status}
                </span>
                <button
                  onClick={() => handleBlock(u.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-50 border border-red-200 text-red-700 hover:bg-red-100"
                >
                  <MdBlock size={13} /> Block
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <MdGavel className="text-amber-500" />
            <h3 className="font-bold text-slate-800">Fraud Cases</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {filteredCases.map((c) => (
              <div key={c.id} className="px-5 py-3 flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">{c.title}</p>
                  <p className="text-xs text-slate-500">Reported by {c.reportedBy}</p>
                  <p className="text-xs mt-1 capitalize"><span className="font-semibold">Severity:</span> {c.severity}</p>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${c.status === 'closed' ? 'bg-green-100 text-green-700' : c.status === 'investigating' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                  {c.status}
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleInvestigate(c.id)} className="px-2.5 py-1.5 text-xs rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100">Investigate</button>
                  <button onClick={() => handleClose(c.id)} className="px-2.5 py-1.5 text-xs rounded-lg border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 inline-flex items-center gap-1"><MdFactCheck size={12} /> Close</button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
