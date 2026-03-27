'use client';

import {
  HiOutlineExclamationTriangle, HiOutlineBanknotes, HiOutlineShoppingCart,
  HiOutlinePencilSquare, HiOutlineArrowTrendingUp, HiOutlineCube,
  HiOutlineBuildingOffice, HiOutlineMagnifyingGlass, HiOutlineChevronDown,
  HiOutlineChevronUp, HiOutlineDocumentText, HiOutlineCalendarDays,
  HiOutlineUserCircle, HiOutlineReceiptPercent, HiOutlineArrowPath,
  HiOutlineCheckBadge, HiOutlineClock, HiOutlineHashtag,
} from 'react-icons/hi2';

import { useState, useEffect } from 'react';
import React from 'react';
import Link from 'next/link';

// ─── Dark Theme Styles ──────────────────────────────────────────
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
  newSaleBtn: {
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    border: 'none', padding: '0.7rem 1.35rem', borderRadius: '12px',
    color: '#fff', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    boxShadow: '0 4px 16px rgba(59,130,246,0.35)',
    transition: 'all 0.2s ease', textDecoration: 'none',
    position: 'relative', zIndex: 1,
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
    background: 'radial-gradient(circle at 70% 30%, rgba(139,92,246,0.04), transparent 40%)',
    pointerEvents: 'none',
  },
  // Search
  searchWrap: { position: 'relative', zIndex: 1 },
  searchIcon: {
    position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)',
    color: 'rgba(148,163,184,0.5)', pointerEvents: 'none',
  },
  searchInput: {
    width: '100%', padding: '0.75rem 1rem 0.75rem 2.6rem', fontSize: '14px',
    borderRadius: '12px', border: '1px solid rgba(59,130,246,0.2)',
    background: 'rgba(15,23,42,0.6)', color: '#e2e8f0', outline: 'none',
    transition: 'all 0.2s ease',
  },
  resultCount: {
    fontSize: '12px', color: 'rgba(148,163,184,0.5)', marginTop: '0.6rem',
    position: 'relative', zIndex: 1,
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
  // Badges / pills
  invoiceBadge: {
    background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
    padding: '4px 10px', borderRadius: '7px', fontSize: '12px',
    fontFamily: "'SF Mono','Fira Code',monospace", color: '#a78bfa',
    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
  },
  customerName: { color: '#e2e8f0', fontWeight: '600', fontSize: '13.5px' },
  warehousePill: {
    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
    padding: '3px 9px', borderRadius: '7px', fontSize: '12px', fontWeight: '500',
    background: 'rgba(6,182,212,0.1)', color: '#22d3ee',
    border: '1px solid rgba(6,182,212,0.2)',
  },
  itemsCount: {
    display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
    padding: '3px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
    background: 'rgba(59,130,246,0.1)', color: '#60a5fa',
    border: '1px solid rgba(59,130,246,0.2)',
  },
  totalAmount: { color: '#4ade80', fontWeight: '700', fontSize: '14px' },
  statusBadge: (completed) => ({
    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
    padding: '4px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: '600',
    background: completed ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)',
    color: completed ? '#4ade80' : '#fbbf24',
    border: `1px solid ${completed ? 'rgba(34,197,94,0.25)' : 'rgba(245,158,11,0.25)'}`,
  }),
  statusDot: (completed) => ({
    width: '6px', height: '6px', borderRadius: '50%',
    background: completed ? '#4ade80' : '#fbbf24',
    boxShadow: completed ? '0 0 6px rgba(74,222,128,0.5)' : '0 0 6px rgba(251,191,36,0.5)',
  }),
  detailsBtn: (expanded) => ({
    padding: '5px 12px', fontSize: '12px', fontWeight: '500',
    background: expanded ? 'rgba(139,92,246,0.15)' : 'rgba(59,130,246,0.1)',
    color: expanded ? '#c084fc' : '#60a5fa',
    border: `1px solid ${expanded ? 'rgba(139,92,246,0.3)' : 'rgba(59,130,246,0.2)'}`,
    borderRadius: '8px', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
    transition: 'all 0.15s ease',
  }),
  dateText: { color: 'rgba(148,163,184,0.6)', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '0.3rem' },
  // Expanded detail
  expandedRow: {
    background: 'rgba(15,23,42,0.5)', borderBottom: '1px solid rgba(255,255,255,0.03)',
  },
  expandedInner: {
    padding: '1rem 1.25rem',
    background: 'linear-gradient(145deg, rgba(15,23,42,0.7), rgba(30,41,59,0.4))',
    borderRadius: '12px', margin: '0.25rem 0.5rem 0.5rem',
    border: '1px solid rgba(255,255,255,0.04)',
  },
  expandedTitle: {
    fontSize: '13px', fontWeight: '600', color: '#94a3b8',
    marginBottom: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
  },
  subTh: {
    padding: '0.5rem 0.7rem', fontSize: '10.5px', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: '0.5px',
    color: 'rgba(148,163,184,0.5)', textAlign: 'left',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  subTd: {
    padding: '0.55rem 0.7rem', fontSize: '12.5px', color: '#cbd5e1',
    borderBottom: '1px solid rgba(255,255,255,0.025)',
  },
  productCode: {
    background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)',
    padding: '2px 7px', borderRadius: '4px', fontSize: '10.5px',
    fontFamily: "'SF Mono','Fira Code',monospace", color: '#60a5fa',
  },
  profitText: { color: '#4ade80', fontWeight: '600' },
  // Alerts
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
  emptyIcon: {
    width: '68px', height: '68px', borderRadius: '18px', margin: '0 auto 1rem',
    background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  emptyTitle: { color: '#e2e8f0', fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.4rem' },
  emptyText: { color: 'rgba(148,163,184,0.6)', fontSize: '14px', marginBottom: '1rem' },
  emptyBtn: {
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    border: 'none', padding: '0.65rem 1.5rem', borderRadius: '10px',
    color: '#fff', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    textDecoration: 'none', boxShadow: '0 4px 14px rgba(59,130,246,0.3)',
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
  /* filter section */
  filterContainer: {
    marginBottom: '1.25rem', padding: '1rem 1.75rem',
    background: 'linear-gradient(145deg, rgba(30,41,59,0.6), rgba(15,23,42,0.75))',
    borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)',
  },
  filterHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    cursor: 'pointer', userSelect: 'none', padding: '0.5rem 0',
  },
  filterTitle: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    fontSize: '0.95rem', fontWeight: '600', color: '#e2e8f0',
  },
  filterBadge: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    minWidth: '1.5rem', height: '1.5rem',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    color: '#fff', borderRadius: '50%', fontSize: '0.75rem', fontWeight: '700',
    marginLeft: '0.5rem',
  },
  filterContent: {
    marginTop: '1rem', paddingTop: '1rem',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  filterGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem',
    marginBottom: '1rem',
  },
  FilterGroup: {
    padding: '1rem', borderRadius: '12px',
    background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)',
    transition: 'all 0.3s ease',
  },
  filterLabel: {
    display: 'block', fontSize: '0.82rem', fontWeight: '600',
    color: 'rgba(148,163,184,0.85)', marginBottom: '0.5rem',
  },
  filterSelect: {
    width: '100%', padding: '0.7rem 1rem',
    background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px', color: '#e2e8f0', fontSize: '0.92rem',
    outline: 'none', transition: 'border-color 0.2s ease', cursor: 'pointer',
  },
  filterInput: {
    width: '100%', padding: '0.7rem 1rem',
    background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px', color: '#e2e8f0', fontSize: '0.92rem',
    outline: 'none', transition: 'border-color 0.2s ease',
  },
  rangeInputs: {
    display: 'flex', alignItems: 'center', gap: '6px',
  },
  rangeInput: {
    flex: 1, padding: '0.7rem 0.75rem',
    background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px', color: '#e2e8f0', fontSize: '0.92rem',
    outline: 'none', transition: 'border-color 0.2s ease', minWidth: 0,
  },
  rangeSeparator: {
    color: 'rgba(148,163,184,0.5)', fontSize: '0.88rem', fontWeight: '500',
  },
  clearFiltersBtn: {
    padding: '0.65rem 1.5rem', borderRadius: '10px',
    background: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(220,38,38,0.2))',
    border: '1px solid rgba(239,68,68,0.25)', color: '#f87171',
    fontWeight: '600', fontSize: '13px', cursor: 'pointer',
    transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.4rem',
  },
};

