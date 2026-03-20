import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MdMenu, MdNotifications, MdSearch, MdClose } from 'react-icons/md';
import { FiBell } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const pageNames = {
  '/admin/dashboard': { title: 'Dashboard', subtitle: 'Platform overview' },
  '/admin/users': { title: 'User Management', subtitle: 'Manage all users' },
  '/admin/ads': { title: 'Ad Management', subtitle: 'Moderate all ads' },
  '/admin/reports': { title: 'Reports', subtitle: 'Reported content' },
  '/admin/categories': { title: 'Categories', subtitle: 'Manage categories' },
  '/admin/content': { title: 'Content Management', subtitle: 'Banners, promotions and homepage ads' },
  '/admin/fraud': { title: 'Fraud & Safety', subtitle: 'Monitor suspicious users and scams' },
  '/admin/support': { title: 'Customer Support', subtitle: 'Resolve user issues and tickets' },
  '/admin/analytics': { title: 'Analytics', subtitle: 'Platform insights' },
  '/admin/settings': { title: 'Settings', subtitle: 'Admin configuration' },
};

const initialNotifications = [
  { id: 1, title: 'New user registered', desc: 'Rahul Sharma just joined', time: '2 min ago', unread: true, color: 'bg-blue-100 text-blue-600' },
  { id: 2, title: 'Ads pending approval', desc: '5 ads need your review', time: '10 min ago', unread: true, color: 'bg-amber-100 text-amber-600' },
  { id: 3, title: 'New report filed', desc: 'Fake iPhone listing reported', time: '1 hour ago', unread: true, color: 'bg-red-100 text-red-600' },
  { id: 4, title: 'Category updated', desc: 'Electronics category modified', time: '2 hours ago', unread: false, color: 'bg-green-100 text-green-600' },
];

const AdminNavbar = ({ onMenuClick }) => {
  const location = useLocation();
  const { admin } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(initialNotifications);
  const notifRef = useRef(null);

  const page = pageNames[location.pathname] || { title: 'Admin Panel', subtitle: '' };
  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-6 h-16 flex items-center gap-4 shadow-sm flex-shrink-0">
      {/* Hamburger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
      >
        <MdMenu size={22} />
      </button>

      {/* Page Title */}
      <div className="hidden sm:block">
        <h1 className="text-base font-bold text-slate-800 leading-tight">{page.title}</h1>
        <p className="text-xs text-slate-400 leading-tight">{page.subtitle}</p>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-sm mx-2 hidden md:block relative">
        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
        <input
          type="text"
          placeholder="Search users, ads..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-400 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-olx-teal-dark focus:bg-white transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <MdClose size={14} />
          </button>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications((p) => !p)}
            className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <FiBell size={19} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800 text-sm">Notifications</h3>
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto scrollbar-thin divide-y divide-slate-50">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n.id)}
                    className={`flex gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors ${n.unread ? 'bg-blue-50/30' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${n.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <MdNotifications size={15} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                      <p className="text-xs text-slate-500">{n.desc}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                    </div>
                    {n.unread && <div className="w-2 h-2 bg-olx-teal-dark rounded-full ml-auto mt-2 flex-shrink-0" />}
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-slate-100 text-center">
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-olx-navy hover:text-olx-navySoft font-medium"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile chip */}
        <div className="flex items-center gap-2.5 ml-1 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 bg-olx-navy rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {admin?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="hidden md:block pr-1">
            <p className="text-sm font-semibold text-slate-800 leading-tight">{admin?.name || 'Admin'}</p>
            <p className="text-xs text-green-500 font-medium leading-tight">● Online</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
