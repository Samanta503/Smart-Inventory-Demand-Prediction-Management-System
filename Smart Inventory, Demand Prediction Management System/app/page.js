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

// Dashboard Styles matching sidebar theme
const dashboardStyles = {
  container: {
    padding: '0',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  },
  header: {
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    padding: '2rem 2.5rem',
    borderRadius: '0 0 24px 24px',
    marginBottom: '2rem',
    boxShadow: '0 10px 40px rgba(15, 23, 42, 0.15)',
    position: 'relative',
    overflow: 'hidden',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  headerContent: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  headerTitle: {
    color: 'white',
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    letterSpacing: '-0.5px',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '1rem',
    fontWeight: '400',
  },
  refreshBtn: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
  },
  content: {
    padding: '0 2rem 2rem',
  },
  financialCard: {
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    borderRadius: '20px',
    padding: '1.75rem',
    marginBottom: '2rem',
    boxShadow: '0 10px 40px rgba(15, 23, 42, 0.12)',
    position: 'relative',
    overflow: 'hidden',
  },
  financialCardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  financialHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
    position: 'relative',
    zIndex: 1,
  },
  financialTitle: {
    color: 'white',
    fontSize: '1.25rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  controlsContainer: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  controlGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  controlLabel: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
  select: {
    padding: '0.5rem 0.75rem',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    fontSize: '13px',
    cursor: 'pointer',
    outline: 'none',
    minWidth: '110px',
    backdropFilter: 'blur(10px)',
  },
  resetBtn: {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  periodBadge: {
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
    padding: '0.6rem 1.2rem',
    borderRadius: '10px',
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '1.25rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    position: 'relative',
    zIndex: 1,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    position: 'relative',
    zIndex: 1,
  },
  periodCard: {
    padding: '1.25rem',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  periodCardTitle: {
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  periodRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
    fontSize: '13px',
  },
  periodLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  divider: {
    margin: '0.75rem 0',
    border: 'none',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1.25rem',
    marginBottom: '2rem',
  },
  metricCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
    border: '1px solid rgba(0, 0, 0, 0.04)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
  },
  metricIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    marginBottom: '1rem',
  },
  metricValue: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '0.25rem',
  },
  metricLabel: {
    fontSize: '0.875rem',
    color: '#64748b',
    fontWeight: '500',
  },
  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '1.5rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
    border: '1px solid rgba(0, 0, 0, 0.04)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #f1f5f9',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e293b',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  viewAllBtn: {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
    color: '#475569',
    fontSize: '13px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '0.75rem 1rem',
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid #f1f5f9',
    background: '#f8fafc',
  },
  td: {
    padding: '0.875rem 1rem',
    fontSize: '14px',
    color: '#334155',
    borderBottom: '1px solid #f1f5f9',
  },
  quickActionsCard: {
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    borderRadius: '20px',
    padding: '1.75rem',
    boxShadow: '0 10px 40px rgba(15, 23, 42, 0.12)',
    marginTop: '1.5rem',
  },
  quickActionsTitle: {
    color: 'white',
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  quickActionsGrid: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  actionBtn: {
    padding: '0.75rem 1.25rem',
    borderRadius: '12px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    fontSize: '14px',
  },
  emptyState: {
    padding: '2rem',
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '14px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '1rem',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  errorCard: {
    background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
    borderRadius: '16px',
    padding: '1.5rem',
    margin: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    border: '1px solid #fecaca',
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
      <div style={dashboardStyles.container}>
        <div style={dashboardStyles.loadingContainer}>
          <div style={dashboardStyles.spinner}></div>
          <p style={{ color: '#64748b', fontWeight: '500' }}>Loading dashboard...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div style={dashboardStyles.container}>
        <div style={dashboardStyles.errorCard}>
          <span style={{ fontSize: '2rem' }}>⚠️</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: '600', color: '#991b1b', marginBottom: '0.25rem' }}>Error Loading Dashboard</p>
            <p style={{ color: '#b91c1c', fontSize: '14px' }}>{error}</p>
          </div>
          <button 
            onClick={fetchDashboardData} 
            style={{
              ...dashboardStyles.refreshBtn,
              background: '#ef4444',
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
            }}
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  // Destructure data for easier access
  const { inventory, sales, purchases, periodStats, alerts, recentSales, topProducts, categories } = data || {};

  return (
    <div style={dashboardStyles.container}>
      {/* Animated Header */}
      <div style={dashboardStyles.header}>
        <div style={dashboardStyles.headerOverlay}></div>
        <div style={dashboardStyles.headerContent}>
          <div>
            <h1 style={dashboardStyles.headerTitle}>📊 Dashboard</h1>
            <p style={dashboardStyles.headerSubtitle}>
              Welcome to Smart Inventory Management System
            </p>
          </div>
          <button 
            style={dashboardStyles.refreshBtn} 
            onClick={() => fetchDashboardData(selectedYear, selectedMonth, selectedWeek)}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            🔄 Refresh Data
          </button>
        </div>
      </div>

      <div style={dashboardStyles.content}>
        {/* Financial Overview Card with Dark Theme */}
        <div style={dashboardStyles.financialCard}>
          <div style={dashboardStyles.financialCardOverlay}></div>
          
          <div style={dashboardStyles.financialHeader}>
            <h2 style={dashboardStyles.financialTitle}>
              <span>💹</span> Financial Overview
            </h2>
            
            {/* Date Selection Controls */}
            <div style={dashboardStyles.controlsContainer}>
              {/* Year Selector */}
              <div style={dashboardStyles.controlGroup}>
                <label style={dashboardStyles.controlLabel}>Year:</label>
                <select 
                  value={selectedYear} 
                  onChange={handleYearChange}
                  style={dashboardStyles.select}
                >
                  {YEARS.map(year => (
                    <option key={year} value={year} style={{ background: '#1e293b' }}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Month Selector */}
              <div style={dashboardStyles.controlGroup}>
                <label style={dashboardStyles.controlLabel}>Month:</label>
                <select 
                  value={selectedMonth} 
                  onChange={handleMonthChange}
                  style={dashboardStyles.select}
                >
                  {MONTHS.map(month => (
                    <option key={month.value} value={month.value} style={{ background: '#1e293b' }}>{month.label}</option>
                  ))}
                </select>
              </div>

              {/* Week Selector */}
              <div style={dashboardStyles.controlGroup}>
                <label style={dashboardStyles.controlLabel}>Week:</label>
                <select 
                  value={selectedWeek} 
                  onChange={handleWeekChange}
                  style={dashboardStyles.select}
                >
                  <option value="" style={{ background: '#1e293b' }}>All Weeks</option>
                  {WEEKS.map(week => (
                    <option key={week} value={week} style={{ background: '#1e293b' }}>Week {week}</option>
                  ))}
                </select>
              </div>

              {/* Reset Button */}
              <button 
                style={dashboardStyles.resetBtn} 
                onClick={resetToCurrentPeriod}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
              >
                ↻ Current Period
              </button>
            </div>
          </div>

          {/* Selected Period Display */}
          <div style={dashboardStyles.periodBadge}>
            📅 Showing data for: <strong>{MONTHS.find(m => m.value === selectedMonth)?.label} {selectedYear}</strong>
            {selectedWeek && <span> • <strong>Week {selectedWeek}</strong></span>}
          </div>

          <div style={dashboardStyles.statsGrid}>
            {/* Weekly Stats */}
            <div style={{ ...dashboardStyles.periodCard, borderTop: '3px solid #3b82f6' }}>
              <h3 style={{ ...dashboardStyles.periodCardTitle, color: '#60a5fa' }}>
                📅 Week {periodStats?.weekly?.weekNumber || periodStats?.currentWeek || 'Current'} {selectedWeek ? '' : '(Current)'}
              </h3>
              <div>
                <div style={dashboardStyles.periodRow}>
                  <span style={dashboardStyles.periodLabel}>Sales ({periodStats?.weekly?.salesCount || 0} orders)</span>
                  <strong style={{ color: '#4ade80' }}>{formatCurrency(periodStats?.weekly?.sales)}</strong>
                </div>
                <div style={dashboardStyles.periodRow}>
                  <span style={dashboardStyles.periodLabel}>Purchases</span>
                  <strong style={{ color: '#38bdf8' }}>{formatCurrency(periodStats?.weekly?.purchases)}</strong>
                </div>
                <div style={dashboardStyles.periodRow}>
                  <span style={dashboardStyles.periodLabel}>Cost of Goods</span>
                  <span style={{ color: 'rgba(255,255,255,0.8)' }}>{formatCurrency(periodStats?.weekly?.cogs)}</span>
                </div>
                <hr style={dashboardStyles.divider} />
                <div style={dashboardStyles.periodRow}>
                  <strong style={{ color: 'white' }}>Gross Profit</strong>
                  <strong style={{ 
                    color: (periodStats?.weekly?.grossProfit || 0) >= 0 ? '#4ade80' : '#f87171' 
                  }}>
                    {(periodStats?.weekly?.grossProfit || 0) >= 0 ? '+' : ''}{formatCurrency(periodStats?.weekly?.grossProfit)}
                  </strong>
                </div>
              </div>
            </div>

            {/* Monthly Stats */}
            <div style={{ ...dashboardStyles.periodCard, borderTop: '3px solid #22c55e' }}>
              <h3 style={{ ...dashboardStyles.periodCardTitle, color: '#4ade80' }}>
                📆 {MONTHS.find(m => m.value === selectedMonth)?.label} {selectedYear}
              </h3>
              <div>
                <div style={dashboardStyles.periodRow}>
                  <span style={dashboardStyles.periodLabel}>Sales ({periodStats?.monthly?.salesCount || 0} orders)</span>
                  <strong style={{ color: '#4ade80' }}>{formatCurrency(periodStats?.monthly?.sales)}</strong>
                </div>
                <div style={dashboardStyles.periodRow}>
                  <span style={dashboardStyles.periodLabel}>Purchases</span>
                  <strong style={{ color: '#38bdf8' }}>{formatCurrency(periodStats?.monthly?.purchases)}</strong>
                </div>
                <div style={dashboardStyles.periodRow}>
                  <span style={dashboardStyles.periodLabel}>Cost of Goods</span>
                  <span style={{ color: 'rgba(255,255,255,0.8)' }}>{formatCurrency(periodStats?.monthly?.cogs)}</span>
                </div>
                <hr style={dashboardStyles.divider} />
                <div style={dashboardStyles.periodRow}>
                  <strong style={{ color: 'white' }}>Gross Profit</strong>
                  <strong style={{ 
                    color: (periodStats?.monthly?.grossProfit || 0) >= 0 ? '#4ade80' : '#f87171' 
                  }}>
                    {(periodStats?.monthly?.grossProfit || 0) >= 0 ? '+' : ''}{formatCurrency(periodStats?.monthly?.grossProfit)}
                  </strong>
                </div>
              </div>
            </div>

            {/* Yearly Stats */}
            <div style={{ ...dashboardStyles.periodCard, borderTop: '3px solid #f59e0b' }}>
              <h3 style={{ ...dashboardStyles.periodCardTitle, color: '#fbbf24' }}>
                📅 Year {selectedYear}
              </h3>
              <div>
                <div style={dashboardStyles.periodRow}>
                  <span style={dashboardStyles.periodLabel}>Sales ({periodStats?.yearly?.salesCount || 0} orders)</span>
                  <strong style={{ color: '#4ade80' }}>{formatCurrency(periodStats?.yearly?.sales)}</strong>
                </div>
                <div style={dashboardStyles.periodRow}>
                  <span style={dashboardStyles.periodLabel}>Purchases</span>
                  <strong style={{ color: '#38bdf8' }}>{formatCurrency(periodStats?.yearly?.purchases)}</strong>
                </div>
                <div style={dashboardStyles.periodRow}>
                  <span style={dashboardStyles.periodLabel}>Cost of Goods</span>
                  <span style={{ color: 'rgba(255,255,255,0.8)' }}>{formatCurrency(periodStats?.yearly?.cogs)}</span>
                </div>
                <hr style={dashboardStyles.divider} />
                <div style={dashboardStyles.periodRow}>
                  <strong style={{ color: 'white' }}>Gross Profit</strong>
                  <strong style={{ 
                    color: (periodStats?.yearly?.grossProfit || 0) >= 0 ? '#4ade80' : '#f87171' 
                  }}>
                    {(periodStats?.yearly?.grossProfit || 0) >= 0 ? '+' : ''}{formatCurrency(periodStats?.yearly?.grossProfit)}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Statistics Cards */}
        <div style={dashboardStyles.metricsGrid}>
          {/* Total Products */}
          <div 
            style={dashboardStyles.metricCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(59, 130, 246, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.04)';
            }}
          >
            <div style={{ ...dashboardStyles.metricIcon, background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
              📦
            </div>
            <div style={dashboardStyles.metricValue}>{formatNumber(inventory?.TotalProducts)}</div>
            <div style={dashboardStyles.metricLabel}>Total Products</div>
          </div>

          {/* Total Inventory Value */}
          <div 
            style={dashboardStyles.metricCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(6, 182, 212, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.04)';
            }}
          >
            <div style={{ ...dashboardStyles.metricIcon, background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' }}>
              💎
            </div>
            <div style={dashboardStyles.metricValue}>{formatCurrency(inventory?.TotalInventoryValue)}</div>
            <div style={dashboardStyles.metricLabel}>Inventory Value</div>
          </div>

          {/* Monthly Revenue */}
          <div 
            style={dashboardStyles.metricCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(34, 197, 94, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.04)';
            }}
          >
            <div style={{ ...dashboardStyles.metricIcon, background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}>
              💰
            </div>
            <div style={dashboardStyles.metricValue}>{formatCurrency(sales?.TotalRevenue)}</div>
            <div style={dashboardStyles.metricLabel}>This Month's Revenue</div>
          </div>

          {/* Monthly Sales Count */}
          <div 
            style={dashboardStyles.metricCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(139, 92, 246, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.04)';
            }}
          >
            <div style={{ ...dashboardStyles.metricIcon, background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
              🛒
            </div>
            <div style={dashboardStyles.metricValue}>{formatNumber(sales?.TotalSales)}</div>
            <div style={dashboardStyles.metricLabel}>Sales This Month</div>
          </div>

          {/* Low Stock Alert */}
          <div 
            style={dashboardStyles.metricCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(245, 158, 11, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.04)';
            }}
          >
            <div style={{ ...dashboardStyles.metricIcon, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
              ⚠️
            </div>
            <div style={dashboardStyles.metricValue}>{formatNumber(inventory?.LowStockProducts)}</div>
            <div style={dashboardStyles.metricLabel}>Low Stock Items</div>
          </div>

          {/* Out of Stock */}
          <div 
            style={dashboardStyles.metricCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(239, 68, 68, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.04)';
            }}
          >
            <div style={{ ...dashboardStyles.metricIcon, background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
              ❌
            </div>
            <div style={dashboardStyles.metricValue}>{formatNumber(inventory?.OutOfStockProducts)}</div>
            <div style={dashboardStyles.metricLabel}>Out of Stock</div>
          </div>

          {/* Unresolved Alerts */}
          <div 
            style={dashboardStyles.metricCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(239, 68, 68, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.04)';
            }}
          >
            <div style={{ ...dashboardStyles.metricIcon, background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' }}>
              🔔
            </div>
            <div style={dashboardStyles.metricValue}>{formatNumber(alerts?.TotalUnresolvedAlerts)}</div>
            <div style={dashboardStyles.metricLabel}>Active Alerts</div>
          </div>

          {/* Monthly Purchases */}
          <div 
            style={dashboardStyles.metricCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(59, 130, 246, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.04)';
            }}
          >
            <div style={{ ...dashboardStyles.metricIcon, background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' }}>
              📥
            </div>
            <div style={dashboardStyles.metricValue}>{formatCurrency(purchases?.TotalPurchaseCost)}</div>
            <div style={dashboardStyles.metricLabel}>Purchases This Month</div>
          </div>
        </div>

        {/* Content Grid - Two columns */}
        <div style={dashboardStyles.twoColumnGrid}>
          {/* Recent Sales Card */}
          <div style={dashboardStyles.card}>
            <div style={dashboardStyles.cardHeader}>
              <h2 style={dashboardStyles.cardTitle}>
                <span>💹</span> Recent Sales
              </h2>
              <Link href="/sales" style={dashboardStyles.viewAllBtn}>
                View All →
              </Link>
            </div>
            
            {recentSales && recentSales.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={dashboardStyles.table}>
                  <thead>
                    <tr>
                      <th style={{ ...dashboardStyles.th, borderRadius: '8px 0 0 0' }}>Product</th>
                      <th style={dashboardStyles.th}>Qty</th>
                      <th style={dashboardStyles.th}>Amount</th>
                      <th style={{ ...dashboardStyles.th, borderRadius: '0 8px 0 0' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSales.map((sale) => (
                      <tr key={sale.SaleID} style={{ transition: 'background 0.2s' }}>
                        <td style={{ ...dashboardStyles.td, fontWeight: '500' }}>{sale.ProductName}</td>
                        <td style={dashboardStyles.td}>{sale.Quantity}</td>
                        <td style={{ ...dashboardStyles.td, color: '#22c55e', fontWeight: '600' }}>{formatCurrency(sale.TotalAmount)}</td>
                        <td style={{ ...dashboardStyles.td, color: '#64748b' }}>{new Date(sale.SaleDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={dashboardStyles.emptyState}>
                <p>📭 No recent sales</p>
              </div>
            )}
          </div>

          {/* Top Products Card */}
          <div style={dashboardStyles.card}>
            <div style={dashboardStyles.cardHeader}>
              <h2 style={dashboardStyles.cardTitle}>
                <span>🏆</span> Top Selling Products
              </h2>
              <span style={{ fontSize: '12px', color: '#94a3b8', background: '#f1f5f9', padding: '0.35rem 0.75rem', borderRadius: '20px' }}>This Month</span>
            </div>
            
            {topProducts && topProducts.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={dashboardStyles.table}>
                  <thead>
                    <tr>
                      <th style={{ ...dashboardStyles.th, borderRadius: '8px 0 0 0' }}>Product</th>
                      <th style={dashboardStyles.th}>Units Sold</th>
                      <th style={{ ...dashboardStyles.th, borderRadius: '0 8px 0 0' }}>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product, index) => (
                      <tr key={product.ProductID}>
                        <td style={{ ...dashboardStyles.td, fontWeight: '500' }}>
                          <span style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            width: '24px', 
                            height: '24px', 
                            borderRadius: '50%', 
                            fontSize: '12px', 
                            fontWeight: '700',
                            marginRight: '0.5rem',
                            background: index === 0 ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' : 
                                       index === 1 ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)' : 
                                       index === 2 ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' : '#e2e8f0',
                            color: index < 3 ? 'white' : '#64748b',
                          }}>
                            {index + 1}
                          </span>
                          {product.ProductName}
                        </td>
                        <td style={dashboardStyles.td}>{formatNumber(product.UnitsSold)}</td>
                        <td style={{ ...dashboardStyles.td, color: '#22c55e', fontWeight: '600' }}>{formatCurrency(product.Revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={dashboardStyles.emptyState}>
                <p>📊 No sales data for this month</p>
              </div>
            )}
          </div>
        </div>

        {/* Category Distribution */}
        <div style={dashboardStyles.card}>
          <div style={dashboardStyles.cardHeader}>
            <h2 style={dashboardStyles.cardTitle}>
              <span>🏷️</span> Category Distribution
            </h2>
            <Link href="/categories" style={dashboardStyles.viewAllBtn}>
              Manage Categories →
            </Link>
          </div>
          
          {categories && categories.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={dashboardStyles.table}>
                <thead>
                  <tr>
                    <th style={{ ...dashboardStyles.th, borderRadius: '8px 0 0 0' }}>Category</th>
                    <th style={dashboardStyles.th}>Products</th>
                    <th style={dashboardStyles.th}>Total Stock</th>
                    <th style={{ ...dashboardStyles.th, borderRadius: '0 8px 0 0' }}>Inventory Value</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr key={index}>
                      <td style={{ ...dashboardStyles.td, fontWeight: '600' }}>
                        {category.CategoryName}
                      </td>
                      <td style={dashboardStyles.td}>
                        <span style={{ 
                          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', 
                          color: '#3b82f6', 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '20px', 
                          fontSize: '13px',
                          fontWeight: '600'
                        }}>
                          {formatNumber(category.ProductCount)}
                        </span>
                      </td>
                      <td style={dashboardStyles.td}>{formatNumber(category.TotalStock)} units</td>
                      <td style={{ ...dashboardStyles.td, color: '#22c55e', fontWeight: '600' }}>{formatCurrency(category.InventoryValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={dashboardStyles.emptyState}>
              <p>📁 No categories found</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={dashboardStyles.quickActionsCard}>
          <h2 style={dashboardStyles.quickActionsTitle}>
            <span>⚡</span> Quick Actions
          </h2>
          <div style={dashboardStyles.quickActionsGrid}>
            <Link 
              href="/products/add" 
              style={{ 
                ...dashboardStyles.actionBtn, 
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
              }}
            >
              ➕ Add Product
            </Link>
            <Link 
              href="/sales/add" 
              style={{ 
                ...dashboardStyles.actionBtn, 
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                color: 'white',
                boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)',
              }}
            >
              🛒 New Sale
            </Link>
            <Link 
              href="/purchases/add" 
              style={{ 
                ...dashboardStyles.actionBtn, 
                background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                color: 'white',
                boxShadow: '0 4px 15px rgba(6, 182, 212, 0.4)',
              }}
            >
              📥 New Purchase
            </Link>
            <Link 
              href="/alerts/low-stock" 
              style={{ 
                ...dashboardStyles.actionBtn, 
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: 'white',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
              }}
            >
              ⚠️ View Low Stock
            </Link>
            <Link 
              href="/alerts" 
              style={{ 
                ...dashboardStyles.actionBtn, 
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
              }}
            >
              🔔 View Alerts
            </Link>
          </div>
        </div>
      </div>
      
      {/* Global keyframe animation */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
