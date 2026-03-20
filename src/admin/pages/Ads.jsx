import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  MdSearch, MdFilterList, MdCheckCircle, MdCancel, MdDeleteOutline,
  MdAdsClick, MdStar, MdReport,
} from 'react-icons/md';
import { FiEye } from 'react-icons/fi';
import { fetchAds, approveAd, rejectAd, deleteAd as deleteAdApi, featureAd } from '../services/adminApi';
import useLivePolling from '../../hooks/useLivePolling';

const initialAds = [
  { id: 1,  title: 'iPhone 14 Pro Max 256GB',      category: 'Mobiles',     seller: 'Rahul Sharma', price: '₹85,000',   location: 'Mumbai',    status: 'pending',  postedDate: 'Mar 10, 2024', featured: false, reportedCount: 2, imageCount: 4, description: 'Used iPhone with box and bill.' },
  { id: 2,  title: 'Honda Activa 6G 2023',          category: 'Bikes',       seller: 'Priya Singh',  price: '₹75,000',   location: 'Delhi',     status: 'active',   postedDate: 'Mar 9, 2024',  featured: true,  reportedCount: 0, imageCount: 3, description: 'Single owner, excellent condition.'  },
  { id: 3,  title: 'MacBook Pro M3 2024',           category: 'Electronics', seller: 'Amit Kumar',   price: '₹1,80,000', location: 'Bangalore', status: 'pending',  postedDate: 'Mar 8, 2024',  featured: false, reportedCount: 1, imageCount: 5, description: 'M3, 16GB RAM, 512GB SSD.' },
  { id: 4,  title: 'Maruti Swift VXI 2022',         category: 'Cars',        seller: 'Anita Patel',  price: '₹7,50,000', location: 'Pune',      status: 'active',   postedDate: 'Mar 7, 2024',  featured: false, reportedCount: 0, imageCount: 6, description: 'Well maintained, no accident history.' },
  { id: 5,  title: '2BHK Flat for Rent – HSR Layout', category: 'Real Estate', seller: 'Vikram Mehta',  price: '₹25,000/mo', location: 'Bangalore', status: 'rejected', postedDate: 'Mar 6, 2024', featured: false, reportedCount: 5, imageCount: 2, description: 'Broker listing with suspicious details.' },
  { id: 6,  title: 'Samsung Galaxy S24 Ultra 12GB', category: 'Mobiles',     seller: 'Sneha Joshi',  price: '₹1,20,000', location: 'Hyderabad', status: 'active',   postedDate: 'Mar 5, 2024',  featured: true,  reportedCount: 0, imageCount: 4, description: 'Like new condition, no scratches.'  },
  { id: 7,  title: 'Royal Enfield Classic 350 BS6', category: 'Bikes',       seller: 'Rajan Gupta',  price: '₹1,95,000', location: 'Kolkata',   status: 'pending',  postedDate: 'Mar 4, 2024',  featured: false, reportedCount: 3, imageCount: 4, description: 'Owner claim needs verification.' },
  { id: 8,  title: 'Office Chair Pro Ergonomic',    category: 'Furniture',   seller: 'Deepika Nair', price: '₹18,000',   location: 'Ahmedabad', status: 'active',   postedDate: 'Mar 3, 2024',  featured: false, reportedCount: 0, imageCount: 3, description: 'Brand new ergonomic office chair.' },
  { id: 9,  title: 'Toyota Fortuner Legender 2022', category: 'Cars',        seller: 'Sanjay Verma', price: '₹38,00,000',location: 'Jaipur',    status: 'pending',  postedDate: 'Mar 2, 2024',  featured: false, reportedCount: 2, imageCount: 5, description: 'Negotiable, urgent sale.' },
  { id: 10, title: 'Dell XPS 15 OLED Laptop',       category: 'Electronics', seller: 'Kavita Reddy', price: '₹1,50,000', location: 'Lucknow',   status: 'active',   postedDate: 'Mar 1, 2024',  featured: false, reportedCount: 0, imageCount: 4, description: 'Office use only, mint condition.' },
  { id: 11, title: 'Sofa Set – 5 Seater L-Shape',   category: 'Furniture',   seller: 'Mohit Pandey', price: '₹35,000',   location: 'Bhopal',    status: 'pending',  postedDate: 'Feb 28, 2024', featured: false, reportedCount: 1, imageCount: 2, description: 'Used sofa set, pickup only.' },
  { id: 12, title: 'Senior Software Engineer – MNC', category: 'Jobs',        seller: 'Neha Agarwal', price: '₹25 LPA',   location: 'Bangalore', status: 'active',   postedDate: 'Feb 27, 2024', featured: false, reportedCount: 0, imageCount: 1, description: 'Hiring for senior backend role.' },
];

const categories = ['All', 'Mobiles', 'Cars', 'Bikes', 'Electronics', 'Furniture', 'Real Estate', 'Jobs'];

