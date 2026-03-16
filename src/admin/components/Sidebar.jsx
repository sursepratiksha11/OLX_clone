import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  MdDashboard,
  MdPeople,
  MdClose,
  MdFlag,
  MdCategory,
  MdBarChart,
  MdSettings,
  MdLogout,
  MdAdsClick,
  MdSecurity,
  MdSupportAgent,
  MdViewCarousel,
} from 'react-icons/md';
import { FaShieldAlt } from 'react-icons/fa';

const navItems = [
  { icon: MdDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: MdPeople, label: 'Users', path: '/admin/users', badge: '1.2K' },
  { icon: MdAdsClick, label: 'Ads', path: '/admin/ads', badge: '347', badgeColor: 'bg-amber-500' },
  { icon: MdFlag, label: 'Reports', path: '/admin/reports', badge: '89', badgeColor: 'bg-red-500' },
  { icon: MdCategory, label: 'Categories', path: '/admin/categories' },
  { icon: MdViewCarousel, label: 'Content', path: '/admin/content' },
  { icon: MdSecurity, label: 'Fraud & Safety', path: '/admin/fraud', badge: '12', badgeColor: 'bg-red-500' },
  { icon: MdSupportAgent, label: 'Support', path: '/admin/support', badge: '27', badgeColor: 'bg-emerald-500' },
  { icon: MdBarChart, label: 'Analytics', path: '/admin/analytics' },
  { icon: MdSettings, label: 'Settings', path: '/admin/settings' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 flex flex-col h-full
        bg-white
        border-r border-slate-200
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* ── Logo ── */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-olx-navy rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
            <FaShieldAlt className="text-white text-sm" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-olx-navy font-black text-xl leading-none tracking-tight">OLX</span>
              <span className="bg-olx-lemon text-olx-navy text-[9px] font-bold px-1.5 py-0.5 rounded-md tracking-wide">
                ADMIN
              </span>
            </div>
            <p className="text-slate-500 text-[11px] mt-0.5">Control Panel</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1 text-slate-500 hover:text-olx-navy transition-colors rounded-lg hover:bg-slate-100"
        >
          <MdClose size={18} />
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-thin space-y-0.5">
        {navItems.map(({ icon: Icon, label, path, badge, badgeColor = 'bg-olx-navy' }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative
              ${
                isActive
                  ? 'bg-[#e7fffd] border border-[#b6f3ef] shadow-sm'
                  : 'text-slate-500 hover:text-olx-navy hover:bg-slate-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-olx-teal-dark rounded-r-full" />
                )}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all flex-shrink-0
                    ${isActive ? 'bg-olx-teal/30' : 'bg-slate-100 group-hover:bg-white'}`}
                >
                  <Icon
                    size={17}
                    className={isActive ? 'text-olx-navy' : 'text-slate-500 group-hover:text-olx-navy'}
                  />
                </div>
                <span
                  className={`flex-1 text-sm font-medium transition-colors
                    ${isActive ? 'text-olx-navy' : 'text-slate-600 group-hover:text-olx-navy'}`}
                >
                  {label}
                </span>
                {badge && (
                  <span
                    className={`${badgeColor} text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[22px] text-center leading-tight`}
                  >
                    {badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Profile + Logout ── */}
      <div className="px-3 py-4 border-t border-slate-200 space-y-1.5">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50">
          <div className="w-8 h-8 bg-olx-navy rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {admin?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-700 text-sm font-semibold truncate">{admin?.name || 'Super Admin'}</p>
            <p className="text-slate-500 text-[11px]">Administrator</p>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" title="Online" />
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all group"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-red-100 flex items-center justify-center transition-all">
            <MdLogout size={17} className="transition-colors" />
          </div>
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
