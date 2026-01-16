'use client';

/**
 * Customers Page
 * ==============
 * 
 * View and manage customers with purchase history.
 */

import React, { useState, useEffect } from 'react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [expandedCustomer, setExpandedCustomer] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      setLoading(true);
      const response = await fetch('/api/customers');
      const result = await response.json();
      if (result.success) {
        setCustomers(result.data || []);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (result.success) {
        setFormData({ customerName: '', email: '', phone: '', address: '', city: '', country: '' });
        setShowForm(false);
        fetchCustomers();
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading customers...
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">👥 Customers</h1>
          <p className="page-subtitle">Manage your customers</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '➕ Add Customer'}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Add Customer Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Add New Customer</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Customer Name *</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Customer'}
            </button>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <span className="stat-icon">👥</span>
          <span className="stat-value">{customers.length}</span>
          <span className="stat-label">Total Customers</span>
        </div>
        <div className="stat-card success">
          <span className="stat-icon">💰</span>
          <span className="stat-value">{formatCurrency(customers.reduce((sum, c) => sum + parseFloat(c.TotalSpent || 0), 0))}</span>
          <span className="stat-label">Total Revenue</span>
        </div>
        <div className="stat-card info">
          <span className="stat-icon">🛒</span>
          <span className="stat-value">{customers.reduce((sum, c) => sum + parseInt(c.TotalOrders || 0), 0)}</span>
          <span className="stat-label">Total Orders</span>
        </div>
      </div>

      {/* Customers Table */}
      <div className="card">
        {customers.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Orders</th>
                  <th>Items Bought</th>
                  <th>Total Spent</th>
                  <th>Last Purchase</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <React.Fragment key={customer.CustomerID}>
                    <tr 
                      style={{ cursor: 'pointer' }}
                      onClick={() => setExpandedCustomer(expandedCustomer === customer.CustomerID ? null : customer.CustomerID)}
                    >
                      <td style={{ width: '40px' }}>
                        <span style={{ fontSize: '12px' }}>
                          {expandedCustomer === customer.CustomerID ? '▼' : '▶'}
                        </span>
                      </td>
                      <td>#{customer.CustomerID}</td>
                      <td><strong>{customer.CustomerName}</strong></td>
                      <td>{customer.Email || '-'}</td>
                      <td>{customer.Phone || '-'}</td>
                      <td>
                        <span className="badge badge-info">{customer.TotalOrders || 0}</span>
                      </td>
                      <td>{customer.TotalItemsBought || 0} items</td>
                      <td><strong style={{ color: 'var(--success-color)' }}>{formatCurrency(customer.TotalSpent)}</strong></td>
                      <td>
                        {customer.LastPurchaseDate 
                          ? new Date(customer.LastPurchaseDate).toLocaleDateString() 
                          : <span className="text-muted">Never</span>
                        }
                      </td>
                    </tr>
                    {expandedCustomer === customer.CustomerID && (
                      <tr>
                        <td colSpan="9" style={{ padding: '0', backgroundColor: 'var(--bg-tertiary)' }}>
                          <div style={{ padding: '1rem 1rem 1rem 3rem' }}>
                            {/* Customer Details */}
                            <div style={{ 
                              display: 'grid', 
                              gridTemplateColumns: 'repeat(4, 1fr)', 
                              gap: '1rem', 
                              marginBottom: '1rem',
                              padding: '1rem',
                              backgroundColor: 'var(--bg-secondary)',
                              borderRadius: '8px'
                            }}>
                              <div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Address</div>
                                <div>{customer.Address || '-'}</div>
                              </div>
                              <div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>City</div>
                                <div>{customer.City || '-'}</div>
                              </div>
                              <div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Country</div>
                                <div>{customer.Country || '-'}</div>
                              </div>
                              <div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Customer Since</div>
                                <div>{new Date(customer.CreatedAt).toLocaleDateString()}</div>
                              </div>
                            </div>

                            {/* Purchase History */}
                            <h4 style={{ marginBottom: '0.75rem', fontSize: '14px' }}>📜 Purchase History</h4>
                            {customer.purchaseHistory && customer.purchaseHistory.length > 0 ? (
                              <table className="table" style={{ marginBottom: 0 }}>
                                <thead>
                                  <tr>
                                    <th>Invoice</th>
                                    <th>Date</th>
                                    <th>Product</th>
                                    <th>Qty</th>
                                    <th>Unit Price</th>
                                    <th>Total</th>
                                    <th>Warehouse</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {customer.purchaseHistory.map((item, idx) => (
                                    <tr key={idx}>
                                      <td>
                                        <code style={{ 
                                          backgroundColor: 'var(--bg-primary)', 
                                          padding: '2px 6px', 
                                          borderRadius: '4px',
                                          fontSize: '11px'
                                        }}>
                                          {item.InvoiceNumber}
                                        </code>
                                      </td>
                                      <td>{new Date(item.SaleDate).toLocaleDateString()}</td>
                                      <td>
                                        <strong>{item.ProductName}</strong>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.ProductCode}</div>
                                      </td>
                                      <td>{item.Quantity}</td>
                                      <td>{formatCurrency(item.UnitPrice)}</td>
                                      <td><strong>{formatCurrency(item.LineTotal)}</strong></td>
                                      <td style={{ fontSize: '12px' }}>{item.WarehouseName}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <div style={{ 
                                padding: '1rem', 
                                textAlign: 'center', 
                                color: 'var(--text-muted)',
                                backgroundColor: 'var(--bg-secondary)',
                                borderRadius: '8px'
                              }}>
                                No purchases yet
                              </div>
                            )}
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
            <span className="icon">👥</span>
            <h3>No customers yet</h3>
            <p>Add your first customer to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD',
  }).format(value || 0);
}
