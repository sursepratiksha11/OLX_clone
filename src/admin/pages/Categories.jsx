import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { MdAdd, MdEdit, MdDeleteOutline, MdCategory } from 'react-icons/md';

const categoryIcons = {
  Cars: '🚗', Bikes: '🏍️', Mobiles: '📱', Electronics: '💻',
  Furniture: '🛋️', Jobs: '💼', 'Real Estate': '🏠', Fashion: '👗',
  Sports: '⚽', Books: '📚', Pets: '🐾', 'Musical Instruments': '🎸',
};

const categoryColors = [
  { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-500', text: 'text-blue-700' },
  { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-500', text: 'text-green-700' },
  { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-500', text: 'text-purple-700' },
  { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-500', text: 'text-amber-700' },
  { bg: 'bg-rose-50', border: 'border-rose-200', badge: 'bg-rose-500', text: 'text-rose-700' },
  { bg: 'bg-cyan-50', border: 'border-cyan-200', badge: 'bg-cyan-500', text: 'text-cyan-700' },
  { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-500', text: 'text-orange-700' },
  { bg: 'bg-teal-50', border: 'border-teal-200', badge: 'bg-teal-500', text: 'text-teal-700' },
  { bg: 'bg-indigo-50', border: 'border-indigo-200', badge: 'bg-indigo-500', text: 'text-indigo-700' },
  { bg: 'bg-pink-50', border: 'border-pink-200', badge: 'bg-pink-500', text: 'text-pink-700' },
];

const initialCategories = [
  { id: 1, name: 'Cars',                adsCount: 245, active: true  },
  { id: 2, name: 'Bikes',               adsCount: 189, active: true  },
  { id: 3, name: 'Mobiles',             adsCount: 312, active: true  },
  { id: 4, name: 'Electronics',         adsCount: 278, active: true  },
  { id: 5, name: 'Furniture',           adsCount: 156, active: true  },
  { id: 6, name: 'Jobs',                adsCount: 423, active: true  },
  { id: 7, name: 'Real Estate',         adsCount: 198, active: true  },
  { id: 8, name: 'Fashion',             adsCount: 134, active: false },
  { id: 9, name: 'Sports',              adsCount: 92,  active: true  },
  { id: 10, name: 'Books',              adsCount: 67,  active: false },
  { id: 11, name: 'Pets',               adsCount: 48,  active: true  },
  { id: 12, name: 'Musical Instruments',adsCount: 31,  active: true  },
];

const ModalInput = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
    />
  </div>
);

export default function Categories() {
  const [categories, setCategories] = useState(initialCategories);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [newName, setNewName] = useState('');
  const [editName, setEditName] = useState('');

  const handleAdd = () => {
    if (!newName.trim()) { toast.error('Category name is required'); return; }
    if (categories.some((c) => c.name.toLowerCase() === newName.trim().toLowerCase())) {
      toast.error('Category already exists'); return;
    }
    setCategories((prev) => [
      ...prev,
      { id: Date.now(), name: newName.trim(), adsCount: 0, active: true },
    ]);
    toast.success(`Category "${newName.trim()}" added`);
    setNewName('');
    setShowAddModal(false);
  };

  const handleEdit = () => {
    if (!editName.trim()) { toast.error('Category name required'); return; }
    setCategories((prev) => prev.map((c) => c.id === editTarget.id ? { ...c, name: editName.trim() } : c));
    toast.success('Category updated');
    setEditTarget(null);
  };

  const handleDelete = () => {
    setCategories((prev) => prev.filter((c) => c.id !== deleteTarget));
    toast.success('Category deleted');
    setDeleteTarget(null);
  };

  const toggleActive = (id) => {
    setCategories((prev) => prev.map((c) => {
      if (c.id !== id) return c;
      toast.success(c.active ? 'Category hidden' : 'Category activated');
      return { ...c, active: !c.active };
    }));
  };

  const totalAds = categories.reduce((s, c) => s + c.adsCount, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Category Management</h2>
          <p className="text-slate-500 text-sm mt-0.5">{categories.length} categories · {totalAds} total ads</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm shadow-blue-200 transition-colors"
        >
          <MdAdd size={18} /> Add Category
        </motion.button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((cat, idx) => {
          const color = categoryColors[idx % categoryColors.length];
          const icon = categoryIcons[cat.name] || '📦';
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.04 }}
              whileHover={{ y: -2 }}
              className={`${color.bg} border ${color.border} rounded-2xl p-5 transition-all duration-200 ${!cat.active ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{icon}</div>
                <div className="flex items-center gap-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${cat.active ? color.badge : 'bg-slate-400'}`}>
                    {cat.active ? 'Active' : 'Hidden'}
                  </span>
                </div>
              </div>

              <h3 className={`font-bold text-base ${color.text} mb-1`}>{cat.name}</h3>
              <p className="text-slate-500 text-xs">{cat.adsCount.toLocaleString()} ads listed</p>

              {/* Bar */}
              <div className="mt-3 mb-4">
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${color.badge}`}
                    style={{ width: `${Math.min(100, (cat.adsCount / 500) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => { setEditTarget(cat); setEditName(cat.name); }}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-white/70 hover:bg-white text-slate-600 rounded-lg text-xs font-medium border border-white/50 transition-all"
                >
                  <MdEdit size={13} /> Edit
                </button>
                <button
                  onClick={() => toggleActive(cat.id)}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-white/70 hover:bg-white text-slate-600 rounded-lg text-xs font-medium border border-white/50 transition-all"
                >
                  {cat.active ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={() => setDeleteTarget(cat.id)}
                  className="ml-auto p-1.5 hover:bg-red-100 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                >
                  <MdDeleteOutline size={15} />
                </button>
              </div>
            </motion.div>
          );
        })}

        {/* Add new card */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddModal(true)}
          className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-blue-500 transition-all group min-h-[180px]"
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
            <MdAdd size={24} />
          </div>
          <span className="text-sm font-semibold">Add Category</span>
        </motion.button>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                <MdCategory className="text-blue-600" size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Add New Category</h3>
              <p className="text-slate-400 text-sm mb-5">Create a new product category for the platform.</p>
              <div className="space-y-4">
                <ModalInput label="Category Name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Electronics" />
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => { setShowAddModal(false); setNewName(''); }} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                <button onClick={handleAdd} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-semibold text-white transition-colors">Add Category</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
                <MdEdit className="text-amber-600" size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Edit Category</h3>
              <p className="text-slate-400 text-sm mb-5">Update the category name.</p>
              <ModalInput label="Category Name" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Category name" />
              <div className="flex gap-3 mt-5">
                <button onClick={() => setEditTarget(null)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                <button onClick={handleEdit} className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 rounded-xl text-sm font-semibold text-white transition-colors">Save Changes</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
                <MdDeleteOutline className="text-red-500" size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Delete Category?</h3>
              <p className="text-slate-500 text-sm mb-6">This will delete the category and cannot be undone. Ads in this category will need to be recategorized.</p>
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
