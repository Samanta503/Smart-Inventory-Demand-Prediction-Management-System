'use client';

/**
 * Sales List Page
 * ===============
 * 
 * Displays all sales transactions with filtering and summary.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSales();
  }, []);

  /**
   * Fetch sales from API
   */
  async function fetchSales() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/sales');
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      setSales(result.data);
      setSummary(result.summary);
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
   * Filter sales based on search
   */
  const filteredSales = sales.filter(sale =>
    sale.ProductName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.InvoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.CustomerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading sales...
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <span>⚠️</span>
        Error: {error}
        <button className="btn btn-sm btn-secondary" onClick={fetchSales} style={{ marginLeft: 'auto' }}>
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
          <h1 className="page-title">💰 Sales</h1>
          <p className="page-subtitle">
            View and manage sales transactions
          </p>
        </div>
        <Link href="/sales/add" className="btn btn-primary">
          🛒 New Sale
        </Link>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="stats-grid">
          <div className="stat-card primary">
            <span className="stat-icon">📝</span>
            <span className="stat-value">{summary.totalSales}</span>
            <span className="stat-label">Total Sales</span>
          </div>
          <div className="stat-card success">
            <span className="stat-icon">💰</span>
            <span className="stat-value">{formatCurrency(summary.totalRevenue)}</span>
            <span className="stat-label">Total Revenue</span>
          </div>
          <div className="stat-card info">
            <span className="stat-icon">📈</span>
            <span className="stat-value">{formatCurrency(summary.totalProfit)}</span>
            <span className="stat-label">Total Profit</span>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="card">
        <input
          type="text"
          className="form-input"
          placeholder="Search by product, invoice, or customer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Sales Table */}
      <div className="card">
        {filteredSales.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Date</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Customer</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                  <th>Profit</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <tr key={sale.SaleID}>
                    <td>
                      <code style={{ 
                        backgroundColor: 'var(--bg-tertiary)', 
                        padding: '2px 6px', 
                        borderRadius: '4px',
                        fontSize: '11px'
                      }}>
                        {sale.InvoiceNumber}
                      </code>
                    </td>
                    <td>{new Date(sale.SaleDate).toLocaleDateString()}</td>
                    <td>
                      <strong>{sale.ProductName}</strong>
                      <div className="text-muted" style={{ fontSize: '11px' }}>
                        {sale.ProductCode}
                      </div>
                    </td>
                    <td>{sale.CategoryName}</td>
                    <td>{sale.CustomerName || '-'}</td>
                    <td>{sale.Quantity}</td>
                    <td>{formatCurrency(sale.UnitPrice)}</td>
                    <td><strong>{formatCurrency(sale.TotalAmount)}</strong></td>
                    <td className="text-success">
                      {formatCurrency(sale.Profit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <span className="icon">🛒</span>
            <h3>No sales found</h3>
            <p>
              {searchTerm 
                ? 'Try adjusting your search' 
                : 'Start recording your first sale'}
            </p>
            {!searchTerm && (
              <Link href="/sales/add" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Record Sale
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="card">
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/analytics/sales" className="btn btn-primary">
            📈 Sales Analytics
          </Link>
          <Link href="/" className="btn btn-secondary">
            ← Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
