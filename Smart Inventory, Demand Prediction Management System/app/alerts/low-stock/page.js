'use client';

/**
 * Low Stock Alerts Page
 * =====================
 * 
 * Displays products that are running low on stock
 * and need to be reordered.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LowStockPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetchLowStock();
  }, []);

  /**
   * Fetch low stock products from API
   */
  async function fetchLowStock() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/products/low-stock');
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      setProducts(result.data || []);
      setSummary(result.summary || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Format currency
   */
  function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value || 0);
  }

  /**
   * Get urgency badge
   */
  function getUrgencyBadge(level) {
    if (level.includes('CRITICAL')) return 'badge badge-danger';
    if (level.includes('HIGH')) return 'badge badge-warning';
    return 'badge badge-info';
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading low stock products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <span>⚠️</span>
        Error: {error}
        <button className="btn btn-sm btn-secondary" onClick={fetchLowStock} style={{ marginLeft: 'auto' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">⚠️ Low Stock Products</h1>
          <p className="page-subtitle">
            Products that need to be reordered
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={fetchLowStock}>
            🔄 Refresh
          </button>
          <Link href="/purchases/add" className="btn btn-primary">
            📥 Create Purchase Order
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="stats-grid">
          <div className="stat-card warning">
            <span className="stat-icon">📦</span>
            <span className="stat-value">{summary.totalLowStockProducts}</span>
            <span className="stat-label">Low Stock Products</span>
          </div>
          <div className="stat-card danger">
            <span className="stat-icon">❌</span>
            <span className="stat-value">{summary.outOfStockCount}</span>
            <span className="stat-label">Out of Stock</span>
          </div>
          <div className="stat-card danger">
            <span className="stat-icon">🚨</span>
            <span className="stat-value">{summary.criticalCount}</span>
            <span className="stat-label">Critical Priority</span>
          </div>
          <div className="stat-card info">
            <span className="stat-icon">💰</span>
            <span className="stat-value">{formatCurrency(summary.totalEstimatedRestockCost)}</span>
            <span className="stat-label">Est. Restock Cost</span>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="card">
        {products.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Urgency</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Current Stock</th>
                  <th>Reorder Level</th>
                  <th>Units Needed</th>
                  <th>Suggested Order</th>
                  <th>Est. Cost</th>
                  <th>Supplier</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.ProductID}>
                    <td>
                      <span className={getUrgencyBadge(product.UrgencyLevel)}>
                        {product.UrgencyLevel.split(' - ')[0]}
                      </span>
                    </td>
                    <td>
                      <strong>{product.ProductName}</strong>
                      <div className="text-muted" style={{ fontSize: '12px' }}>
                        {product.ProductCode}
                      </div>
                    </td>
                    <td>{product.CategoryName}</td>
                    <td>
                      <span className={product.CurrentStock === 0 ? 'text-danger' : 'text-warning'}>
                        <strong>{product.CurrentStock}</strong>
                      </span>
                      <span className="text-muted"> {product.Unit}</span>
                    </td>
                    <td>{product.ReorderLevel}</td>
                    <td className="text-danger">
                      <strong>{product.UnitsNeeded > 0 ? product.UnitsNeeded : 0}</strong>
                    </td>
                    <td>
                      <strong>{product.SuggestedOrderQuantity}</strong>
                      <span className="text-muted"> {product.Unit}</span>
                    </td>
                    <td>{formatCurrency(product.EstimatedRestockCost)}</td>
                    <td>
                      <div>{product.SupplierName}</div>
                      {product.SupplierPhone && (
                        <div className="text-muted" style={{ fontSize: '11px' }}>
                          📞 {product.SupplierPhone}
                        </div>
                      )}
                      {product.SupplierEmail && (
                        <div className="text-muted" style={{ fontSize: '11px' }}>
                          ✉️ {product.SupplierEmail}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <span className="icon">✅</span>
            <h3>All stocked up!</h3>
            <p>No products are currently below their reorder level.</p>
          </div>
        )}
      </div>

      {/* Back Link */}
      <div className="card">
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/alerts" className="btn btn-secondary">
            ← Back to Alerts
          </Link>
          <Link href="/products" className="btn btn-secondary">
            View All Products
          </Link>
        </div>
      </div>
    </div>
  );
}
