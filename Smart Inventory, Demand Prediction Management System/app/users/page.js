'use client';

import {
  HiOutlineShieldCheck, HiOutlineClipboardDocumentList, HiOutlineBanknotes,
  HiOutlineBuildingOffice, HiOutlineXMark, HiOutlinePlusCircle,
  HiOutlineExclamationTriangle, HiOutlineCheckCircle, HiOutlinePencil,
  HiOutlineCheck, HiOutlineUser, HiOutlineBriefcase, HiOutlineMagnifyingGlass,
  HiOutlineNoSymbol, HiOutlineFunnel, HiOutlineUserGroup, HiOutlineCalendarDays,
  HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash,
} from 'react-icons/hi2';

import React, { useState, useEffect } from 'react';

const ROLES = ['ADMIN', 'MANAGER', 'SALES', 'WAREHOUSE'];

const roleConfig = {
  ADMIN:     { icon: HiOutlineShieldCheck,            color: '#f87171', bg: 'rgba(239, 68, 68, 0.12)',  border: 'rgba(239, 68, 68, 0.25)',  gradient: 'linear-gradient(135deg, #ef4444, #dc2626)' },
  MANAGER:   { icon: HiOutlineClipboardDocumentList,  color: '#fbbf24', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.25)', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
  SALES:     { icon: HiOutlineBanknotes,              color: '#4ade80', bg: 'rgba(34, 197, 94, 0.12)',  border: 'rgba(34, 197, 94, 0.25)',  gradient: 'linear-gradient(135deg, #22c55e, #16a34a)' },
  WAREHOUSE: { icon: HiOutlineBuildingOffice,         color: '#38bdf8', bg: 'rgba(14, 165, 233, 0.12)', border: 'rgba(14, 165, 233, 0.25)', gradient: 'linear-gradient(135deg, #0ea5e9, #0284c7)' },
};

