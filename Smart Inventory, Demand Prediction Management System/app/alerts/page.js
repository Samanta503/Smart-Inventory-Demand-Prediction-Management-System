'use client';

import { HiOutlineExclamationTriangle, HiOutlineBell, HiOutlineArrowPath, HiOutlineExclamationCircle, HiOutlineXCircle, HiOutlineArrowTrendingDown, HiOutlineCheckCircle, HiOutlineSparkles, HiOutlineNoSymbol, HiOutlineInboxArrowDown, HiOutlineCube } from 'react-icons/hi2';

/**
 * Alerts Page
 * ===========
 * 
 * Displays all inventory alerts (low stock, out of stock)
 * with the ability to filter and resolve alerts.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('unresolved');
  const [summary, setSummary] = useState(null);

  // Fetch alerts when component mounts or filter changes
  useEffect(() => {
    fetchAlerts();
  }, [filter]);

  /**
   * Fetch alerts from API
   */
  async function fetchAlerts() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/alerts?status=${filter}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      setAlerts(result.data || []);
      setSummary(result.summary || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Resolve an alert
   */
  async function resolveAlert(alertId) {
    try {
      const response = await fetch('/api/alerts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          alertId,
          resolvedBy: 'User',
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      // Refresh alerts list
      fetchAlerts();
    } catch (err) {
      alert('Failed to resolve alert: ' + err.message);
    }
  }

  /**
   * Get urgency badge class
   */
  function getUrgencyBadge(urgency) {
    switch (urgency) {
      case 'CRITICAL':
        return 'badge badge-danger';
      case 'HIGH':
        return 'badge badge-warning';
      default:
        return 'badge badge-info';
    }
  }

  /**
   * Get alert type badge
   */
  function getAlertTypeBadge(type) {
    switch (type) {
      case 'OUT_OF_STOCK':
        return 'badge badge-danger';
      case 'LOW_STOCK':
        return 'badge badge-warning';
      default:
        return 'badge badge-secondary';
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading alerts...
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="alert alert-danger">
        <span><HiOutlineExclamationTriangle size={20} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /></span>
        Error: {error}
        <button className="btn btn-sm btn-secondary" onClick={fetchAlerts} style={{ marginLeft: 'auto' }}>
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
          <h1 className="page-title"><HiOutlineBell size={24} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> Inventory Alerts</h1>
          <p className="page-subtitle">
            Monitor and manage inventory alerts
          </p>
        </div>
        <button className="btn btn-primary" onClick={fetchAlerts}>
          <HiOutlineArrowPath size={16} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> Refresh
        </button>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="stats-grid">
          <div className="stat-card danger">
            <span className="stat-icon"><HiOutlineExclamationCircle size={24} /></span>
            <span className="stat-value">{summary.criticalCount}</span>
            <span className="stat-label">Critical</span>
          </div>
          <div className="stat-card warning">
            <span className="stat-icon"><HiOutlineExclamationTriangle size={24} /></span>
            <span className="stat-value">{summary.highCount}</span>
            <span className="stat-label">High Priority</span>
          </div>
          <div className="stat-card danger">
            <span className="stat-icon"><HiOutlineXCircle size={24} /></span>
            <span className="stat-value">{summary.outOfStockCount}</span>
            <span className="stat-label">Out of Stock</span>
          </div>
          <div className="stat-card warning">
            <span className="stat-icon"><HiOutlineArrowTrendingDown size={24} /></span>
            <span className="stat-value">{summary.lowStockCount}</span>
            <span className="stat-label">Low Stock</span>
          </div>
        </div>
      )}

      {/* Filter Buttons */}
      <div className="card">
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn ${filter === 'unresolved' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('unresolved')}
          >
            Unresolved ({filter === 'unresolved' ? alerts.length : '...'})
          </button>
          <button
            className={`btn ${filter === 'resolved' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('resolved')}
          >
            Resolved
          </button>
          <button
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('all')}
          >
            All Alerts
          </button>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="card">
        {alerts.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Urgency</th>
                  <th>Type</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Message</th>
                  <th>Supplier</th>
                  <th>Date</th>
                  {filter !== 'resolved' && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert) => (
                  <tr key={alert.AlertID}>
                    <td>
                      <span className={getUrgencyBadge(alert.Urgency)}>
                        {alert.Urgency}
                      </span>
                    </td>
                    <td>
                      <span className={getAlertTypeBadge(alert.AlertType)}>
                        {alert.AlertType.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <strong>{alert.ProductName}</strong>
                      <div className="text-muted" style={{ fontSize: '12px' }}>
                        {alert.ProductCode}
                      </div>
                    </td>
                    <td>{alert.CategoryName}</td>
                    <td>
                      <span className={alert.LatestStock === 0 ? 'text-danger' : 'text-warning'}>
                        <strong>{alert.LatestStock}</strong>
                      </span>
                      <span className="text-muted"> / {alert.ReorderLevel}</span>
                    </td>
                    <td style={{ maxWidth: '250px', fontSize: '13px' }}>
                      {alert.Message}
                    </td>
                    <td>
                      {alert.SupplierName}
                      {alert.SupplierEmail && (
                        <div className="text-muted" style={{ fontSize: '11px' }}>
                          {alert.SupplierEmail}
                        </div>
                      )}
                    </td>
                    <td>{new Date(alert.CreatedAt).toLocaleDateString()}</td>
                    {filter !== 'resolved' && (
                      <td>
                        {!alert.IsResolved && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => resolveAlert(alert.AlertID)}
                          >
                            <HiOutlineCheckCircle size={16} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> Resolve
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <span className="icon"><HiOutlineSparkles size={48} /></span>
            <h3>No {filter} alerts</h3>
            <p>
              {filter === 'unresolved' 
                ? 'All inventory alerts have been resolved!' 
                : 'No alerts found with this filter.'}
            </p>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="card">
        <h3 className="card-title">Quick Links</h3>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Link href="/alerts/low-stock" className="btn btn-warning" style={{ backgroundColor: 'var(--warning-color)', color: 'white' }}>
            <HiOutlineExclamationTriangle size={16} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> View Low Stock Products
          </Link>
          <Link href="/alerts/dead-stock" className="btn btn-secondary">
            <HiOutlineNoSymbol size={16} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> View Dead Stock
          </Link>
          <Link href="/purchases/add" className="btn btn-info" style={{ backgroundColor: 'var(--info-color)', color: 'white' }}>
            <HiOutlineInboxArrowDown size={16} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> Create Purchase Order
          </Link>
        </div>
      </div>
    </div>
  );
}
