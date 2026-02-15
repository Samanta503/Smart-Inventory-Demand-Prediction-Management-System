'use client';

import { HiOutlineBuildingOffice, HiOutlineXMark, HiOutlinePlusCircle, HiOutlineExclamationTriangle, HiOutlineCube, HiOutlineMapPin } from 'react-icons/hi2';

/**
 * Warehouses Page
 * ===============
 * 
 * View and manage warehouses with stock overview.
 */

import { useState, useEffect } from 'react';

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    warehouseName: '',
    address: '',
    city: '',
    country: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  async function fetchWarehouses() {
    try {
      setLoading(true);
      const response = await fetch('/api/warehouses');
      const result = await response.json();
      if (result.success) {
        setWarehouses(result.data || []);
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
      const response = await fetch('/api/warehouses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (result.success) {
        setFormData({ warehouseName: '', address: '', city: '', country: '' });
        setShowForm(false);
        fetchWarehouses();
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
        Loading warehouses...
      </div>
    );
  }

  const totalStock = warehouses.reduce((sum, w) => sum + parseInt(w.TotalStock || 0), 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title"><HiOutlineBuildingOffice size={24} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> Warehouses</h1>
          <p className="page-subtitle">Manage warehouse locations and stock levels</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? <><HiOutlineXMark size={16} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> Cancel</> : <><HiOutlinePlusCircle size={16} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> Add Warehouse</>}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          <span><HiOutlineExclamationTriangle size={16} style={{display:'inline', verticalAlign:'middle'}} /></span> {error}
        </div>
      )}

      {/* Add Warehouse Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Add New Warehouse</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Warehouse Name *</label>
                <input
                  type="text"
                  name="warehouseName"
                  value={formData.warehouseName}
                  onChange={handleChange}
                  className="form-input"
                  required
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
              {submitting ? 'Adding...' : 'Add Warehouse'}
            </button>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <span className="stat-icon"><HiOutlineBuildingOffice size={24} /></span>
          <span className="stat-value">{warehouses.length}</span>
          <span className="stat-label">Total Warehouses</span>
        </div>
        <div className="stat-card info">
          <span className="stat-icon"><HiOutlineCube size={24} /></span>
          <span className="stat-value">{totalStock.toLocaleString()}</span>
          <span className="stat-label">Total Stock Units</span>
        </div>
      </div>

      {/* Warehouses Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {warehouses.length > 0 ? (
          warehouses.map((warehouse) => (
            <div key={warehouse.WarehouseID} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>
                    <HiOutlineBuildingOffice size={20} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> {warehouse.WarehouseName}
                  </h3>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                    {warehouse.City}{warehouse.Country ? `, ${warehouse.Country}` : ''}
                  </p>
                </div>
                <span className="badge badge-success">Active</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <div style={{ textAlign: 'center', padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                    {parseInt(warehouse.TotalStock || 0).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Stock Units</div>
                </div>
                <div style={{ textAlign: 'center', padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--info)' }}>
                    {warehouse.ProductCount || 0}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Products</div>
                </div>
              </div>

              {warehouse.Address && (
                <p style={{ margin: '1rem 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <HiOutlineMapPin size={14} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> {warehouse.Address}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-state">
              <span className="icon"><HiOutlineBuildingOffice size={24} /></span>
              <h3>No warehouses yet</h3>
              <p>Add your first warehouse to start managing inventory locations</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
