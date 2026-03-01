'use client';

/**
 * Add Sale Page
 * =============
 *
 * Form to record a new sale with multiple items.
 * Auto-detects which warehouse(s) have the selected product in stock.
 * Once a warehouse is chosen (or auto-selected), subsequent products
 * are filtered to that warehouse.
 *
 * Professional Dark Theme
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  HiOutlineShoppingCart,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlinePlusCircle,
  HiOutlineXMark,
  HiOutlineBanknotes,
  HiOutlineArrowLeft,
  HiOutlineBuildingStorefront,
  HiOutlineInformationCircle,
  HiOutlineCube,
  HiOutlineUserGroup,
} from 'react-icons/hi2';

// ─── Professional Dark Theme Styles ──────────────────────────────
const s = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    padding: '1.5rem 2rem 2rem',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '1.5rem', padding: '1.5rem 1.75rem',
    background: 'linear-gradient(145deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9))',
    borderRadius: '20px', border: '1px solid rgba(34,197,94,0.15)',
    backdropFilter: 'blur(20px)', position: 'relative', overflow: 'hidden',
  },
  headerGlow: {
    position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
    background: 'radial-gradient(circle at 30% 30%, rgba(34,197,94,0.08), transparent 40%)',
    pointerEvents: 'none',
  },
  headerLeft: { position: 'relative', zIndex: 1 },
  headerTitle: {
    fontSize: '1.75rem', fontWeight: '700', color: '#fff',
    letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '0.75rem',
  },
  titleIcon: {
    width: '42px', height: '42px',
    background: 'linear-gradient(135deg, #22c55e, #3b82f6)',
    borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(34,197,94,0.4)', color: '#fff',
  },
  headerSub: { color: 'rgba(148,163,184,0.8)', fontSize: '0.9rem', marginTop: '0.35rem' },
  backBtn: {
    background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)',
    padding: '0.7rem 1.25rem', borderRadius: '12px',
    color: '#60a5fa', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    transition: 'all 0.2s ease', textDecoration: 'none', position: 'relative', zIndex: 1,
  },
  card: {
    background: 'linear-gradient(145deg, rgba(30,41,59,0.7), rgba(15,23,42,0.85))',
    borderRadius: '18px', padding: '1.5rem', marginBottom: '1.25rem',
    border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden',
  },
  cardGlow: {
    position: 'absolute', top: '-50%', right: '-50%', width: '200%', height: '200%',
    background: 'radial-gradient(circle at 70% 30%, rgba(59,130,246,0.04), transparent 40%)',
    pointerEvents: 'none',
  },
  cardTitle: {
    color: '#e2e8f0', fontSize: '1rem', fontWeight: '600', marginBottom: '1rem',
    display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative', zIndex: 1,
  },
  formRow: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem',
    position: 'relative', zIndex: 1,
  },
  formGroup: { marginBottom: '1rem', position: 'relative', zIndex: 1 },
  label: {
    display: 'block', color: 'rgba(148,163,184,0.8)', fontSize: '13px',
    fontWeight: '500', marginBottom: '0.4rem',
  },
  input: {
    width: '100%', padding: '0.7rem 0.85rem', fontSize: '14px',
    borderRadius: '10px', border: '1px solid rgba(59,130,246,0.2)',
    background: 'rgba(15,23,42,0.6)', color: '#e2e8f0', outline: 'none',
    transition: 'all 0.2s ease',
  },
  select: {
    width: '100%', padding: '0.7rem 0.85rem', fontSize: '14px',
    borderRadius: '10px', border: '1px solid rgba(59,130,246,0.2)',
    background: 'rgba(15,23,42,0.6)', color: '#e2e8f0', outline: 'none',
    transition: 'all 0.2s ease', cursor: 'pointer',
  },
  addItemBtn: {
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    border: 'none', padding: '0.7rem 1.25rem', borderRadius: '10px',
    color: '#fff', fontWeight: '600', fontSize: '13px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '0.4rem',
    boxShadow: '0 4px 12px rgba(59,130,246,0.3)', transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  addItemBtnDisabled: {
    background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.1)',
    padding: '0.7rem 1.25rem', borderRadius: '10px',
    color: 'rgba(148,163,184,0.4)', fontWeight: '600', fontSize: '13px',
    cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: '0.4rem',
    whiteSpace: 'nowrap',
  },
  // Table
  tableWrap: { overflowX: 'auto', position: 'relative', zIndex: 1 },
  table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.35rem' },
  th: {
    padding: '0.7rem 0.85rem', fontSize: '11px', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: '0.6px',
    color: 'rgba(148,163,184,0.6)', textAlign: 'left',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  td: {
    padding: '0.75rem 0.85rem', fontSize: '13.5px', color: '#cbd5e1',
    borderBottom: '1px solid rgba(255,255,255,0.03)', verticalAlign: 'middle',
  },
  removeBtn: {
    background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
    borderRadius: '8px', padding: '0.4rem', cursor: 'pointer',
    color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  productName: { color: '#e2e8f0', fontWeight: '600', fontSize: '13.5px' },
  productCode: {
    background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)',
    padding: '2px 7px', borderRadius: '4px', fontSize: '10.5px',
    fontFamily: "'SF Mono','Fira Code',monospace", color: '#60a5fa',
    display: 'inline-block', marginTop: '3px',
  },
  costText: { color: '#4ade80', fontWeight: '700' },
  emptyCart: {
    textAlign: 'center', padding: '2rem 1rem', color: 'rgba(148,163,184,0.5)',
    fontSize: '14px', position: 'relative', zIndex: 1,
  },
  // Warehouse detection
  warehouseBox: {
    background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)',
    borderRadius: '12px', padding: '0.85rem 1rem', marginBottom: '1rem',
    position: 'relative', zIndex: 1,
  },
  warehouseTitle: {
    display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem',
    fontSize: '13px', fontWeight: '600', color: '#60a5fa',
  },
  warehouseChip: (isSelected, isDisabled) => ({
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.5rem 0.85rem', borderRadius: '10px',
    border: isSelected ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
    background: isSelected
      ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
      : isDisabled ? 'rgba(15,23,42,0.4)' : 'rgba(30,41,59,0.6)',
    color: isSelected ? '#fff' : isDisabled ? 'rgba(148,163,184,0.3)' : '#cbd5e1',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    fontSize: '13px', fontWeight: '500', transition: 'all 0.2s ease',
    opacity: isDisabled ? 0.5 : 1,
  }),
  warehouseQty: (isSelected) => ({
    background: isSelected ? 'rgba(255,255,255,0.25)' : 'rgba(59,130,246,0.12)',
    color: isSelected ? '#fff' : '#60a5fa',
    padding: '1px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700',
  }),
  warehouseInfo: {
    marginTop: '0.5rem', fontSize: '11px', color: 'rgba(148,163,184,0.5)',
    display: 'flex', alignItems: 'center', gap: '0.3rem',
  },
  selectedWarehouse: {
    background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
    borderRadius: '10px', padding: '0.6rem 0.85rem', marginBottom: '1rem',
    fontSize: '13px', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.5rem',
    position: 'relative', zIndex: 1,
  },
  changeLink: {
    marginLeft: 'auto', background: 'none', border: 'none',
    color: '#f87171', cursor: 'pointer', fontSize: '12px', textDecoration: 'underline',
  },
  // Summary
  summaryCard: {
    background: 'linear-gradient(145deg, rgba(30,41,59,0.7), rgba(15,23,42,0.85))',
    borderRadius: '18px', padding: '1.5rem', position: 'sticky', top: '1rem',
    border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden',
  },
  summaryRow: {
    display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem',
    fontSize: '14px', color: '#cbd5e1',
  },
  summaryDivider: {
    borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1rem', marginBottom: '1rem',
  },
  totalRow: {
    display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem',
    fontWeight: '700', marginBottom: '1.5rem',
  },
  submitBtn: {
    width: '100%', padding: '0.9rem', fontSize: '1rem', fontWeight: '600',
    borderRadius: '12px', border: 'none', cursor: 'pointer',
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
    boxShadow: '0 4px 16px rgba(34,197,94,0.35)', transition: 'all 0.2s ease',
  },
  submitBtnDisabled: {
    width: '100%', padding: '0.9rem', fontSize: '1rem', fontWeight: '600',
    borderRadius: '12px', border: 'none', cursor: 'not-allowed',
    background: 'rgba(34,197,94,0.15)', color: 'rgba(148,163,184,0.4)',
  },
  infoBox: {
    marginTop: '0.75rem', fontSize: '12px', color: 'rgba(148,163,184,0.5)',
    textAlign: 'center', background: 'rgba(15,23,42,0.4)',
    padding: '0.6rem', borderRadius: '8px', display: 'flex',
    alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
  },
  // Alerts
  alertSuccess: {
    background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(15,23,42,0.9))',
    borderRadius: '14px', padding: '1rem 1.25rem', marginBottom: '1.25rem',
    display: 'flex', alignItems: 'center', gap: '0.6rem',
    border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', fontSize: '14px', fontWeight: '500',
  },
  alertError: {
    background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(15,23,42,0.9))',
    borderRadius: '14px', padding: '1rem 1.25rem', marginBottom: '1.25rem',
    display: 'flex', alignItems: 'center', gap: '0.6rem',
    border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: '14px', fontWeight: '500',
  },
  // Loading
  loadingContainer: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', minHeight: '80vh', gap: '1.5rem',
    background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
  },
  spinner: {
    width: '50px', height: '50px',
    border: '3px solid rgba(34,197,94,0.2)', borderTop: '3px solid #22c55e',
    borderRadius: '50%', animation: 'spin 1s linear infinite',
  },
  warehousePill: {
    display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
    background: 'rgba(59,130,246,0.12)', color: '#60a5fa',
    padding: '2px 10px', borderRadius: '6px', fontWeight: '600', fontSize: '13px',
  },
  stockAvail: (ok) => ({
    fontWeight: '400', color: ok ? '#4ade80' : '#f87171', marginLeft: '6px', fontSize: '12px',
  }),
  noAvail: {
    fontSize: '13px', color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.3rem',
  },
};

const onFocus = (e) => { e.target.style.borderColor = 'rgba(59,130,246,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; };
const onBlur  = (e) => { e.target.style.borderColor = 'rgba(59,130,246,0.2)'; e.target.style.boxShadow = 'none'; };

export default function AddSalePage() {
  const router = useRouter();

  const [customerId, setCustomerId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [notes, setNotes] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({ productId: '', quantity: '', unitPrice: '' });
  const [availableWarehouses, setAvailableWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const [productsRes, customersRes, warehousesRes] = await Promise.all([
        fetch('/api/products'), fetch('/api/customers'), fetch('/api/warehouses')
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

  function getWarehouseStock(product, whId) {
    if (!product || !product.warehouseStocks || !whId) return 0;
    const ws = product.warehouseStocks.find(s => s.warehouseId === parseInt(whId));
    return ws ? ws.quantity : 0;
  }

  function handleProductSelect(productId) {
    const prod = products.find(p => p.ProductID === parseInt(productId));
    setCurrentItem({ productId, quantity: '', unitPrice: prod?.SellingPrice || '' });

    if (prod && prod.warehouseStocks && prod.warehouseStocks.length > 0) {
      setAvailableWarehouses(prod.warehouseStocks);
      if (warehouseId) {
        const existsInCurrent = prod.warehouseStocks.find(ws => ws.warehouseId === parseInt(warehouseId));
        if (!existsInCurrent) {
          if (prod.warehouseStocks.length === 1) {
            setWarehouseId(prod.warehouseStocks[0].warehouseId.toString());
          } else {
            setWarehouseId('');
          }
        }
      } else {
        if (prod.warehouseStocks.length === 1) {
          setWarehouseId(prod.warehouseStocks[0].warehouseId.toString());
        }
      }
    } else {
      setAvailableWarehouses([]);
    }
  }

  function getFilteredProducts() {
    if (warehouseId) {
      return products.filter(p =>
        p.warehouseStocks && p.warehouseStocks.some(ws => ws.warehouseId === parseInt(warehouseId) && ws.quantity > 0)
      );
    }
    return products.filter(p => p.CurrentStock > 0);
  }

  function addToCart() {
    const product = getSelectedProduct();
    if (!product || !currentItem.quantity || !warehouseId) return;
    const unitPrice = currentItem.unitPrice || product.SellingPrice;
    const warehouseStock = getWarehouseStock(product, warehouseId);
    if (parseInt(currentItem.quantity) > warehouseStock) {
      setError(`Only ${warehouseStock} units available in the selected warehouse`);
      return;
    }
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
    if (newCart.length === 0) setWarehouseId('');
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
            productId: item.productId, quantity: item.quantity, unitPrice: item.unitPrice
          }))
        })
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      setSuccess(true);
      setTimeout(() => router.push('/sales'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
  }

  const selectedProduct = getSelectedProduct();
  const currentWarehouseStock = selectedProduct ? getWarehouseStock(selectedProduct, warehouseId) : 0;
  const filteredProducts = getFilteredProducts();
  const canSubmit = !submitting && customerId && warehouseId && cartItems.length > 0;
  const canAdd = currentItem.productId && currentItem.quantity && warehouseId;

  if (loading) {
    return (
      <div style={s.loadingContainer}>
        <div style={s.spinner}></div>
        <span style={{ color: 'rgba(148,163,184,0.8)', fontSize: '15px', fontWeight: '500' }}>Loading...</span>
      </div>
    );
  }

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerGlow}></div>
        <div style={s.headerLeft}>
          <h1 style={s.headerTitle}>
            <span style={s.titleIcon}><HiOutlineShoppingCart size={22} /></span>
            New Sale
          </h1>
          <p style={s.headerSub}>Create a sale with multiple items</p>
        </div>
        <Link href="/sales" style={s.backBtn}>
          <HiOutlineArrowLeft size={16} /> Back to Sales
        </Link>
      </div>

      {success && (
        <div style={s.alertSuccess}>
          <HiOutlineCheckCircle size={18} /> Sale recorded successfully! Redirecting...
        </div>
      )}

      {error && (
        <div style={s.alertError}>
          <HiOutlineExclamationTriangle size={18} /> {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.25rem', alignItems: 'start' }}>
        {/* Left column */}
        <div>
          {/* Sale Details */}
          <div style={s.card}>
            <div style={s.cardGlow}></div>
            <h3 style={s.cardTitle}><HiOutlineUserGroup size={18} style={{ color: '#60a5fa' }} /> Sale Details</h3>
            <div style={s.formRow}>
              <div style={s.formGroup}>
                <label style={s.label}>Customer *</label>
                <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}
                  style={s.select} onFocus={onFocus} onBlur={onBlur}>
                  <option value="">Select customer...</option>
                  {customers.map(c => (
                    <option key={c.CustomerID} value={c.CustomerID}>{c.CustomerName}</option>
                  ))}
                </select>
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Notes</label>
                <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)}
                  style={s.input} placeholder="Optional notes..." onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>
          </div>

          {/* Add Items */}
          <div style={s.card}>
            <div style={s.cardGlow}></div>
            <h3 style={s.cardTitle}><HiOutlineCube size={18} style={{ color: '#a78bfa' }} /> Add Items</h3>

            {/* Product selection */}
            <div style={s.formGroup}>
              <label style={s.label}>Product</label>
              <select value={currentItem.productId} onChange={(e) => handleProductSelect(e.target.value)}
                style={s.select} onFocus={onFocus} onBlur={onBlur}>
                <option value="">Select product...</option>
                {filteredProducts.map(p => {
                  const stock = warehouseId ? getWarehouseStock(p, warehouseId) : p.CurrentStock;
                  return (
                    <option key={p.ProductID} value={p.ProductID}>
                      {p.ProductCode} - {p.ProductName} (Stock: {stock})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Warehouse auto-detection */}
            {selectedProduct && (
              <div style={s.warehouseBox}>
                <div style={s.warehouseTitle}>
                  <HiOutlineBuildingStorefront size={16} />
                  Warehouse Availability for &ldquo;{selectedProduct.ProductName}&rdquo;
                </div>
                {selectedProduct.warehouseStocks && selectedProduct.warehouseStocks.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedProduct.warehouseStocks.map((ws) => {
                      const isSelected = parseInt(warehouseId) === ws.warehouseId;
                      const isDisabled = cartItems.length > 0 && parseInt(warehouseId) !== ws.warehouseId;
                      return (
                        <button key={ws.warehouseId} type="button"
                          onClick={() => { if (!isDisabled) setWarehouseId(ws.warehouseId.toString()); }}
                          disabled={isDisabled} style={s.warehouseChip(isSelected, isDisabled)}>
                          <HiOutlineBuildingStorefront size={14} />
                          <span>{ws.warehouseName}</span>
                          <span style={s.warehouseQty(isSelected)}>{ws.quantity} units</span>
                          {isSelected && <HiOutlineCheckCircle size={16} />}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div style={s.noAvail}>
                    <HiOutlineExclamationTriangle size={14} /> This product is not available in any warehouse
                  </div>
                )}
                {cartItems.length > 0 && selectedProduct.warehouseStocks?.length > 1 && (
                  <div style={s.warehouseInfo}>
                    <HiOutlineInformationCircle size={13} />
                    Warehouse is locked to &ldquo;{warehouses.find(w => w.WarehouseID == warehouseId)?.WarehouseName}&rdquo;. Remove all items to change.
                  </div>
                )}
              </div>
            )}

            {/* Selected warehouse indicator */}
            {!selectedProduct && warehouseId && (
              <div style={s.selectedWarehouse}>
                <HiOutlineBuildingStorefront size={15} />
                <span>Selling from: <strong>{warehouses.find(w => w.WarehouseID == warehouseId)?.WarehouseName}</strong></span>
                {cartItems.length === 0 && (
                  <button type="button" onClick={() => setWarehouseId('')} style={s.changeLink}>Change</button>
                )}
              </div>
            )}

            {/* Quantity & Price */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
              <div>
                <label style={s.label}>
                  Qty
                  {selectedProduct && warehouseId && (
                    <span style={s.stockAvail(currentWarehouseStock > 0)}>
                      (Available: {currentWarehouseStock})
                    </span>
                  )}
                </label>
                <input type="number" value={currentItem.quantity}
                  onChange={(e) => setCurrentItem({...currentItem, quantity: e.target.value})}
                  style={s.input} min="1" max={currentWarehouseStock || 999}
                  placeholder={currentWarehouseStock ? `Max: ${currentWarehouseStock}` : ''}
                  onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div>
                <label style={s.label}>Price</label>
                <input type="number" value={currentItem.unitPrice}
                  onChange={(e) => setCurrentItem({...currentItem, unitPrice: e.target.value})}
                  style={s.input} step="0.01" min="0" onFocus={onFocus} onBlur={onBlur} />
              </div>
              <button type="button" onClick={addToCart} disabled={!canAdd}
                style={canAdd ? s.addItemBtn : s.addItemBtnDisabled}
                title={!warehouseId ? 'Select a product first to auto-detect warehouse' : ''}>
                <HiOutlinePlusCircle size={16} /> Add
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div style={s.card}>
            <div style={s.cardGlow}></div>
            <h3 style={s.cardTitle}><HiOutlineShoppingCart size={18} style={{ color: '#22c55e' }} /> Cart Items ({cartItems.length})</h3>
            {cartItems.length > 0 ? (
              <div style={s.tableWrap}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      {['Product', 'Qty', 'Price', 'Subtotal', ''].map(h => (
                        <th key={h} style={s.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item, index) => (
                      <tr key={index}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.04)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                        <td style={s.td}>
                          <div style={s.productName}>{item.productName}</div>
                          <span style={s.productCode}>{item.productCode}</span>
                        </td>
                        <td style={s.td}>{item.quantity}</td>
                        <td style={s.td}>{formatCurrency(item.unitPrice)}</td>
                        <td style={s.td}>
                          <span style={s.costText}>{formatCurrency(item.quantity * item.unitPrice)}</span>
                        </td>
                        <td style={s.td}>
                          <button type="button" onClick={() => removeFromCart(index)} style={s.removeBtn}>
                            <HiOutlineXMark size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={s.emptyCart}>
                No items added yet. Select a product above — the warehouse will be auto-detected.
              </div>
            )}
          </div>
        </div>

        {/* Right: Summary */}
        <div style={s.summaryCard}>
          <h3 style={s.cardTitle}><HiOutlineBanknotes size={18} style={{ color: '#4ade80' }} /> Order Summary</h3>

          <div style={s.summaryDivider}>
            <div style={s.summaryRow}>
              <span>Customer:</span>
              <strong style={{ color: '#e2e8f0' }}>{customers.find(c => c.CustomerID == customerId)?.CustomerName || '-'}</strong>
            </div>
            <div style={s.summaryRow}>
              <span>Warehouse:</span>
              {warehouseId ? (
                <span style={s.warehousePill}>
                  <HiOutlineBuildingStorefront size={13} />
                  {warehouses.find(w => w.WarehouseID == warehouseId)?.WarehouseName}
                </span>
              ) : (
                <span style={{ color: 'rgba(148,163,184,0.4)', fontSize: '13px', fontStyle: 'italic' }}>Auto-detected</span>
              )}
            </div>
            <div style={s.summaryRow}>
              <span>Items:</span>
              <strong style={{ color: '#e2e8f0' }}>{cartItems.length}</strong>
            </div>
          </div>

          <div style={s.totalRow}>
            <span style={{ color: '#e2e8f0' }}>Total:</span>
            <span style={{ color: '#4ade80' }}>{formatCurrency(calculateTotal())}</span>
          </div>

          <button onClick={handleSubmit} disabled={!canSubmit}
            style={canSubmit ? s.submitBtn : s.submitBtnDisabled}>
            {submitting ? 'Processing...' : <><HiOutlineBanknotes size={18} /> Complete Sale</>}
          </button>

          {(!warehouseId && cartItems.length === 0) && (
            <div style={s.infoBox}>
              <HiOutlineInformationCircle size={14} />
              Warehouse is auto-selected when you choose a product
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