const onFocus = (e) => { e.target.style.borderColor = 'rgba(59,130,246,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; };
const onBlur  = (e) => { e.target.style.borderColor = 'rgba(59,130,246,0.2)'; e.target.style.boxShadow = 'none'; };

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSale, setExpandedSale] = useState(null);
  const [filterCustomer, setFilterCustomer] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [filterWarehouse, setFilterWarehouse] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  useEffect(() => { fetchSales(); }, []);

  useEffect(() => {
    let count = 0;
    if (filterCustomer) count++;
    if (startDate) count++;
    if (endDate) count++;
    if (minAmount) count++;
    if (maxAmount) count++;
    if (filterWarehouse) count++;
    setActiveFiltersCount(count);
  }, [filterCustomer, startDate, endDate, minAmount, maxAmount, filterWarehouse]);

  async function fetchSales() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/sales');
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      setSales(result.data || []);
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

  const getUniqueCustomers = () => [...new Set(sales.map(s => s.CustomerName).filter(Boolean))].sort();
  const getUniqueWarehouses = () => [...new Set(sales.map(s => s.WarehouseName).filter(Boolean))].sort();

  const clearSalesFilters = () => {
    setFilterCustomer('');
    setStartDate('');
    setEndDate('');
    setMinAmount('');
    setMaxAmount('');
    setFilterWarehouse('');
  };

  const filteredSales = sales.filter(sale => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      (sale.InvoiceNumber?.toLowerCase().includes(q)) ||
      (sale.CustomerName?.toLowerCase().includes(q)) ||
      (sale.WarehouseName?.toLowerCase().includes(q));
    
    const matchesCustomer = !filterCustomer || (sale.CustomerName || '').toLowerCase() === filterCustomer.toLowerCase();
    const matchesWarehouse = !filterWarehouse || (sale.WarehouseName || '').toLowerCase() === filterWarehouse.toLowerCase();
    
    let matchesDateRange = true;
    if (startDate || endDate) {
      const saleDate = new Date(sale.SaleDate);
      if (startDate) matchesDateRange = saleDate >= new Date(startDate);
      if (endDate) matchesDateRange = matchesDateRange && saleDate <= new Date(endDate);
    }
    
    const amount = parseFloat(sale.TotalAmount) || 0;
    const matchesAmount = (!minAmount || amount >= +minAmount) && (!maxAmount || amount <= +maxAmount);
    
    return matchesSearch && matchesCustomer && matchesWarehouse && matchesDateRange && matchesAmount;
  });

  if (loading) {
    return (
      <div style={s.loadingContainer}>
        <div style={s.spinner}></div>
        <span style={{ color: 'rgba(148,163,184,0.8)', fontSize: '15px', fontWeight: '500' }}>Loading sales...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={s.page}>
        <div style={s.errorAlert}>
          <HiOutlineExclamationTriangle size={18} />
          <span>Error: {error}</span>
          <button onClick={fetchSales} style={s.retryBtn}>
            <HiOutlineArrowPath size={14} /> Retry
          </button>
        </div>
      </div>
    );
  }

  const statItems = summary ? [
    { label: 'Total Sales', value: summary.totalSales, icon: HiOutlineReceiptPercent, color: '#60a5fa', bg: 'rgba(59,130,246,0.15)' },
    { label: 'Revenue', value: formatCurrency(summary.totalRevenue), icon: HiOutlineBanknotes, color: '#4ade80', bg: 'rgba(34,197,94,0.15)' },
    { label: 'Profit', value: formatCurrency(summary.totalProfit), icon: HiOutlineArrowTrendingUp, color: '#c084fc', bg: 'rgba(139,92,246,0.15)' },
    { label: 'Items Sold', value: summary.totalItemsSold || 0, icon: HiOutlineCube, color: '#fbbf24', bg: 'rgba(245,158,11,0.15)' },
  ] : [];

  return (
    <div style={s.page}>
      {/* ─── Header ─── */}
      <div style={s.header}>
        <div style={s.headerGlow}></div>
        <div style={s.headerLeft}>
          <h1 style={s.headerTitle}>
            <span style={s.titleIcon}><HiOutlineBanknotes size={22} /></span>
            Sales
          </h1>
          <p style={s.headerSub}>View and manage all sales transactions</p>
        </div>
        <Link href="/sales/add" style={s.newSaleBtn}>
          <HiOutlineShoppingCart size={16} /> New Sale
        </Link>
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

      {/* ─── Search ─── */}
      <div style={s.card}>
        <div style={s.cardGlow}></div>
        <div style={s.searchWrap}>
          <HiOutlineMagnifyingGlass size={16} style={s.searchIcon} />
          <input
            type="text"
            placeholder="Search by invoice number, customer, or warehouse..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={onFocus} onBlur={onBlur}
            style={s.searchInput}
          />
        </div>
        <div style={s.resultCount}>
          Showing {filteredSales.length} of {sales.length} transactions
        </div>
      </div>

      {/* ─── Filter Panel ─── */}
      <div style={s.filterContainer}>
        <div style={s.filterHeader} onClick={() => setShowFilters(!showFilters)}>
          <div style={s.filterTitle}>
            <HiOutlineChevronDown size={18} style={{ marginRight: '0.5rem', transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
            <strong>Filters</strong>
            {activeFiltersCount > 0 && (
              <span style={s.filterBadge}>{activeFiltersCount}</span>
            )}
          </div>
        </div>

        {showFilters && (
          <div style={s.filterContent}>
            <div style={s.filterGrid}>
              {/* Date Range */}
              <div style={s.FilterGroup}>
                <label style={s.filterLabel}>Date Range (From)</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  style={s.filterInput}
                  onFocus={e => (e.target.style.borderColor = 'rgba(59,130,246,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
              </div>

              {/* Date Range To */}
              <div style={s.FilterGroup}>
                <label style={s.filterLabel}>Date Range (To)</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  style={s.filterInput}
                  onFocus={e => (e.target.style.borderColor = 'rgba(59,130,246,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
              </div>

              {/* Customer Filter */}
              <div style={s.FilterGroup}>
                <label style={s.filterLabel}>Customer</label>
                <select
                  value={filterCustomer}
                  onChange={e => setFilterCustomer(e.target.value)}
                  style={s.filterSelect}
                  onFocus={e => (e.target.style.borderColor = 'rgba(59,130,246,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                >
                  <option value="">All Customers</option>
                  {getUniqueCustomers().map(customer => (
                    <option key={customer} value={customer}>{customer}</option>
                  ))}
                </select>
              </div>

              {/* Warehouse Filter */}
              <div style={s.FilterGroup}>
                <label style={s.filterLabel}>Warehouse</label>
                <select
                  value={filterWarehouse}
                  onChange={e => setFilterWarehouse(e.target.value)}
                  style={s.filterSelect}
                  onFocus={e => (e.target.style.borderColor = 'rgba(59,130,246,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                >
                  <option value="">All Warehouses</option>
                  {getUniqueWarehouses().map(warehouse => (
                    <option key={warehouse} value={warehouse}>{warehouse}</option>
                  ))}
                </select>
              </div>

              {/* Amount Range */}
              <div style={s.FilterGroup}>
                <label style={s.filterLabel}>Amount Range</label>
                <div style={s.rangeInputs}>
                  <input
                    type="number"
                    placeholder="Min"
                    value={minAmount}
                    onChange={e => setMinAmount(e.target.value)}
                    style={s.rangeInput}
                    onFocus={e => (e.target.style.borderColor = 'rgba(59,130,246,0.5)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                  />
                  <span style={s.rangeSeparator}>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxAmount}
                    onChange={e => setMaxAmount(e.target.value)}
                    style={s.rangeInput}
                    onFocus={e => (e.target.style.borderColor = 'rgba(59,130,246,0.5)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                  />
                </div>
              </div>
            </div>

            {/* Clear Button */}
            {activeFiltersCount > 0 && (
              <button
                onClick={clearSalesFilters}
                style={s.clearFiltersBtn}
                onMouseEnter={e => (e.target.style.background = 'linear-gradient(135deg, rgba(239,68,68,0.3), rgba(220,38,38,0.3))')}
                onMouseLeave={e => (e.target.style.background = 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(220,38,38,0.2))')}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* ─── Sales Table ─── */}
      <div style={s.card}>
        <div style={s.cardGlow}></div>
        {filteredSales.length > 0 ? (
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  {['Invoice', 'Date', 'Customer', 'Warehouse', 'Items', 'Total', 'Status', 'Actions'].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => {
                  const isCompleted = sale.Status === 'COMPLETED';
                  const isExpanded = expandedSale === sale.SaleID;
                  return (
                    <React.Fragment key={sale.SaleID}>
                      <tr
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.04)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        {/* Invoice */}
                        <td style={s.td}>
                          <span style={s.invoiceBadge}>
                            <HiOutlineHashtag size={11} />
                            {sale.InvoiceNumber}
                          </span>
                        </td>
                        {/* Date */}
                        <td style={s.td}>
                          <span style={s.dateText}>
                            <HiOutlineCalendarDays size={13} />
                            {new Date(sale.SaleDate).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'short', day: 'numeric'
                            })}
                          </span>
                        </td>
                        {/* Customer */}
                        <td style={s.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                              width: '32px', height: '32px', borderRadius: '9px',
                              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#fff', fontSize: '13px', fontWeight: '700', flexShrink: 0,
                            }}>
                              {sale.CustomerName?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <span style={s.customerName}>{sale.CustomerName}</span>
                          </div>
                        </td>
                        {/* Warehouse */}
                        <td style={s.td}>
                          <span style={s.warehousePill}>
                            <HiOutlineBuildingOffice size={12} />
                            {sale.WarehouseName}
                          </span>
                        </td>
                        {/* Items */}
                        <td style={s.td}>
                          <span style={s.itemsCount}>
                            <HiOutlineCube size={12} />
                            {sale.ItemCount}
                          </span>
                        </td>
                        {/* Total */}
                        <td style={s.td}>
                          <span style={s.totalAmount}>{formatCurrency(sale.TotalAmount)}</span>
                        </td>
                        {/* Status */}
                        <td style={s.td}>
                          <span style={s.statusBadge(isCompleted)}>
                            <span style={s.statusDot(isCompleted)}></span>
                            {sale.Status}
                          </span>
                        </td>
                        {/* Actions */}
                        <td style={s.td}>
                          <button
                            onClick={() => setExpandedSale(isExpanded ? null : sale.SaleID)}
                            style={s.detailsBtn(isExpanded)}
                          >
                            {isExpanded
                              ? <><HiOutlineChevronUp size={13} /> Hide</>
                              : <><HiOutlineChevronDown size={13} /> Details</>
                            }
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Items Row */}
                      {isExpanded && sale.items && (
                        <tr style={s.expandedRow}>
                          <td colSpan="8" style={{ padding: '0.25rem 0.5rem 0.75rem' }}>
                            <div style={s.expandedInner}>
                              <div style={s.expandedTitle}>
                                <HiOutlineDocumentText size={14} />
                                Items in {sale.InvoiceNumber} ({sale.items.length} products)
                              </div>
                              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                  <tr>
                                    {['Product', 'Code', 'Qty', 'Unit Price', 'Line Total', 'Profit'].map(h => (
                                      <th key={h} style={s.subTh}>{h}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {sale.items.map(item => (
                                    <tr key={item.SaleItemID}>
                                      <td style={s.subTd}>
                                        <span style={{ color: '#e2e8f0', fontWeight: '500' }}>{item.ProductName}</span>
                                      </td>
                                      <td style={s.subTd}>
                                        <span style={s.productCode}>{item.ProductCode}</span>
                                      </td>
                                      <td style={s.subTd}>
                                        <span style={{
                                          background: 'rgba(255,255,255,0.05)', padding: '2px 8px',
                                          borderRadius: '5px', fontWeight: '600', color: '#e2e8f0',
                                        }}>{item.Quantity}</span>
                                      </td>
                                      <td style={s.subTd}>{formatCurrency(item.UnitPrice)}</td>
                                      <td style={{ ...s.subTd, fontWeight: '600', color: '#e2e8f0' }}>
                                        {formatCurrency(item.LineTotal)}
                                      </td>
                                      <td style={s.subTd}>
                                        <span style={s.profitText}>{formatCurrency(item.Profit)}</span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              {/* Sale totals summary row */}
                              <div style={{
                                display: 'flex', justifyContent: 'flex-end', gap: '1.5rem',
                                marginTop: '0.75rem', paddingTop: '0.7rem',
                                borderTop: '1px solid rgba(255,255,255,0.05)',
                              }}>
                                <div style={{ fontSize: '12px' }}>
                                  <span style={{ color: 'rgba(148,163,184,0.5)' }}>Total: </span>
                                  <span style={{ color: '#e2e8f0', fontWeight: '700' }}>{formatCurrency(sale.TotalAmount)}</span>
                                </div>
                                <div style={{ fontSize: '12px' }}>
                                  <span style={{ color: 'rgba(148,163,184,0.5)' }}>Profit: </span>
                                  <span style={{ color: '#4ade80', fontWeight: '700' }}>
                                    {formatCurrency(sale.items.reduce((sum, itm) => sum + (parseFloat(itm.Profit) || 0), 0))}
                                  </span>
                                </div>
                              </div>
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
          <div style={s.empty}>
            <div style={s.emptyIcon}>
              <HiOutlineBanknotes size={30} style={{ color: '#60a5fa' }} />
            </div>
            <h3 style={s.emptyTitle}>No sales found</h3>
            <p style={s.emptyText}>
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Record your first sale to get started'
              }
            </p>
            {!searchTerm && (
              <Link href="/sales/add" style={s.emptyBtn}>
                <HiOutlineShoppingCart size={16} /> New Sale
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
