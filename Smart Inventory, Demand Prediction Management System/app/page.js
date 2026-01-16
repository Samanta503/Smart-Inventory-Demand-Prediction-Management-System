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
      <div className="loading">
        <div className="spinner"></div>
        Loading dashboard...
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="alert alert-danger">
        <span>⚠️</span>
        Error: {error}
        <button className="btn btn-sm btn-secondary" onClick={fetchDashboardData} style={{ marginLeft: 'auto' }}>
          Retry
        </button>
      </div>
    );
  }

  // Destructure data for easier access
  const { inventory, sales, purchases, periodStats, alerts, recentSales, topProducts, categories } = data || {};

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome to Smart Inventory Management System
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => fetchDashboardData(selectedYear, selectedMonth, selectedWeek)}>
          🔄 Refresh
        </button>
      </div>

      {/* Period Statistics - Weekly, Monthly, Yearly */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 className="card-title" style={{ margin: 0 }}>📊 Financial Overview</h2>
          
          {/* Date Selection Controls */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Year Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Year:</label>
              <select 
                value={selectedYear} 
                onChange={handleYearChange}
                className="form-input"
                style={{ padding: '0.4rem 0.75rem', minWidth: '100px' }}
              >
                {YEARS.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Month Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Month:</label>
              <select 
                value={selectedMonth} 
                onChange={handleMonthChange}
                className="form-input"
                style={{ padding: '0.4rem 0.75rem', minWidth: '120px' }}
              >
                {MONTHS.map(month => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </select>
            </div>

            {/* Week Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Week:</label>
              <select 
                value={selectedWeek} 
                onChange={handleWeekChange}
                className="form-input"
                style={{ padding: '0.4rem 0.75rem', minWidth: '100px' }}
              >
                <option value="">All Weeks</option>
                {WEEKS.map(week => (
                  <option key={week} value={week}>Week {week}</option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            <button 
              className="btn btn-sm btn-secondary" 
              onClick={resetToCurrentPeriod}
              style={{ padding: '0.4rem 0.75rem' }}
            >
              ↻ Current
            </button>
          </div>
        </div>

        {/* Selected Period Display */}
        <div style={{ 
          marginBottom: '1rem', 
          padding: '0.5rem 1rem', 
          backgroundColor: 'var(--bg-tertiary)', 
          borderRadius: '6px',
          fontSize: '13px'
        }}>
          📅 Showing data for: <strong>{MONTHS.find(m => m.value === selectedMonth)?.label} {selectedYear}</strong>
          {selectedWeek && <span> • <strong>Week {selectedWeek}</strong></span>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          
          {/* Weekly Stats */}
          <div style={{ 
            padding: '1rem', 
            backgroundColor: 'var(--bg-secondary)', 
            borderRadius: '8px',
            border: '2px solid var(--primary-color)'
          }}>
            <h3 style={{ fontSize: '14px', color: 'var(--primary-color)', marginBottom: '1rem' }}>
              📅 Week {periodStats?.weekly?.weekNumber || periodStats?.currentWeek || 'Current'} {selectedWeek ? '' : '(Current)'}
            </h3>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Sales ({periodStats?.weekly?.salesCount || 0} orders)</span>
                <strong style={{ color: 'var(--success-color)' }}>{formatCurrency(periodStats?.weekly?.sales)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Purchases</span>
                <strong style={{ color: 'var(--info-color)' }}>{formatCurrency(periodStats?.weekly?.purchases)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Cost of Goods</span>
                <span>{formatCurrency(periodStats?.weekly?.cogs)}</span>
              </div>
              <hr style={{ margin: '0.5rem 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>Gross Profit</strong>
                <strong style={{ 
                  color: (periodStats?.weekly?.grossProfit || 0) >= 0 ? 'var(--success-color)' : 'var(--danger-color)' 
                }}>
                  {(periodStats?.weekly?.grossProfit || 0) >= 0 ? '+' : ''}{formatCurrency(periodStats?.weekly?.grossProfit)}
                </strong>
              </div>
            </div>
          </div>

          {/* Monthly Stats */}
          <div style={{ 
            padding: '1rem', 
            backgroundColor: 'var(--bg-secondary)', 
            borderRadius: '8px',
            border: '2px solid var(--success-color)'
          }}>
            <h3 style={{ fontSize: '14px', color: 'var(--success-color)', marginBottom: '1rem' }}>
              📆 {MONTHS.find(m => m.value === selectedMonth)?.label} {selectedYear}
            </h3>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Sales ({periodStats?.monthly?.salesCount || 0} orders)</span>
                <strong style={{ color: 'var(--success-color)' }}>{formatCurrency(periodStats?.monthly?.sales)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Purchases</span>
                <strong style={{ color: 'var(--info-color)' }}>{formatCurrency(periodStats?.monthly?.purchases)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Cost of Goods</span>
                <span>{formatCurrency(periodStats?.monthly?.cogs)}</span>
              </div>
              <hr style={{ margin: '0.5rem 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>Gross Profit</strong>
                <strong style={{ 
                  color: (periodStats?.monthly?.grossProfit || 0) >= 0 ? 'var(--success-color)' : 'var(--danger-color)' 
                }}>
                  {(periodStats?.monthly?.grossProfit || 0) >= 0 ? '+' : ''}{formatCurrency(periodStats?.monthly?.grossProfit)}
                </strong>
              </div>
            </div>
          </div>

          {/* Yearly Stats */}
          <div style={{ 
            padding: '1rem', 
            backgroundColor: 'var(--bg-secondary)', 
            borderRadius: '8px',
            border: '2px solid var(--warning-color)'
          }}>
            <h3 style={{ fontSize: '14px', color: 'var(--warning-color)', marginBottom: '1rem' }}>
              📅 Year {selectedYear}
            </h3>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Sales ({periodStats?.yearly?.salesCount || 0} orders)</span>
                <strong style={{ color: 'var(--success-color)' }}>{formatCurrency(periodStats?.yearly?.sales)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Purchases</span>
                <strong style={{ color: 'var(--info-color)' }}>{formatCurrency(periodStats?.yearly?.purchases)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Cost of Goods</span>
                <span>{formatCurrency(periodStats?.yearly?.cogs)}</span>
              </div>
              <hr style={{ margin: '0.5rem 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>Gross Profit</strong>
                <strong style={{ 
                  color: (periodStats?.yearly?.grossProfit || 0) >= 0 ? 'var(--success-color)' : 'var(--danger-color)' 
                }}>
                  {(periodStats?.yearly?.grossProfit || 0) >= 0 ? '+' : ''}{formatCurrency(periodStats?.yearly?.grossProfit)}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Statistics Cards */}
      <div className="stats-grid">
        {/* Total Products */}
        <div className="stat-card primary">
          <span className="stat-icon">📦</span>
          <span className="stat-value">{formatNumber(inventory?.TotalProducts)}</span>
          <span className="stat-label">Total Products</span>
        </div>

        {/* Total Inventory Value */}
        <div className="stat-card info">
          <span className="stat-icon">💎</span>
          <span className="stat-value">{formatCurrency(inventory?.TotalInventoryValue)}</span>
          <span className="stat-label">Inventory Value</span>
        </div>

        {/* Monthly Revenue */}
        <div className="stat-card success">
          <span className="stat-icon">💰</span>
          <span className="stat-value">{formatCurrency(sales?.TotalRevenue)}</span>
          <span className="stat-label">This Month's Revenue</span>
        </div>

        {/* Monthly Sales Count */}
        <div className="stat-card success">
          <span className="stat-icon">🛒</span>
          <span className="stat-value">{formatNumber(sales?.TotalSales)}</span>
          <span className="stat-label">Sales This Month</span>
        </div>

        {/* Low Stock Alert */}
        <div className="stat-card warning">
          <span className="stat-icon">⚠️</span>
          <span className="stat-value">{formatNumber(inventory?.LowStockProducts)}</span>
          <span className="stat-label">Low Stock Items</span>
        </div>

        {/* Out of Stock */}
        <div className="stat-card danger">
          <span className="stat-icon">❌</span>
          <span className="stat-value">{formatNumber(inventory?.OutOfStockProducts)}</span>
          <span className="stat-label">Out of Stock</span>
        </div>

        {/* Unresolved Alerts */}
        <div className="stat-card danger">
          <span className="stat-icon">🔔</span>
          <span className="stat-value">{formatNumber(alerts?.TotalUnresolvedAlerts)}</span>
          <span className="stat-label">Active Alerts</span>
        </div>

        {/* Monthly Purchases */}
        <div className="stat-card info">
          <span className="stat-icon">📥</span>
          <span className="stat-value">{formatCurrency(purchases?.TotalPurchaseCost)}</span>
          <span className="stat-label">Purchases This Month</span>
        </div>
      </div>

      {/* Content Grid - Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {/* Recent Sales Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Sales</h2>
            <Link href="/sales" className="btn btn-sm btn-secondary">
              View All
            </Link>
          </div>
          
          {recentSales && recentSales.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSales.map((sale) => (
                    <tr key={sale.SaleID}>
                      <td>{sale.ProductName}</td>
                      <td>{sale.Quantity}</td>
                      <td>{formatCurrency(sale.TotalAmount)}</td>
                      <td>{new Date(sale.SaleDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>No recent sales</p>
            </div>
          )}
        </div>

        {/* Top Products Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Top Selling Products</h2>
            <span className="card-subtitle">This Month</span>
          </div>
          
          {topProducts && topProducts.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Units Sold</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product) => (
                    <tr key={product.ProductID}>
                      <td>{product.ProductName}</td>
                      <td>{formatNumber(product.UnitsSold)}</td>
                      <td>{formatCurrency(product.Revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>No sales data for this month</p>
            </div>
          )}
        </div>
      </div>

      {/* Category Distribution */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="card-header">
          <h2 className="card-title">Category Distribution</h2>
          <Link href="/categories" className="btn btn-sm btn-secondary">
            Manage Categories
          </Link>
        </div>
        
        {categories && categories.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Products</th>
                  <th>Total Stock</th>
                  <th>Inventory Value</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={index}>
                    <td>
                      <strong>{category.CategoryName}</strong>
                    </td>
                    <td>{formatNumber(category.ProductCount)}</td>
                    <td>{formatNumber(category.TotalStock)} units</td>
                    <td>{formatCurrency(category.InventoryValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>No categories found</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h2 className="card-title" style={{ marginBottom: '1rem' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/products/add" className="btn btn-primary">
            ➕ Add Product
          </Link>
          <Link href="/sales/add" className="btn btn-success">
            🛒 New Sale
          </Link>
          <Link href="/purchases/add" className="btn btn-info" style={{ backgroundColor: 'var(--info-color)', color: 'white' }}>
            📥 New Purchase
          </Link>
          <Link href="/alerts/low-stock" className="btn btn-warning" style={{ backgroundColor: 'var(--warning-color)', color: 'white' }}>
            ⚠️ View Low Stock
          </Link>
          <Link href="/alerts" className="btn btn-danger">
            🔔 View Alerts
          </Link>
        </div>
      </div>
    </div>
  );
}
