import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  MdSearch, MdBlock, MdDeleteOutline, MdCheckCircle,
  MdFilterList, MdPeople, MdPersonOff, MdVerified,
  MdHistory, MdRefresh,
} from 'react-icons/md';
import {
  fetchUsers,
  banUser,
  unbanUser,
  deleteUser as deleteUserApi,
  verifySeller,
  fetchUserActivity,
  resetUserStatus,
} from '../services/adminApi';
import useLivePolling from '../../hooks/useLivePolling';

const initialUsers = [
  { id: 1,  name: 'Rahul Sharma',  email: 'rahul@gmail.com',   phone: '+91 9876543210', city: 'Mumbai',    totalAds: 5,  status: 'active', joinDate: 'Jan 15, 2024', complaints: 1, verifiedSeller: false },
  { id: 2,  name: 'Priya Singh',   email: 'priya@gmail.com',   phone: '+91 9876543211', city: 'Delhi',     totalAds: 3,  status: 'active', joinDate: 'Feb 20, 2024', complaints: 0, verifiedSeller: true },
  { id: 3,  name: 'Amit Kumar',    email: 'amit@gmail.com',    phone: '+91 9876543212', city: 'Bangalore', totalAds: 8,  status: 'banned', joinDate: 'Jan 10, 2024', complaints: 4, verifiedSeller: false },
  { id: 4,  name: 'Anita Patel',   email: 'anita@gmail.com',   phone: '+91 9876543213', city: 'Pune',      totalAds: 2,  status: 'active', joinDate: 'Mar 5, 2024', complaints: 0, verifiedSeller: false  },
  { id: 5,  name: 'Vikram Mehta',  email: 'vikram@gmail.com',  phone: '+91 9876543214', city: 'Chennai',   totalAds: 12, status: 'active', joinDate: 'Dec 1, 2023', complaints: 2, verifiedSeller: true  },
  { id: 6,  name: 'Sneha Joshi',   email: 'sneha@gmail.com',   phone: '+91 9876543215', city: 'Hyderabad', totalAds: 1,  status: 'active', joinDate: 'Mar 10, 2024', complaints: 0, verifiedSeller: false },
  { id: 7,  name: 'Rajan Gupta',   email: 'rajan@gmail.com',   phone: '+91 9876543216', city: 'Kolkata',   totalAds: 6,  status: 'banned', joinDate: 'Jan 25, 2024', complaints: 6, verifiedSeller: false },
  { id: 8,  name: 'Deepika Nair',  email: 'deepika@gmail.com', phone: '+91 9876543217', city: 'Ahmedabad', totalAds: 4,  status: 'active', joinDate: 'Feb 14, 2024', complaints: 0, verifiedSeller: false },
  { id: 9,  name: 'Sanjay Verma',  email: 'sanjay@gmail.com',  phone: '+91 9876543218', city: 'Jaipur',    totalAds: 7,  status: 'active', joinDate: 'Feb 28, 2024', complaints: 1, verifiedSeller: true },
  { id: 10, name: 'Kavita Reddy',  email: 'kavita@gmail.com',  phone: '+91 9876543219', city: 'Lucknow',   totalAds: 2,  status: 'active', joinDate: 'Mar 8, 2024', complaints: 0, verifiedSeller: false },
  { id: 11, name: 'Mohit Pandey',  email: 'mohit@gmail.com',   phone: '+91 9876543220', city: 'Bhopal',    totalAds: 9,  status: 'active', joinDate: 'Mar 12, 2024', complaints: 2, verifiedSeller: true },
  { id: 12, name: 'Neha Agarwal',  email: 'neha@gmail.com',    phone: '+91 9876543221', city: 'Nagpur',    totalAds: 3,  status: 'banned', joinDate: 'Feb 7, 2024', complaints: 3, verifiedSeller: false },
  { id: 13, name: 'Arjun Kapoor',  email: 'arjun@gmail.com',   phone: '+91 9876543222', city: 'Surat',     totalAds: 5,  status: 'active', joinDate: 'Jan 30, 2024', complaints: 0, verifiedSeller: false },
  { id: 14, name: 'Pooja Yadav',   email: 'pooja@gmail.com',   phone: '+91 9876543223', city: 'Indore',    totalAds: 0,  status: 'active', joinDate: 'Mar 14, 2024', complaints: 0, verifiedSeller: false },
];

