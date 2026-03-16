import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { MdSearch, MdFlag, MdCheckCircle, MdRemoveCircle, MdFilterList } from 'react-icons/md';
import { FiAlertTriangle } from 'react-icons/fi';

const initialReports = [
  { id: 1,  adTitle: 'iPhone 14 Pro Max 256GB',     reportedBy: 'Amit Kumar',    reason: 'Fake product',       description: 'This is a fake listing with stolen images from another website.',    status: 'pending',  date: 'Mar 10, 2024', category: 'Fraud'    },
  { id: 2,  adTitle: 'Honda Activa – Too Cheap',    reportedBy: 'Rajan Gupta',   reason: 'Suspicious price',   description: 'Price is unrealistically low, potential scam.',                      status: 'pending',  date: 'Mar 9, 2024',  category: 'Scam'     },
  { id: 3,  adTitle: 'Old Furniture Lot',           reportedBy: 'Priya Singh',   reason: 'Spam listing',       description: 'Same seller posting the same item repeatedly every day.',            status: 'resolved', date: 'Mar 8, 2024',  category: 'Spam'     },
  { id: 4,  adTitle: 'Land for Sale – Suspicious',  reportedBy: 'Sneha Joshi',   reason: 'Wrong category',     description: 'This is posted in jobs but it is a real estate listing.',            status: 'pending',  date: 'Mar 7, 2024',  category: 'Misplace' },
  { id: 5,  adTitle: 'Free iPhone Giveaway',        reportedBy: 'Vikram Mehta',  reason: 'Scam / phishing',    description: 'Ad asks users to click external link for a free iPhone giveaway.',  status: 'resolved', date: 'Mar 6, 2024',  category: 'Phishing' },
  { id: 6,  adTitle: 'Used Car – Tampered ODO',     reportedBy: 'Kavita Reddy',  reason: 'Fraudulent listing', description: 'Seller has tampered the odometer reading on the car.',               status: 'pending',  date: 'Mar 5, 2024',  category: 'Fraud'    },
  { id: 7,  adTitle: 'Fake Branded Clothes',        reportedBy: 'Mohit Pandey',  reason: 'Counterfeit goods',  description: 'Selling fake branded clothing as original.',                         status: 'dismissed',date: 'Mar 4, 2024',  category: 'Fraud'    },
  { id: 8,  adTitle: 'Job Scam – Pay First',        reportedBy: 'Deepika Nair',  reason: 'Job scam',           description: 'Asking candidates to pay ₹2000 to get interview call.',             status: 'pending',  date: 'Mar 3, 2024',  category: 'Scam'     },
];

const reasonColors = {
  Fraud: 'bg-red-100 text-red-700', Scam: 'bg-orange-100 text-orange-700',
  Spam: 'bg-yellow-100 text-yellow-700', Phishing: 'bg-purple-100 text-purple-700',
  Misplace: 'bg-blue-100 text-blue-700',
};

const StatusBadge = ({ status }) => {
  const map = {
    pending:   'bg-amber-100 text-amber-700 border-amber-200',
    resolved:  'bg-green-100 text-green-700 border-green-200',
    dismissed: 'bg-slate-100 text-slate-600 border-slate-200',
  };
  const dots = { pending: 'bg-amber-500', resolved: 'bg-green-500', dismissed: 'bg-slate-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${map[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status]}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function Reports() {
  const [reports, setReports] = useState(initialReports);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  const filtered = reports.filter((r) => {
    const q = search.toLowerCase();
    const matchQ = r.adTitle.toLowerCase().includes(q) || r.reportedBy.toLowerCase().includes(q) || r.reason.toLowerCase().includes(q);
    const matchS = filterStatus === 'all' || r.status === filterStatus;
    return matchQ && matchS;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const updateStatus = (id, status) => {
    setReports((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    const labels = { resolved: '✅ Report resolved', dismissed: '🚫 Report dismissed' };
    toast.success(labels[status]);
    setSelectedReport(null);
  };

  const pending = reports.filter((r) => r.status === 'pending').length;
  const resolved = reports.filter((r) => r.status === 'resolved').length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Reports</h2>
          <p className="text-slate-500 text-sm mt-0.5">Review and act on reported content</p>
        </div>
        <div className="flex items-center gap-2">
          {[{ label: 'Pending', val: pending, color: 'text-amber-600' }, { label: 'Resolved', val: resolved, color: 'text-green-600' }].map((s) => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm text-sm">
              <span className={`font-black ${s.color}`}>{s.val}</span>
              <span className="text-slate-400 ml-1">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center px-5 py-4 border-b border-slate-100">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm w-56 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <MdFilterList className="text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-400"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Ad Title', 'Reported By', 'Reason', 'Date', 'Status', 'Actions'].map((h, i) => (
                  <th key={h} className={`px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider ${i === 5 ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <MdFlag size={40} className="opacity-30" />
                      <p className="text-sm">No reports found</p>
                    </div>
                  </td>
                </tr>
              ) : paged.map((report, idx) => (
                <motion.tr key={report.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FiAlertTriangle size={14} className="text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 max-w-[180px] truncate">{report.adTitle}</p>
                        <p className="text-xs text-slate-400 truncate max-w-[180px]">{report.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {report.reportedBy[0]}
                      </div>
                      <span className="text-sm text-slate-700 font-medium">{report.reportedBy}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${reasonColors[report.category] || 'bg-slate-100 text-slate-600'}`}>
                      {report.reason}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">{report.date}</td>
                  <td className="px-4 py-3"><StatusBadge status={report.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      {report.status === 'pending' && (
                        <>
                          <button onClick={() => updateStatus(report.id, 'resolved')} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 transition-all">
                            <MdCheckCircle size={13} /> Resolve
                          </button>
                          <button onClick={() => updateStatus(report.id, 'dismissed')} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all">
                            <MdRemoveCircle size={13} /> Dismiss
                          </button>
                        </>
                      )}
                      {report.status !== 'pending' && (
                        <button onClick={() => setSelectedReport(report)} className="text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1 hover:bg-blue-50 rounded-lg transition-colors">
                          View
                        </button>
                      )}
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

      {/* Report detail modal */}
      <AnimatePresence>
        {selectedReport && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-bold text-slate-800 text-base">Report Details</h3>
                <StatusBadge status={selectedReport.status} />
              </div>
              <div className="space-y-3">
                {[['Ad Title', selectedReport.adTitle], ['Reported By', selectedReport.reportedBy], ['Reason', selectedReport.reason], ['Category', selectedReport.category], ['Date', selectedReport.date]].map(([k, v]) => (
                  <div key={k} className="flex items-start gap-2">
                    <span className="text-xs text-slate-400 w-28 pt-0.5 flex-shrink-0">{k}</span>
                    <span className="text-sm font-semibold text-slate-800">{v}</span>
                  </div>
                ))}
                <div className="flex items-start gap-2">
                  <span className="text-xs text-slate-400 w-28 pt-0.5 flex-shrink-0">Description</span>
                  <span className="text-sm text-slate-600">{selectedReport.description}</span>
                </div>
              </div>
              <button onClick={() => setSelectedReport(null)} className="mt-5 w-full py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
