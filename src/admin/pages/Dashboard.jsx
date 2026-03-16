import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  MdPeople, MdAdsClick, MdFlag, MdCheckCircle, MdTrendingUp,
  MdPendingActions, MdArrowForward,
} from 'react-icons/md';
import { Link } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import { fetchStats } from '../services/adminApi';
import useLivePolling from '../../hooks/useLivePolling';

const defaultStats = {
  totalUsers: 0,
  totalAds: 0,
  pendingAds: 0,
  reportedAds: 0,
};

const trendData = [
  { date: 'Mar 9',  ads: 42, users: 12 },
  { date: 'Mar 10', ads: 58, users: 18 },
  { date: 'Mar 11', ads: 35, users: 9  },
  { date: 'Mar 12', ads: 71, users: 24 },
  { date: 'Mar 13', ads: 48, users: 15 },
  { date: 'Mar 14', ads: 82, users: 28 },
  { date: 'Mar 15', ads: 65, users: 21 },
  { date: 'Mar 16', ads: 74, users: 19 },
];

const categoryData = [
  { name: 'Mobiles',     value: 312, color: '#8b5cf6' },
  { name: 'Cars',        value: 245, color: '#3b82f6' },
  { name: 'Electronics', value: 278, color: '#f59e0b' },
  { name: 'Bikes',       value: 189, color: '#22c55e' },
  { name: 'Real Estate', value: 198, color: '#06b6d4' },
  { name: 'Others',      value: 156, color: '#f97316' },
];

const recentAds = [
  { id: 1, title: 'iPhone 14 Pro Max 256GB', category: 'Mobiles',     seller: 'Rahul Sharma', price: '₹85,000',   status: 'pending' },
  { id: 2, title: 'Honda Activa 6G 2023',    category: 'Bikes',       seller: 'Priya Singh',  price: '₹75,000',   status: 'active'  },
  { id: 3, title: 'MacBook Pro M3 2024',     category: 'Electronics', seller: 'Amit Kumar',   price: '₹1,80,000', status: 'pending' },
  { id: 4, title: 'Maruti Swift VXI 2022',   category: 'Cars',        seller: 'Anita Patel',  price: '₹7,50,000', status: 'active'  },
  { id: 5, title: 'Samsung Galaxy S24 Ultra',category: 'Mobiles',     seller: 'Sneha Joshi',  price: '₹1,20,000', status: 'active'  },
];

const recentUsers = [
  { id: 1, name: 'Rahul Sharma',  city: 'Mumbai',    ads: 5, time: 'Just now'   },
  { id: 2, name: 'Priya Singh',   city: 'Delhi',     ads: 3, time: '5 min ago'  },
  { id: 3, name: 'Amit Kumar',    city: 'Bangalore', ads: 8, time: '1 hr ago'   },
  { id: 4, name: 'Sneha Joshi',   city: 'Hyderabad', ads: 1, time: '3 hrs ago'  },
  { id: 5, name: 'Vikram Mehta',  city: 'Chennai',   ads: 12, time: 'Yesterday' },
];

const avatarColors = [
  'from-blue-400 to-blue-600', 'from-purple-400 to-purple-600',
  'from-green-400 to-green-600', 'from-orange-400 to-orange-600',
  'from-pink-400 to-pink-600',
];

