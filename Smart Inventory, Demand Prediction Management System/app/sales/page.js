'use client';

/**
 * Sales List Page
 * ===============
 * 
 * Displays all sales transactions with multi-item support.
 */

import { useState, useEffect } from 'react';
import React from 'react';
import Link from 'next/link';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSale, setExpandedSale] = useState(null);

  useEffect(() => {
    fetchSales();
  }, []);

  async function fetchSales() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/sales');
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      setSales(result.data || []);
      setSummary(result.summary || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value || 0);
  }

  const filteredSales = sales.filter(sale =>
    sale.InvoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.CustomerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.WarehouseName?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <div className="stat-card warning">
            <span className="stat-icon">📦</span>
            <span className="stat-value">{summary.totalItemsSold || 0}</span>
            <span className="stat-label">Items Sold</span>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="card">
        <input
          type="text"
          className="form-input"
          placeholder="Search by invoice, customer, or warehouse..."
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
                  <th>Customer</th>
                  <th>Warehouse</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <React.Fragment key={sale.SaleID}>
                    <tr>
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
                      <td><strong>{sale.CustomerName}</strong></td>
                      <td>
                        <span style={{ fontSize: '12px' }}>🏭 {sale.WarehouseName}</span>
                      </td>
                      <td>
                        <span className="badge badge-info">{sale.ItemCount} items</span>
                      </td>
                      <td><strong style={{ color: 'var(--success)' }}>{formatCurrency(sale.TotalAmount)}</strong></td>
                      <td>
                        <span className={`badge ${sale.Status === 'COMPLETED' ? 'badge-success' : 'badge-warning'}`}>
                          {sale.Status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-ghost"
                          onClick={() => setExpandedSale(expandedSale === sale.SaleID ? null : sale.SaleID)}
                        >
                          {expandedSale === sale.SaleID ? '▲ Hide' : '▼ Details'}
                        </button>
                      </td>
                    </tr>
                    {expandedSale === sale.SaleID && sale.items && (
                      <tr>
                        <td colSpan="8" style={{ padding: '0', background: 'var(--bg-tertiary)' }}>
                          <div style={{ padding: '1rem' }}>
                            <h4 style={{ margin: '0 0 0.5rem', fontSize: '14px' }}>Items in this sale:</h4>
                            <table className="table" style={{ margin: 0, background: 'var(--bg-secondary)' }}>
                              <thead>
                                <tr>
                                  <th>Product</th>
                                  <th>Code</th>
                                  <th>Qty</th>
                                  <th>Unit Price</th>
                                  <th>Line Total</th>
                                  <th>Profit</th>
                                </tr>
                              </thead>
                              <tbody>
                                {sale.items.map(item => (
                                  <tr key={item.SaleItemID}>
                                    <td>{item.ProductName}</td>
                                    <td><code style={{ fontSize: '10px' }}>{item.ProductCode}</code></td>
                                    <td>{item.Quantity}</td>
                                    <td>{formatCurrency(item.UnitPrice)}</td>
                                    <td><strong>{formatCurrency(item.LineTotal)}</strong></td>
                                    <td style={{ color: 'var(--success)' }}>{formatCurrency(item.Profit)}</td>
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
          <div className="empty-state">
            <span className="icon">💰</span>
            <h3>No sales found</h3>
            <p>Record your first sale to get started</p>
            <Link href="/sales/add" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              New Sale
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
