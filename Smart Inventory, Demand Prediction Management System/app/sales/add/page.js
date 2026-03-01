'use client';

import { HiOutlineShoppingCart, HiOutlineCheckCircle, HiOutlineExclamationTriangle, HiOutlinePlusCircle, HiOutlineXMark, HiOutlineBanknotes, HiOutlineArrowLeft, HiOutlineBuildingStorefront, HiOutlineInformationCircle } from 'react-icons/hi2';

/**
 * Add Sale Page
 * =============
 * 
 * Form to record a new sale with multiple items.
 * Auto-detects which warehouse(s) have the selected product in stock.
 * Once a warehouse is chosen (or auto-selected), subsequent products
 * are filtered to that warehouse.
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

  // Available warehouses for the currently selected product
  const [availableWarehouses, setAvailableWarehouses] = useState([]);

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
      if (warehousesData.success) setWarehouses(warehousesData.data || []);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  function getSelectedProduct() {
    return products.find(p => p.ProductID === parseInt(currentItem.productId));
  }

  /**
   * Get the stock available in the currently selected warehouse for a product
   */
  function getWarehouseStock(product, whId) {
    if (!product || !product.warehouseStocks || !whId) return 0;
    const ws = product.warehouseStocks.find(s => s.warehouseId === parseInt(whId));
    return ws ? ws.quantity : 0;
  }

  /**
   * When a product is selected, detect which warehouses have it in stock
   */
  function handleProductSelect(productId) {
    const prod = products.find(p => p.ProductID === parseInt(productId));
    
    setCurrentItem({
      productId: productId,
      quantity: '',
      unitPrice: prod?.SellingPrice || ''
    });

    if (prod && prod.warehouseStocks && prod.warehouseStocks.length > 0) {
      setAvailableWarehouses(prod.warehouseStocks);
      
      // If warehouse is already set (from a previous item), keep it if this product is available there
      if (warehouseId) {
        const existsInCurrent = prod.warehouseStocks.find(ws => ws.warehouseId === parseInt(warehouseId));
        if (!existsInCurrent) {
          // Product not available in current warehouse - auto-switch if only one option
          if (prod.warehouseStocks.length === 1) {
            setWarehouseId(prod.warehouseStocks[0].warehouseId.toString());
          } else {
            // Multiple warehouses - let admin choose, clear current warehouse
            setWarehouseId('');
          }
        }
      } else {
        // No warehouse selected yet - auto-select if only one warehouse has this product
        if (prod.warehouseStocks.length === 1) {
          setWarehouseId(prod.warehouseStocks[0].warehouseId.toString());
        }
      }
    } else {
      setAvailableWarehouses([]);
    }
  }

  /**
   * Get products filtered by the selected warehouse (if one is selected)
   * Shows products that have stock in the selected warehouse
   */
  function getFilteredProducts() {
    if (warehouseId) {
      // Only show products with stock in selected warehouse
      return products.filter(p => 
        p.warehouseStocks && 
        p.warehouseStocks.some(ws => ws.warehouseId === parseInt(warehouseId) && ws.quantity > 0)
      );
    }
    // No warehouse selected yet - show all products with any stock
    return products.filter(p => p.CurrentStock > 0);
  }

  function addToCart() {
    const product = getSelectedProduct();
    if (!product || !currentItem.quantity || !warehouseId) return;

    const unitPrice = currentItem.unitPrice || product.SellingPrice;
    const warehouseStock = getWarehouseStock(product, warehouseId);
    
    // Validate quantity against warehouse stock
    if (parseInt(currentItem.quantity) > warehouseStock) {
      setError(`Only ${warehouseStock} units available in the selected warehouse`);
      return;
    }
    
    // Check if product already in cart
    const existingIndex = cartItems.findIndex(item => item.productId === parseInt(currentItem.productId));
    
    if (existingIndex >= 0) {
      const newQty = cartItems[existingIndex].quantity + parseInt(currentItem.quantity);
      if (newQty > warehouseStock) {
        setError(`Only ${warehouseStock} units available. You already have ${cartItems[existingIndex].quantity} in cart.`);
        return;
      }
      const updatedCart = [...cartItems];
      updatedCart[existingIndex].quantity = newQty;
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, {
        productId: parseInt(currentItem.productId),
        productName: product.ProductName,
        productCode: product.ProductCode,
        quantity: parseInt(currentItem.quantity),
        unitPrice: parseFloat(unitPrice),
        maxStock: warehouseStock
      }]);
    }

    setError(null);
    setCurrentItem({ productId: '', quantity: '', unitPrice: '' });
    setAvailableWarehouses([]);
  }

  function removeFromCart(index) {
    const newCart = cartItems.filter((_, i) => i !== index);
    setCartItems(newCart);
    // If cart is empty, allow warehouse to be changed
    if (newCart.length === 0) {
      setWarehouseId('');
    }
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
        throw new Error('Please select customer, add at least one item');
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

  // Get the selected product's stock in selected warehouse
  const selectedProduct = getSelectedProduct();
  const currentWarehouseStock = selectedProduct ? getWarehouseStock(selectedProduct, warehouseId) : 0;
  const filteredProducts = getFilteredProducts();

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
          {/* Customer & Notes Selection */}
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
          </div>

          {/* Add Items - with auto warehouse detection */}
          <div className="card" style={{ marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Add Items</h3>
            
            {/* Product selection */}
            <div className="form-group">
              <label className="form-label">Product</label>
              <select
                value={currentItem.productId}
                onChange={(e) => handleProductSelect(e.target.value)}
                className="form-input"
              >
                <option value="">Select product...</option>
                {filteredProducts.map(p => {
                  // Show warehouse-specific stock if warehouse is selected, else total stock
                  const stock = warehouseId 
                    ? getWarehouseStock(p, warehouseId) 
                    : p.CurrentStock;
                  return (
                    <option key={p.ProductID} value={p.ProductID}>
                      {p.ProductCode} - {p.ProductName} (Stock: {stock})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Warehouse auto-detection display */}
            {selectedProduct && (
              <div style={{ 
                background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)',
                border: '1px solid #bfdbfe',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                marginBottom: '1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <HiOutlineBuildingStorefront size={16} style={{ color: '#2563eb' }} />
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e40af' }}>
                    Warehouse Availability for "{selectedProduct.ProductName}"
                  </span>
                </div>

                {selectedProduct.warehouseStocks && selectedProduct.warehouseStocks.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedProduct.warehouseStocks.map((ws) => {
                      const isSelected = parseInt(warehouseId) === ws.warehouseId;
                      const isDisabled = cartItems.length > 0 && parseInt(warehouseId) !== ws.warehouseId;
                      return (
                        <button
                          key={ws.warehouseId}
                          type="button"
                          onClick={() => {
                            if (!isDisabled) {
                              setWarehouseId(ws.warehouseId.toString());
                            }
                          }}
                          disabled={isDisabled}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 0.85rem',
                            borderRadius: '8px',
                            border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                            background: isSelected 
                              ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' 
                              : isDisabled ? '#f1f5f9' : '#ffffff',
                            color: isSelected ? '#ffffff' : isDisabled ? '#94a3b8' : '#334155',
                            cursor: isDisabled ? 'not-allowed' : 'pointer',
                            fontSize: '13px',
                            fontWeight: '500',
                            transition: 'all 0.2s ease',
                            opacity: isDisabled ? 0.5 : 1,
                          }}
                        >
                          <HiOutlineBuildingStorefront size={14} />
                          <span>{ws.warehouseName}</span>
                          <span style={{
                            background: isSelected ? 'rgba(255,255,255,0.25)' : '#e0f2fe',
                            color: isSelected ? '#ffffff' : '#0369a1',
                            padding: '1px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '700',
                          }}>
                            {ws.quantity} units
                          </span>
                          {isSelected && <HiOutlineCheckCircle size={16} />}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ fontSize: '13px', color: '#dc2626' }}>
                    <HiOutlineExclamationTriangle size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                    This product is not available in any warehouse
                  </div>
                )}

                {cartItems.length > 0 && selectedProduct.warehouseStocks?.length > 1 && (
                  <div style={{ 
                    marginTop: '0.5rem', 
                    fontSize: '11px', 
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}>
                    <HiOutlineInformationCircle size={13} />
                    Warehouse is locked to "{warehouses.find(w => w.WarehouseID == warehouseId)?.WarehouseName}" because you have items in cart. Remove all items to change warehouse.
                  </div>
                )}
              </div>
            )}

            {/* Selected warehouse indicator (when no product is selected but warehouse is set) */}
            {!selectedProduct && warehouseId && (
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '0.6rem 0.85rem',
                marginBottom: '1rem',
                fontSize: '13px',
                color: '#166534',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <HiOutlineBuildingStorefront size={15} />
                <span>
                  Selling from: <strong>{warehouses.find(w => w.WarehouseID == warehouseId)?.WarehouseName}</strong>
                </span>
                {cartItems.length === 0 && (
                  <button 
                    type="button"
                    onClick={() => setWarehouseId('')}
                    style={{
                      marginLeft: 'auto',
                      background: 'none',
                      border: 'none',
                      color: '#dc2626',
                      cursor: 'pointer',
                      fontSize: '12px',
                      textDecoration: 'underline',
                    }}
                  >
                    Change
                  </button>
                )}
              </div>
            )}

            {/* Quantity and Price row */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Qty
                  {selectedProduct && warehouseId && (
                    <span style={{ 
                      fontWeight: '400', 
                      color: currentWarehouseStock > 0 ? '#16a34a' : '#dc2626',
                      marginLeft: '6px'
                    }}>
                      (Available: {currentWarehouseStock})
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  value={currentItem.quantity}
                  onChange={(e) => setCurrentItem({...currentItem, quantity: e.target.value})}
                  className="form-input"
                  min="1"
                  max={currentWarehouseStock || 999}
                  placeholder={currentWarehouseStock ? `Max: ${currentWarehouseStock}` : ''}
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
                  disabled={!currentItem.productId || !currentItem.quantity || !warehouseId}
                  title={!warehouseId ? 'Select a product first to auto-detect warehouse' : ''}
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
                No items added yet. Select a product above — the warehouse will be auto-detected.
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
              <span>Warehouse:</span>
              {warehouseId ? (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  padding: '2px 10px',
                  borderRadius: '6px',
                  fontWeight: '600',
                  fontSize: '13px',
                }}>
                  <HiOutlineBuildingStorefront size={13} />
                  {warehouses.find(w => w.WarehouseID == warehouseId)?.WarehouseName}
                </span>
              ) : (
                <span style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>Auto-detected on product select</span>
              )}
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

          {(!warehouseId && cartItems.length === 0) && (
            <div style={{ 
              marginTop: '0.75rem', 
              fontSize: '12px', 
              color: '#6b7280', 
              textAlign: 'center',
              background: '#f9fafb',
              padding: '0.6rem',
              borderRadius: '8px',
            }}>
              <HiOutlineInformationCircle size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
              Warehouse is auto-selected when you choose a product
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
