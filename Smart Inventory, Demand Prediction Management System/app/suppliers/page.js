'use client';

/**
 * Suppliers Page
 * ==============
 * 
 * Manage suppliers - view all suppliers and add new ones.
 * Shows which categories each supplier provides.
 */

import { useState, useEffect } from 'react';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expandedSupplier, setExpandedSupplier] = useState(null);
  const [editingCategories, setEditingCategories] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [newSupplier, setNewSupplier] = useState({
    supplierName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    categoryIds: [],
  });

  useEffect(() => {
    fetchSuppliers();
    fetchCategories();
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

  async function fetchCategories() {
    try {
      const response = await fetch('/api/categories');
      const result = await response.json();
      if (result.success) {
        setCategories(result.data || []);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
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
        categoryIds: [],
      });
      setShowForm(false);
      fetchSuppliers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdateCategories(supplierId) {
    try {
      setSubmitting(true);
      const response = await fetch('/api/suppliers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplierId,
          categoryIds: selectedCategories,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      setEditingCategories(null);
      setSelectedCategories([]);
      fetchSuppliers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function startEditingCategories(supplier) {
    setEditingCategories(supplier.SupplierID);
    setSelectedCategories(supplier.categories?.map(c => c.CategoryID) || []);
    setExpandedSupplier(supplier.SupplierID);
  }

  function toggleCategory(categoryId) {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  }

  function toggleNewSupplierCategory(categoryId) {
    setNewSupplier(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId]
    }));
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

            {/* Category Selection for New Supplier */}
            <div className="form-group">
              <label className="form-label">Categories Supplied</label>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '8px',
                padding: '12px',
                backgroundColor: 'var(--card-bg)',
                borderRadius: '8px',
                border: '1px solid var(--border-color)'
              }}>
                {categories.map(cat => (
                  <label 
                    key={cat.CategoryID} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px',
                      padding: '6px 12px',
                      backgroundColor: newSupplier.categoryIds.includes(cat.CategoryID) 
                        ? 'var(--primary-color)' 
                        : 'var(--bg-color)',
                      color: newSupplier.categoryIds.includes(cat.CategoryID) 
                        ? 'white' 
                        : 'inherit',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={newSupplier.categoryIds.includes(cat.CategoryID)}
                      onChange={() => toggleNewSupplierCategory(cat.CategoryID)}
                      style={{ display: 'none' }}
                    />
                    {newSupplier.categoryIds.includes(cat.CategoryID) ? '✓ ' : ''}{cat.CategoryName}
                  </label>
                ))}
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
                  <th>Categories</th>
                  <th>Location</th>
                  <th>Products</th>
                  <th>Inventory Value</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((sup) => (
                  <>
                    <tr 
                      key={sup.SupplierID}
                      onClick={() => setExpandedSupplier(expandedSupplier === sup.SupplierID ? null : sup.SupplierID)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ 
                            transform: expandedSupplier === sup.SupplierID ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease',
                            display: 'inline-block'
                          }}>▶</span>
                          <div>
                            <strong>{sup.SupplierName}</strong>
                            {sup.ContactPerson && (
                              <div className="text-muted" style={{ fontSize: '12px' }}>
                                {sup.ContactPerson}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        {sup.Email && <div style={{ fontSize: '13px' }}>✉️ {sup.Email}</div>}
                        {sup.Phone && <div style={{ fontSize: '13px' }}>📞 {sup.Phone}</div>}
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {sup.categories && sup.categories.length > 0 ? (
                            sup.categories.map(cat => (
                              <span 
                                key={cat.CategoryID} 
                                className="badge badge-info"
                                style={{ fontSize: '11px' }}
                              >
                                {cat.CategoryName}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted" style={{ fontSize: '12px' }}>No categories</span>
                          )}
                        </div>
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
                      <td onClick={(e) => e.stopPropagation()}>
                        <button 
                          className="btn btn-sm"
                          onClick={() => startEditingCategories(sup)}
                          style={{ padding: '4px 8px', fontSize: '12px' }}
                        >
                          ✏️ Categories
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Row for Category Editing */}
                    {expandedSupplier === sup.SupplierID && (
                      <tr key={`${sup.SupplierID}-expanded`}>
                        <td colSpan="8" style={{ backgroundColor: 'var(--bg-color)', padding: '16px' }}>
                          <div>
                            <h4 style={{ marginBottom: '12px' }}>
                              📦 Categories for {sup.SupplierName}
                            </h4>
                            
                            {editingCategories === sup.SupplierID ? (
                              <div>
                                <p style={{ marginBottom: '12px', fontSize: '14px', color: 'var(--text-muted)' }}>
                                  Select the categories this supplier provides:
                                </p>
                                <div style={{ 
                                  display: 'flex', 
                                  flexWrap: 'wrap', 
                                  gap: '8px',
                                  marginBottom: '16px'
                                }}>
                                  {categories.map(cat => (
                                    <label 
                                      key={cat.CategoryID} 
                                      style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '6px',
                                        padding: '8px 16px',
                                        backgroundColor: selectedCategories.includes(cat.CategoryID) 
                                          ? 'var(--primary-color)' 
                                          : 'var(--card-bg)',
                                        color: selectedCategories.includes(cat.CategoryID) 
                                          ? 'white' 
                                          : 'inherit',
                                        borderRadius: '20px',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        transition: 'all 0.2s ease',
                                        border: '1px solid var(--border-color)'
                                      }}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(cat.CategoryID)}
                                        onChange={() => toggleCategory(cat.CategoryID)}
                                        style={{ display: 'none' }}
                                      />
                                      {selectedCategories.includes(cat.CategoryID) ? '✓ ' : ''}{cat.CategoryName}
                                    </label>
                                  ))}
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button 
                                    className="btn btn-primary"
                                    onClick={() => handleUpdateCategories(sup.SupplierID)}
                                    disabled={submitting}
                                  >
                                    {submitting ? 'Saving...' : '💾 Save Categories'}
                                  </button>
                                  <button 
                                    className="btn"
                                    onClick={() => {
                                      setEditingCategories(null);
                                      setSelectedCategories([]);
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                {sup.categories && sup.categories.length > 0 ? (
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {sup.categories.map(cat => (
                                      <span 
                                        key={cat.CategoryID} 
                                        className="badge badge-info"
                                        style={{ padding: '8px 16px' }}
                                      >
                                        {cat.CategoryName}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <p style={{ color: 'var(--text-muted)' }}>
                                    No categories assigned. Click "Edit Categories" to add some.
                                  </p>
                                )}
                                <button 
                                  className="btn btn-primary"
                                  onClick={() => startEditingCategories(sup)}
                                  style={{ marginTop: '12px' }}
                                >
                                  ✏️ Edit Categories
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
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
