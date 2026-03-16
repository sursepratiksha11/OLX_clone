import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminRole');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// ── Auth ──────────────────────────────────────────────────────
export const adminLogin = (email, password) =>
  api.post('/admin/login', { email, password });

// ── Stats ─────────────────────────────────────────────────────
export const fetchStats = () => api.get('/admin/stats');

// ── Users ─────────────────────────────────────────────────────
export const fetchUsers = (params) => api.get('/admin/users', { params });
export const banUser    = (id)     => api.put(`/admin/users/${id}/ban`);
export const unbanUser  = (id)     => api.put(`/admin/users/${id}/unban`);
export const deleteUser = (id)     => api.delete(`/admin/users/${id}`);
export const verifySeller = (id)   => api.put(`/admin/users/${id}/verify`);
export const fetchUserActivity = (id) => api.get(`/admin/users/${id}/activity`);
export const resetUserStatus = (id) => api.put(`/admin/users/${id}/reset-status`);
export const fetchUserComplaints = (params) => api.get('/admin/users/complaints', { params });

// ── Ads ───────────────────────────────────────────────────────
export const fetchAds   = (params) => api.get('/admin/products', { params });
export const approveAd  = (id)     => api.put(`/admin/products/${id}/approve`);
export const rejectAd   = (id)     => api.put(`/admin/products/${id}/reject`);
export const deleteAd   = (id)     => api.delete(`/admin/products/${id}`);
export const featureAd  = (id)     => api.put(`/admin/products/${id}/feature`);

// ── Reports ───────────────────────────────────────────────────
export const fetchReports   = (params) => api.get('/admin/reports', { params });
export const resolveReport  = (id)     => api.put(`/admin/reports/${id}/resolve`);
export const dismissReport  = (id)     => api.put(`/admin/reports/${id}/dismiss`);

// ── Fraud & Safety ───────────────────────────────────────────
export const fetchFraudReports = (params) => api.get('/admin/fraud/reports', { params });
export const fetchSuspiciousUsers = (params) => api.get('/admin/fraud/users', { params });
export const blockFraudUser = (id) => api.put(`/admin/fraud/users/${id}/block`);
export const investigateFraudCase = (id) => api.put(`/admin/fraud/reports/${id}/investigate`);
export const closeFraudCase = (id) => api.put(`/admin/fraud/reports/${id}/close`);

// ── Categories ────────────────────────────────────────────────
export const fetchCategories  = ()       => api.get('/categories');
export const createCategory   = (data)   => api.post('/categories', data);
export const updateCategory   = (id, d)  => api.put(`/categories/${id}`, d);
export const deleteCategory   = (id)     => api.delete(`/categories/${id}`);

// ── Content Management ───────────────────────────────────────
export const fetchBanners = () => api.get('/admin/content/banners');
export const createBanner = (data) => api.post('/admin/content/banners', data);
export const updateBanner = (id, data) => api.put(`/admin/content/banners/${id}`, data);
export const deleteBanner = (id) => api.delete(`/admin/content/banners/${id}`);
export const fetchPromotions = () => api.get('/admin/content/promotions');
export const createPromotion = (data) => api.post('/admin/content/promotions', data);
export const updatePromotion = (id, data) => api.put(`/admin/content/promotions/${id}`, data);
export const deletePromotion = (id) => api.delete(`/admin/content/promotions/${id}`);
export const fetchHomepageAds = () => api.get('/admin/content/homepage-ads');
export const updateHomepageAd = (id, data) => api.put(`/admin/content/homepage-ads/${id}`, data);

// ── Customer Support ─────────────────────────────────────────
export const fetchSupportTickets = (params) => api.get('/admin/support/tickets', { params });
export const resolveSupportTicket = (id, data) => api.put(`/admin/support/tickets/${id}/resolve`, data);
export const replySupportTicket = (id, data) => api.post(`/admin/support/tickets/${id}/reply`, data);

export default api;
