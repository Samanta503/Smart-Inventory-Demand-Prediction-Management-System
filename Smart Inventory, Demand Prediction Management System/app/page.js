'use client';

/**
 * Dashboard Page
 * ==============
 * 
 * The main dashboard showing overview statistics, recent activity,
 * and key metrics for the inventory management system.
 * 
 * 'use client' - This makes the component run on the client side,
 * which is required when using React hooks like useState and useEffect.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  HiOutlineChartBar,
  HiOutlineCube,
  HiOutlineBanknotes,
  HiOutlineShoppingCart,
  HiOutlineInboxArrowDown,
  HiOutlineExclamationTriangle,
  HiOutlineXCircle,
  HiOutlineBell,
  HiOutlineArrowPath,
  HiOutlineTag,
  HiOutlineArrowTrendingUp,
  HiOutlinePlusCircle,
  HiOutlineBolt,
  HiOutlineCalendarDays,
  HiOutlineTrophy,
  HiOutlineInboxStack,
  HiOutlineFolderOpen,
} from 'react-icons/hi2';

// Month names for display
const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

// Generate year options (last 10 years to next year)
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 12 }, (_, i) => currentYear - 10 + i);

// Generate week options (1-53)
const WEEKS = Array.from({ length: 53 }, (_, i) => i + 1);

// Professional Dark Dashboard Styles - Matching Sidebar Theme
const styles = {
  // Main container with dark gradient background
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    padding: '1.5rem 2rem 2rem',
  },
  // Header section
  header: {
    marginBottom: '2rem',
    position: 'relative',
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.5rem',
  },
  headerTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: '-0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  headerSubtitle: {
    color: 'rgba(148, 163, 184, 0.8)',
    fontSize: '0.95rem',
    marginTop: '0.5rem',
  },
  refreshBtn: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    color: 'white',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.35)',
  },
  // Financial Overview Card
  financialCard: {
    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
    borderRadius: '20px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    border: '1px solid rgba(59, 130, 246, 0.15)',
    backdropFilter: 'blur(20px)',
    position: 'relative',
    overflow: 'hidden',
  },
  cardGlow: {
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 40%)',
    pointerEvents: 'none',
  },
  financialHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem',
    flexWrap: 'wrap',
    gap: '1rem',
    position: 'relative',
    zIndex: 1,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: '1.15rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  // Controls
  controlsRow: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  controlGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  controlLabel: {
    fontSize: '12px',
    color: 'rgba(148, 163, 184, 0.7)',
    fontWeight: '500',
  },
  select: {
    padding: '0.45rem 0.7rem',
    borderRadius: '8px',
    border: '1px solid rgba(59, 130, 246, 0.25)',
    background: 'rgba(15, 23, 42, 0.6)',
    color: '#e2e8f0',
    fontSize: '13px',
    cursor: 'pointer',
    outline: 'none',
    minWidth: '100px',
    transition: 'all 0.2s ease',
  },
  resetBtn: {
    padding: '0.45rem 0.9rem',
    borderRadius: '8px',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    background: 'rgba(139, 92, 246, 0.15)',
    color: '#c4b5fd',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  // Period Badge
  periodBadge: {
    background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    fontSize: '12px',
    color: 'rgba(226, 232, 240, 0.9)',
    marginBottom: '1rem',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    display: 'inline-block',
    position: 'relative',
    zIndex: 1,
  },
  // Period Stats Grid
  periodGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    position: 'relative',
    zIndex: 1,
  },
  periodCard: {
    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.7) 100%)',
    borderRadius: '14px',
    padding: '1.1rem',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    transition: 'all 0.3s ease',
  },
  periodTitle: {
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  periodRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.4rem',
    fontSize: '12px',
  },
  periodLabel: {
    color: 'rgba(148, 163, 184, 0.7)',
  },
  periodDivider: {
    margin: '0.6rem 0',
    border: 'none',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
  },
  // Metrics Grid
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  metricCard: {
    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%)',
    borderRadius: '16px',
    padding: '1.25rem',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
  },
  metricGlow: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    filter: 'blur(40px)',
    opacity: 0.4,
    pointerEvents: 'none',
  },
  metricIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.35rem',
    marginBottom: '0.9rem',
    position: 'relative',
    zIndex: 1,
  },
  metricValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '0.2rem',
    position: 'relative',
    zIndex: 1,
  },
  metricLabel: {
    fontSize: '0.8rem',
    color: 'rgba(148, 163, 184, 0.8)',
    fontWeight: '500',
    position: 'relative',
    zIndex: 1,
  },
  // Two Column Grid
  twoColGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.25rem',
    marginBottom: '1.25rem',
  },
  // Cards
  card: {
    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%)',
    borderRadius: '18px',
    padding: '1.25rem',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    position: 'relative',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    paddingBottom: '0.9rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  },
  cardTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  viewBtn: {
    padding: '0.4rem 0.9rem',
    borderRadius: '8px',
    background: 'rgba(59, 130, 246, 0.15)',
    color: '#60a5fa',
    fontSize: '12px',
    fontWeight: '500',
    border: '1px solid rgba(59, 130, 246, 0.25)',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  },
  badge: {
    padding: '0.3rem 0.7rem',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '500',
    background: 'rgba(139, 92, 246, 0.15)',
    color: '#a78bfa',
    border: '1px solid rgba(139, 92, 246, 0.2)',
  },
  // Table
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0',
  },
  th: {
    textAlign: 'left',
    padding: '0.7rem 0.9rem',
    fontSize: '11px',
    fontWeight: '600',
    color: 'rgba(148, 163, 184, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    background: 'rgba(15, 23, 42, 0.4)',
  },
  td: {
    padding: '0.75rem 0.9rem',
    fontSize: '13px',
    color: '#e2e8f0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
  },
  // Quick Actions
  quickActions: {
    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%)',
    borderRadius: '18px',
    padding: '1.25rem',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    marginTop: '1.25rem',
  },
  quickTitle: {
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  actionsGrid: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  actionBtn: {
    padding: '0.7rem 1.1rem',
    borderRadius: '10px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    fontSize: '13px',
  },
  // Empty State
  emptyState: {
    padding: '2rem',
    textAlign: 'center',
    color: 'rgba(148, 163, 184, 0.6)',
    fontSize: '13px',
  },
  // Loading
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
    gap: '1.5rem',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '3px solid rgba(59, 130, 246, 0.2)',
    borderTop: '3px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: 'rgba(148, 163, 184, 0.8)',
    fontSize: '15px',
    fontWeight: '500',
  },
  // Error
  errorCard: {
    background: 'linear-gradient(145deg, rgba(127, 29, 29, 0.3) 0%, rgba(15, 23, 42, 0.9) 100%)',
    borderRadius: '16px',
    padding: '1.5rem',
    margin: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    border: '1px solid rgba(239, 68, 68, 0.3)',
  },
  // Rank Badge
  rankBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    fontSize: '11px',
    fontWeight: '700',
    marginRight: '0.5rem',
  },
  // Product Count Badge
  countBadge: {
    background: 'rgba(59, 130, 246, 0.2)',
    color: '#60a5fa',
    padding: '0.2rem 0.6rem',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
};

/**
 * Dashboard Component
 * -------------------
 * Main dashboard view with:
 * - Inventory statistics
 * - Sales overview
 * - Alerts summary
 * - Recent sales
 * - Top products
 */
