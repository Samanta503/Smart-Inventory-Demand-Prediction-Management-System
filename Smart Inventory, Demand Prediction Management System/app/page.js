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
  async function fetchDashboardData() {
    try {
      setLoading(true);
      setError(null);

      // Fetch data from our dashboard API
      const response = await fetch('/api/analytics/dashboard');
      
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
  const { inventory, sales, purchases, alerts, recentSales, topProducts, categories } = data || {};

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
        <button className="btn btn-primary" onClick={fetchDashboardData}>
          🔄 Refresh
        </button>
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
