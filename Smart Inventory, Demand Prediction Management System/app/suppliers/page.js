'use client';

/**
 * Suppliers Page
 * ==============
 * 
 * Manage suppliers - view all suppliers and add new ones.
 */

import { useState, useEffect } from 'react';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    supplierName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  async function fetchSuppliers() {
    try {
      setLoading(true);
      const response = await fetch('/api/suppliers');
      const result = await response.json();
      if (result.success) {
        setSuppliers(result.data || []);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSupplier),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      setNewSupplier({
        supplierName: '', contactPerson: '', email: '',
        phone: '', address: '', city: '', country: '',
      });
      setShowForm(false);
      fetchSuppliers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
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
        Loading suppliers...
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">🏢 Suppliers</h1>
          <p className="page-subtitle">Manage your product suppliers</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '➕ Add Supplier'}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          <span>⚠️</span> {error}
        </div>
      )}

      {showForm && (
        <div className="card">
          <h3 className="card-title">Add New Supplier</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Supplier Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={newSupplier.supplierName}
                  onChange={(e) => setNewSupplier({ ...newSupplier, supplierName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Person</label>
                <input
                  type="text"
                  className="form-input"
                  value={newSupplier.contactPerson}
                  onChange={(e) => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={newSupplier.email}
                  onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-input"
                  value={newSupplier.phone}
                  onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-input"
                value={newSupplier.address}
                onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-input"
                  value={newSupplier.city}
                  onChange={(e) => setNewSupplier({ ...newSupplier, city: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  className="form-input"
                  value={newSupplier.country}
                  onChange={(e) => setNewSupplier({ ...newSupplier, country: e.target.value })}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Supplier'}
            </button>
          </form>
        </div>
      )}

      <div className="card">
        {suppliers.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Supplier</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>Products</th>
                  <th>Inventory Value</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((sup) => (
                  <tr key={sup.SupplierID}>
                    <td>
                      <strong>{sup.SupplierName}</strong>
                      {sup.ContactPerson && (
                        <div className="text-muted" style={{ fontSize: '12px' }}>
                          {sup.ContactPerson}
                        </div>
                      )}
                    </td>
                    <td>
                      {sup.Email && <div style={{ fontSize: '13px' }}>✉️ {sup.Email}</div>}
                      {sup.Phone && <div style={{ fontSize: '13px' }}>📞 {sup.Phone}</div>}
                    </td>
                    <td>
                      {sup.City && sup.Country 
                        ? `${sup.City}, ${sup.Country}`
                        : sup.City || sup.Country || '-'
                      }
                    </td>
                    <td>
                      <span className="badge badge-info">{sup.ProductCount}</span>
                    </td>
                    <td>{formatCurrency(sup.TotalInventoryValue)}</td>
                    <td>
                      <span className={`badge ${sup.IsActive ? 'badge-success' : 'badge-secondary'}`}>
                        {sup.IsActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <span className="icon">🏢</span>
            <h3>No suppliers yet</h3>
            <p>Add your first supplier to start managing inventory</p>
          </div>
        )}
      </div>
    </div>
  );
}
