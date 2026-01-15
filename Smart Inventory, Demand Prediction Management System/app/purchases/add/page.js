'use client';

/**
 * Add Purchase Page
 * =================
 * 
 * Record new stock arrivals from suppliers with multi-item support.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddPurchasePage() {
  const router = useRouter();
  
  // Form state
  const [supplierId, setSupplierId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  
  // Cart items
  const [cartItems, setCartItems] = useState([]);
  
  // Current item being added
  const [currentItem, setCurrentItem] = useState({
    productId: '',
    quantity: '',
    unitCost: ''
  });
  
  // Data for dropdowns
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchData();
    generateReferenceNumber();
  }, []);

  async function fetchData() {
    try {
      const [productsRes, suppliersRes, warehousesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/suppliers'),
        fetch('/api/warehouses')
      ]);
      
      const productsData = await productsRes.json();
      const suppliersData = await suppliersRes.json();
      const warehousesData = await warehousesRes.json();
      
      if (productsData.success) setProducts(productsData.data || []);
      if (suppliersData.success) setSuppliers(suppliersData.data || []);
      if (warehousesData.success) {
        setWarehouses(warehousesData.data || []);
        if (warehousesData.data && warehousesData.data.length > 0) {
          setWarehouseId(warehousesData.data[0].WarehouseID.toString());
        }
      }
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  function generateReferenceNumber() {
    const date = new Date();
    const ref = `PO-${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}-${Math.random().toString(36).substr(2,4).toUpperCase()}`;
    setReferenceNumber(ref);
  }

  function getSelectedProduct() {
    return products.find(p => p.ProductID === parseInt(currentItem.productId));
  }

  function addToCart() {
    const product = getSelectedProduct();
    if (!product || !currentItem.quantity || !currentItem.unitCost) return;

    // Check if product already in cart
    const existingIndex = cartItems.findIndex(item => item.productId === parseInt(currentItem.productId));
    
    if (existingIndex >= 0) {
      const updatedCart = [...cartItems];
      updatedCart[existingIndex].quantity += parseInt(currentItem.quantity);
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, {
        productId: parseInt(currentItem.productId),
        productName: product.ProductName,
        productCode: product.ProductCode,
        quantity: parseInt(currentItem.quantity),
        unitCost: parseFloat(currentItem.unitCost)
      }]);
    }

    setCurrentItem({ productId: '', quantity: '', unitCost: '' });
  }

  function removeFromCart(index) {
    setCartItems(cartItems.filter((_, i) => i !== index));
  }

  function calculateTotal() {
    return cartItems.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (!supplierId || !warehouseId || cartItems.length === 0) {
        throw new Error('Please select supplier, warehouse, and add at least one item');
      }

      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplierId: parseInt(supplierId),
          warehouseId: parseInt(warehouseId),
          referenceNumber,
          notes,
          items: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitCost: item.unitCost
          }))
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

  function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value || 0);
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading...
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">📥 New Purchase</h1>
          <p className="page-subtitle">Record incoming stock with multiple items</p>
        </div>
        <Link href="/purchases" className="btn btn-secondary">← Back to Purchases</Link>
      </div>

      {success && (
        <div className="alert alert-success">
          <span>✅</span> Purchase recorded successfully! Redirecting...
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          <span>⚠️</span> {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left: Form */}
        <div>
          {/* Purchase Details */}
          <div className="card" style={{ marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Purchase Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Reference Number</label>
                <input
                  type="text"
                  value={referenceNumber}
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
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Supplier *</label>
                <select
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="form-input"
                  required
                >
                  <option value="">Select supplier...</option>
                  {suppliers.map(s => (
                    <option key={s.SupplierID} value={s.SupplierID}>
                      {s.SupplierName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Warehouse *</label>
                <select
                  value={warehouseId}
                  onChange={(e) => setWarehouseId(e.target.value)}
                  className="form-input"
                  required
                >
                  <option value="">Select warehouse...</option>
                  {warehouses.map(w => (
                    <option key={w.WarehouseID} value={w.WarehouseID}>
                      {w.WarehouseName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-input"
                placeholder="Optional notes..."
              />
            </div>
          </div>

          {/* Add Items */}
          <div className="card" style={{ marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Add Items</h3>
            <div className="form-row">
              <div className="form-group" style={{ flex: 2 }}>
                <label className="form-label">Product</label>
                <select
                  value={currentItem.productId}
                  onChange={(e) => {
                    const prod = products.find(p => p.ProductID === parseInt(e.target.value));
                    setCurrentItem({
                      productId: e.target.value,
                      quantity: '',
                      unitCost: prod?.CostPrice || ''
                    });
                  }}
                  className="form-input"
                >
                  <option value="">Select product...</option>
                  {products.map(p => (
                    <option key={p.ProductID} value={p.ProductID}>
                      {p.ProductCode} - {p.ProductName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Qty</label>
                <input
                  type="number"
                  value={currentItem.quantity}
                  onChange={(e) => setCurrentItem({...currentItem, quantity: e.target.value})}
                  className="form-input"
                  min="1"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Cost</label>
                <input
                  type="number"
                  value={currentItem.unitCost}
                  onChange={(e) => setCurrentItem({...currentItem, unitCost: e.target.value})}
                  className="form-input"
                  step="0.01"
                  min="0"
                />
              </div>
              <div className="form-group" style={{ alignSelf: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={addToCart}
                  disabled={!currentItem.productId || !currentItem.quantity || !currentItem.unitCost}
                >
                  ➕ Add
                </button>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Cart Items ({cartItems.length})</h3>
            {cartItems.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Cost</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <strong>{item.productName}</strong>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.productCode}</div>
                      </td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.unitCost)}</td>
                      <td><strong>{formatCurrency(item.quantity * item.unitCost)}</strong></td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => removeFromCart(index)}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No items added yet. Select products above.
              </div>
            )}
          </div>
        </div>

        {/* Right: Summary */}
        <div className="card" style={{ position: 'sticky', top: '1rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Purchase Summary</h3>
          
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Supplier:</span>
              <strong>{suppliers.find(s => s.SupplierID == supplierId)?.SupplierName || '-'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Warehouse:</span>
              <strong>{warehouses.find(w => w.WarehouseID == warehouseId)?.WarehouseName || '-'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Items:</span>
              <strong>{cartItems.length}</strong>
            </div>
          </div>

          <div style={{ fontSize: '1.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '1.5rem' }}>
            <span>Total:</span>
            <span style={{ color: 'var(--primary)' }}>{formatCurrency(calculateTotal())}</span>
          </div>

          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
            disabled={submitting || !supplierId || !warehouseId || cartItems.length === 0}
          >
            {submitting ? 'Processing...' : '📥 Record Purchase'}
          </button>
        </div>
      </div>
    </div>
  );
}
