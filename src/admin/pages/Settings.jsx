import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  MdLock, MdPerson, MdSettings, MdNotifications, MdSecurity,
  MdVisibility, MdVisibilityOff, MdAdd, MdDeleteOutline, MdSave,
} from 'react-icons/md';
import { FiShield } from 'react-icons/fi';

const TABS = [
  { key: 'general',   label: 'General',        icon: MdSettings },
  { key: 'security',  label: 'Security',       icon: MdSecurity },
  { key: 'admins',    label: 'Admins',         icon: MdPerson },
  { key: 'notifications', label: 'Notifications', icon: MdNotifications },
];

const initialAdmins = [
  { id: 1, name: 'Super Admin',  email: 'admin@olx.com',        role: 'Super Admin', lastLogin: '2 min ago', status: 'online' },
  { id: 2, name: 'Ravi Kumar',   email: 'ravi@olx.com',         role: 'Moderator',   lastLogin: '1 hr ago',  status: 'offline' },
  { id: 3, name: 'Sneha Nair',   email: 'sneha.admin@olx.com',  role: 'Moderator',   lastLogin: '3 hrs ago', status: 'offline' },
];

const fieldClass = 'w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:bg-white transition-all';
const labelClass = 'block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [adminForm, setAdminForm] = useState({ name: '', email: '', role: 'Moderator' });
  const [admins, setAdmins] = useState(initialAdmins);
  const [platformSettings, setPlatformSettings] = useState({
    siteName: 'OLX India',
    adExpiryDays: '30',
    maxImagesPerAd: '5',
    maxAdsPerUser: '20',
    allowFreeAds: true,
    requireEmailVerify: true,
    maintenanceMode: false,
    adAutoDelete: true,
  });
  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' });
  const [notifSettings, setNotifSettings] = useState({
    emailNewUser: true, emailNewAd: false, emailNewReport: true,
    dashboardAlerts: true, weeklyReport: true, securityAlerts: true,
  });

  const saveGeneral = () => toast.success('Platform settings saved!');
  const savePass = () => {
    if (!passForm.current || !passForm.newPass || !passForm.confirm) { toast.error('Fill all password fields'); return; }
    if (passForm.newPass !== passForm.confirm) { toast.error('Passwords do not match'); return; }
    if (passForm.newPass.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setPassForm({ current: '', newPass: '', confirm: '' });
    toast.success('Password changed successfully!');
  };
  const addAdmin = () => {
    if (!adminForm.name.trim() || !adminForm.email.trim()) { toast.error('Name and email required'); return; }
    setAdmins((prev) => [...prev, { id: Date.now(), ...adminForm, lastLogin: 'Never', status: 'offline' }]);
    setAdminForm({ name: '', email: '', role: 'Moderator' });
    toast.success(`Admin "${adminForm.name}" added`);
  };
  const removeAdmin = (id) => {
    if (id === 1) { toast.error("Can't remove Super Admin"); return; }
    setAdmins((prev) => prev.filter((a) => a.id !== id));
    toast.success('Admin removed');
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-black text-slate-800">Settings</h2>
        <p className="text-slate-500 text-sm mt-0.5">Manage platform configuration and admin accounts</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Tab sidebar */}
        <div className="lg:w-52 bg-white rounded-2xl shadow-sm border border-slate-100 p-2 h-fit">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left mb-0.5 ${
                activeTab === key
                  ? 'bg-blue-50 text-blue-700 border border-blue-100'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >

            {/* ── General Settings ── */}
            {activeTab === 'general' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
                <div>
                  <h3 className="font-bold text-slate-800 text-base mb-0.5">Platform Settings</h3>
                  <p className="text-slate-400 text-xs">Configure general platform behaviour</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Site Name</label>
                    <input className={fieldClass} value={platformSettings.siteName} onChange={(e) => setPlatformSettings((p) => ({ ...p, siteName: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelClass}>Ad Expiry (Days)</label>
                    <input type="number" className={fieldClass} value={platformSettings.adExpiryDays} onChange={(e) => setPlatformSettings((p) => ({ ...p, adExpiryDays: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelClass}>Max Images Per Ad</label>
                    <input type="number" className={fieldClass} value={platformSettings.maxImagesPerAd} onChange={(e) => setPlatformSettings((p) => ({ ...p, maxImagesPerAd: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelClass}>Max Ads Per User</label>
                    <input type="number" className={fieldClass} value={platformSettings.maxAdsPerUser} onChange={(e) => setPlatformSettings((p) => ({ ...p, maxAdsPerUser: e.target.value }))} />
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'allowFreeAds', label: 'Allow Free Ads', desc: 'Users can post ads for free' },
                    { key: 'requireEmailVerify', label: 'Require Email Verification', desc: 'Users must verify email to post ads' },
                    { key: 'adAutoDelete', label: 'Auto-Delete Expired Ads', desc: 'Automatically remove ads after expiry' },
                    { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Take the platform offline for maintenance' },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{label}</p>
                        <p className="text-xs text-slate-400">{desc}</p>
                      </div>
                      <button
                        onClick={() => setPlatformSettings((p) => ({ ...p, [key]: !p[key] }))}
                        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${platformSettings[key] ? 'bg-blue-500' : 'bg-slate-300'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${platformSettings[key] ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>

                <button onClick={saveGeneral} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors">
                  <MdSave size={17} /> Save Settings
                </button>
              </div>
            )}

            {/* ── Security / Change Password ── */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
                <div>
                  <h3 className="font-bold text-slate-800 text-base mb-0.5">Change Password</h3>
                  <p className="text-slate-400 text-xs">Keep your admin account secure with a strong password</p>
                </div>
                <div className="max-w-md space-y-4">
                  {[
                    { id: 'current', label: 'Current Password',  key: 'current' },
                    { id: 'new',     label: 'New Password',      key: 'newPass' },
                    { id: 'confirm', label: 'Confirm New Password', key: 'confirm' },
                  ].map(({ id, label, key }) => (
                    <div key={id}>
                      <label className={labelClass}>{label}</label>
                      <div className="relative">
                        <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                        <input
                          type={showPass[id] ? 'text' : 'password'}
                          value={passForm[key]}
                          onChange={(e) => setPassForm((p) => ({ ...p, [key]: e.target.value }))}
                          placeholder="••••••••"
                          className={`${fieldClass} pl-10 pr-10`}
                        />
                        <button type="button" onClick={() => setShowPass((p) => ({ ...p, [id]: !p[id] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showPass[id] ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="p-3 bg-blue-50 rounded-xl text-xs text-blue-700 space-y-1">
                    <p className="font-semibold">Password requirements:</p>
                    <p>• Minimum 8 characters</p>
                    <p>• Use letters, numbers and symbols</p>
                    <p>• Avoid common words or personal info</p>
                  </div>
                  <button onClick={savePass} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors">
                    <FiShield size={15} /> Update Password
                  </button>
                </div>
              </div>
            )}

            {/* ── Admins ── */}
            {activeTab === 'admins' && (
              <div className="space-y-4">
                {/* Existing admins */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                  <h3 className="font-bold text-slate-800 text-sm mb-4">Admin Accounts ({admins.length})</h3>
                  <div className="space-y-2">
                    {admins.map((admin) => (
                      <div key={admin.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {admin.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-slate-800">{admin.name}</p>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${admin.role === 'Super Admin' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'}`}>{admin.role}</span>
                          </div>
                          <p className="text-xs text-slate-400">{admin.email}</p>
                        </div>
                        <div className="text-right flex-shrink-0 mr-2">
                          <div className={`text-xs font-medium ${admin.status === 'online' ? 'text-green-500' : 'text-slate-400'}`}>
                            ● {admin.status === 'online' ? 'Online' : `Last: ${admin.lastLogin}`}
                          </div>
                        </div>
                        {admin.id !== 1 && (
                          <button onClick={() => removeAdmin(admin.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <MdDeleteOutline size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add admin */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                  <h3 className="font-bold text-slate-800 text-sm mb-4">Add New Admin</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className={labelClass}>Full Name</label>
                      <input className={fieldClass} placeholder="Admin name" value={adminForm.name} onChange={(e) => setAdminForm((p) => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div>
                      <label className={labelClass}>Email</label>
                      <input type="email" className={fieldClass} placeholder="admin@olx.com" value={adminForm.email} onChange={(e) => setAdminForm((p) => ({ ...p, email: e.target.value }))} />
                    </div>
                    <div>
                      <label className={labelClass}>Role</label>
                      <select className={fieldClass} value={adminForm.role} onChange={(e) => setAdminForm((p) => ({ ...p, role: e.target.value }))}>
                        <option>Moderator</option>
                        <option>Super Admin</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={addAdmin} className="mt-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors">
                    <MdAdd size={17} /> Add Admin
                  </button>
                </div>
              </div>
            )}

            {/* ── Notification settings ── */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
                <div>
                  <h3 className="font-bold text-slate-800 text-base mb-0.5">Notification Preferences</h3>
                  <p className="text-slate-400 text-xs">Control what alerts and emails you receive</p>
                </div>
                <div className="space-y-3">
                  {[
                    { key: 'emailNewUser',    label: 'New User Registered',          desc: 'Email when a new user joins' },
                    { key: 'emailNewAd',      label: 'New Ad Posted',                desc: 'Email when a new ad is submitted' },
                    { key: 'emailNewReport',  label: 'New Report Filed',             desc: 'Email when someone reports an ad' },
                    { key: 'dashboardAlerts', label: 'Dashboard Alerts',             desc: 'Show alerts in the admin panel' },
                    { key: 'weeklyReport',    label: 'Weekly Analytics Report',      desc: 'Receive weekly platform stats' },
                    { key: 'securityAlerts',  label: 'Security Alerts',              desc: 'Alert on suspicious activity' },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{label}</p>
                        <p className="text-xs text-slate-400">{desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifSettings((p) => ({ ...p, [key]: !p[key] }))}
                        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${notifSettings[key] ? 'bg-blue-500' : 'bg-slate-300'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${notifSettings[key] ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={() => toast.success('Notification preferences saved!')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors">
                  <MdSave size={17} /> Save Preferences
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
