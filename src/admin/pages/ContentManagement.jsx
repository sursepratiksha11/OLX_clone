import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { MdAdd, MdDeleteOutline, MdCampaign, MdViewCarousel } from 'react-icons/md';
import {
  fetchBanners,
  createBanner,
  deleteBanner,
  fetchPromotions,
  createPromotion,
  deletePromotion,
  fetchHomepageAds,
  updateHomepageAd,
} from '../services/adminApi';
import useLivePolling from '../../hooks/useLivePolling';

const fallbackBanners = [
  { id: 1, title: 'Summer Sale Banner', status: 'active' },
  { id: 2, title: 'Electronics Fest', status: 'inactive' },
];

const fallbackPromos = [
  { id: 11, title: 'Featured Ads Discount 20%', status: 'active' },
  { id: 12, title: 'Boost Ads Week', status: 'active' },
];

const fallbackHomepageAds = [
  { id: 101, title: 'Premium Car Listing', pinned: true },
  { id: 102, title: 'Top Mobile Deal', pinned: false },
];

export default function ContentManagement() {
  const [banners, setBanners] = useState(fallbackBanners);
  const [promos, setPromos] = useState(fallbackPromos);
  const [homepageAds, setHomepageAds] = useState(fallbackHomepageAds);
  const [newBanner, setNewBanner] = useState('');
  const [newPromo, setNewPromo] = useState('');

  useLivePolling(async () => {
    try {
      const [bannerRes, promoRes, homeRes] = await Promise.all([
        fetchBanners(),
        fetchPromotions(),
        fetchHomepageAds(),
      ]);

      const mapList = (res) => Array.isArray(res) ? res : Array.isArray(res?.content) ? res.content : [];
      const bn = mapList(bannerRes);
      const pr = mapList(promoRes);
      const hm = mapList(homeRes);

      if (bn.length) setBanners(bn.map((b, i) => ({ id: b.id ?? i + 1, title: b.title ?? b.name ?? 'Banner', status: (b.status ?? 'active').toLowerCase() })));
      if (pr.length) setPromos(pr.map((p, i) => ({ id: p.id ?? i + 11, title: p.title ?? p.name ?? 'Promotion', status: (p.status ?? 'active').toLowerCase() })));
      if (hm.length) setHomepageAds(hm.map((h, i) => ({ id: h.id ?? i + 101, title: h.title ?? h.name ?? 'Homepage Ad', pinned: Boolean(h.pinned) })));
    } catch {
      // keep fallback data
    }
  }, 15000, []);

  const activeCount = useMemo(() => banners.filter((b) => b.status === 'active').length + promos.filter((p) => p.status === 'active').length, [banners, promos]);

  const onAddBanner = async () => {
    if (!newBanner.trim()) return;
    try {
      await createBanner({ title: newBanner.trim() });
      setBanners((prev) => [...prev, { id: Date.now(), title: newBanner.trim(), status: 'active' }]);
      setNewBanner('');
      toast.success('Banner added');
    } catch {
      toast.error('Failed to add banner');
    }
  };

  const onDeleteBanner = async (id) => {
    try {
      await deleteBanner(id);
      setBanners((prev) => prev.filter((b) => b.id !== id));
      toast.success('Banner deleted');
    } catch {
      toast.error('Failed to delete banner');
    }
  };

  const onAddPromo = async () => {
    if (!newPromo.trim()) return;
    try {
      await createPromotion({ title: newPromo.trim() });
      setPromos((prev) => [...prev, { id: Date.now(), title: newPromo.trim(), status: 'active' }]);
      setNewPromo('');
      toast.success('Promotion added');
    } catch {
      toast.error('Failed to add promotion');
    }
  };

  const onDeletePromo = async (id) => {
    try {
      await deletePromotion(id);
      setPromos((prev) => prev.filter((p) => p.id !== id));
      toast.success('Promotion deleted');
    } catch {
      toast.error('Failed to delete promotion');
    }
  };

  const onPinHomepageAd = async (id, nextPinned) => {
    try {
      await updateHomepageAd(id, { pinned: nextPinned });
      setHomepageAds((prev) => prev.map((h) => h.id === id ? { ...h, pinned: nextPinned } : h));
      toast.success(nextPinned ? 'Homepage ad pinned' : 'Homepage ad unpinned');
    } catch {
      toast.error('Failed to update homepage ad');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Content Management Admin</h2>
          <p className="text-slate-500 text-sm mt-0.5">Manage categories, banners, promotions and homepage ads (live refresh: 15s)</p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#e7fffd] text-olx-navy border border-[#b6f3ef]">{activeCount} active campaigns</div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3"><MdViewCarousel className="text-olx-navy" /><h3 className="font-bold">Banners</h3></div>
          <div className="flex gap-2 mb-3">
            <input value={newBanner} onChange={(e) => setNewBanner(e.target.value)} placeholder="Add new banner" className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm" />
            <button onClick={onAddBanner} className="px-3 py-2 rounded-xl bg-olx-navy text-white text-sm inline-flex items-center gap-1"><MdAdd size={14} /> Add</button>
          </div>
          <div className="space-y-2">
            {banners.map((b) => (
              <div key={b.id} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">{b.title}</p>
                  <p className="text-xs text-slate-500 capitalize">{b.status}</p>
                </div>
                <button onClick={() => onDeleteBanner(b.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"><MdDeleteOutline size={14} /></button>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3"><MdCampaign className="text-amber-500" /><h3 className="font-bold">Promotions</h3></div>
          <div className="flex gap-2 mb-3">
            <input value={newPromo} onChange={(e) => setNewPromo(e.target.value)} placeholder="Add new promotion" className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm" />
            <button onClick={onAddPromo} className="px-3 py-2 rounded-xl bg-olx-navy text-white text-sm inline-flex items-center gap-1"><MdAdd size={14} /> Add</button>
          </div>
          <div className="space-y-2">
            {promos.map((p) => (
              <div key={p.id} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">{p.title}</p>
                  <p className="text-xs text-slate-500 capitalize">{p.status}</p>
                </div>
                <button onClick={() => onDeletePromo(p.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"><MdDeleteOutline size={14} /></button>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3"><MdCampaign className="text-emerald-500" /><h3 className="font-bold">Homepage Ads</h3></div>
          <div className="space-y-2">
            {homepageAds.map((h) => (
              <div key={h.id} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">{h.title}</p>
                  <p className="text-xs text-slate-500">{h.pinned ? 'Pinned' : 'Not pinned'}</p>
                </div>
                <button
                  onClick={() => onPinHomepageAd(h.id, !h.pinned)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold ${h.pinned ? 'bg-amber-100 text-amber-700' : 'bg-[#e7fffd] text-olx-navy'}`}
                >
                  {h.pinned ? 'Unpin' : 'Pin'}
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
