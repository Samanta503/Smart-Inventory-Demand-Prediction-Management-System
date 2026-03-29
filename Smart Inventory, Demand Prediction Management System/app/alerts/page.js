'use client';

/**
 * Alerts Page
 * ===========
 *
 * Displays all inventory alerts (low stock, out of stock)
 * with the ability to filter and resolve alerts.
 *
 * Professional Dark Theme - Matching Dashboard & Products
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  HiOutlineExclamationTriangle,
  HiOutlineBell,
  HiOutlineArrowPath,
  HiOutlineExclamationCircle,
  HiOutlineXCircle,
  HiOutlineArrowTrendingDown,
  HiOutlineCheckCircle,
  HiOutlineSparkles,
  HiOutlineNoSymbol,
  HiOutlineInboxArrowDown,
  HiOutlineCube,
  HiOutlineBuildingOffice,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineCalendarDays,
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
  HiOutlineArchiveBox,
  HiOutlineBanknotes,
} from 'react-icons/hi2';

// ─── Professional Dark Theme Styles ──────────────────────────────
const s = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    padding: '1.5rem 2rem 2rem',
  },
  // Header
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '1.5rem', padding: '1.5rem 1.75rem',
    background: 'linear-gradient(145deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9))',
    borderRadius: '20px', border: '1px solid rgba(239,68,68,0.15)',
    backdropFilter: 'blur(20px)', position: 'relative', overflow: 'hidden',
  },
  headerGlow: {
    position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
    background: 'radial-gradient(circle at 30% 30%, rgba(239,68,68,0.06), transparent 40%)',
    pointerEvents: 'none',
  },
  headerLeft: { position: 'relative', zIndex: 1 },
  headerTitle: {
    fontSize: '1.75rem', fontWeight: '700', color: '#fff',
    letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '0.75rem',
  },
  titleIcon: {
    width: '42px', height: '42px',
    background: 'linear-gradient(135deg, #ef4444, #f97316)',
    borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(239,68,68,0.4)', color: '#fff',
  },
  headerSub: { color: 'rgba(148,163,184,0.8)', fontSize: '0.9rem', marginTop: '0.35rem' },
  refreshBtn: {
    background: 'rgba(59,130,246,0.15)',
    border: '1px solid rgba(59,130,246,0.25)',
    padding: '0.7rem 1.25rem', borderRadius: '12px',
    color: '#60a5fa', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    transition: 'all 0.2s ease', position: 'relative', zIndex: 1,
  },
  // Stats
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem', marginBottom: '1.25rem',
  },
  statCard: {
    background: 'linear-gradient(145deg, rgba(30,41,59,0.7), rgba(15,23,42,0.85))',
    borderRadius: '16px', padding: '1.25rem 1.35rem',
    border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden',
  },
  statGlow: (color) => ({
    position: 'absolute', top: '-30%', right: '-30%', width: '120%', height: '120%',
    background: `radial-gradient(circle at 80% 20%, ${color}, transparent 50%)`,
    pointerEvents: 'none', opacity: 0.12,
  }),
  statIconWrap: (bg) => ({
    width: '40px', height: '40px', borderRadius: '10px', background: bg,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '0.5rem', position: 'relative', zIndex: 1,
  }),
  statValue: {
    color: '#fff', fontSize: '1.65rem', fontWeight: '700',
    position: 'relative', zIndex: 1, display: 'block',
  },
  statLabel: {
    color: 'rgba(148,163,184,0.7)', fontSize: '12px', fontWeight: '500',
    textTransform: 'uppercase', letterSpacing: '0.4px',
    position: 'relative', zIndex: 1,
  },
  // Card
  card: {
    background: 'linear-gradient(145deg, rgba(30,41,59,0.7), rgba(15,23,42,0.85))',
    borderRadius: '18px', padding: '1.5rem', marginBottom: '1.25rem',
    border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden',
  },
  cardGlow: {
    position: 'absolute', top: '-50%', right: '-50%', width: '200%', height: '200%',
    background: 'radial-gradient(circle at 70% 30%, rgba(239,68,68,0.04), transparent 40%)',
    pointerEvents: 'none',
  },
  // Filter Buttons
  filterWrap: {
    display: 'flex', gap: '0.6rem', position: 'relative', zIndex: 1,
    flexWrap: 'wrap', alignItems: 'center',
  },
  filterLabel: {
    color: 'rgba(148,163,184,0.7)', fontSize: '13px', fontWeight: '500',
    display: 'flex', alignItems: 'center', gap: '0.4rem', marginRight: '0.5rem',
  },
  filterBtnActive: {
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    border: 'none', padding: '0.55rem 1.15rem', borderRadius: '10px',
    color: '#fff', fontWeight: '600', fontSize: '13px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '0.4rem',
    boxShadow: '0 3px 14px rgba(59,130,246,0.3)',
    transition: 'all 0.2s ease',
  },
  filterBtn: {
    background: 'rgba(59,130,246,0.08)',
    border: '1px solid rgba(59,130,246,0.15)', padding: '0.55rem 1.15rem',
    borderRadius: '10px', color: 'rgba(148,163,184,0.7)', fontWeight: '500',
    fontSize: '13px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '0.4rem',
    transition: 'all 0.2s ease',
  },
  filterCount: {
    background: 'rgba(255,255,255,0.12)', padding: '1px 7px',
    borderRadius: '10px', fontSize: '11px', fontWeight: '700',
  },
  // Table
  tableWrap: { overflowX: 'auto', position: 'relative', zIndex: 1 },
  table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.35rem' },
  th: {
    padding: '0.7rem 0.85rem', fontSize: '11px', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: '0.6px',
    color: 'rgba(148,163,184,0.6)', textAlign: 'left', whiteSpace: 'nowrap',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  td: {
    padding: '0.8rem 0.85rem', fontSize: '13.5px', color: '#cbd5e1',
    borderBottom: '1px solid rgba(255,255,255,0.03)', whiteSpace: 'nowrap',
    verticalAlign: 'middle',
  },
  // Urgency badges
  badgeCritical: {
    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
    padding: '4px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: '600',
    background: 'rgba(220,38,38,0.12)', color: '#dc2626',
    border: '1px solid rgba(220,38,38,0.25)',
  },
  badgeHigh: {
    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
    padding: '4px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: '600',
    background: 'rgba(245,158,11,0.12)', color: '#f59e0b',
    border: '1px solid rgba(245,158,11,0.25)',
  },
  badgeMedium: {
    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
    padding: '4px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: '600',
    background: 'rgba(59,130,246,0.12)', color: '#60a5fa',
    border: '1px solid rgba(59,130,246,0.25)',
  },
  statusDot: (color) => ({
    width: '6px', height: '6px', borderRadius: '50%',
    background: color, boxShadow: `0 0 6px ${color}80`,
  }),
  // Alert Type badges
  badgeOutOfStock: {
    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
    padding: '4px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: '600',
    background: 'rgba(220,38,38,0.12)', color: '#dc2626',
    border: '1px solid rgba(220,38,38,0.25)',
  },
  badgeLowStock: {
    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
    padding: '4px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: '600',
    background: 'rgba(245,158,11,0.12)', color: '#f59e0b',
    border: '1px solid rgba(245,158,11,0.25)',
  },
  badgeRestocked: {
    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
    padding: '4px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: '600',
    background: 'rgba(34,197,94,0.12)', color: '#4ade80',
    border: '1px solid rgba(34,197,94,0.25)',
  },
  // Product
  productName: { color: '#e2e8f0', fontWeight: '600', fontSize: '13.5px' },
  productCode: {
    background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)',
    padding: '2px 7px', borderRadius: '4px', fontSize: '10.5px',
    fontFamily: "'SF Mono','Fira Code',monospace", color: '#60a5fa',
    display: 'inline-block', marginTop: '3px',
  },
  // Stock display
  stockDanger: { color: '#dc2626', fontWeight: '700', fontSize: '14px' },
  stockWarning: { color: '#f59e0b', fontWeight: '700', fontSize: '14px' },
  stockGood: { color: '#4ade80', fontWeight: '700', fontSize: '14px' },
  stockSep: { color: 'rgba(148,163,184,0.4)', margin: '0 3px', fontWeight: '400', fontSize: '12px' },
  stockReorder: { color: 'rgba(148,163,184,0.6)', fontSize: '12px', fontWeight: '500' },
  stockUnit: { color: 'rgba(148,163,184,0.5)', fontSize: '12px', fontWeight: '400', marginLeft: '3px' },
  // Suggested order
  orderQty: {
    display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
    padding: '3px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
    background: 'rgba(34,197,94,0.1)', color: '#4ade80',
    border: '1px solid rgba(34,197,94,0.2)',
  },
  // Cost
  costText: { color: '#4ade80', fontWeight: '600', fontSize: '13.5px' },
  // Warehouse pill
  warehousePill: {
    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
    padding: '3px 9px', borderRadius: '7px', fontSize: '11.5px', fontWeight: '500',
    background: 'rgba(6,182,212,0.1)', color: '#22d3ee',
    border: '1px solid rgba(6,182,212,0.2)',
  },
  // Supplier
  supplierName: { color: '#e2e8f0', fontWeight: '500', fontSize: '13px' },
  supplierDetail: {
    color: 'rgba(148,163,184,0.5)', fontSize: '11px',
    display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '2px',
  },
  // Date
  dateText: { color: 'rgba(148,163,184,0.6)', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '0.3rem' },
  // Message
  messageText: { color: 'rgba(148,163,184,0.7)', fontSize: '12.5px', maxWidth: '240px', whiteSpace: 'normal', lineHeight: '1.45' },
  // Resolve button
  resolveBtn: {
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    border: 'none', padding: '5px 14px', borderRadius: '8px',
    color: '#fff', fontWeight: '600', fontSize: '12px', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
    boxShadow: '0 2px 10px rgba(34,197,94,0.3)',
    transition: 'all 0.2s ease',
  },
  resolvedBadge: {
    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
    padding: '4px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: '600',
    background: 'rgba(34,197,94,0.1)', color: '#4ade80',
    border: '1px solid rgba(34,197,94,0.2)',
  },
  // Error
  errorAlert: {
    background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(15,23,42,0.9))',
    borderRadius: '14px', padding: '1rem 1.25rem', marginBottom: '1.25rem',
    display: 'flex', alignItems: 'center', gap: '0.6rem',
    border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: '14px', fontWeight: '500',
  },
  retryBtn: {
    marginLeft: 'auto', padding: '5px 14px', borderRadius: '8px', fontSize: '12px',
    fontWeight: '600', cursor: 'pointer',
    background: 'rgba(239,68,68,0.15)', color: '#f87171',
    border: '1px solid rgba(239,68,68,0.3)',
    display: 'flex', alignItems: 'center', gap: '0.3rem',
  },
  // Empty
  empty: { textAlign: 'center', padding: '3rem 1rem', position: 'relative', zIndex: 1 },
  emptyIconWrap: {
    width: '68px', height: '68px', borderRadius: '18px', margin: '0 auto 1rem',
    background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  emptyTitle: { color: '#e2e8f0', fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.4rem' },
  emptyText: { color: 'rgba(148,163,184,0.6)', fontSize: '14px', marginBottom: '1rem' },
  // Loading
  loadingContainer: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', minHeight: '80vh', gap: '1.5rem',
    background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
  },
  spinner: {
    width: '50px', height: '50px',
    border: '3px solid rgba(239,68,68,0.2)', borderTop: '3px solid #ef4444',
    borderRadius: '50%', animation: 'spin 1s linear infinite',
  },
  // Quick Links
  linksTitle: {
    color: '#fff', fontSize: '1rem', fontWeight: '600',
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    position: 'relative', zIndex: 1, marginBottom: '1rem',
  },
  linksGrid: {
    display: 'flex', gap: '0.75rem', flexWrap: 'wrap',
    position: 'relative', zIndex: 1,
  },
  navBtn: {
    background: 'rgba(59,130,246,0.1)',
    border: '1px solid rgba(59,130,246,0.2)',
    padding: '0.6rem 1.25rem', borderRadius: '10px',
    color: '#60a5fa', fontWeight: '500', fontSize: '13.5px', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    transition: 'all 0.2s ease', textDecoration: 'none',
  },
  navBtnWarning: {
    background: 'rgba(245,158,11,0.1)',
    border: '1px solid rgba(245,158,11,0.2)',
    padding: '0.6rem 1.25rem', borderRadius: '10px',
    color: '#fbbf24', fontWeight: '500', fontSize: '13.5px', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    transition: 'all 0.2s ease', textDecoration: 'none',
  },
  navBtnDanger: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.2)',
    padding: '0.6rem 1.25rem', borderRadius: '10px',
    color: '#f87171', fontWeight: '500', fontSize: '13.5px', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    transition: 'all 0.2s ease', textDecoration: 'none',
  },
  navBtnPrimary: {
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    border: 'none', padding: '0.6rem 1.25rem', borderRadius: '10px',
    color: '#fff', fontWeight: '600', fontSize: '13.5px', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    transition: 'all 0.2s ease', textDecoration: 'none',
    boxShadow: '0 4px 14px rgba(59,130,246,0.3)',
  },
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetchAlerts();
  }, [filter]);

  async function fetchAlerts() {
    try {
      setLoading(true);
      setError(null);
      // Use the same API as Low-Stock page for consistency
      const response = await fetch(`/api/products/low-stock?filter=${filter}`);
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      setAlerts(result.data || []);
      setSummary(result.summary || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
  }

  function getUrgencyBadge(level) {
    if (level.includes('CRITICAL')) return { ...s.badgeCritical, background: 'rgba(220,38,38,0.15)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.3)' };
    if (level.includes('HIGH')) return { ...s.badgeHigh, background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' };
    return { ...s.badgeMedium, background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' };
  }

  function getUrgencyDotColor(level) {
    if (level.includes('CRITICAL')) return '#dc2626';
    if (level.includes('HIGH')) return '#f59e0b';
    return '#60a5fa';
  }

  function getStockStatusBadge(status) {
    if (status === 'OUT_OF_STOCK') return s.badgeOutOfStock;
    return s.badgeLowStock;
  }

  function getStockStatusLabel(status) {
    if (status === 'OUT_OF_STOCK') return 'Out of Stock';
    return 'Low Stock';
  }

  // Loading
  if (loading) {
    return (
      <div style={s.loadingContainer}>
        <div style={s.spinner}></div>
        <span style={{ color: 'rgba(148,163,184,0.8)', fontSize: '15px', fontWeight: '500' }}>
          Loading alerts...
        </span>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div style={s.page}>
        <div style={s.errorAlert}>
          <HiOutlineExclamationTriangle size={18} />
          <span>Error: {error}</span>
          <button onClick={fetchAlerts} style={s.retryBtn}>
            <HiOutlineArrowPath size={14} /> Retry
          </button>
        </div>
      </div>
    );
  }

  const statItems = summary ? [
    { label: 'Total Products', value: summary.totalProducts, icon: HiOutlineCube, color: '#60a5fa', bg: 'rgba(59,130,246,0.15)' },
    { label: 'Low Stock', value: summary.lowStockCount, icon: HiOutlineArrowTrendingDown, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
    { label: 'Out of Stock', value: summary.outOfStockCount, icon: HiOutlineXCircle, color: '#dc2626', bg: 'rgba(220,38,38,0.15)' },
    { label: 'Est. Restock Cost', value: formatCurrency(summary.totalEstimatedRestockCost), icon: HiOutlineBanknotes, color: '#4ade80', bg: 'rgba(34,197,94,0.15)' },
  ] : [];

  return (
    <div style={s.page}>
      {/* ─── Header ─── */}
      <div style={s.header}>
        <div style={s.headerGlow}></div>
        <div style={s.headerLeft}>
          <h1 style={s.headerTitle}>
            <span style={s.titleIcon}><HiOutlineBell size={22} /></span>
            Inventory Alerts
          </h1>
          <p style={s.headerSub}>Monitor and manage inventory alerts across all warehouses</p>
        </div>
        <button style={s.refreshBtn} onClick={fetchAlerts}>
          <HiOutlineArrowPath size={16} /> Refresh
        </button>
      </div>

      {/* ─── Stats ─── */}
      {summary && (
        <div style={s.statsGrid}>
          {statItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} style={s.statCard}>
                <div style={s.statGlow(item.color)}></div>
                <div style={s.statIconWrap(item.bg)}>
                  <Icon size={20} style={{ color: item.color }} />
                </div>
                <span style={s.statValue}>{item.value}</span>
                <span style={s.statLabel}>{item.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Filter Buttons ─── */}
      <div style={s.card}>
        <div style={s.cardGlow}></div>
        <div style={s.filterWrap}>
          <span style={s.filterLabel}>
            <HiOutlineFunnel size={14} /> Filter:
          </span>
          <button
            style={filter === 'all' ? s.filterBtnActive : s.filterBtn}
            onClick={() => setFilter('all')}
          >
            All Products
            {summary && <span style={s.filterCount}>{summary.totalProducts}</span>}
          </button>
          <button
            style={filter === 'low-stock' ? { ...s.filterBtnActive, background: 'linear-gradient(135deg, #f59e0b, #f97316)', boxShadow: '0 3px 14px rgba(245,158,11,0.3)' } : s.filterBtn}
            onClick={() => setFilter('low-stock')}
          >
            <HiOutlineArrowTrendingDown size={13} /> Low Stock
            {summary && <span style={s.filterCount}>{summary.lowStockCount}</span>}
          </button>
          <button
            style={filter === 'out-of-stock' ? { ...s.filterBtnActive, background: 'linear-gradient(135deg, #dc2626, #991b1b)', boxShadow: '0 3px 14px rgba(220,38,38,0.3)' } : s.filterBtn}
            onClick={() => setFilter('out-of-stock')}
          >
            <HiOutlineXCircle size={13} /> Out of Stock
            {summary && <span style={s.filterCount}>{summary.outOfStockCount}</span>}
          </button>
        </div>
      </div>

      {/* ─── Alerts Table ─── */}
      <div style={s.card}>
        <div style={s.cardGlow}></div>
        {alerts.length > 0 ? (
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  {['Status', 'Urgency', 'Product', 'Category', 'Current Stock', 'Reorder Level', 'Units Needed', 'Suggested Order', 'Est. Cost', 'Supplier'].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alerts.map((product) => (
                  <tr
                    key={product.ProductID}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.04)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    {/* Stock Status */}
                    <td style={s.td}>
                      <span style={product.StockStatus === 'OUT_OF_STOCK' ? s.badgeOutOfStock : s.badgeLowStock}>
                        {product.StockStatus === 'OUT_OF_STOCK' ? (
                          <><HiOutlineXCircle size={12} /> Out of Stock</>
                        ) : (
                          <><HiOutlineArrowTrendingDown size={12} /> Low Stock</>
                        )}
                      </span>
                    </td>
                    {/* Urgency */}
                    <td style={s.td}>
                      <span style={getUrgencyBadge(product.UrgencyLevel)}>
                        <span style={s.statusDot(getUrgencyDotColor(product.UrgencyLevel))}></span>
                        {product.UrgencyLevel.split(' - ')[0]}
                      </span>
                    </td>
                    {/* Product */}
                    <td style={s.td}>
                      <div style={s.productName}>{product.ProductName}</div>
                      <span style={s.productCode}>{product.ProductCode}</span>
                    </td>
                    {/* Category */}
                    <td style={s.td}>{product.CategoryName}</td>
                    {/* Current Stock */}
                    <td style={s.td}>
                      <span style={product.CurrentStock === 0 ? s.stockDanger : s.stockWarning}>
                        {product.CurrentStock}
                      </span>
                      <span style={s.stockUnit}>{product.Unit}</span>
                    </td>
                    {/* Reorder Level */}
                    <td style={s.td}>
                      <span style={{ color: '#e2e8f0', fontWeight: '500' }}>{product.ReorderLevel}</span>
                    </td>
                    {/* Units Needed */}
                    <td style={s.td}>
                      <span style={{ color: '#dc2626', fontWeight: '600' }}>
                        {product.UnitsNeeded > 0 ? product.UnitsNeeded : 0}
                      </span>
                    </td>
                    {/* Suggested Order */}
                    <td style={s.td}>
                      <span style={s.orderQty}>
                        <HiOutlineArchiveBox size={12} />
                        {product.SuggestedOrderQuantity} {product.Unit}
                      </span>
                    </td>
                    {/* Est. Cost */}
                    <td style={s.td}>
                      <span style={s.costText}>{formatCurrency(product.EstimatedRestockCost)}</span>
                    </td>
                    {/* Supplier */}
                    <td style={s.td}>
                      <div style={s.supplierName}>{product.SupplierName}</div>
                      {product.SupplierPhone && (
                        <div style={s.supplierDetail}>
                          <HiOutlinePhone size={11} /> {product.SupplierPhone}
                        </div>
                      )}
                      {product.SupplierEmail && (
                        <div style={s.supplierDetail}>
                          <HiOutlineEnvelope size={11} /> {product.SupplierEmail}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={s.empty}>
            <div style={s.emptyIconWrap}>
              <HiOutlineCheckCircle size={30} style={{ color: '#4ade80' }} />
            </div>
            <h3 style={s.emptyTitle}>
              {filter === 'all' ? 'All stocked up!' : filter === 'out-of-stock' ? 'No Out of Stock Items' : 'No Low Stock Items'}
            </h3>
            <p style={s.emptyText}>
              {filter === 'all'
                ? 'All products have sufficient stock levels. No action needed.'
                : filter === 'out-of-stock'
                  ? 'Great! No products are currently out of stock. Stock levels are healthy.'
                  : 'Excellent! No products are below their reorder level. Inventory is well-stocked.'}
            </p>
          </div>
        )}
      </div>

      {/* ─── Quick Links ─── */}
      <div style={s.card}>
        <div style={s.cardGlow}></div>
        <h3 style={s.linksTitle}>
          <HiOutlineCube size={18} style={{ color: '#60a5fa' }} />
          Quick Actions
        </h3>
        <div style={s.linksGrid}>
          <Link href="/alerts/low-stock" style={s.navBtnWarning}>
            <HiOutlineExclamationTriangle size={14} /> Low Stock & Out of Stock
          </Link>
          <Link href="/alerts/dead-stock" style={s.navBtnDanger}>
            <HiOutlineNoSymbol size={14} /> Dead Stock Analysis
          </Link>
          <Link href="/purchases/add" style={s.navBtnPrimary}>
            <HiOutlineInboxArrowDown size={14} /> Create Purchase Order
          </Link>
        </div>
      </div>
    </div>
  );
}