export default function Dashboard() {
  // State to store dashboard data
  const [data, setData] = useState(null);
  
  // State to track loading status
  const [loading, setLoading] = useState(true);
  
  // State to store any errors
  const [error, setError] = useState(null);

  // State for period selection
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedWeek, setSelectedWeek] = useState('');

  /**
   * useEffect Hook
   * --------------
   * Runs when the component mounts (loads)
   * Fetches dashboard data from our API
   */
  useEffect(() => {
    fetchDashboardData();
  }, []); // Empty array means run once on mount

  /**
   * Fetch Dashboard Data
   * --------------------
   * Makes an API call to get all dashboard statistics
   */
  async function fetchDashboardData(year = selectedYear, month = selectedMonth, week = selectedWeek) {
    try {
      setLoading(true);
      setError(null);

      // Build URL with query parameters
      let url = `/api/analytics/dashboard?year=${year}&month=${month}`;
      if (week) {
        url += `&week=${week}`;
      }

      // Fetch data from our dashboard API
      const response = await fetch(url);
      
      // Parse the JSON response
      const result = await response.json();

      // Check if the request was successful
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch dashboard data');
      }

      // Update state with the data
      setData(result.data);
    } catch (err) {
      // Store error message
      setError(err.message);
      console.error('Dashboard fetch error:', err);
    } finally {
      // Always set loading to false when done
      setLoading(false);
    }
  }

  // Handle period selection changes
  function handleYearChange(e) {
    const year = parseInt(e.target.value);
    setSelectedYear(year);
    fetchDashboardData(year, selectedMonth, selectedWeek);
  }

  function handleMonthChange(e) {
    const month = parseInt(e.target.value);
    setSelectedMonth(month);
    fetchDashboardData(selectedYear, month, selectedWeek);
  }

  function handleWeekChange(e) {
    const week = e.target.value ? parseInt(e.target.value) : '';
    setSelectedWeek(week);
    fetchDashboardData(selectedYear, selectedMonth, week);
  }

  function resetToCurrentPeriod() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    setSelectedYear(year);
    setSelectedMonth(month);
    setSelectedWeek('');
    fetchDashboardData(year, month, '');
  }

  /**
   * Format Currency
   * ---------------
   * Helper function to format numbers as currency
   */
  function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value || 0);
  }

  /**
   * Format Number
   * -------------
   * Helper function to format large numbers with commas
   */
  function formatNumber(value) {
    return new Intl.NumberFormat('en-US').format(value || 0);
  }

  // Show loading state
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading dashboard...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorCard}>
          <span style={{ fontSize: '2rem', display: 'flex', alignItems: 'center' }}><HiOutlineExclamationTriangle size={32} /></span>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: '600', color: '#fca5a5', marginBottom: '0.25rem' }}>Error Loading Dashboard</p>
            <p style={{ color: '#f87171', fontSize: '14px' }}>{error}</p>
          </div>
          <button 
            onClick={fetchDashboardData} 
            style={{
              ...styles.refreshBtn,
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
            }}
          >
            <HiOutlineArrowPath size={16} style={{display:'inline', verticalAlign:'middle'}} /> Retry
          </button>
        </div>
      </div>
    );
  }

  // Destructure data for easier access
  const { inventory, sales, purchases, periodStats, alerts, recentSales, topProducts, categories } = data || {};

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div>
            <h1 style={styles.headerTitle}>
              <span style={{ 
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', 
                padding: '0.4rem', 
                borderRadius: '10px',
                display: 'inline-flex',
                marginRight: '0.5rem'
              }}><HiOutlineChartBar size={24} /></span>
              Dashboard
            </h1>
            <p style={styles.headerSubtitle}>
              Welcome to Smart Inventory Management System
            </p>
          </div>
          <button 
            style={styles.refreshBtn} 
            onClick={() => fetchDashboardData(selectedYear, selectedMonth, selectedWeek)}
          >
            <HiOutlineArrowPath size={16} style={{display:'inline', verticalAlign:'middle'}} /> Refresh Data
          </button>
        </div>
      </div>

      {/* Financial Overview Card */}
      <div style={styles.financialCard}>
        <div style={styles.cardGlow}></div>
        
        <div style={styles.financialHeader}>
          <h2 style={styles.sectionTitle}>
            <HiOutlineArrowTrendingUp size={20} style={{display:'inline', verticalAlign:'middle'}} /> Financial Overview
          </h2>
          
          {/* Date Selection Controls */}
          <div style={styles.controlsRow}>
            <div style={styles.controlGroup}>
              <label style={styles.controlLabel}>Year:</label>
              <select value={selectedYear} onChange={handleYearChange} style={styles.select}>
                {YEARS.map(year => (
                  <option key={year} value={year} style={{ background: '#0f172a' }}>{year}</option>
                ))}
              </select>
            </div>

            <div style={styles.controlGroup}>
              <label style={styles.controlLabel}>Month:</label>
              <select value={selectedMonth} onChange={handleMonthChange} style={styles.select}>
                {MONTHS.map(month => (
                  <option key={month.value} value={month.value} style={{ background: '#0f172a' }}>{month.label}</option>
                ))}
              </select>
            </div>

            <div style={styles.controlGroup}>
              <label style={styles.controlLabel}>Week:</label>
              <select value={selectedWeek} onChange={handleWeekChange} style={styles.select}>
                <option value="" style={{ background: '#0f172a' }}>All Weeks</option>
                {WEEKS.map(week => (
                  <option key={week} value={week} style={{ background: '#0f172a' }}>Week {week}</option>
                ))}
              </select>
            </div>

            <button style={styles.resetBtn} onClick={resetToCurrentPeriod}>
              <HiOutlineArrowPath size={14} style={{display:'inline', verticalAlign:'middle'}} /> Current Period
            </button>
          </div>
        </div>

        {/* Period Badge */}
        <div style={styles.periodBadge}>
          <HiOutlineCalendarDays size={16} style={{display:'inline', verticalAlign:'middle'}} /> Showing data for: <strong>{MONTHS.find(m => m.value === selectedMonth)?.label} {selectedYear}</strong>
          {selectedWeek && <span> • <strong>Week {selectedWeek}</strong></span>}
        </div>

        {/* Period Stats Grid */}
        <div style={styles.periodGrid}>
          {/* Weekly Stats */}
          <div style={{ ...styles.periodCard, borderLeft: '3px solid #3b82f6' }}>
            <h3 style={{ ...styles.periodTitle, color: '#60a5fa' }}>
              <HiOutlineCalendarDays size={16} style={{display:'inline', verticalAlign:'middle'}} /> Week {periodStats?.weekly?.weekNumber || periodStats?.currentWeek || 'Current'} {selectedWeek ? '' : '(Current)'}
            </h3>
            <div>
              <div style={styles.periodRow}>
                <span style={styles.periodLabel}>Sales ({periodStats?.weekly?.salesCount || 0} orders)</span>
                <strong style={{ color: '#4ade80' }}>{formatCurrency(periodStats?.weekly?.sales)}</strong>
              </div>
              <div style={styles.periodRow}>
                <span style={styles.periodLabel}>Purchases</span>
                <strong style={{ color: '#38bdf8' }}>{formatCurrency(periodStats?.weekly?.purchases)}</strong>
              </div>
              <div style={styles.periodRow}>
                <span style={styles.periodLabel}>Cost of Goods</span>
                <span style={{ color: 'rgba(226, 232, 240, 0.8)' }}>{formatCurrency(periodStats?.weekly?.cogs)}</span>
              </div>
              <hr style={styles.periodDivider} />
              <div style={styles.periodRow}>
                <strong style={{ color: '#e2e8f0' }}>Gross Profit</strong>
                <strong style={{ color: (periodStats?.weekly?.grossProfit || 0) >= 0 ? '#4ade80' : '#f87171' }}>
                  {(periodStats?.weekly?.grossProfit || 0) >= 0 ? '+' : ''}{formatCurrency(periodStats?.weekly?.grossProfit)}
                </strong>
              </div>
            </div>
          </div>

          {/* Monthly Stats */}
          <div style={{ ...styles.periodCard, borderLeft: '3px solid #22c55e' }}>
            <h3 style={{ ...styles.periodTitle, color: '#4ade80' }}>
              <HiOutlineCalendarDays size={16} style={{display:'inline', verticalAlign:'middle'}} /> {MONTHS.find(m => m.value === selectedMonth)?.label} {selectedYear}
            </h3>
            <div>
              <div style={styles.periodRow}>
                <span style={styles.periodLabel}>Sales ({periodStats?.monthly?.salesCount || 0} orders)</span>
                <strong style={{ color: '#4ade80' }}>{formatCurrency(periodStats?.monthly?.sales)}</strong>
              </div>
              <div style={styles.periodRow}>
                <span style={styles.periodLabel}>Purchases</span>
                <strong style={{ color: '#38bdf8' }}>{formatCurrency(periodStats?.monthly?.purchases)}</strong>
              </div>
              <div style={styles.periodRow}>
                <span style={styles.periodLabel}>Cost of Goods</span>
                <span style={{ color: 'rgba(226, 232, 240, 0.8)' }}>{formatCurrency(periodStats?.monthly?.cogs)}</span>
              </div>
              <hr style={styles.periodDivider} />
              <div style={styles.periodRow}>
                <strong style={{ color: '#e2e8f0' }}>Gross Profit</strong>
                <strong style={{ color: (periodStats?.monthly?.grossProfit || 0) >= 0 ? '#4ade80' : '#f87171' }}>
                  {(periodStats?.monthly?.grossProfit || 0) >= 0 ? '+' : ''}{formatCurrency(periodStats?.monthly?.grossProfit)}
                </strong>
              </div>
            </div>
          </div>

          {/* Yearly Stats */}
          <div style={{ ...styles.periodCard, borderLeft: '3px solid #f59e0b' }}>
            <h3 style={{ ...styles.periodTitle, color: '#fbbf24' }}>
              <HiOutlineCalendarDays size={16} style={{display:'inline', verticalAlign:'middle'}} /> Year {selectedYear}
            </h3>
            <div>
              <div style={styles.periodRow}>
                <span style={styles.periodLabel}>Sales ({periodStats?.yearly?.salesCount || 0} orders)</span>
                <strong style={{ color: '#4ade80' }}>{formatCurrency(periodStats?.yearly?.sales)}</strong>
              </div>
              <div style={styles.periodRow}>
                <span style={styles.periodLabel}>Purchases</span>
                <strong style={{ color: '#38bdf8' }}>{formatCurrency(periodStats?.yearly?.purchases)}</strong>
              </div>
              <div style={styles.periodRow}>
                <span style={styles.periodLabel}>Cost of Goods</span>
                <span style={{ color: 'rgba(226, 232, 240, 0.8)' }}>{formatCurrency(periodStats?.yearly?.cogs)}</span>
              </div>
              <hr style={styles.periodDivider} />
              <div style={styles.periodRow}>
                <strong style={{ color: '#e2e8f0' }}>Gross Profit</strong>
                <strong style={{ color: (periodStats?.yearly?.grossProfit || 0) >= 0 ? '#4ade80' : '#f87171' }}>
                  {(periodStats?.yearly?.grossProfit || 0) >= 0 ? '+' : ''}{formatCurrency(periodStats?.yearly?.grossProfit)}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid - 8 Cards */}
      <div style={styles.metricsGrid}>
        {/* Total Products */}
        <div style={styles.metricCard}>
          <div style={{ ...styles.metricGlow, background: '#3b82f6' }}></div>
          <div style={{ ...styles.metricIcon, background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}><HiOutlineCube size={24} /></div>
          <div style={styles.metricValue}>{formatNumber(inventory?.TotalProducts)}</div>
          <div style={styles.metricLabel}>Total Products</div>
        </div>

        {/* Inventory Value */}
        <div style={styles.metricCard}>
          <div style={{ ...styles.metricGlow, background: '#06b6d4' }}></div>
          <div style={{ ...styles.metricIcon, background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' }}><HiOutlineBanknotes size={24} /></div>
          <div style={styles.metricValue}>{formatCurrency(inventory?.TotalInventoryValue)}</div>
          <div style={styles.metricLabel}>Inventory Value</div>
        </div>

        {/* Monthly Revenue */}
        <div style={styles.metricCard}>
          <div style={{ ...styles.metricGlow, background: '#22c55e' }}></div>
          <div style={{ ...styles.metricIcon, background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}><HiOutlineBanknotes size={24} /></div>
          <div style={styles.metricValue}>{formatCurrency(sales?.TotalRevenue)}</div>
          <div style={styles.metricLabel}>This Month's Revenue</div>
        </div>

        {/* Sales Count */}
        <div style={styles.metricCard}>
          <div style={{ ...styles.metricGlow, background: '#8b5cf6' }}></div>
          <div style={{ ...styles.metricIcon, background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}><HiOutlineShoppingCart size={24} /></div>
          <div style={styles.metricValue}>{formatNumber(sales?.TotalSales)}</div>
          <div style={styles.metricLabel}>Sales This Month</div>
        </div>

        {/* Low Stock */}
        <div style={styles.metricCard}>
          <div style={{ ...styles.metricGlow, background: '#f59e0b' }}></div>
          <div style={{ ...styles.metricIcon, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}><HiOutlineExclamationTriangle size={24} /></div>
          <div style={styles.metricValue}>{formatNumber(inventory?.LowStockProducts)}</div>
          <div style={styles.metricLabel}>Low Stock Items</div>
        </div>

        {/* Out of Stock */}
        <div style={styles.metricCard}>
          <div style={{ ...styles.metricGlow, background: '#ef4444' }}></div>
          <div style={{ ...styles.metricIcon, background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}><HiOutlineXCircle size={24} /></div>
          <div style={styles.metricValue}>{formatNumber(inventory?.OutOfStockProducts)}</div>
          <div style={styles.metricLabel}>Out of Stock</div>
        </div>

        {/* Active Alerts */}
        <div style={styles.metricCard}>
          <div style={{ ...styles.metricGlow, background: '#f43f5e' }}></div>
          <div style={{ ...styles.metricIcon, background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' }}><HiOutlineBell size={24} /></div>
          <div style={styles.metricValue}>{formatNumber(alerts?.TotalUnresolvedAlerts)}</div>
          <div style={styles.metricLabel}>Active Alerts</div>
        </div>

        {/* Purchases */}
        <div style={styles.metricCard}>
          <div style={{ ...styles.metricGlow, background: '#0ea5e9' }}></div>
          <div style={{ ...styles.metricIcon, background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' }}><HiOutlineInboxArrowDown size={24} /></div>
          <div style={styles.metricValue}>{formatCurrency(purchases?.TotalPurchaseCost)}</div>
          <div style={styles.metricLabel}>Purchases This Month</div>
        </div>
      </div>

      {/* Two Column Grid - Recent Sales & Top Products */}
      <div style={styles.twoColGrid}>
        {/* Recent Sales */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}><HiOutlineArrowTrendingUp size={20} style={{display:'inline', verticalAlign:'middle'}} /> Recent Sales</h2>
            <Link href="/sales" style={styles.viewBtn}>View All →</Link>
          </div>
          
          {recentSales && recentSales.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={{ ...styles.th, borderRadius: '8px 0 0 0' }}>Product</th>
                    <th style={styles.th}>Qty</th>
                    <th style={styles.th}>Amount</th>
                    <th style={{ ...styles.th, borderRadius: '0 8px 0 0' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSales.map((sale) => (
                    <tr key={sale.SaleID}>
                      <td style={{ ...styles.td, fontWeight: '500' }}>{sale.ProductName}</td>
                      <td style={styles.td}>{sale.Quantity}</td>
                      <td style={{ ...styles.td, color: '#4ade80', fontWeight: '600' }}>{formatCurrency(sale.TotalAmount)}</td>
                      <td style={{ ...styles.td, color: 'rgba(148, 163, 184, 0.8)' }}>{new Date(sale.SaleDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={styles.emptyState}><HiOutlineInboxStack size={16} style={{display:'inline', verticalAlign:'middle'}} /> No recent sales</div>
          )}
        </div>

        {/* Top Products */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}><HiOutlineTrophy size={20} style={{display:'inline', verticalAlign:'middle'}} /> Top Selling Products</h2>
            <span style={styles.badge}>This Month</span>
          </div>
          
          {topProducts && topProducts.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={{ ...styles.th, borderRadius: '8px 0 0 0' }}>Product</th>
                    <th style={styles.th}>Units Sold</th>
                    <th style={{ ...styles.th, borderRadius: '0 8px 0 0' }}>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, index) => (
                    <tr key={product.ProductID}>
                      <td style={{ ...styles.td, fontWeight: '500' }}>
                        <span style={{ 
                          ...styles.rankBadge,
                          background: index === 0 ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' : 
                                     index === 1 ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)' : 
                                     index === 2 ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' : 'rgba(59, 130, 246, 0.3)',
                          color: 'white',
                        }}>
                          {index + 1}
                        </span>
                        {product.ProductName}
                      </td>
                      <td style={styles.td}>{formatNumber(product.UnitsSold)}</td>
                      <td style={{ ...styles.td, color: '#4ade80', fontWeight: '600' }}>{formatCurrency(product.Revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={styles.emptyState}><HiOutlineChartBar size={16} style={{display:'inline', verticalAlign:'middle'}} /> No sales data for this month</div>
          )}
        </div>
      </div>

      {/* Category Distribution */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}><HiOutlineTag size={20} style={{display:'inline', verticalAlign:'middle'}} /> Category Distribution</h2>
          <Link href="/categories" style={styles.viewBtn}>Manage Categories →</Link>
        </div>
        
        {categories && categories.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ ...styles.th, borderRadius: '8px 0 0 0' }}>Category</th>
                  <th style={styles.th}>Products</th>
                  <th style={styles.th}>Total Stock</th>
                  <th style={{ ...styles.th, borderRadius: '0 8px 0 0' }}>Inventory Value</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={index}>
                    <td style={{ ...styles.td, fontWeight: '600' }}>{category.CategoryName}</td>
                    <td style={styles.td}>
                      <span style={styles.countBadge}>{formatNumber(category.ProductCount)}</span>
                    </td>
                    <td style={styles.td}>{formatNumber(category.TotalStock)} units</td>
                    <td style={{ ...styles.td, color: '#4ade80', fontWeight: '600' }}>{formatCurrency(category.InventoryValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={styles.emptyState}><HiOutlineFolderOpen size={16} style={{display:'inline', verticalAlign:'middle'}} /> No categories found</div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={styles.quickActions}>
        <h2 style={styles.quickTitle}><HiOutlineBolt size={20} style={{display:'inline', verticalAlign:'middle'}} /> Quick Actions</h2>
        <div style={styles.actionsGrid}>
          <Link href="/products/add" style={{ ...styles.actionBtn, background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.35)' }}>
            <HiOutlinePlusCircle size={16} style={{display:'inline', verticalAlign:'middle'}} /> Add Product
          </Link>
          <Link href="/sales/add" style={{ ...styles.actionBtn, background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: 'white', boxShadow: '0 4px 15px rgba(34, 197, 94, 0.35)' }}>
            <HiOutlineShoppingCart size={16} style={{display:'inline', verticalAlign:'middle'}} /> New Sale
          </Link>
          <Link href="/purchases/add" style={{ ...styles.actionBtn, background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', color: 'white', boxShadow: '0 4px 15px rgba(6, 182, 212, 0.35)' }}>
            <HiOutlineInboxArrowDown size={16} style={{display:'inline', verticalAlign:'middle'}} /> New Purchase
          </Link>
          <Link href="/alerts/low-stock" style={{ ...styles.actionBtn, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.35)' }}>
            <HiOutlineExclamationTriangle size={16} style={{display:'inline', verticalAlign:'middle'}} /> View Low Stock
          </Link>
          <Link href="/alerts" style={{ ...styles.actionBtn, background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.35)' }}>
            <HiOutlineBell size={16} style={{display:'inline', verticalAlign:'middle'}} /> View Alerts
          </Link>
        </div>
      </div>
      
      {/* Keyframe animation */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