// ── Subcomponents ──────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    active:   'bg-green-100 text-green-700 border-green-200',
    pending:  'bg-amber-100 text-amber-700 border-amber-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border capitalize ${map[status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
      {status}
    </span>
  );
};

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 shadow-xl">
      <p className="text-slate-400 text-xs mb-1.5 font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-white text-sm font-semibold">
          <span style={{ color: p.color }}>● </span>{p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

// ── Main Dashboard ─────────────────────────────────────────────
const Dashboard = () => {
  const [statsData, setStatsData] = useState(defaultStats);

  const loadStats = async () => {
      try {
        const res = await fetchStats();
        const normalized = {
          totalUsers: Number(res?.totalUsers ?? res?.users ?? res?.userCount ?? 0),
          totalAds: Number(res?.totalAds ?? res?.ads ?? res?.adCount ?? 0),
          pendingAds: Number(res?.pendingAds ?? res?.pending ?? 0),
          reportedAds: Number(res?.reportedAds ?? res?.reports ?? res?.reportCount ?? 0),
        };
        setStatsData(normalized);
      } catch {
        setStatsData(defaultStats);
      }
    };

  useLivePolling(loadStats, 15000, []);

  const stats = useMemo(
    () => [
      { title: 'Total Users', value: statsData.totalUsers.toLocaleString(), subtitle: 'From /api/admin/stats', icon: MdPeople, color: 'blue' },
      { title: 'Total Ads', value: statsData.totalAds.toLocaleString(), subtitle: 'From /api/admin/stats', icon: MdAdsClick, color: 'green' },
      { title: 'Pending Ads', value: statsData.pendingAds.toLocaleString(), subtitle: 'Awaiting moderation', icon: MdPendingActions, color: 'orange' },
      { title: 'Reported Ads', value: statsData.reportedAds.toLocaleString(), subtitle: 'Under review', icon: MdFlag, color: 'red' },
    ],
    [statsData]
  );

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Platform Overview</h2>
          <p className="text-slate-500 text-sm mt-0.5">Good morning! Here's what's happening on OLX today.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm shadow-sm">
          <MdTrendingUp className="text-blue-500" />
          <span className="font-semibold text-slate-700">March 16, 2026</span>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <StatsCard key={s.title} {...s} index={i} />
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Area chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="xl:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Ads & Registrations Trend</h3>
              <p className="text-slate-400 text-xs">Last 8 days</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Ads</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> Users</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="gAds" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="ads"   name="Ads"   stroke="#3b82f6" strokeWidth={2.5} fill="url(#gAds)"   dot={{ fill: '#3b82f6', r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
              <Area type="monotone" dataKey="users" name="Users" stroke="#22c55e" strokeWidth={2.5} fill="url(#gUsers)" dot={{ fill: '#22c55e', r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
        >
          <div className="mb-3">
            <h3 className="font-bold text-slate-800 text-sm">Ads by Category</h3>
            <p className="text-slate-400 text-xs">Distribution overview</p>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" innerRadius={42} outerRadius={65} paddingAngle={3} strokeWidth={0}>
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center gap-1.5 text-xs min-w-0">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-slate-600 truncate">{cat.name}</span>
                <span className="font-semibold text-slate-800 ml-auto">{cat.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Recent Ads + Users ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Recent Ads */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Recent Ads</h3>
              <p className="text-slate-400 text-xs">Latest listings on the platform</p>
            </div>
            <Link to="/admin/ads" className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              View all <MdArrowForward size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs text-slate-500 font-semibold uppercase tracking-wide">Title</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-500 font-semibold uppercase tracking-wide">Category</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-500 font-semibold uppercase tracking-wide">Price</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-500 font-semibold uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentAds.map((ad) => (
                  <tr key={ad.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-slate-800">{ad.title}</p>
                      <p className="text-xs text-slate-400">{ad.seller}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-md font-medium">{ad.category}</span>
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-slate-800">{ad.price}</td>
                    <td className="px-4 py-3"><StatusBadge status={ad.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* New Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">New Users</h3>
              <p className="text-slate-400 text-xs">Recently joined</p>
            </div>
            <Link to="/admin/users" className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              View all <MdArrowForward size={14} />
            </Link>
          </div>
          <div className="p-3 space-y-0.5">
            {recentUsers.map((user, i) => (
              <div key={user.id} className="flex items-center gap-3 px-2 py-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group">
                <div className={`w-9 h-9 bg-gradient-to-br ${avatarColors[i % avatarColors.length]} rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                  {user.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.city} · {user.ads} ads</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-slate-400 whitespace-nowrap">{user.time}</p>
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full ml-auto mt-1" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Quick Stats Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
        className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg shadow-blue-500/20"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-x divide-blue-500/30">
          {[
            { label: 'Approved Today',  value: '124', icon: <MdCheckCircle size={18} /> },
            { label: 'Rejected Today',  value: '12',  icon: <MdFlag size={18} /> },
            { label: 'New Reports',     value: '5',   icon: <MdFlag size={18} /> },
            { label: 'Revenue (est.)',  value: '₹84K', icon: <MdTrendingUp size={18} /> },
          ].map((item, i) => (
            <div key={i} className={`text-center ${i !== 0 ? 'pl-4' : ''}`}>
              <div className="flex items-center justify-center gap-1.5 text-blue-200 text-xs mb-1">
                {item.icon} {item.label}
              </div>
              <p className="text-2xl font-black">{item.value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