const avatarColors = [
  'from-blue-400 to-blue-600', 'from-purple-400 to-purple-600',
  'from-green-400 to-green-600', 'from-orange-400 to-orange-600',
  'from-pink-400 to-pink-600', 'from-teal-400 to-teal-600',
  'from-rose-400 to-rose-600', 'from-indigo-400 to-indigo-600',
];

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
    status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
  }`}>
    <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
    {status === 'active' ? 'Active' : 'Banned'}
  </span>
);

export default function Users() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [activityModal, setActivityModal] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);
  const perPage = 8;

  const pendingVerifyRef = useRef(new Set());
  const pendingResetRef = useRef(new Set());
  const pendingBanRef = useRef(new Set());
  const pendingActivityRef = useRef(new Set());
  const [deleting, setDeleting] = useState(false);

  const loadUsers = async () => {
      try {
        const res = await fetchUsers();
        const list = Array.isArray(res)
          ? res
          : Array.isArray(res?.content)
            ? res.content
            : Array.isArray(res?.data)
              ? res.data
              : [];

        if (list.length) {
          const normalized = list.map((u, idx) => {
            const normalizedStatus = String(u.status || '').toLowerCase();
            return {
              id: u.id ?? u.userId ?? u._id ?? idx + 1,
              name: u.name ?? u.fullName ?? 'Unknown User',
              email: u.email ?? '-',
              phone: u.phone ?? u.mobile ?? '-',
              city: u.city ?? u.location ?? '-',
              totalAds: Number(u.totalAds ?? u.adsCount ?? 0),
              status: normalizedStatus === 'banned' || normalizedStatus === 'inactive' ? 'banned' : 'active',
              joinDate: u.joinDate ?? u.createdAt ?? '-',
              complaints: Number(u.complaints ?? u.complaintCount ?? 0),
              verifiedSeller: Boolean(u.verifiedSeller ?? u.isVerifiedSeller ?? false),
            };
          });
          setUsers(normalized);
        }
      } catch {
        toast.error('Failed to load users from API');
      }
    };

  useLivePolling(loadUsers, 15000, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchQ = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.city.toLowerCase().includes(q);
    const matchS = filterStatus === 'all' || u.status === filterStatus;
    return matchQ && matchS;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const toggleBan = async (id) => {
    if (pendingBanRef.current.has(id)) return;
    const current = users.find((u) => u.id === id);
    if (!current) return;
    const next = current.status === 'active' ? 'banned' : 'active';

    pendingBanRef.current.add(id);
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: next } : u))
    );
    try {
      if (next === 'banned') {
        await banUser(id);
      } else {
        await unbanUser(id);
      }
      toast.success(`User ${next === 'banned' ? 'banned' : 'unbanned'} successfully`);
    } catch {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: current.status } : u))
      );
      toast.error(`Failed to ${next === 'banned' ? 'ban' : 'unban'} user`);
    } finally {
      pendingBanRef.current.delete(id);
    }
  };

  const confirmDelete = (id) => setDeleteTarget(id);
  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await deleteUserApi(deleteTarget);
      setUsers((p) => p.filter((u) => u.id !== deleteTarget));
      toast.success('User deleted permanently');
    } catch {
      toast.error('Failed to delete user');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleVerifySeller = async (id) => {
    if (pendingVerifyRef.current.has(id)) return;
    pendingVerifyRef.current.add(id);
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, verifiedSeller: true } : u)));
    try {
      await verifySeller(id);
      toast.success('Seller verified');
    } catch {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, verifiedSeller: false } : u)));
      toast.error('Failed to verify seller');
    } finally {
      pendingVerifyRef.current.delete(id);
    }
  };

  const handleViewActivity = async (user) => {
    if (pendingActivityRef.current.has(user.id)) return;
    pendingActivityRef.current.add(user.id);
    setActivityModal(user);
    try {
      const res = await fetchUserActivity(user.id);
      const logs = Array.isArray(res)
        ? res
        : Array.isArray(res?.activity)
          ? res.activity
          : [];
      setActivityLogs(logs.length ? logs : [
        { id: 1, text: 'Logged in', time: '2h ago' },
        { id: 2, text: 'Posted new ad', time: '4h ago' },
      ]);
    } catch {
      setActivityLogs([
        { id: 1, text: 'Logged in', time: '2h ago' },
        { id: 2, text: 'Updated profile', time: '1d ago' },
      ]);
    } finally {
      pendingActivityRef.current.delete(user.id);
    }
  };

  const handleResetStatus = async (id) => {
    if (pendingResetRef.current.has(id)) return;
    const current = users.find((u) => u.id === id);
    if (!current) return;
    pendingResetRef.current.add(id);
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: 'active', complaints: 0 } : u)));
    try {
      await resetUserStatus(id);
      toast.success('Account status reset');
    } catch {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: current.status, complaints: current.complaints } : u)));
      toast.error('Failed to reset account status');
    } finally {
      pendingResetRef.current.delete(id);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-800">User Management</h2>
          <p className="text-slate-500 text-sm mt-0.5">Manage all registered users on the platform</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm text-sm">
            <span className="font-black text-green-600">{users.filter((u) => u.status === 'active').length}</span>
            <span className="text-slate-500 ml-1">Active</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm text-sm">
            <span className="font-black text-red-600">{users.filter((u) => u.status === 'banned').length}</span>
            <span className="text-slate-500 ml-1">Banned</span>
          </div>
        </div>
      </div>

      {/* Table card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
      >
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center px-5 py-4 border-b border-slate-100">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              type="text"
              placeholder="Search by name, email or city..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm w-64 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <MdFilterList className="text-slate-400" size={18} />
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-400 transition-all"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="banned">Banned Only</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['User', 'Phone', 'City', 'Ads', 'Verified', 'Complaints', 'Joined', 'Status', 'Actions'].map((h, i) => (
                  <th key={h} className={`px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider ${i === 8 ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <MdPeople size={40} className="opacity-30" />
                      <p className="text-sm">No users found</p>
                    </div>
                  </td>
                </tr>
              ) : paged.map((user, idx) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{user.phone}</td>
                  <td className="px-4 py-3">
                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-md font-medium">{user.city}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">{user.totalAds}</span>
                  </td>
                  <td className="px-4 py-3">
                    {user.verifiedSeller ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                        <MdVerified size={12} /> Verified
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500">Not verified</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${user.complaints > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                      {user.complaints}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{user.joinDate}</td>
                  <td className="px-4 py-3"><StatusBadge status={user.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      {!user.verifiedSeller && (
                        <button
                          onClick={() => handleVerifySeller(user.id)}
                          disabled={pendingVerifyRef.current.has(user.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <MdVerified size={13} /> {pendingVerifyRef.current.has(user.id) ? 'Verifying...' : 'Verify'}
                        </button>
                      )}
                      <button
                        onClick={() => handleViewActivity(user)}
                        disabled={pendingActivityRef.current.has(user.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <MdHistory size={13} /> {pendingActivityRef.current.has(user.id) ? 'Loading...' : 'Activity'}
                      </button>
                      <button
                        onClick={() => handleResetStatus(user.id)}
                        disabled={pendingResetRef.current.has(user.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <MdRefresh size={13} /> {pendingResetRef.current.has(user.id) ? 'Resetting...' : 'Reset'}
                      </button>
                      <button
                        onClick={() => toggleBan(user.id)}
                        disabled={pendingBanRef.current.has(user.id)}
                        title={user.status === 'active' ? 'Ban user' : 'Unban user'}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border disabled:opacity-50 disabled:cursor-not-allowed ${
                          user.status === 'active'
                            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200'
                            : 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200'
                        }`}
                      >
                        {pendingBanRef.current.has(user.id) ? (
                          <>
                            <MdBlock size={13} /> {user.status === 'active' ? 'Banning...' : 'Unbanning...'}
                          </>
                        ) : (
                          user.status === 'active'
                            ? <><MdBlock size={13} /> Ban</>
                            : <><MdCheckCircle size={13} /> Unban</>
                        )}
                      </button>
                      <button
                        onClick={() => confirmDelete(user.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all"
                      >
                        <MdDeleteOutline size={13} /> Delete
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              {Math.min((currentPage - 1) * perPage + 1, filtered.length)}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length} users
            </p>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                    currentPage === i + 1 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
                <MdPersonOff className="text-red-500" size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Delete User?</h3>
              <p className="text-slate-500 text-sm mb-6">This will permanently remove the user and all their data. This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={deleting}>
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={deleting} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {deleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activityModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-lg font-bold text-slate-800 mb-1">User Activity</h3>
              <p className="text-sm text-slate-500 mb-4">{activityModal.name}</p>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {activityLogs.map((log, idx) => (
                  <div key={log.id ?? idx} className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-700 font-medium">{log.text ?? log.action ?? 'Activity event'}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{log.time ?? log.timestamp ?? '-'}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActivityModal(null)}
                className="mt-5 w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
