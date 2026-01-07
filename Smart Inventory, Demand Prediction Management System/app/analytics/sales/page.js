'use client';

/**
 * Sales Analytics Page
 * ====================
 * 
 * View monthly sales trends and demand analysis.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SalesAnalyticsPage() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/monthly-sales');
      const result = await response.json();
      if (result.success) {
        setMonthlyData(result.data);
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD',
    }).format(value || 0);
  }

  // Calculate summary statistics
  const totalRevenue = monthlyData.reduce((sum, m) => sum + (m.TotalRevenue || 0), 0);
  const totalUnits = monthlyData.reduce((sum, m) => sum + (m.TotalUnitsSold || 0), 0);
  const avgMonthlyRevenue = monthlyData.length > 0 ? totalRevenue / monthlyData.length : 0;
  const maxMonth = monthlyData.reduce((max, m) => (m.TotalRevenue > (max?.TotalRevenue || 0)) ? m : max, null);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading analytics...
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">📊 Sales Analytics</h1>
          <p className="page-subtitle">Monthly sales trends and demand analysis</p>
        </div>
        <Link href="/" className="btn btn-ghost">
          ← Back to Dashboard
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Summary Stats */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <span className="stat-icon">💰</span>
          <span className="stat-value">{formatCurrency(totalRevenue)}</span>
          <span className="stat-label">Total Revenue</span>
        </div>
        <div className="stat-card success">
          <span className="stat-icon">📦</span>
          <span className="stat-value">{totalUnits.toLocaleString()}</span>
          <span className="stat-label">Units Sold</span>
        </div>
        <div className="stat-card info">
          <span className="stat-icon">📅</span>
          <span className="stat-value">{formatCurrency(avgMonthlyRevenue)}</span>
          <span className="stat-label">Avg Monthly Revenue</span>
        </div>
        <div className="stat-card warning">
          <span className="stat-icon">🏆</span>
          <span className="stat-value">{maxMonth ? `${maxMonth.MonthName} ${maxMonth.SalesYear}` : 'N/A'}</span>
          <span className="stat-label">Best Month</span>
        </div>
      </div>

      {monthlyData.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Monthly Breakdown Table */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>📅 Monthly Breakdown</h3>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Sales</th>
                    <th>Units</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((month, index) => (
                    <tr key={index}>
                      <td>
                        <strong>{month.MonthName}</strong>
                        <span className="text-muted" style={{ marginLeft: '0.5rem' }}>
                          {month.SalesYear}
                        </span>
                      </td>
                      <td>{month.TotalSales}</td>
                      <td>{month.TotalUnitsSold}</td>
                      <td>
                        <strong style={{ color: 'var(--success-color)' }}>
                          {formatCurrency(month.TotalRevenue)}
                        </strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Revenue Visualization */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>📈 Revenue Trend</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {monthlyData.map((month, index) => {
                const maxRevenue = Math.max(...monthlyData.map(m => m.TotalRevenue));
                const percentage = maxRevenue > 0 ? (month.TotalRevenue / maxRevenue) * 100 : 0;
                
                return (
                  <div key={index}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '13px' }}>
                        {month.MonthName} {month.SalesYear}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: '600' }}>
                        {formatCurrency(month.TotalRevenue)}
                      </span>
                    </div>
                    <div style={{ 
                      backgroundColor: 'var(--bg-tertiary)', 
                      borderRadius: '4px', 
                      height: '24px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, var(--primary-color), var(--success-color))`,
                        borderRadius: '4px',
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <span className="icon">📊</span>
            <h3>No sales data available</h3>
            <p>Start recording sales to see analytics</p>
            <Link href="/sales/add" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Add Sale
            </Link>
          </div>
        </div>
      )}

      {/* Analysis Insights */}
      {monthlyData.length > 0 && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>💡 Demand Insights</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'var(--bg-tertiary)', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📈</div>
              <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Growth Trend</div>
              <div className="text-muted" style={{ fontSize: '13px' }}>
                {monthlyData.length >= 2 
                  ? monthlyData[0].TotalRevenue > monthlyData[1]?.TotalRevenue
                    ? 'Revenue increasing'
                    : 'Revenue stabilizing'
                  : 'More data needed'}
              </div>
            </div>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'var(--bg-tertiary)', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎯</div>
              <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Avg Basket Size</div>
              <div className="text-muted" style={{ fontSize: '13px' }}>
                {totalUnits > 0 
                  ? `${(totalRevenue / totalUnits).toFixed(2)} per unit`
                  : 'No data'}
              </div>
            </div>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'var(--bg-tertiary)', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔄</div>
              <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Sales Velocity</div>
              <div className="text-muted" style={{ fontSize: '13px' }}>
                {monthlyData.length > 0 
                  ? `${Math.round(totalUnits / monthlyData.length)} units/month avg`
                  : 'No data'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
