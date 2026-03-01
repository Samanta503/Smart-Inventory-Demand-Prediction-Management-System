'use client';

/**
 * Purchases Page
 * ==============
 *
 * View all purchase records with multi-item support.
 * Professional Dark Theme
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  HiOutlineInboxArrowDown,
  HiOutlinePlusCircle,
  HiOutlineExclamationTriangle,
  HiOutlinePencilSquare,
  HiOutlineCube,
  HiOutlineBanknotes,
  HiOutlineArrowPath,
  HiOutlineChevronDown,
  HiOutlineChevronRight,
  HiOutlineBuildingStorefront,
  HiOutlineCalendarDays,
  HiOutlineDocumentText,
  HiOutlineMagnifyingGlass,
} from 'react-icons/hi2';

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
    textDecoration: 'none',
  },
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
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
    textTransform: 'uppercase', letterSpacing: '0.4px', position: 'relative', zIndex: 1,
  },
  card: {
    background: 'linear-gradient(145deg, rgba(30,41,59,0.7), rgba(15,23,42,0.85))',
    borderRadius: '18px', padding: '1.5rem', marginBottom: '1.25rem',
    border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden',
  },
  cardGlow: {
    position: 'absolute', top: '-50%', right: '-50%', width: '200%', height: '200%',
    background: 'radial-gradient(circle at 70% 30%, rgba(59,130,246,0.04), transparent 40%)',
    pointerEvents: 'none',
  },
  searchWrap: { position: 'relative', zIndex: 1, marginBottom: '1rem' },
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
  refCode: {
    background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)',
    padding: '2px 8px', borderRadius: '4px', fontSize: '11px',
    fontFamily: "'SF Mono','Fira Code',monospace", color: '#60a5fa',
  },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
    padding: '3px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: '600',
    background: 'rgba(59,130,246,0.12)', color: '#60a5fa',
    border: '1px solid rgba(59,130,246,0.25)',
  },
  costText: { color: '#4ade80', fontWeight: '700', fontSize: '13.5px' },
  supplierName: { color: '#e2e8f0', fontWeight: '600' },
  expandIcon: { color: '#60a5fa', transition: 'transform 0.2s ease' },
  subTable: {
    width: '100%', borderCollapse: 'separate', borderSpacing: '0',
    background: 'rgba(15,23,42,0.4)', borderRadius: '10px', overflow: 'hidden',
  },
  subTd: {
    padding: '0.65rem 0.85rem', fontSize: '13px', color: '#cbd5e1',
    borderBottom: '1px solid rgba(255,255,255,0.03)',
  },
  subTh: {
    padding: '0.6rem 0.85rem', fontSize: '10.5px', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: '0.5px',
    color: 'rgba(148,163,184,0.5)', textAlign: 'left',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  expandedRow: {
    background: 'rgba(59,130,246,0.03)', padding: '1rem 1.5rem 1rem 3.5rem',
  },
  noteText: { color: 'rgba(148,163,184,0.5)', fontSize: '12px', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' },
  errorAlert: {
    background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(15,23,42,0.9))',
    borderRadius: '14px', padding: '1rem 1.25rem', marginBottom: '1.25rem',
    display: 'flex', alignItems: 'center', gap: '0.6rem',
    border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: '14px', fontWeight: '500',
  },
  empty: { textAlign: 'center', padding: '3rem 1rem', position: 'relative', zIndex: 1 },
  emptyIconWrap: {
    width: '68px', height: '68px', borderRadius: '18px', margin: '0 auto 1rem',
    background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  emptyTitle: { color: '#e2e8f0', fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.4rem' },
  emptyText: { color: 'rgba(148,163,184,0.6)', fontSize: '14px', marginBottom: '1rem' },
  emptyBtn: {
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    border: 'none', padding: '0.6rem 1.25rem', borderRadius: '10px',
    color: '#fff', fontWeight: '600', fontSize: '13.5px', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    textDecoration: 'none', boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
  },
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
  resultCount: {
    fontSize: '12px', color: 'rgba(148,163,184,0.5)', position: 'relative', zIndex: 1,
  },
};

const onFocus = (e) => { e.target.style.borderColor = 'rgba(59,130,246,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; };
const onBlur  = (e) => { e.target.style.borderColor = 'rgba(59,130,246,0.2)'; e.target.style.boxShadow = 'none'; };

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [expandedPurchase, setExpandedPurchase] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchPurchases(); }, []);

  async function fetchPurchases() {
    try {
      setLoading(true);
      const response = await fetch('/api/purchases');
      const result = await response.json();
      if (result.success) {
        setPurchases(result.data || []);
        setSummary(result.summary || null);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
  }

  const filteredPurchases = purchases.filter(p =>
    p.ReferenceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.SupplierName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.WarehouseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.Notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={s.loadingContainer}>
        <div style={s.spinner}></div>
        <span style={{ color: 'rgba(148,163,184,0.8)', fontSize: '15px', fontWeight: '500' }}>Loading purchases...</span>
      </div>
    );
  }

  const statItems = summary ? [
    { label: 'Total Purchases', value: summary.totalPurchases, icon: HiOutlinePencilSquare, color: '#60a5fa', bg: 'rgba(59,130,246,0.15)' },
    { label: 'Units Received', value: summary.totalUnits, icon: HiOutlineCube, color: '#a78bfa', bg: 'rgba(139,92,246,0.15)' },
    { label: 'Total Cost', value: formatCurrency(summary.totalCost), icon: HiOutlineBanknotes, color: '#4ade80', bg: 'rgba(34,197,94,0.15)' },
  ] : [];

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerGlow}></div>
        <div style={s.headerLeft}>
          <h1 style={s.headerTitle}>
            <span style={s.titleIcon}><HiOutlineInboxArrowDown size={22} /></span>
            Purchases
          </h1>
          <p style={s.headerSub}>Track incoming stock from suppliers</p>
        </div>
        <div style={s.headerActions}>
          <button style={s.refreshBtn} onClick={fetchPurchases}>
            <HiOutlineArrowPath size={16} /> Refresh
          </button>
          <Link href="/purchases/add" style={s.addBtn}>
            <HiOutlinePlusCircle size={16} /> New Purchase
          </Link>
        </div>
      </div>

      {error && (
        <div style={s.errorAlert}>
          <HiOutlineExclamationTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Stats */}
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

      {/* Search + Table */}
      <div style={s.card}>
        <div style={s.cardGlow}></div>
        <div style={s.searchWrap}>
          <HiOutlineMagnifyingGlass size={16} style={s.searchIcon} />
          <input
            type="text"
            placeholder="Search by reference, supplier, warehouse..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={onFocus} onBlur={onBlur}
            style={s.searchInput}
          />
        </div>
        <div style={{ ...s.resultCount, marginBottom: '0.75rem' }}>
          Showing {filteredPurchases.length} of {purchases.length} purchases
        </div>

        {filteredPurchases.length > 0 ? (
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  {['', 'Reference', 'Date', 'Supplier', 'Warehouse', 'Items', 'Total Cost', 'Notes'].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPurchases.map((purchase) => (
                  <React.Fragment key={purchase.PurchaseID}>
                    <tr
                      style={{ cursor: 'pointer' }}
                      onClick={() => setExpandedPurchase(expandedPurchase === purchase.PurchaseID ? null : purchase.PurchaseID)}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.04)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td style={{ ...s.td, width: '40px' }}>
                        {expandedPurchase === purchase.PurchaseID
                          ? <HiOutlineChevronDown size={14} style={s.expandIcon} />
                          : <HiOutlineChevronRight size={14} style={s.expandIcon} />}
                      </td>
                      <td style={s.td}>
                        <span style={s.refCode}>{purchase.ReferenceNumber}</span>
                      </td>
                      <td style={s.td}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <HiOutlineCalendarDays size={13} style={{ color: 'rgba(148,163,184,0.4)' }} />
                          {new Date(purchase.PurchaseDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td style={s.td}>
                        <span style={s.supplierName}>{purchase.SupplierName}</span>
                      </td>
                      <td style={s.td}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <HiOutlineBuildingStorefront size={13} style={{ color: 'rgba(148,163,184,0.4)' }} />
                          {purchase.WarehouseName}
                        </span>
                      </td>
                      <td style={s.td}>
                        <span style={s.badge}>
                          <HiOutlineCube size={12} />
                          {purchase.items?.length || 0} items
                        </span>
                      </td>
                      <td style={s.td}>
                        <span style={s.costText}>{formatCurrency(purchase.TotalCost)}</span>
                      </td>
                      <td style={{ ...s.td, ...s.noteText }}>
                        {purchase.Notes || '-'}
                      </td>
                    </tr>
                    {expandedPurchase === purchase.PurchaseID && purchase.items && (
                      <tr>
                        <td colSpan="8" style={{ padding: 0, border: 'none' }}>
                          <div style={s.expandedRow}>
                            <table style={s.subTable}>
                              <thead>
                                <tr>
                                  <th style={s.subTh}>Product</th>
                                  <th style={s.subTh}>Quantity</th>
                                  <th style={s.subTh}>Unit Cost</th>
                                  <th style={s.subTh}>Line Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {purchase.items.map((item, idx) => (
                                  <tr key={idx}>
                                    <td style={s.subTd}>
                                      <span style={{ color: '#e2e8f0', fontWeight: '600' }}>{item.ProductName}</span>
                                      <span style={{ ...s.refCode, marginLeft: '0.5rem' }}>{item.ProductCode}</span>
                                    </td>
                                    <td style={s.subTd}>{item.Quantity}</td>
                                    <td style={s.subTd}>{formatCurrency(item.UnitCost)}</td>
                                    <td style={s.subTd}>
                                      <span style={s.costText}>{formatCurrency(item.LineTotal)}</span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={s.empty}>
            <div style={s.emptyIconWrap}>
              <HiOutlineInboxArrowDown size={30} style={{ color: '#60a5fa' }} />
            </div>
            <h3 style={s.emptyTitle}>
              {searchTerm ? 'No matching purchases' : 'No purchases yet'}
            </h3>
            <p style={s.emptyText}>
              {searchTerm ? 'Try adjusting your search terms' : 'Record your first purchase to start tracking inventory'}
            </p>
            {!searchTerm && (
              <Link href="/purchases/add" style={s.emptyBtn}>
                <HiOutlinePlusCircle size={14} /> Add Purchase
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
