'use client';

/**
 * Add Purchase Page
 * =================
 * 
 * Record new stock arrivals from suppliers.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddPurchasePage() {
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState({
    productId: '',
    supplierId: '',
    quantity: '',
    unitCost: '',
    referenceNumber: '',
    notes: ''
  });
  
  // Data for dropdowns
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch products and suppliers on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, suppliersRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/suppliers')
        ]);
        
        const productsData = await productsRes.json();
        const suppliersData = await suppliersRes.json();
        
        if (productsData.success) setProducts(productsData.data);
        if (suppliersData.success) setSuppliers(suppliersData.data);
      } catch (err) {
        setError('Failed to load form data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Generate reference number
  useEffect(() => {
    const date = new Date();
    const ref = `PO-${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}-${Math.random().toString(36).substr(2,4).toUpperCase()}`;
    setFormData(prev => ({ ...prev, referenceNumber: ref }));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      // Validation
      if (!formData.productId || !formData.supplierId || !formData.quantity || !formData.unitCost) {
        throw new Error('Please fill in all required fields');
      }

      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: parseInt(formData.productId),
          supplierId: parseInt(formData.supplierId),
          quantity: parseInt(formData.quantity),
          unitCost: parseFloat(formData.unitCost),
          referenceNumber: formData.referenceNumber,
          notes: formData.notes
        })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      setSuccess(true);
      setTimeout(() => router.push('/purchases'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  // Calculate total cost
  const totalCost = formData.quantity && formData.unitCost 
    ? parseFloat(formData.quantity) * parseFloat(formData.unitCost) 
    : 0;

  // Get selected product details
  const selectedProduct = products.find(p => p.ProductID == formData.productId);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading form data...
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">📥 New Purchase</h1>
          <p className="page-subtitle">Record incoming stock from suppliers</p>
        </div>
        <Link href="/purchases" className="btn btn-ghost">
          ← Back to Purchases
        </Link>
      </div>

      {success ? (
        <div className="alert alert-success">
          <span>✅</span> Purchase recorded successfully! Redirecting...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '1.5rem', alignItems: 'start' }}>
          <div className="card">
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Purchase Details</h2>
            
            {error && (
              <div className="alert alert-danger">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Reference Number</label>
                  <input
                    type="text"
                    name="referenceNumber"
                    value={formData.referenceNumber}
                    onChange={handleChange}
                    className="form-input"
                    readOnly
                    style={{ backgroundColor: 'var(--bg-tertiary)' }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="text"
                    value={new Date().toLocaleDateString()}
                    className="form-input"
                    readOnly
                    style={{ backgroundColor: 'var(--bg-tertiary)' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Product *</label>
                <select
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">Select a product...</option>
                  {products.map(product => (
                    <option key={product.ProductID} value={product.ProductID}>
                      {product.ProductCode} - {product.ProductName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Supplier *</label>
                <select
                  name="supplierId"
                  value={formData.supplierId}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">Select a supplier...</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.SupplierID} value={supplier.SupplierID}>
                      {supplier.SupplierName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="0"
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Unit Cost ($) *</label>
                  <input
                    type="number"
                    name="unitCost"
                    value={formData.unitCost}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Optional notes about this purchase..."
                  rows="3"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Recording...' : '📥 Record Purchase'}
                </button>
                <Link href="/purchases" className="btn btn-ghost">
                  Cancel
                </Link>
              </div>
            </form>
          </div>

          {/* Purchase Summary Card */}
          <div className="card" style={{ position: 'sticky', top: '1rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>📋 Purchase Summary</h3>
            
            {selectedProduct ? (
              <div>
                <div style={{ 
                  padding: '1rem', 
                  backgroundColor: 'var(--bg-tertiary)', 
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                    {selectedProduct.ProductName}
                  </div>
                  <div className="text-muted" style={{ fontSize: '13px' }}>
                    Code: {selectedProduct.ProductCode}
                  </div>
                  <div className="text-muted" style={{ fontSize: '13px' }}>
                    Current Stock: <strong>{selectedProduct.CurrentStock}</strong> {selectedProduct.UnitOfMeasure}
                  </div>
                </div>

                {formData.quantity && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span className="text-muted">Quantity:</span>
                      <span>{formData.quantity} units</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span className="text-muted">Unit Cost:</span>
                      <span>${parseFloat(formData.unitCost || 0).toFixed(2)}</span>
                    </div>
                    <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1rem 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: '600' }}>Total Cost:</span>
                      <span style={{ fontWeight: '700', fontSize: '1.25rem', color: 'var(--primary-color)' }}>
                        ${totalCost.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                {formData.quantity && (
                  <div style={{ 
                    padding: '0.75rem', 
                    backgroundColor: 'rgba(59, 130, 246, 0.1)', 
                    borderRadius: '8px',
                    fontSize: '13px'
                  }}>
                    <strong>After Purchase:</strong>
                    <div style={{ marginTop: '0.25rem' }}>
                      Stock will be: <strong style={{ color: 'var(--success-color)' }}>
                        {parseInt(selectedProduct.CurrentStock || 0) + parseInt(formData.quantity || 0)}
                      </strong> {selectedProduct.UnitOfMeasure}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-muted" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                Select a product to see purchase summary
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
