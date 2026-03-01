'use client';

/**
 * Suppliers Page
 * ==============
 *
 * Manage suppliers — view all suppliers and add new ones.
 * Shows which categories each supplier provides.
 * Professional Dark Theme
 */

import React, { useState, useEffect } from 'react';
import {
  HiOutlineBuildingStorefront, HiOutlineXMark, HiOutlinePlusCircle,
  HiOutlineExclamationTriangle, HiOutlineEnvelope, HiOutlinePhone,
  HiOutlinePencil, HiOutlineCube, HiOutlineCheck, HiOutlineArrowPath,
  HiOutlineMagnifyingGlass, HiOutlineChevronDown, HiOutlineChevronRight,
  HiOutlineMapPin, HiOutlineBanknotes, HiOutlineTag,
} from 'react-icons/hi2';

/* ───────── inline dark styles ───────── */
const s = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    padding: '1.5rem 2rem 2rem',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '1.5rem', padding: '1.5rem 1.75rem',
    background: 'linear-gradient(145deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9))',
    borderRadius: '20px', border: '1px solid rgba(59,130,246,0.15)',
    backdropFilter: 'blur(20px)', position: 'relative', overflow: 'hidden',
  },
  headerGlow: {
    position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
    background: 'radial-gradient(circle at 30% 30%, rgba(59,130,246,0.08), transparent 40%)',
    pointerEvents: 'none',
  },
  headerLeft: { position: 'relative', zIndex: 1 },
  headerTitle: {
    fontSize: '1.75rem', fontWeight: '700', color: '#fff',
    letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '0.75rem',
  },
  titleIcon: {
    width: '42px', height: '42px',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(59,130,246,0.4)', color: '#fff',
  },
  headerSub: { color: 'rgba(148,163,184,0.8)', fontSize: '0.9rem', marginTop: '0.35rem' },
  headerActions: { display: 'flex', gap: '0.75rem', position: 'relative', zIndex: 1 },
  refreshBtn: {
    background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)',
    padding: '0.7rem 1.25rem', borderRadius: '12px',
    color: '#60a5fa', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s ease',
  },
  addBtn: {
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    border: 'none', padding: '0.7rem 1.35rem', borderRadius: '12px',
    color: '#fff', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    boxShadow: '0 4px 16px rgba(59,130,246,0.35)', transition: 'all 0.2s ease',
  },
  cancelBtn: {
    background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.25)',
    padding: '0.7rem 1.25rem', borderRadius: '12px',
    color: '#f87171', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s ease',
  },
  /* stat cards */
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.25rem' },
  statCard: {
    background: 'linear-gradient(145deg, rgba(30,41,59,0.7), rgba(15,23,42,0.85))',
    borderRadius: '16px', padding: '1.25rem 1.35rem',
    border: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden',
  },
  statGlow: {
    position: 'absolute', top: '-30%', right: '-30%', width: '110px', height: '110px',
    borderRadius: '50%', pointerEvents: 'none', filter: 'blur(30px)', opacity: 0.5,
  },
  statIconWrap: {
    width: '38px', height: '38px', borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.65rem',
  },
  statValue: { fontSize: '1.5rem', fontWeight: '700', color: '#fff', marginBottom: '0.15rem' },
  statLabel: { fontSize: '0.78rem', color: 'rgba(148,163,184,0.7)', fontWeight: '500' },
  /* search bar */
  searchWrap: {
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    marginBottom: '1.25rem', padding: '0.85rem 1.25rem',
    background: 'linear-gradient(145deg, rgba(30,41,59,0.6), rgba(15,23,42,0.75))',
    borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)',
  },
  searchIcon: { color: 'rgba(148,163,184,0.5)' },
  searchInput: {
    flex: 1, background: 'transparent', border: 'none', outline: 'none',
    color: '#e2e8f0', fontSize: '0.95rem',
  },
  searchCount: { color: 'rgba(148,163,184,0.5)', fontSize: '0.8rem', whiteSpace: 'nowrap' },
  /* form card */
  formCard: {
    marginBottom: '1.25rem', padding: '1.5rem 1.75rem',
    background: 'linear-gradient(145deg, rgba(30,41,59,0.75), rgba(15,23,42,0.9))',
    borderRadius: '18px', border: '1px solid rgba(59,130,246,0.15)',
    backdropFilter: 'blur(20px)',
  },
  formTitle: { fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  formGroup: { marginBottom: '0.25rem' },
  formLabel: { display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'rgba(148,163,184,0.85)', marginBottom: '0.35rem' },
  formInput: {
    width: '100%', padding: '0.7rem 1rem',
    background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px', color: '#e2e8f0', fontSize: '0.92rem', outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  catSelectWrap: {
    display: 'flex', flexWrap: 'wrap', gap: '8px',
    padding: '14px', borderRadius: '12px',
    background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.06)',
  },
  submitBtn: {
    marginTop: '1rem',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    border: 'none', padding: '0.7rem 1.75rem', borderRadius: '12px',
    color: '#fff', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(59,130,246,0.35)',
  },
  /* table card */
  tableCard: {
    background: 'linear-gradient(145deg, rgba(30,41,59,0.6), rgba(15,23,42,0.75))',
    borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)',
    overflow: 'hidden', backdropFilter: 'blur(16px)',
  },
  table: { width: '100%', borderCollapse: 'separate', borderSpacing: 0 },
  th: {
    padding: '0.85rem 1rem', textAlign: 'left',
    fontSize: '0.75rem', fontWeight: '600', color: 'rgba(148,163,184,0.7)',
    textTransform: 'uppercase', letterSpacing: '0.05em',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(15,23,42,0.5)',
  },
  td: {
    padding: '0.85rem 1rem', fontSize: '0.88rem', color: '#cbd5e1',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  rowHover: { cursor: 'pointer', transition: 'background 0.2s ease' },
  /* badges */
  badge: { padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' },
  badgeBlue: { background: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
  badgeGreen: { background: 'rgba(16,185,129,0.15)', color: '#34d399' },
  badgePurple: { background: 'rgba(139,92,246,0.15)', color: '#a78bfa' },
  badgeGray: { background: 'rgba(148,163,184,0.15)', color: '#94a3b8' },
  catChip: {
    padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '600',
    background: 'rgba(59,130,246,0.12)', color: '#60a5fa',
    border: '1px solid rgba(59,130,246,0.2)',
  },
  /* expanded row */
  expandedWrap: {
    padding: '1.25rem 1.5rem 1.25rem 3.5rem',
    background: 'rgba(15,23,42,0.65)',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  expandedTitle: {
    fontSize: '0.95rem', fontWeight: '600', color: '#e2e8f0',
    marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
  },
  expandedSub: { fontSize: '0.82rem', color: 'rgba(148,163,184,0.6)', marginBottom: '0.85rem' },
  catToggle: (active) => ({
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '8px 16px', borderRadius: '24px', cursor: 'pointer',
    fontSize: '0.82rem', fontWeight: '500', transition: 'all 0.2s ease',
    border: active ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(255,255,255,0.08)',
    background: active ? 'rgba(59,130,246,0.2)' : 'rgba(30,41,59,0.5)',
    color: active ? '#60a5fa' : '#94a3b8',
  }),
  actionRow: { display: 'flex', gap: '0.5rem', marginTop: '1rem' },
  saveBtn: {
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    border: 'none', padding: '0.55rem 1.25rem', borderRadius: '10px',
    color: '#fff', fontWeight: '600', fontSize: '13px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '0.4rem',
    boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
  },
  cancelSmBtn: {
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
    padding: '0.55rem 1.25rem', borderRadius: '10px',
    color: '#94a3b8', fontWeight: '600', fontSize: '13px', cursor: 'pointer',
  },
  editCatBtn: {
    background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)',
    padding: '0.5rem 1rem', borderRadius: '10px',
    color: '#60a5fa', fontWeight: '600', fontSize: '13px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.85rem',
  },
  /* empty state */
  emptyState: { padding: '4rem 2rem', textAlign: 'center' },
  emptyIcon: {
    width: '64px', height: '64px', margin: '0 auto 1rem',
    background: 'rgba(59,130,246,0.1)', borderRadius: '16px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa',
  },
  emptyTitle: { color: '#e2e8f0', fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.35rem' },
  emptySub: { color: 'rgba(148,163,184,0.6)', fontSize: '0.88rem' },
  /* error */
  errorBar: {
    display: 'flex', alignItems: 'center', gap: '0.6rem',
    padding: '0.85rem 1.25rem', marginBottom: '1rem',
    background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
    borderRadius: '12px', color: '#f87171', fontSize: '0.88rem',
  },
  /* loading */
  loadingWrap: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    gap: '1rem', color: '#60a5fa',
  },
  spinner: {
    width: '40px', height: '40px', border: '3px solid rgba(59,130,246,0.2)',
    borderTopColor: '#3b82f6', borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};

const statThemes = [
  { bg: 'rgba(59,130,246,0.15)', glow: 'rgba(59,130,246,0.35)', color: '#60a5fa' },
  { bg: 'rgba(16,185,129,0.15)', glow: 'rgba(16,185,129,0.35)', color: '#34d399' },
  { bg: 'rgba(139,92,246,0.15)', glow: 'rgba(139,92,246,0.35)', color: '#a78bfa' },
  { bg: 'rgba(245,158,11,0.15)', glow: 'rgba(245,158,11,0.35)', color: '#fbbf24' },
];

/* ───────── component ───────── */
export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expandedSupplier, setExpandedSupplier] = useState(null);
  const [editingCategories, setEditingCategories] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [newSupplier, setNewSupplier] = useState({
    supplierName: '', contactPerson: '', email: '',
    phone: '', address: '', city: '', country: '', categoryIds: [],
  });

  useEffect(() => { fetchSuppliers(); fetchCategories(); }, []);

  async function fetchSuppliers() {
    try {
      setLoading(true);
      const response = await fetch('/api/suppliers');
      const result = await response.json();
      if (result.success) setSuppliers(result.data || []);
      else throw new Error(result.message);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }

  async function fetchCategories() {
    try {
      const response = await fetch('/api/categories');
      const result = await response.json();
      if (result.success) setCategories(result.data || []);
    } catch (err) { console.error('Error fetching categories:', err); }
  }

  async function handleSubmit(e) {
    e.preventDefault(); setSubmitting(true); setError(null);
    try {
      const response = await fetch('/api/suppliers', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSupplier),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      setNewSupplier({ supplierName: '', contactPerson: '', email: '', phone: '', address: '', city: '', country: '', categoryIds: [] });
      setShowForm(false); fetchSuppliers();
    } catch (err) { setError(err.message); } finally { setSubmitting(false); }
  }

  async function handleUpdateCategories(supplierId) {
    try {
      setSubmitting(true);
      const response = await fetch('/api/suppliers', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supplierId, categoryIds: selectedCategories }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      setEditingCategories(null); setSelectedCategories([]); fetchSuppliers();
    } catch (err) { setError(err.message); } finally { setSubmitting(false); }
  }

  function startEditingCategories(supplier) {
    setEditingCategories(supplier.SupplierID);
    setSelectedCategories(supplier.categories?.map(c => c.CategoryID) || []);
    setExpandedSupplier(supplier.SupplierID);
  }

  function toggleCategory(categoryId) {
    setSelectedCategories(prev =>
      prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
    );
  }

  function toggleNewSupplierCategory(categoryId) {
    setNewSupplier(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId) : [...prev.categoryIds, categoryId],
    }));
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
  }

  const filtered = suppliers.filter(sup => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (sup.SupplierName || '').toLowerCase().includes(q)
      || (sup.ContactPerson || '').toLowerCase().includes(q)
      || (sup.Email || '').toLowerCase().includes(q)
      || (sup.City || '').toLowerCase().includes(q)
      || (sup.Country || '').toLowerCase().includes(q);
  });

  const totalProducts = suppliers.reduce((sum, sup) => sum + parseInt(sup.ProductCount || 0), 0);
  const totalValue = suppliers.reduce((sum, sup) => sum + parseFloat(sup.TotalInventoryValue || 0), 0);
  const activeCount = suppliers.filter(sup => sup.IsActive).length;

  if (loading) {
    return (
      <div style={s.loadingWrap}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={s.spinner}></div>
        <span style={{ fontSize: '0.95rem' }}>Loading suppliers...</span>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* ── Header ── */}
      <div style={s.header}>
        <div style={s.headerGlow} />
        <div style={s.headerLeft}>
          <h1 style={s.headerTitle}>
            <span style={s.titleIcon}><HiOutlineBuildingStorefront size={22} /></span>
            Suppliers
          </h1>
          <p style={s.headerSub}>Manage your product suppliers &amp; categories</p>
        </div>
        <div style={s.headerActions}>
          <button style={s.refreshBtn} onClick={() => fetchSuppliers()} title="Refresh">
            <HiOutlineArrowPath size={16} /> Refresh
          </button>
          {showForm ? (
            <button style={s.cancelBtn} onClick={() => setShowForm(false)}>
              <HiOutlineXMark size={16} /> Cancel
            </button>
          ) : (
            <button style={s.addBtn} onClick={() => setShowForm(true)}>
              <HiOutlinePlusCircle size={16} /> Add Supplier
            </button>
          )}
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={s.errorBar}>
          <HiOutlineExclamationTriangle size={16} /> {error}
        </div>
      )}

      {/* ── Add Supplier Form ── */}
      {showForm && (
        <div style={s.formCard}>
          <h3 style={s.formTitle}><HiOutlinePlusCircle size={18} /> Add New Supplier</h3>
          <form onSubmit={handleSubmit}>
            <div style={s.formGrid}>
              {[
                { label: 'Supplier Name *', key: 'supplierName', type: 'text', required: true },
                { label: 'Contact Person', key: 'contactPerson', type: 'text' },
                { label: 'Email', key: 'email', type: 'email' },
                { label: 'Phone', key: 'phone', type: 'text' },
                { label: 'City', key: 'city', type: 'text' },
                { label: 'Country', key: 'country', type: 'text' },
              ].map(f => (
                <div key={f.key} style={s.formGroup}>
                  <label style={s.formLabel}>{f.label}</label>
                  <input
                    type={f.type} required={f.required}
                    value={newSupplier[f.key]}
                    onChange={e => setNewSupplier({ ...newSupplier, [f.key]: e.target.value })}
                    style={s.formInput}
                    onFocus={e => (e.target.style.borderColor = 'rgba(59,130,246,0.5)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                    placeholder={f.label.replace(' *', '')}
                  />
                </div>
              ))}
            </div>
            {/* Address - full width */}
            <div style={{ ...s.formGroup, marginTop: '0.75rem' }}>
              <label style={s.formLabel}>Address</label>
              <input
                type="text" value={newSupplier.address}
                onChange={e => setNewSupplier({ ...newSupplier, address: e.target.value })}
                style={s.formInput}
                onFocus={e => (e.target.style.borderColor = 'rgba(59,130,246,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                placeholder="Address"
              />
            </div>
            {/* Category Selection */}
            <div style={{ ...s.formGroup, marginTop: '0.75rem' }}>
              <label style={s.formLabel}>Categories Supplied</label>
              <div style={s.catSelectWrap}>
                {categories.map(cat => {
                  const active = newSupplier.categoryIds.includes(cat.CategoryID);
                  return (
                    <span key={cat.CategoryID} style={s.catToggle(active)} onClick={() => toggleNewSupplierCategory(cat.CategoryID)}>
                      {active && <HiOutlineCheck size={14} />} {cat.CategoryName}
                    </span>
                  );
                })}
                {categories.length === 0 && <span style={{ color: 'rgba(148,163,184,0.5)', fontSize: '0.82rem' }}>No categories available</span>}
              </div>
            </div>
            <button type="submit" style={{ ...s.submitBtn, opacity: submitting ? 0.6 : 1 }} disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Supplier'}
            </button>
          </form>
        </div>
      )}

      {/* ── Stats ── */}
      <div style={s.statsGrid}>
        {[
          { icon: <HiOutlineBuildingStorefront size={20} />, value: suppliers.length, label: 'Total Suppliers', theme: 0 },
          { icon: <HiOutlineCheck size={20} />, value: activeCount, label: 'Active Suppliers', theme: 1 },
          { icon: <HiOutlineCube size={20} />, value: totalProducts, label: 'Total Products', theme: 2 },
          { icon: <HiOutlineBanknotes size={20} />, value: formatCurrency(totalValue), label: 'Inventory Value', theme: 3 },
        ].map((st, i) => (
          <div key={i} style={s.statCard}>
            <div style={{ ...s.statGlow, background: statThemes[st.theme].glow }} />
            <div style={{ ...s.statIconWrap, background: statThemes[st.theme].bg }}>
              <span style={{ color: statThemes[st.theme].color }}>{st.icon}</span>
            </div>
            <div style={s.statValue}>{st.value}</div>
            <div style={s.statLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* ── Search ── */}
      <div style={s.searchWrap}>
        <HiOutlineMagnifyingGlass size={18} style={s.searchIcon} />
        <input
          style={s.searchInput} placeholder="Search suppliers by name, contact, email, city..."
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <span style={s.searchCount}>{filtered.length} of {suppliers.length}</span>
      </div>

      {/* ── Suppliers Table ── */}
      <div style={s.tableCard}>
        {filtered.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={s.table}>
              <thead>
                <tr>
                  {['', 'Supplier', 'Contact', 'Categories', 'Location', 'Products', 'Inv. Value', 'Status', 'Actions'].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(sup => {
                  const isExp = expandedSupplier === sup.SupplierID;
                  return (
                    <React.Fragment key={sup.SupplierID}>
                      <tr
                        style={{
                          ...s.rowHover,
                          background: isExp ? 'rgba(59,130,246,0.06)' : 'transparent',
                        }}
                        onClick={() => setExpandedSupplier(isExp ? null : sup.SupplierID)}
                        onMouseEnter={e => { if (!isExp) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                        onMouseLeave={e => { if (!isExp) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <td style={{ ...s.td, width: '40px', color: '#60a5fa' }}>
                          {isExp ? <HiOutlineChevronDown size={14} /> : <HiOutlineChevronRight size={14} />}
                        </td>
                        <td style={s.td}>
                          <span style={{ color: '#fff', fontWeight: '600' }}>{sup.SupplierName}</span>
                          {sup.ContactPerson && (
                            <div style={{ fontSize: '0.78rem', color: 'rgba(148,163,184,0.6)', marginTop: '2px' }}>
                              {sup.ContactPerson}
                            </div>
                          )}
                        </td>
                        <td style={s.td}>
                          {sup.Email && (
                            <div style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <HiOutlineEnvelope size={13} style={{ color: 'rgba(148,163,184,0.5)' }} /> {sup.Email}
                            </div>
                          )}
                          {sup.Phone && (
                            <div style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                              <HiOutlinePhone size={13} style={{ color: 'rgba(148,163,184,0.5)' }} /> {sup.Phone}
                            </div>
                          )}
                          {!sup.Email && !sup.Phone && <span style={{ color: 'rgba(148,163,184,0.4)' }}>—</span>}
                        </td>
                        <td style={s.td}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {sup.categories && sup.categories.length > 0 ? (
                              sup.categories.map(cat => (
                                <span key={cat.CategoryID} style={s.catChip}>{cat.CategoryName}</span>
                              ))
                            ) : (
                              <span style={{ fontSize: '0.78rem', color: 'rgba(148,163,184,0.4)' }}>None</span>
                            )}
                          </div>
                        </td>
                        <td style={s.td}>
                          {sup.City || sup.Country ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <HiOutlineMapPin size={13} style={{ color: 'rgba(148,163,184,0.5)' }} />
                              {[sup.City, sup.Country].filter(Boolean).join(', ')}
                            </span>
                          ) : <span style={{ color: 'rgba(148,163,184,0.4)' }}>—</span>}
                        </td>
                        <td style={s.td}>
                          <span style={{ ...s.badge, ...s.badgePurple }}>{sup.ProductCount}</span>
                        </td>
                        <td style={s.td}>
                          <span style={{ color: '#34d399', fontWeight: '600' }}>
                            {formatCurrency(sup.TotalInventoryValue)}
                          </span>
                        </td>
                        <td style={s.td}>
                          <span style={{ ...s.badge, ...(sup.IsActive ? s.badgeGreen : s.badgeGray) }}>
                            {sup.IsActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td style={s.td} onClick={e => e.stopPropagation()}>
                          <button
                            style={s.editCatBtn}
                            onClick={() => startEditingCategories(sup)}
                          >
                            <HiOutlinePencil size={13} /> Categories
                          </button>
                        </td>
                      </tr>

                      {/* ── Expanded Category Editor ── */}
                      {isExp && (
                        <tr>
                          <td colSpan="9" style={{ padding: 0 }}>
                            <div style={s.expandedWrap}>
                              <div style={s.expandedTitle}>
                                <HiOutlineTag size={16} style={{ color: '#60a5fa' }} />
                                Categories for {sup.SupplierName}
                              </div>

                              {editingCategories === sup.SupplierID ? (
                                <>
                                  <div style={s.expandedSub}>Select the categories this supplier provides:</div>
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {categories.map(cat => {
                                      const active = selectedCategories.includes(cat.CategoryID);
                                      return (
                                        <span key={cat.CategoryID} style={s.catToggle(active)} onClick={() => toggleCategory(cat.CategoryID)}>
                                          {active && <HiOutlineCheck size={14} />} {cat.CategoryName}
                                        </span>
                                      );
                                    })}
                                  </div>
                                  <div style={s.actionRow}>
                                    <button style={{ ...s.saveBtn, opacity: submitting ? 0.6 : 1 }} onClick={() => handleUpdateCategories(sup.SupplierID)} disabled={submitting}>
                                      {submitting ? 'Saving...' : <><HiOutlineCheck size={14} /> Save</>}
                                    </button>
                                    <button style={s.cancelSmBtn} onClick={() => { setEditingCategories(null); setSelectedCategories([]); }}>
                                      Cancel
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  {sup.categories && sup.categories.length > 0 ? (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                      {sup.categories.map(cat => (
                                        <span key={cat.CategoryID} style={{ ...s.catChip, padding: '6px 14px', fontSize: '0.82rem' }}>
                                          {cat.CategoryName}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <div style={{ color: 'rgba(148,163,184,0.5)', fontSize: '0.85rem' }}>
                                      No categories assigned. Click "Edit Categories" to add some.
                                    </div>
                                  )}
                                  <button style={s.editCatBtn} onClick={() => startEditingCategories(sup)}>
                                    <HiOutlinePencil size={13} /> Edit Categories
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={s.emptyState}>
            <div style={s.emptyIcon}><HiOutlineBuildingStorefront size={28} /></div>
            <div style={s.emptyTitle}>{search ? 'No matching suppliers' : 'No suppliers yet'}</div>
            <div style={s.emptySub}>{search ? 'Try adjusting your search query' : 'Add your first supplier to start managing inventory'}</div>
          </div>
        )}
      </div>
    </div>
  );
}
