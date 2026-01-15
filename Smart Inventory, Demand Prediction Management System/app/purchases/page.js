'use client';

/**
 * Purchases Page
 * ==============
 * 
 * View all purchase records with multi-item support.
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [expandedPurchase, setExpandedPurchase] = useState(null);

  useEffect(() => {
    fetchPurchases();
  }, []);

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
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD',
    }).format(value || 0);
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading purchases...
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">📥 Purchases</h1>
          <p className="page-subtitle">Track incoming stock from suppliers</p>
        </div>
        <Link href="/purchases/add" className="btn btn-primary">
          ➕ New Purchase
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger">
          <span>⚠️</span> {error}
        </div>
      )}

      {summary && (
        <div className="stats-grid">
          <div className="stat-card primary">
            <span className="stat-icon">📝</span>
            <span className="stat-value">{summary.totalPurchases}</span>
            <span className="stat-label">Total Purchases</span>
          </div>
          <div className="stat-card info">
            <span className="stat-icon">📦</span>
            <span className="stat-value">{summary.totalUnits}</span>
            <span className="stat-label">Units Received</span>
          </div>
          <div className="stat-card warning">
            <span className="stat-icon">💰</span>
            <span className="stat-value">{formatCurrency(summary.totalCost)}</span>
            <span className="stat-label">Total Cost</span>
          </div>
        </div>
      )}

      <div className="card">
        {purchases.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>Reference</th>
                  <th>Date</th>
                  <th>Supplier</th>
                  <th>Warehouse</th>
                  <th>Items</th>
                  <th>Total Cost</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase) => (
                  <React.Fragment key={purchase.PurchaseID}>
                    <tr 
                      style={{ cursor: 'pointer' }}
                      onClick={() => setExpandedPurchase(expandedPurchase === purchase.PurchaseID ? null : purchase.PurchaseID)}
                    >
                      <td style={{ width: '40px' }}>
                        <span style={{ fontSize: '12px' }}>
                          {expandedPurchase === purchase.PurchaseID ? '▼' : '▶'}
                        </span>
                      </td>
                      <td>
                        <code style={{ 
                          backgroundColor: 'var(--bg-tertiary)', 
                          padding: '2px 6px', 
                          borderRadius: '4px',
                          fontSize: '11px'
                        }}>
                          {purchase.ReferenceNumber}
                        </code>
                      </td>
                      <td>{new Date(purchase.PurchaseDate).toLocaleDateString()}</td>
                      <td><strong>{purchase.SupplierName}</strong></td>
                      <td>{purchase.WarehouseName}</td>
                      <td>
                        <span className="badge badge-info">
                          {purchase.items?.length || 0} items
                        </span>
                      </td>
                      <td><strong>{formatCurrency(purchase.TotalCost)}</strong></td>
                      <td className="text-muted" style={{ fontSize: '12px', maxWidth: '150px' }}>
                        {purchase.Notes || '-'}
                      </td>
                    </tr>
                    {expandedPurchase === purchase.PurchaseID && purchase.items && (
                      <tr>
                        <td colSpan="8" style={{ padding: '0', backgroundColor: 'var(--bg-tertiary)' }}>
                          <div style={{ padding: '1rem 1rem 1rem 3rem' }}>
                            <table className="table" style={{ marginBottom: 0 }}>
                              <thead>
                                <tr>
                                  <th>Product</th>
                                  <th>Quantity</th>
                                  <th>Unit Cost</th>
                                  <th>Line Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {purchase.items.map((item, idx) => (
                                  <tr key={idx}>
                                    <td>
                                      <strong>{item.ProductName}</strong>
                                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.ProductCode}</div>
                                    </td>
                                    <td>{item.Quantity}</td>
                                    <td>{formatCurrency(item.UnitCost)}</td>
                                    <td><strong>{formatCurrency(item.LineTotal)}</strong></td>
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
            <span className="icon">📥</span>
            <h3>No purchases yet</h3>
            <p>Record your first purchase to start tracking inventory</p>
            <Link href="/purchases/add" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Add Purchase
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
