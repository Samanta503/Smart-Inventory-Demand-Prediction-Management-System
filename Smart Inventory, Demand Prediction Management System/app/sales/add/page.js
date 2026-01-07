'use client';

/**
 * Add Sale Page
 * =============
 * 
 * Form to record a new sale transaction.
 * Automatically decreases stock and can trigger alerts.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddSalePage() {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    unitPrice: '',
    customerName: '',
    notes: '',
  });

  // Products list for dropdown
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Loading and status states
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Fetch products when component mounts
   */
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        const result = await response.json();

        if (result.success) {
          // Only show products with stock > 0
          setProducts(result.data.filter(p => p.CurrentStock > 0));
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoadingProducts(false);
      }
    }

    fetchProducts();
  }, []);

  /**
   * Handle input changes
   */
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // When product is selected, set default unit price
    if (name === 'productId' && value) {
      const product = products.find(p => p.ProductID === parseInt(value));
      if (product) {
        setSelectedProduct(product);
        setFormData(prev => ({
          ...prev,
          unitPrice: product.SellingPrice.toString(),
        }));
      }
    }
  }

  /**
   * Calculate total amount
   */
  function calculateTotal() {
    const qty = parseFloat(formData.quantity) || 0;
    const price = parseFloat(formData.unitPrice) || 0;
    return qty * price;
  }

  /**
   * Handle form submission
   */
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Validation
      if (!formData.productId || !formData.quantity) {
        throw new Error('Please select a product and enter quantity');
      }

      const quantity = parseInt(formData.quantity);
      if (quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
      }

      if (selectedProduct && quantity > selectedProduct.CurrentStock) {
        throw new Error(`Insufficient stock. Available: ${selectedProduct.CurrentStock}`);
      }

      // Submit sale
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: parseInt(formData.productId),
          quantity: quantity,
          unitPrice: parseFloat(formData.unitPrice),
          customerName: formData.customerName || null,
          notes: formData.notes || null,
          createdBy: 'User',
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      setSuccess(true);

      // Redirect after success
      setTimeout(() => {
        router.push('/sales');
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
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

  if (loadingProducts) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading products...
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">🛒 New Sale</h1>
          <p className="page-subtitle">
            Record a new sales transaction
          </p>
        </div>
        <Link href="/sales" className="btn btn-secondary">
          ← Back to Sales
        </Link>
      </div>

      {/* Success Message */}
      {success && (
        <div className="alert alert-success">
          <span>✅</span>
          Sale recorded successfully! Stock has been updated. Redirecting...
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger">
          <span>⚠️</span>
          {error}
        </div>
      )}

      {/* Check if there are products available */}
      {products.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <span className="icon">📦</span>
            <h3>No products available</h3>
            <p>All products are out of stock. Add stock via purchases first.</p>
            <Link href="/purchases/add" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Add Purchase
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          {/* Sale Form */}
          <div className="card">
            <form onSubmit={handleSubmit}>
              {/* Product Selection */}
              <div className="form-group">
                <label className="form-label">
                  Select Product *
                </label>
                <select
                  name="productId"
                  className="form-select"
                  value={formData.productId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select a product --</option>
                  {products.map(product => (
                    <option key={product.ProductID} value={product.ProductID}>
                      {product.ProductName} ({product.ProductCode}) - 
                      Stock: {product.CurrentStock} - 
                      {formatCurrency(product.SellingPrice)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity and Price */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    className="form-input"
                    placeholder="Enter quantity"
                    min="1"
                    max={selectedProduct?.CurrentStock || 999999}
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                  />
                  {selectedProduct && (
                    <span className="form-help">
                      Available stock: <strong>{selectedProduct.CurrentStock}</strong> {selectedProduct.Unit}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Unit Price ($)
                  </label>
                  <input
                    type="number"
                    name="unitPrice"
                    className="form-input"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={formData.unitPrice}
                    onChange={handleChange}
                  />
                  {selectedProduct && (
                    <span className="form-help">
                      Default: {formatCurrency(selectedProduct.SellingPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Customer Name */}
              <div className="form-group">
                <label className="form-label">
                  Customer Name (Optional)
                </label>
                <input
                  type="text"
                  name="customerName"
                  className="form-input"
                  placeholder="Enter customer name"
                  value={formData.customerName}
                  onChange={handleChange}
                />
              </div>

              {/* Notes */}
              <div className="form-group">
                <label className="form-label">
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  className="form-textarea"
                  placeholder="Any additional notes..."
                  value={formData.notes}
                  onChange={handleChange}
                  rows={2}
                />
              </div>

              {/* Submit Button */}
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button
                  type="submit"
                  className="btn btn-success btn-lg"
                  disabled={submitting || !formData.productId || !formData.quantity}
                >
                  {submitting ? (
                    <>
                      <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                      Processing...
                    </>
                  ) : (
                    <>💰 Record Sale</>
                  )}
                </button>
                <Link href="/sales" className="btn btn-secondary btn-lg">
                  Cancel
                </Link>
              </div>
            </form>
          </div>

          {/* Order Summary Card */}
          <div>
            <div className="card">
              <h3 className="card-title">Order Summary</h3>
              
              {selectedProduct ? (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                    <strong>{selectedProduct.ProductName}</strong>
                    <div className="text-muted" style={{ fontSize: '13px' }}>
                      {selectedProduct.ProductCode}
                    </div>
                    <div className="text-muted" style={{ fontSize: '13px' }}>
                      Category: {selectedProduct.CategoryName}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Unit Price:</span>
                    <span>{formatCurrency(formData.unitPrice || selectedProduct.SellingPrice)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Quantity:</span>
                    <span>{formData.quantity || 0}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginTop: '1rem', 
                    paddingTop: '1rem', 
                    borderTop: '2px solid var(--border-color)',
                    fontSize: '1.25rem',
                    fontWeight: 'bold'
                  }}>
                    <span>Total:</span>
                    <span className="text-success">{formatCurrency(calculateTotal())}</span>
                  </div>

                  {/* Stock Warning */}
                  {formData.quantity && parseInt(formData.quantity) > selectedProduct.CurrentStock && (
                    <div className="alert alert-danger" style={{ marginTop: '1rem' }}>
                      ⚠️ Quantity exceeds available stock!
                    </div>
                  )}

                  {/* Low Stock Warning */}
                  {formData.quantity && 
                   selectedProduct.CurrentStock - parseInt(formData.quantity) <= selectedProduct.ReorderLevel && 
                   selectedProduct.CurrentStock - parseInt(formData.quantity) >= 0 && (
                    <div className="alert alert-warning" style={{ marginTop: '1rem' }}>
                      ⚠️ This sale will trigger a low stock alert
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-muted" style={{ marginTop: '1rem' }}>
                  Select a product to see order summary
                </div>
              )}
            </div>

            {/* Quick Stats */}
            {selectedProduct && (
              <div className="card">
                <h4 style={{ marginBottom: '0.5rem' }}>Stock Info</h4>
                <div style={{ fontSize: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span className="text-muted">Current Stock:</span>
                    <strong>{selectedProduct.CurrentStock}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span className="text-muted">After Sale:</span>
                    <strong className={
                      selectedProduct.CurrentStock - (parseInt(formData.quantity) || 0) <= selectedProduct.ReorderLevel 
                        ? 'text-warning' 
                        : 'text-success'
                    }>
                      {selectedProduct.CurrentStock - (parseInt(formData.quantity) || 0)}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="text-muted">Reorder Level:</span>
                    <span>{selectedProduct.ReorderLevel}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