const categoryColors = {
  Mobiles: 'bg-purple-100 text-purple-700',
  Cars: 'bg-blue-100 text-blue-700',
  Bikes: 'bg-green-100 text-green-700',
  Electronics: 'bg-amber-100 text-amber-700',
  Furniture: 'bg-orange-100 text-orange-700',
  'Real Estate': 'bg-cyan-100 text-cyan-700',
  Jobs: 'bg-pink-100 text-pink-700',
};

const StatusBadge = ({ status }) => {
  const map = {
    active:   'bg-green-100 text-green-700 border-green-200',
    pending:  'bg-amber-100 text-amber-700 border-amber-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${map[status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
      {status}
    </span>
  );
};

export default function Ads() {
  const navigate = useNavigate();
  const [ads, setAds] = useState(initialAds);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewAd, setViewAd] = useState(null);
  const perPage = 8;

  const apiRetryCountRef = useRef(0);

  const loadAds = async () => {
      try {
        const res = await fetchAds();
        const list = Array.isArray(res)
          ? res
          : Array.isArray(res?.content)
            ? res.content
            : Array.isArray(res?.data)
              ? res.data
              : [];

        if (list.length) {
          const normalized = list.map((item, idx) => {
            const status = String(item.status || '').toLowerCase();
            return {
              id: item.id ?? item.productId ?? item._id ?? idx + 1,
              title: item.title ?? item.name ?? 'Untitled Ad',
              category: item.category ?? item.categoryName ?? 'Others',
              seller: item.sellerName ?? item.userName ?? item.ownerName ?? 'Unknown Seller',
              price: item.price ? `₹${Number(item.price).toLocaleString()}` : '₹0',
              location: item.location ?? item.city ?? '-',
              status: ['active', 'pending', 'rejected'].includes(status) ? status : 'pending',
              postedDate: item.postedDate ?? item.createdAt ?? '-',
              featured: Boolean(item.featured),
              reportedCount: Number(item.reportedCount ?? item.reports ?? 0),
              imageCount: Number(item.imageCount ?? item.images?.length ?? 0),
              description: item.description ?? 'No description available',
            };
          });
          setAds(normalized);
          apiRetryCountRef.current = 0;
        }
      } catch {
        apiRetryCountRef.current += 1;
        if (apiRetryCountRef.current === 3) {
          toast.error('Failed to connect to ads API. Using demo data.');
        }
      }
    };

  useLivePolling(loadAds, 15000, []);

  const filtered = ads.filter((a) => {
    const q = search.toLowerCase();
    const matchQ = a.title.toLowerCase().includes(q) || a.seller.toLowerCase().includes(q) || a.location.toLowerCase().includes(q);
    const matchC = filterCat === 'All' || a.category === filterCat;
    const matchS = filterStatus === 'all'
      || a.status === filterStatus
      || (filterStatus === 'reported' && a.reportedCount > 0);
    return matchQ && matchC && matchS;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const changeStatus = async (id, newStatus) => {
    try {
      if (newStatus === 'active') {
        await approveAd(id);
      }
      if (newStatus === 'rejected') {
        await rejectAd(id);
      }

      setAds((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
      const labels = { active: '✅ Ad approved', rejected: '❌ Ad rejected' };
      toast.success(labels[newStatus] || 'Status updated');
    } catch {
      toast.error(`Failed to ${newStatus === 'active' ? 'approve' : 'reject'} ad`);
    }
  };

  const toggleFeatured = async (id) => {
    const current = ads.find((a) => a.id === id);
    if (!current) return;

    try {
      if (!current.featured) {
        await featureAd(id);
      }

      setAds((prev) => prev.map((a) => {
        if (a.id !== id) return a;
        toast.success(a.featured ? 'Removed from featured' : '⭐ Marked as featured');
        return { ...a, featured: !a.featured };
      }));
    } catch {
      toast.error('Failed to update featured status');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAdApi(deleteTarget);
      setAds((p) => p.filter((a) => a.id !== deleteTarget));
      toast.success('Ad deleted');
    } catch {
      toast.error('Failed to delete ad');
    } finally {
      setDeleteTarget(null);
    }
  };

  const openRelatedReports = (ad) => {
    const query = encodeURIComponent(ad.title);
    navigate(`/admin/reports?q=${query}&status=pending`);
  };

  const counts = {
    total: ads.length,
    active: ads.filter((a) => a.status === 'active').length,
    pending: ads.filter((a) => a.status === 'pending').length,
    rejected: ads.filter((a) => a.status === 'rejected').length,
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Ad Management</h2>
          <p className="text-slate-500 text-sm mt-0.5">Approve, reject, or delete platform listings</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: 'Total', value: counts.total, color: 'text-slate-700' },
            { label: 'Active', value: counts.active, color: 'text-green-600' },
            { label: 'Pending', value: counts.pending, color: 'text-amber-600' },
            { label: 'Rejected', value: counts.rejected, color: 'text-red-600' },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm text-xs">
              <span className={`font-black text-sm ${s.color}`}>{s.value}</span>
              <span className="text-slate-400 ml-1">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
      >
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center px-5 py-4 border-b border-slate-100">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              type="text"
              placeholder="Search ads, sellers..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm w-56 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
            <MdFilterList className="text-slate-400" />
            <select
              value={filterCat}
              onChange={(e) => { setFilterCat(e.target.value); setCurrentPage(1); }}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-400"
            >
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-400"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="reported">Reported Only</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Ad', 'Category', 'Price', 'Location', 'Reports', 'Date', 'Status', 'Actions'].map((h, i) => (
                  <th key={h} className={`px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider ${i === 7 ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <MdAdsClick size={40} className="opacity-30" />
                      <p className="text-sm">No ads found</p>
                    </div>
                  </td>
                </tr>
              ) : paged.map((ad, idx) => (
                <motion.tr
                  key={ad.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MdAdsClick size={18} className="text-slate-500" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          {ad.featured && <MdStar className="text-amber-400 flex-shrink-0" size={14} />}
                          <p className="text-sm font-semibold text-slate-800 truncate max-w-[180px]">{ad.title}</p>
                        </div>
                        <p className="text-xs text-slate-400">{ad.seller}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${categoryColors[ad.category] || 'bg-slate-100 text-slate-600'}`}>
                      {ad.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-800">{ad.price}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{ad.location}</td>
                  <td className="px-4 py-3">
                    {ad.reportedCount > 0 ? (
                      <button
                        onClick={() => openRelatedReports(ad)}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                        title="Open related reports"
                      >
                        <MdReport size={12} /> {ad.reportedCount}
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                        <MdReport size={12} /> 0
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">{ad.postedDate}</td>
                  <td className="px-4 py-3"><StatusBadge status={ad.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setViewAd(ad)} title="View" className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <FiEye size={14} />
                      </button>
                      {ad.status === 'pending' && (
                        <>
                          <button onClick={() => changeStatus(ad.id, 'active')} className="flex items-center gap-0.5 px-2 py-1 rounded-lg text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 transition-all">
                            <MdCheckCircle size={13} /> Approve
                          </button>
                          <button onClick={() => changeStatus(ad.id, 'rejected')} className="flex items-center gap-0.5 px-2 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all">
                            <MdCancel size={13} /> Reject
                          </button>
                          {ad.reportedCount >= 3 && (
                            <button onClick={() => changeStatus(ad.id, 'rejected')} className="flex items-center gap-0.5 px-2 py-1 rounded-lg text-xs font-medium bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-200 transition-all">
                              <MdReport size={13} /> Block Spam
                            </button>
                          )}
                        </>
                      )}
                      {ad.status === 'active' && (
                        <button onClick={() => toggleFeatured(ad.id)} className={`flex items-center gap-0.5 px-2 py-1 rounded-lg text-xs font-medium border transition-all ${ad.featured ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-600 hover:bg-amber-50 hover:text-amber-700 border-slate-200'}`}>
                          <MdStar size={13} /> {ad.featured ? 'Unfeature' : 'Feature'}
                        </button>
                      )}
                      <button onClick={() => setDeleteTarget(ad.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                        <MdDeleteOutline size={15} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">{Math.min((currentPage - 1) * perPage + 1, filtered.length)}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length}</p>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>{i + 1}</button>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Ad detail modal */}
      <AnimatePresence>
        {viewAd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">{viewAd.title}</h3>
                  <p className="text-slate-400 text-xs mt-0.5">by {viewAd.seller}</p>
                </div>
                <StatusBadge status={viewAd.status} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[['Category', viewAd.category], ['Price', viewAd.price], ['Location', viewAd.location], ['Posted', viewAd.postedDate], ['Featured', viewAd.featured ? '⭐ Yes' : 'No'], ['Image Count', viewAd.imageCount ?? 0], ['Reports', viewAd.reportedCount ?? 0]].map(([k, v]) => (
                  <div key={k} className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-400 mb-0.5">{k}</p>
                    <p className="font-semibold text-slate-800">{v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400 mb-1">Description</p>
                <p className="text-sm text-slate-700">{viewAd.description}</p>
              </div>
              {viewAd.reportedCount > 0 && (
                <button
                  onClick={() => {
                    openRelatedReports(viewAd);
                    setViewAd(null);
                  }}
                  className="mt-3 w-full py-2.5 border border-red-200 bg-red-50 text-red-700 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors"
                >
                  View {viewAd.reportedCount} Related Report(s)
                </button>
              )}
              <button onClick={() => setViewAd(null)} className="mt-5 w-full py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-4"><MdDeleteOutline className="text-red-500" size={24} /></div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Delete Ad?</h3>
              <p className="text-slate-500 text-sm mb-6">This ad will be permanently removed from the platform.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                <button onClick={handleDelete} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 rounded-xl text-sm font-semibold text-white transition-colors">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
