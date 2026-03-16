import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { MdBarChart, MdTrendingUp, MdPeople, MdAdsClick } from 'react-icons/md';

// ── Mock data ──────────────────────────────────────────────────
const adsPerDay = [
  { date: 'Mar 9',  ads: 42, revenue: 8200 },  { date: 'Mar 10', ads: 58, revenue: 11600 },
  { date: 'Mar 11', ads: 35, revenue: 7000 },  { date: 'Mar 12', ads: 71, revenue: 14200 },
  { date: 'Mar 13', ads: 48, revenue: 9600 },  { date: 'Mar 14', ads: 82, revenue: 16400 },
  { date: 'Mar 15', ads: 65, revenue: 13000 }, { date: 'Mar 16', ads: 74, revenue: 14800 },
];

const usersPerDay = [
  { date: 'Mar 9',  users: 12, verified: 8 },  { date: 'Mar 10', users: 18, verified: 14 },
  { date: 'Mar 11', users: 9,  verified: 6 },  { date: 'Mar 12', users: 24, verified: 19 },
  { date: 'Mar 13', users: 15, verified: 11 }, { date: 'Mar 14', users: 28, verified: 22 },
  { date: 'Mar 15', users: 21, verified: 17 }, { date: 'Mar 16', users: 19, verified: 15 },
];

const categoryStats = [
  { name: 'Jobs',        ads: 423, fill: '#ec4899' },
  { name: 'Mobiles',     ads: 312, fill: '#8b5cf6' },
  { name: 'Electronics', ads: 278, fill: '#f59e0b' },
  { name: 'Cars',        ads: 245, fill: '#3b82f6' },
  { name: 'Real Estate', ads: 198, fill: '#06b6d4' },
  { name: 'Bikes',       ads: 189, fill: '#22c55e' },
  { name: 'Furniture',   ads: 156, fill: '#f97316' },
  { name: 'Fashion',     ads: 134, fill: '#a855f7' },
];

const topCities = [
  { city: 'Mumbai',    ads: 1240, users: 890 },
  { city: 'Bangalore', ads: 980,  users: 720 },
  { city: 'Delhi',     ads: 870,  users: 640 },
  { city: 'Hyderabad', ads: 720,  users: 530 },
  { city: 'Pune',      ads: 610,  users: 440 },
  { city: 'Chennai',   ads: 540,  users: 390 },
];

const adStatusShare = [
  { name: 'Active',   value: 6842, color: '#22c55e' },
  { name: 'Pending',  value: 347,  color: '#f59e0b' },
  { name: 'Rejected', value: 523,  color: '#ef4444' },
  { name: 'Expired',  value: 522,  color: '#94a3b8' },
];

const summaryCards = [
  { label: 'Ads This Week',   value: '473',    change: '+12.5%', up: true,  icon: MdAdsClick,   color: 'bg-blue-500' },
  { label: 'New Users',       value: '126',    change: '+8.2%',  up: true,  icon: MdPeople,     color: 'bg-green-500' },
  { label: 'Est. Revenue',    value: '₹94.8K', change: '+18.4%', up: true,  icon: MdTrendingUp, color: 'bg-purple-500' },
  { label: 'Avg Daily Ads',   value: '59',     change: '-2.3%',  up: false, icon: MdBarChart,   color: 'bg-orange-500' },
];

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 shadow-xl text-xs">
      <p className="text-slate-300 font-medium mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-semibold" style={{ color: p.color || p.fill }}>
          {p.name}: {typeof p.value === 'number' && p.name.toLowerCase().includes('revenue') ? `₹${p.value.toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  );
};

const TABS = ['7 Days', '30 Days', '90 Days'];

export default function Analytics() {
  const [activeTab, setActiveTab] = useState('7 Days');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Platform Analytics</h2>
          <p className="text-slate-500 text-sm mt-0.5">Insights into ads, users, and revenue</p>
        </div>
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === t ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 ${s.color} rounded-xl flex items-center justify-center`}>
                <s.icon className="text-white" size={18} />
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${s.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                {s.change}
              </span>
            </div>
            <p className="text-xl font-black text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Ads + Revenue area */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800 text-sm">Ads Posted & Revenue</h3>
            <p className="text-slate-400 text-xs">Daily trend</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={adsPerDay} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="gAds2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="ads" name="Ads" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gAds2)" dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* User registrations */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800 text-sm">User Registrations</h3>
            <p className="text-slate-400 text-xs">Total vs verified</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={usersPerDay} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
              <Bar dataKey="users" name="Total" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              <Bar dataKey="verified" name="Verified" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Category distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.46 }} className="xl:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800 text-sm">Ads by Category</h3>
            <p className="text-slate-400 text-xs">All-time distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryStats} layout="vertical" margin={{ top: 4, right: 20, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={75} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="ads" name="Ads" radius={[0, 6, 6, 0]}>
                {categoryStats.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Ad status donut */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.54 }} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="mb-3">
            <h3 className="font-bold text-slate-800 text-sm">Ad Status Share</h3>
            <p className="text-slate-400 text-xs">Overall breakdown</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={adStatusShare} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={3} strokeWidth={0}>
                {adStatusShare.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [v.toLocaleString(), n]} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2">
            {adStatusShare.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-slate-600 font-medium">{s.name}</span>
                </div>
                <span className="font-bold text-slate-800">{s.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top cities + Revenue trend */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Top cities */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.62 }} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800 text-sm">Top Cities by Ads</h3>
            <p className="text-slate-400 text-xs">Geographic distribution</p>
          </div>
          <div className="space-y-3">
            {topCities.map((city, i) => (
              <div key={city.city} className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 w-4">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-slate-700">{city.city}</span>
                    <span className="text-xs text-slate-500">{city.ads} ads</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                      style={{ width: `${(city.ads / topCities[0].ads) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-green-600 font-bold w-16 text-right">{city.users}u</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Revenue line chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800 text-sm">Revenue Trend</h3>
            <p className="text-slate-400 text-xs">Estimated earnings per day</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={adsPerDay} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: '#8b5cf6', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
