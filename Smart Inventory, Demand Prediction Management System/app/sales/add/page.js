'use client';

import { HiOutlineShoppingCart, HiOutlineCheckCircle, HiOutlineExclamationTriangle, HiOutlinePlusCircle, HiOutlineXMark, HiOutlineBanknotes, HiOutlineArrowLeft } from 'react-icons/hi2';

/**
 * Add Sale Page
 * =============
 * 
 * Form to record a new sale with multiple items.
 * Supports customer selection, warehouse selection, and multi-item cart.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddSalePage() {
  const router = useRouter();

  // Form state
  const [customerId, setCustomerId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [notes, setNotes] = useState('');
  
  // Cart items
  const [cartItems, setCartItems] = useState([]);
  
  // Current item being added
  const [currentItem, setCurrentItem] = useState({
    productId: '',
    quantity: '',
    unitPrice: ''
  });

  // Data for dropdowns
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [productsRes, customersRes, warehousesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/customers'),
        fetch('/api/warehouses')
      ]);
      
      const productsData = await productsRes.json();
      const customersData = await customersRes.json();
      const warehousesData = await warehousesRes.json();
      
      if (productsData.success) setProducts(productsData.data || []);
      if (customersData.success) setCustomers(customersData.data || []);
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

  function getSelectedProduct() {
    return products.find(p => p.ProductID === parseInt(currentItem.productId));
  }

  function addToCart() {
    const product = getSelectedProduct();
    if (!product || !currentItem.quantity) return;

    const unitPrice = currentItem.unitPrice || product.SellingPrice;
    
    // Check if product already in cart
    const existingIndex = cartItems.findIndex(item => item.productId === parseInt(currentItem.productId));
    
    if (existingIndex >= 0) {
      // Update quantity
      const updatedCart = [...cartItems];
      updatedCart[existingIndex].quantity += parseInt(currentItem.quantity);
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, {
        productId: parseInt(currentItem.productId),
        productName: product.ProductName,
        productCode: product.ProductCode,
        quantity: parseInt(currentItem.quantity),
        unitPrice: parseFloat(unitPrice),
        maxStock: product.CurrentStock
      }]);
    }

    // Reset current item
    setCurrentItem({ productId: '', quantity: '', unitPrice: '' });
  }

  function removeFromCart(index) {
    setCartItems(cartItems.filter((_, i) => i !== index));
  }

  function calculateTotal() {
    return cartItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (!customerId || !warehouseId || cartItems.length === 0) {
        throw new Error('Please select customer, warehouse, and add at least one item');
      }

      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: parseInt(customerId),
          warehouseId: parseInt(warehouseId),
          notes,
          items: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice
          }))
        })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      setSuccess(true);
      setTimeout(() => router.push('/sales'), 1500);
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
          <h1 className="page-title"><HiOutlineShoppingCart size={24} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> New Sale</h1>
          <p className="page-subtitle">Create a sale with multiple items</p>
        </div>
        <Link href="/sales" className="btn btn-secondary"><HiOutlineArrowLeft size={16} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> Back to Sales</Link>
      </div>

      {success && (
        <div className="alert alert-success">
          <span><HiOutlineCheckCircle size={16} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /></span> Sale recorded successfully! Redirecting...
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          <span><HiOutlineExclamationTriangle size={16} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /></span> {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left: Form */}
        <div>
          {/* Customer & Warehouse Selection */}
          <div className="card" style={{ marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Sale Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Customer *</label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="form-input"
                  required
                >
                  <option value="">Select customer...</option>
                  {customers.map(c => (
                    <option key={c.CustomerID} value={c.CustomerID}>
                      {c.CustomerName}
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
                      {w.WarehouseName} (Stock: {w.TotalStock})
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
                      unitPrice: prod?.SellingPrice || ''
                    });
                  }}
                  className="form-input"
                >
                  <option value="">Select product...</option>
                  {products.filter(p => p.CurrentStock > 0).map(p => (
                    <option key={p.ProductID} value={p.ProductID}>
                      {p.ProductCode} - {p.ProductName} (Stock: {p.CurrentStock})
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
                  max={getSelectedProduct()?.CurrentStock || 999}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  value={currentItem.unitPrice}
                  onChange={(e) => setCurrentItem({...currentItem, unitPrice: e.target.value})}
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
                  disabled={!currentItem.productId || !currentItem.quantity}
                >
                  <HiOutlinePlusCircle size={16} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> Add
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
                    <th>Price</th>
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
                      <td>{formatCurrency(item.unitPrice)}</td>
                      <td><strong>{formatCurrency(item.quantity * item.unitPrice)}</strong></td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => removeFromCart(index)}
                        >
                          <HiOutlineXMark size={16} />
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
          <h3 style={{ marginBottom: '1rem' }}>Order Summary</h3>
          
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Customer:</span>
              <strong>{customers.find(c => c.CustomerID == customerId)?.CustomerName || '-'}</strong>
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
            <span style={{ color: 'var(--success)' }}>{formatCurrency(calculateTotal())}</span>
          </div>

          <button
            onClick={handleSubmit}
            className="btn btn-success"
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
            disabled={submitting || !customerId || !warehouseId || cartItems.length === 0}
          >
            {submitting ? 'Processing...' : <><HiOutlineBanknotes size={16} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> Complete Sale</>}
          </button>
        </div>
      </div>
    </div>
  );
}
