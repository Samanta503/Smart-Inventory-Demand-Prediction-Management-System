'use client';

/**
 * Purchases Page
 * ==============
 * 
 * View all purchase records (stock in transactions).
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetchPurchases();
  }, []);

  async function fetchPurchases() {
    try {
      setLoading(true);
      const response = await fetch('/api/purchases');
      const result = await response.json();
      if (result.success) {
        setPurchases(result.data);
        setSummary(result.summary);
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
                  <th>Reference</th>
                  <th>Date</th>
                  <th>Product</th>
                  <th>Supplier</th>
                  <th>Quantity</th>
                  <th>Unit Cost</th>
                  <th>Total Cost</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase) => (
                  <tr key={purchase.PurchaseID}>
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
                    <td>
                      <strong>{purchase.ProductName}</strong>
                      <div className="text-muted" style={{ fontSize: '11px' }}>
                        {purchase.ProductCode}
                      </div>
                    </td>
                    <td>{purchase.SupplierName}</td>
                    <td><strong>{purchase.Quantity}</strong></td>
                    <td>{formatCurrency(purchase.UnitCost)}</td>
                    <td><strong>{formatCurrency(purchase.TotalCost)}</strong></td>
                    <td className="text-muted" style={{ fontSize: '12px', maxWidth: '150px' }}>
                      {purchase.Notes || '-'}
                    </td>
                  </tr>
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