// ─── Dark Theme Styles ───────────────────────────────────────────────
const st = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    padding: '1.5rem 2rem 2rem',
  },
  // Header
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    padding: '1.5rem 1.75rem',
    background: 'linear-gradient(145deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.9) 100%)',
    borderRadius: '20px',
    border: '1px solid rgba(59,130,246,0.15)',
    backdropFilter: 'blur(20px)',
    position: 'relative',
    overflow: 'hidden',
  },
  headerGlow: {
    position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
    background: 'radial-gradient(circle at 30% 30%, rgba(59,130,246,0.08) 0%, transparent 40%)',
    pointerEvents: 'none',
  },
  headerLeft: { position: 'relative', zIndex: 1 },
  headerTitle: {
    fontSize: '1.75rem', fontWeight: '700', color: '#ffffff',
    letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '0.75rem',
  },
  titleIcon: {
    width: '42px', height: '42px',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(59,130,246,0.4)', color: '#fff',
  },
  headerSub: { color: 'rgba(148,163,184,0.8)', fontSize: '0.9rem', marginTop: '0.35rem' },
  addBtn: {
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    border: 'none', padding: '0.7rem 1.35rem', borderRadius: '12px',
    color: '#fff', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '0.45rem',
    boxShadow: '0 4px 16px rgba(59,130,246,0.35)', transition: 'all 0.2s ease',
    position: 'relative', zIndex: 1,
  },
  cancelHeaderBtn: {
    background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
    padding: '0.7rem 1.35rem', borderRadius: '12px',
    color: '#f87171', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '0.45rem',
    transition: 'all 0.2s ease', position: 'relative', zIndex: 1,
  },
  // Alerts
  successAlert: {
    background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(15,23,42,0.9))',
    borderRadius: '14px', padding: '0.9rem 1.25rem', marginBottom: '1.25rem',
    display: 'flex', alignItems: 'center', gap: '0.6rem',
    border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', fontSize: '14px', fontWeight: '500',
  },
  errorAlert: {
    background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(15,23,42,0.9))',
    borderRadius: '14px', padding: '0.9rem 1.25rem', marginBottom: '1.25rem',
    display: 'flex', alignItems: 'center', gap: '0.6rem',
    border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: '14px', fontWeight: '500',
  },
  // Stats
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem', marginBottom: '1.25rem',
  },
  statCard: (color, glow) => ({
    background: 'linear-gradient(145deg, rgba(30,41,59,0.7), rgba(15,23,42,0.85))',
    borderRadius: '16px', padding: '1.25rem 1.35rem',
    border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden',
    display: 'flex', flexDirection: 'column', gap: '0.3rem',
  }),
  statGlow: (color) => ({
    position: 'absolute', top: '-30%', right: '-30%', width: '120%', height: '120%',
    background: `radial-gradient(circle at 80% 20%, ${color} 0%, transparent 50%)`,
    pointerEvents: 'none', opacity: 0.12,
  }),
  statIcon: (bg) => ({
    width: '40px', height: '40px', borderRadius: '10px', background: bg,
    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.4rem',
    position: 'relative', zIndex: 1,
  }),
  statValue: { color: '#ffffff', fontSize: '1.65rem', fontWeight: '700', position: 'relative', zIndex: 1 },
  statLabel: { color: 'rgba(148,163,184,0.7)', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.4px', position: 'relative', zIndex: 1 },
  // Card base
  card: {
    background: 'linear-gradient(145deg, rgba(30,41,59,0.7), rgba(15,23,42,0.85))',
    borderRadius: '18px', padding: '1.5rem', marginBottom: '1.25rem',
    border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden',
  },
  cardGlow: {
    position: 'absolute', top: '-50%', right: '-50%', width: '200%', height: '200%',
    background: 'radial-gradient(circle at 70% 30%, rgba(139,92,246,0.04), transparent 40%)',
    pointerEvents: 'none',
  },
  // Form
  formTitle: {
    color: '#ffffff', fontSize: '1.05rem', fontWeight: '600',
    display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem',
    paddingBottom: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.06)',
    position: 'relative', zIndex: 1,
  },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', position: 'relative', zIndex: 1 },
  formGroup: { marginBottom: '1rem', position: 'relative', zIndex: 1 },
  label: {
    display: 'block', fontSize: '12px', fontWeight: '600',
    color: 'rgba(148,163,184,0.9)', marginBottom: '0.4rem',
    textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  required: { color: '#f87171', marginLeft: '2px' },
  input: {
    width: '100%', padding: '0.7rem 0.9rem', fontSize: '14px', borderRadius: '10px',
    border: '1px solid rgba(59,130,246,0.2)', background: 'rgba(15,23,42,0.6)',
    color: '#e2e8f0', outline: 'none', transition: 'all 0.2s ease', fontFamily: 'inherit',
  },
  select: {
    width: '100%', padding: '0.7rem 0.9rem', fontSize: '14px', borderRadius: '10px',
    border: '1px solid rgba(59,130,246,0.2)', background: 'rgba(15,23,42,0.6)',
    color: '#e2e8f0', outline: 'none', transition: 'all 0.2s ease', cursor: 'pointer',
  },
  submitBtn: {
    flex: 1, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px',
    color: '#fff', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem',
    boxShadow: '0 4px 16px rgba(59,130,246,0.35)', transition: 'all 0.2s ease',
  },
  cancelBtn: {
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
    padding: '0.75rem 1.5rem', borderRadius: '12px',
    color: '#94a3b8', fontWeight: '500', fontSize: '14px', cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  // Filter bar
  filterBar: {
    display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center',
    position: 'relative', zIndex: 1,
  },
  searchWrap: {
    flex: 1, minWidth: '220px', position: 'relative',
  },
  searchIcon: {
    position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)',
    color: 'rgba(148,163,184,0.5)', pointerEvents: 'none',
  },
  searchInput: {
    width: '100%', padding: '0.7rem 0.9rem 0.7rem 2.5rem', fontSize: '14px',
    borderRadius: '10px', border: '1px solid rgba(59,130,246,0.2)',
    background: 'rgba(15,23,42,0.6)', color: '#e2e8f0', outline: 'none',
    transition: 'all 0.2s ease',
  },
  filterSelect: {
    padding: '0.7rem 0.9rem', fontSize: '13px', borderRadius: '10px',
    border: '1px solid rgba(59,130,246,0.2)', background: 'rgba(15,23,42,0.6)',
    color: '#e2e8f0', outline: 'none', cursor: 'pointer', minWidth: '130px',
  },
  resultCount: {
    fontSize: '12px', color: 'rgba(148,163,184,0.5)', padding: '0.5rem 0',
    marginLeft: 'auto', whiteSpace: 'nowrap',
  },
  // Table
  tableWrap: { overflowX: 'auto', position: 'relative', zIndex: 1 },
  table: {
    width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.35rem',
  },
  th: {
    padding: '0.7rem 0.85rem', fontSize: '11px', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: '0.6px',
    color: 'rgba(148,163,184,0.6)', textAlign: 'left', whiteSpace: 'nowrap',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  td: {
    padding: '0.75rem 0.85rem', fontSize: '13.5px', color: '#cbd5e1',
    borderBottom: '1px solid rgba(255,255,255,0.03)', whiteSpace: 'nowrap',
    transition: 'background 0.15s ease',
  },
  // User row elements
  avatar: (active, gradient) => ({
    width: '36px', height: '36px', borderRadius: '10px',
    background: active ? gradient : 'linear-gradient(135deg, #475569, #64748b)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontSize: '14px', fontWeight: '700', flexShrink: 0,
    boxShadow: active ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
  }),
  userName: { color: '#e2e8f0', fontWeight: '600', fontSize: '13.5px' },
  userSub: { color: 'rgba(148,163,184,0.5)', fontSize: '11.5px' },
  codeBadge: {
    background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
    padding: '3px 10px', borderRadius: '6px', fontSize: '12px',
    fontFamily: "'SF Mono', 'Fira Code', monospace", color: '#a78bfa',
  },
  roleBadge: (cfg) => ({
    display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
    padding: '4px 10px', borderRadius: '8px', fontSize: '11.5px', fontWeight: '600',
    background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
  }),
  statusBadge: (active) => ({
    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
    padding: '4px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: '600',
    cursor: 'pointer', transition: 'all 0.2s ease',
    background: active ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
    color: active ? '#4ade80' : '#f87171',
    border: `1px solid ${active ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
  }),
  statusDot: (active) => ({
    width: '6px', height: '6px', borderRadius: '50%',
    background: active ? '#4ade80' : '#f87171',
    boxShadow: active ? '0 0 6px rgba(74,222,128,0.5)' : 'none',
  }),
  metricPill: (color, bg, border) => ({
    display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
    padding: '3px 10px', borderRadius: '8px', fontSize: '12px',
    fontWeight: '600', color, background: bg, border: `1px solid ${border}`,
  }),
  dateText: { color: 'rgba(148,163,184,0.6)', fontSize: '12.5px' },
  // Action buttons
  editBtn: {
    padding: '5px 12px', fontSize: '12px', fontWeight: '500',
    background: 'rgba(99,102,241,0.1)', color: '#818cf8',
    border: '1px solid rgba(99,102,241,0.25)', borderRadius: '8px', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: '0.3rem', transition: 'all 0.15s ease',
  },
  toggleBtn: (active) => ({
    padding: '5px 12px', fontSize: '12px', fontWeight: '500',
    background: active ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
    color: active ? '#f87171' : '#4ade80',
    border: `1px solid ${active ? 'rgba(239,68,68,0.25)' : 'rgba(34,197,94,0.25)'}`,
    borderRadius: '8px', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: '0.3rem', transition: 'all 0.15s ease',
  }),
  // Empty
  empty: {
    textAlign: 'center', padding: '3rem 1rem', position: 'relative', zIndex: 1,
  },
  emptyIcon: {
    width: '64px', height: '64px', borderRadius: '16px', margin: '0 auto 1rem',
    background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  // Loading
  loadingContainer: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', minHeight: '80vh', gap: '1.5rem',
    background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
  },
  spinner: {
    width: '50px', height: '50px',
    border: '3px solid rgba(59,130,246,0.2)', borderTop: '3px solid #3b82f6',
    borderRadius: '50%', animation: 'spin 1s linear infinite',
  },
};

// Focus / blur helpers
const onFocus = (e) => { e.target.style.borderColor = 'rgba(59,130,246,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; };
const onBlur  = (e) => { e.target.style.borderColor = 'rgba(59,130,246,0.2)'; e.target.style.boxShadow = 'none'; };

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    role: 'SALES',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    if (successMsg) { const t = setTimeout(() => setSuccessMsg(null), 3000); return () => clearTimeout(t); }
  }, [successMsg]);

  async function fetchUsers() {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      const result = await response.json();
      if (result.success) setUsers(result.data || []);
      else throw new Error(result.message);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleEdit(user) {
    setEditingUser(user);
    setFormData({ fullName: user.FullName, username: user.Username, password: '', role: user.Role });
    setShowForm(true);
    setError(null);
  }

  function handleCancelForm() {
    setShowForm(false);
    setEditingUser(null);
    setFormData({ fullName: '', username: '', password: '', role: 'SALES' });
    setError(null);
    setShowPassword(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (editingUser) {
        const response = await fetch('/api/users', {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: editingUser.UserID, fullName: formData.fullName, username: formData.username, role: formData.role }),
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        setSuccessMsg('User updated successfully!');
      } else {
        const response = await fetch('/api/users', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        setSuccessMsg('User created successfully!');
      }
      handleCancelForm();
      fetchUsers();
    } catch (err) { setError(err.message); }
    finally { setSubmitting(false); }
  }

  async function toggleUserStatus(user) {
    try {
      setError(null);
      const response = await fetch('/api/users', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.UserID, isActive: !user.IsActive }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      setSuccessMsg(`User ${user.IsActive ? 'deactivated' : 'activated'} successfully!`);
      fetchUsers();
    } catch (err) { setError(err.message); }
  }

  // Filters
  const filteredUsers = users.filter(user => {
    const matchSearch = user.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.Username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole   = filterRole === 'ALL' || user.Role === filterRole;
    const matchStatus = filterStatus === 'ALL' ||
                        (filterStatus === 'ACTIVE' && user.IsActive) ||
                        (filterStatus === 'INACTIVE' && !user.IsActive);
    return matchSearch && matchRole && matchStatus;
  });

  // Stats
  const activeUsers = users.filter(u => u.IsActive).length;
  const adminCount  = users.filter(u => u.Role === 'ADMIN').length;
  const totalSales  = users.reduce((s, u) => s + parseInt(u.TotalSales || 0), 0);

  if (loading) {
    return (
      <div style={st.loadingContainer}>
        <div style={st.spinner}></div>
        <span style={{ color: 'rgba(148,163,184,0.8)', fontSize: '15px', fontWeight: '500' }}>Loading users...</span>
      </div>
    );
  }

  return (
    <div style={st.page}>
      {/* ─── Header ─── */}
      <div style={st.header}>
        <div style={st.headerGlow}></div>
        <div style={st.headerLeft}>
          <h1 style={st.headerTitle}>
            <span style={st.titleIcon}><HiOutlineUserGroup size={22} /></span>
            User Management
          </h1>
          <p style={st.headerSub}>Manage system users, roles & permissions</p>
        </div>
        <button
          onClick={() => showForm ? handleCancelForm() : setShowForm(true)}
          style={showForm ? st.cancelHeaderBtn : st.addBtn}
        >
          {showForm
            ? <><HiOutlineXMark size={16} /> Cancel</>
            : <><HiOutlinePlusCircle size={16} /> Add User</>
          }
        </button>
      </div>

      {/* ─── Alerts ─── */}
      {successMsg && (
        <div style={st.successAlert}>
          <HiOutlineCheckCircle size={18} /> {successMsg}
        </div>
      )}
      {error && (
        <div style={st.errorAlert}>
          <HiOutlineExclamationTriangle size={18} /> {error}
        </div>
      )}

      {/* ─── Add / Edit Form ─── */}
      {showForm && (
        <div style={st.card}>
          <div style={st.cardGlow}></div>
          <div style={st.formTitle}>
            <span style={{
              width: '34px', height: '34px', borderRadius: '9px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              background: editingUser ? 'rgba(245,158,11,0.15)' : 'rgba(59,130,246,0.15)',
            }}>
              {editingUser
                ? <HiOutlinePencil size={18} style={{ color: '#fbbf24' }} />
                : <HiOutlinePlusCircle size={18} style={{ color: '#60a5fa' }} />
              }
            </span>
            {editingUser ? `Edit User: ${editingUser.FullName}` : 'Create New User'}
          </div>
          <form onSubmit={handleSubmit}>
            <div style={st.formRow}>
              <div style={st.formGroup}>
                <label style={st.label}>Full Name <span style={st.required}>*</span></label>
                <input
                  type="text" name="fullName" placeholder="Enter full name"
                  value={formData.fullName} onChange={handleChange}
                  onFocus={onFocus} onBlur={onBlur}
                  style={st.input} required
                />
              </div>
              <div style={st.formGroup}>
                <label style={st.label}>Username <span style={st.required}>*</span></label>
                <input
                  type="text" name="username" placeholder="Enter username"
                  value={formData.username} onChange={handleChange}
                  onFocus={onFocus} onBlur={onBlur}
                  style={st.input} required
                />
              </div>
            </div>
            <div style={st.formRow}>
              {!editingUser && (
                <div style={st.formGroup}>
                  <label style={st.label}>Password <span style={st.required}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'} name="password"
                      placeholder="Enter password"
                      value={formData.password} onChange={handleChange}
                      onFocus={onFocus} onBlur={onBlur}
                      style={{ ...st.input, paddingRight: '2.5rem' }} required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute', right: '0.7rem', top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', color: 'rgba(148,163,184,0.6)',
                        cursor: 'pointer', padding: '2px', display: 'flex',
                      }}
                    >
                      {showPassword ? <HiOutlineEyeSlash size={16} /> : <HiOutlineEye size={16} />}
                    </button>
                  </div>
                </div>
              )}
              <div style={st.formGroup}>
                <label style={st.label}>Role <span style={st.required}>*</span></label>
                <select name="role" value={formData.role} onChange={handleChange}
                  onFocus={onFocus} onBlur={onBlur} style={st.select}
                >
                  {ROLES.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                {/* Role preview */}
                <div style={{
                  display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap',
                }}>
                  {ROLES.map(r => {
                    const cfg = roleConfig[r];
                    const Icon = cfg.icon;
                    const isSelected = formData.role === r;
                    return (
                      <button type="button" key={r} onClick={() => setFormData(prev => ({ ...prev, role: r }))}
                        style={{
                          padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '600',
                          display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer',
                          background: isSelected ? cfg.bg : 'rgba(255,255,255,0.03)',
                          color: isSelected ? cfg.color : 'rgba(148,163,184,0.5)',
                          border: `1px solid ${isSelected ? cfg.border : 'rgba(255,255,255,0.06)'}`,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <Icon size={12} /> {r}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', position: 'relative', zIndex: 1 }}>
              <button type="submit" disabled={submitting} style={{
                ...st.submitBtn, opacity: submitting ? 0.7 : 1,
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}>
                {submitting
                  ? (editingUser ? 'Updating...' : 'Creating...')
                  : editingUser
                    ? <><HiOutlineCheck size={16} /> Update User</>
                    : <><HiOutlinePlusCircle size={16} /> Create User</>
                }
              </button>
              <button type="button" onClick={handleCancelForm} style={st.cancelBtn}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* ─── Stats Cards ─── */}
      <div style={st.statsGrid}>
        {[
          { label: 'Total Users', value: users.length, icon: HiOutlineUserGroup, color: '#60a5fa', bg: 'rgba(59,130,246,0.15)' },
          { label: 'Active', value: activeUsers, icon: HiOutlineCheckCircle, color: '#4ade80', bg: 'rgba(34,197,94,0.15)' },
          { label: 'Admins', value: adminCount, icon: HiOutlineShieldCheck, color: '#fbbf24', bg: 'rgba(245,158,11,0.15)' },
          { label: 'Total Sales', value: totalSales, icon: HiOutlineBriefcase, color: '#c084fc', bg: 'rgba(139,92,246,0.15)' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} style={st.statCard(s.color, s.color)}>
              <div style={st.statGlow(s.color)}></div>
              <div style={st.statIcon(s.bg)}>
                <Icon size={20} style={{ color: s.color }} />
              </div>
              <span style={st.statValue}>{s.value}</span>
              <span style={st.statLabel}>{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* ─── Filters ─── */}
      <div style={st.card}>
        <div style={st.cardGlow}></div>
        <div style={st.filterBar}>
          <div style={st.searchWrap}>
            <HiOutlineMagnifyingGlass size={16} style={st.searchIcon} />
            <input
              type="text" placeholder="Search by name or username..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              onFocus={onFocus} onBlur={onBlur}
              style={st.searchInput}
            />
          </div>
          <select value={filterRole} onChange={e => setFilterRole(e.target.value)}
            onFocus={onFocus} onBlur={onBlur} style={st.filterSelect}
          >
            <option value="ALL">All Roles</option>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            onFocus={onFocus} onBlur={onBlur} style={st.filterSelect}
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <span style={st.resultCount}>
            Showing {filteredUsers.length} of {users.length} users
          </span>
        </div>
      </div>

      {/* ─── Users Table ─── */}
      <div style={st.card}>
        <div style={st.cardGlow}></div>
        {filteredUsers.length > 0 ? (
          <div style={st.tableWrap}>
            <table style={st.table}>
              <thead>
                <tr>
                  {['User', 'Username', 'Role', 'Status', 'Sales', 'Purchases', 'Joined', 'Actions'].map(h => (
                    <th key={h} style={st.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => {
                  const cfg = roleConfig[user.Role] || roleConfig.SALES;
                  const Icon = cfg.icon;
                  return (
                    <tr key={user.UserID}
                      style={{ opacity: user.IsActive ? 1 : 0.55 }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.04)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      {/* User */}
                      <td style={st.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <div style={st.avatar(user.IsActive, cfg.gradient)}>
                            {user.FullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={st.userName}>{user.FullName}</div>
                            <div style={st.userSub}>ID #{user.UserID}</div>
                          </div>
                        </div>
                      </td>
                      {/* Username */}
                      <td style={st.td}>
                        <span style={st.codeBadge}>@{user.Username}</span>
                      </td>
                      {/* Role */}
                      <td style={st.td}>
                        <span style={st.roleBadge(cfg)}>
                          <Icon size={13} /> {user.Role}
                        </span>
                      </td>
                      {/* Status */}
                      <td style={st.td}>
                        <span
                          style={st.statusBadge(user.IsActive)}
                          onClick={() => toggleUserStatus(user)}
                          title={`Click to ${user.IsActive ? 'deactivate' : 'activate'}`}
                        >
                          <span style={st.statusDot(user.IsActive)}></span>
                          {user.IsActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      {/* Sales */}
                      <td style={st.td}>
                        <span style={st.metricPill('#60a5fa', 'rgba(59,130,246,0.1)', 'rgba(59,130,246,0.2)')}>
                          {user.TotalSales || 0}
                        </span>
                      </td>
                      {/* Purchases */}
                      <td style={st.td}>
                        <span style={st.metricPill('#fbbf24', 'rgba(245,158,11,0.1)', 'rgba(245,158,11,0.2)')}>
                          {user.TotalPurchases || 0}
                        </span>
                      </td>
                      {/* Joined */}
                      <td style={st.td}>
                        <span style={st.dateText}>
                          {user.CreatedAt
                            ? new Date(user.CreatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                            : '—'}
                        </span>
                      </td>
                      {/* Actions */}
                      <td style={st.td}>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button onClick={() => handleEdit(user)} title="Edit" style={st.editBtn}>
                            <HiOutlinePencil size={13} /> Edit
                          </button>
                          <button
                            onClick={() => toggleUserStatus(user)}
                            title={user.IsActive ? 'Deactivate' : 'Activate'}
                            style={st.toggleBtn(user.IsActive)}
                          >
                            {user.IsActive
                              ? <><HiOutlineNoSymbol size={13} /> Deactivate</>
                              : <><HiOutlineCheckCircle size={13} /> Activate</>
                            }
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={st.empty}>
            <div style={st.emptyIcon}>
              <HiOutlineUser size={28} style={{ color: '#60a5fa' }} />
            </div>
            <h3 style={{ color: '#e2e8f0', fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.4rem' }}>No users found</h3>
            <p style={{ color: 'rgba(148,163,184,0.6)', fontSize: '14px' }}>
              {searchTerm || filterRole !== 'ALL' || filterStatus !== 'ALL'
                ? 'Try adjusting your search or filters'
                : 'Add your first user to get started'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
