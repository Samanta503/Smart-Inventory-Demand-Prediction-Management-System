'use client';

/**
 * Add Purchase Page
 * =================
 *
 * Record new stock arrivals from suppliers with multi-item support.
 * Supports category-based supplier filtering.
 *
 * Professional Dark Theme
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  HiOutlineInboxArrowDown,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineFolderOpen,
  HiOutlinePlusCircle,
  HiOutlineXMark,
  HiOutlineArrowLeft,
  HiOutlineBuildingStorefront,
  HiOutlineBanknotes,
  HiOutlineCube,
  HiOutlineDocumentText,
  HiOutlineTruck,
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
    borderRadius: '20px', border: '1px solid rgba(139,92,246,0.15)',
    backdropFilter: 'blur(20px)', position: 'relative', overflow: 'hidden',
  },
  headerGlow: {
    position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
    background: 'radial-gradient(circle at 30% 30%, rgba(139,92,246,0.08), transparent 40%)',
    pointerEvents: 'none',
  },
  headerLeft: { position: 'relative', zIndex: 1 },
  headerTitle: {
    fontSize: '1.75rem', fontWeight: '700', color: '#fff',
    letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '0.75rem',
  },
  titleIcon: {
    width: '42px', height: '42px',
    background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
    borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(139,92,246,0.4)', color: '#fff',
  },
  headerSub: { color: 'rgba(148,163,184,0.8)', fontSize: '0.9rem', marginTop: '0.35rem' },
  backBtn: {
    background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)',
    padding: '0.7rem 1.25rem', borderRadius: '12px',
    color: '#a78bfa', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
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
    background: 'radial-gradient(circle at 70% 30%, rgba(139,92,246,0.04), transparent 40%)',
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
    borderRadius: '10px', border: '1px solid rgba(139,92,246,0.2)',
    background: 'rgba(15,23,42,0.6)', color: '#e2e8f0', outline: 'none',
    transition: 'all 0.2s ease',
  },
  inputReadonly: {
    width: '100%', padding: '0.7rem 0.85rem', fontSize: '14px',
    borderRadius: '10px', border: '1px solid rgba(139,92,246,0.1)',
    background: 'rgba(15,23,42,0.3)', color: 'rgba(148,163,184,0.6)', outline: 'none',
  },
  select: {
    width: '100%', padding: '0.7rem 0.85rem', fontSize: '14px',
    borderRadius: '10px', border: '1px solid rgba(139,92,246,0.2)',
    background: 'rgba(15,23,42,0.6)', color: '#e2e8f0', outline: 'none',
    transition: 'all 0.2s ease', cursor: 'pointer',
  },
  categoryBox: {
    background: 'rgba(139,92,246,0.06)', border: '2px dashed rgba(139,92,246,0.3)',
    borderRadius: '12px', padding: '1rem', marginBottom: '1rem',
    position: 'relative', zIndex: 1,
  },
  categoryLabel: {
    display: 'flex', alignItems: 'center', gap: '0.4rem',
    color: '#a78bfa', fontWeight: '700', fontSize: '13px', marginBottom: '0.5rem',
  },
  categoryInfo: {
    marginTop: '0.5rem', fontSize: '12px', color: 'rgba(148,163,184,0.5)',
  },
  filterBadge: {
    color: '#a78bfa', fontSize: '11px', fontWeight: '500',
  },
  noSupplier: {
    marginTop: '0.5rem', fontSize: '12px', color: '#f87171',
    display: 'flex', alignItems: 'center', gap: '0.3rem',
  },
  addItemBtn: {
    background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
    border: 'none', padding: '0.7rem 1.25rem', borderRadius: '10px',
    color: '#fff', fontWeight: '600', fontSize: '13px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '0.4rem',
    boxShadow: '0 4px 12px rgba(139,92,246,0.3)', transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  addItemBtnDisabled: {
    background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.1)',
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
    background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)',
    padding: '2px 7px', borderRadius: '4px', fontSize: '10.5px',
    fontFamily: "'SF Mono','Fira Code',monospace", color: '#a78bfa',
    display: 'inline-block', marginTop: '3px',
  },
  costText: { color: '#4ade80', fontWeight: '700' },
  emptyCart: {
    textAlign: 'center', padding: '2rem 1rem', color: 'rgba(148,163,184,0.5)',
    fontSize: '14px', position: 'relative', zIndex: 1,
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
    background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
    boxShadow: '0 4px 16px rgba(139,92,246,0.35)', transition: 'all 0.2s ease',
  },
  submitBtnDisabled: {
    width: '100%', padding: '0.9rem', fontSize: '1rem', fontWeight: '600',
    borderRadius: '12px', border: 'none', cursor: 'not-allowed',
    background: 'rgba(139,92,246,0.15)', color: 'rgba(148,163,184,0.4)',
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
    border: '3px solid rgba(139,92,246,0.2)', borderTop: '3px solid #8b5cf6',
    borderRadius: '50%', animation: 'spin 1s linear infinite',
  },
};

const onFocus = (e) => { e.target.style.borderColor = 'rgba(139,92,246,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)'; };
const onBlur  = (e) => { e.target.style.borderColor = 'rgba(139,92,246,0.2)'; e.target.style.boxShadow = 'none'; };

export default function AddPurchasePage() {
  const router = useRouter();

  const [categoryId, setCategoryId] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({ productId: '', quantity: '', unitCost: '' });
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [allSuppliers, setAllSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => { fetchData(); generateReferenceNumber(); }, []);

  useEffect(() => {
    if (categoryId) {
      const filteredSuppliers = allSuppliers.filter(s =>
        s.categories && s.categories.some(c => c.CategoryID === parseInt(categoryId))
      );
      setSuppliers(filteredSuppliers);
      const filteredProducts = allProducts.filter(p => p.CategoryID === parseInt(categoryId));
      setProducts(filteredProducts);
      if (supplierId && !filteredSuppliers.some(s => s.SupplierID === parseInt(supplierId))) setSupplierId('');
      if (currentItem.productId && !filteredProducts.some(p => p.ProductID === parseInt(currentItem.productId))) {
        setCurrentItem({ productId: '', quantity: '', unitCost: '' });
      }
    } else {
      setSuppliers(allSuppliers);
      setProducts(allProducts);
    }
  }, [categoryId, allSuppliers, allProducts]);

  async function fetchData() {
    try {
      const [productsRes, suppliersRes, warehousesRes, categoriesRes] = await Promise.all([
        fetch('/api/products'), fetch('/api/suppliers'), fetch('/api/warehouses'), fetch('/api/categories'),
      ]);
      const productsData = await productsRes.json();
      const suppliersData = await suppliersRes.json();
      const warehousesData = await warehousesRes.json();
      const categoriesData = await categoriesRes.json();
      if (productsData.success)  { setProducts(productsData.data || []);  setAllProducts(productsData.data || []); }
      if (suppliersData.success) { setSuppliers(suppliersData.data || []); setAllSuppliers(suppliersData.data || []); }
      if (warehousesData.success) {
        setWarehouses(warehousesData.data || []);
        if (warehousesData.data?.length > 0) setWarehouseId(warehousesData.data[0].WarehouseID.toString());
      }
      if (categoriesData.success) setCategories(categoriesData.data || []);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  function generateReferenceNumber() {
    const d = new Date();
    const ref = `PO-${d.getFullYear()}${(d.getMonth()+1).toString().padStart(2,'0')}${d.getDate().toString().padStart(2,'0')}-${Math.random().toString(36).substr(2,4).toUpperCase()}`;
    setReferenceNumber(ref);
  }

  function getSelectedProduct() {
    return products.find(p => p.ProductID === parseInt(currentItem.productId));
  }

  function addToCart() {
    const product = getSelectedProduct();
    if (!product || !currentItem.quantity || !currentItem.unitCost) return;
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
          referenceNumber, notes,
          items: cartItems.map(item => ({
            productId: item.productId, quantity: item.quantity, unitCost: item.unitCost
          }))
        })
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      setSuccess(true);
      setTimeout(() => router.push('/purchases'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
  }

  const canAdd = currentItem.productId && currentItem.quantity && currentItem.unitCost;
  const canSubmit = !submitting && supplierId && warehouseId && cartItems.length > 0;

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
            <span style={s.titleIcon}><HiOutlineInboxArrowDown size={22} /></span>
            New Purchase
          </h1>
          <p style={s.headerSub}>Record incoming stock with multiple items</p>
        </div>
        <Link href="/purchases" style={s.backBtn}>
          <HiOutlineArrowLeft size={16} /> Back to Purchases
        </Link>
      </div>

      {success && (
        <div style={s.alertSuccess}>
          <HiOutlineCheckCircle size={18} /> Purchase recorded successfully! Redirecting...
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
          {/* Purchase Details */}
          <div style={s.card}>
            <div style={s.cardGlow}></div>
            <h3 style={s.cardTitle}><HiOutlineDocumentText size={18} style={{ color: '#a78bfa' }} /> Purchase Details</h3>

            <div style={s.formRow}>
              <div style={s.formGroup}>
                <label style={s.label}>Reference Number</label>
                <input type="text" value={referenceNumber} readOnly style={s.inputReadonly} />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Date</label>
                <input type="text" value={new Date().toLocaleDateString()} readOnly style={s.inputReadonly} />
              </div>
            </div>

            {/* Category Filter */}
            <div style={s.categoryBox}>
              <label style={s.categoryLabel}>
                <HiOutlineFolderOpen size={16} /> Step 1: Select Category (Optional)
              </label>
              <select value={categoryId}
                onChange={(e) => { setCategoryId(e.target.value); setSupplierId(''); }}
                style={s.select} onFocus={onFocus} onBlur={onBlur}>
                <option value="">All Categories (Show all suppliers)</option>
                {categories.map(c => (
                  <option key={c.CategoryID} value={c.CategoryID}>{c.CategoryName}</option>
                ))}
              </select>
              {categoryId && (
                <p style={s.categoryInfo}>
                  Showing {suppliers.length} supplier(s) and {products.length} product(s) in this category
                </p>
              )}
            </div>

            <div style={s.formRow}>
              <div style={s.formGroup}>
                <label style={s.label}>
                  Supplier * {categoryId && <span style={s.filterBadge}>(filtered)</span>}
                </label>
                <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)}
                  style={s.select} onFocus={onFocus} onBlur={onBlur}>
                  <option value="">Select supplier...</option>
                  {suppliers.map(sup => (
                    <option key={sup.SupplierID} value={sup.SupplierID}>
                      {sup.SupplierName}
                      {sup.categories?.length > 0 && ` (${sup.categories.map(c => c.CategoryName).join(', ')})`}
                    </option>
                  ))}
                </select>
                {categoryId && suppliers.length === 0 && (
                  <p style={s.noSupplier}>
                    <HiOutlineExclamationTriangle size={14} /> No suppliers found for this category
                  </p>
                )}
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Warehouse *</label>
                <select value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)}
                  style={s.select} onFocus={onFocus} onBlur={onBlur}>
                  <option value="">Select warehouse...</option>
                  {warehouses.map(w => (
                    <option key={w.WarehouseID} value={w.WarehouseID}>{w.WarehouseName}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={s.formGroup}>
              <label style={s.label}>Notes</label>
              <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)}
                style={s.input} placeholder="Optional notes..." onFocus={onFocus} onBlur={onBlur} />
            </div>
          </div>

          {/* Add Items */}
          <div style={s.card}>
            <div style={s.cardGlow}></div>
            <h3 style={s.cardTitle}><HiOutlineCube size={18} style={{ color: '#60a5fa' }} /> Add Items</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '1rem', alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
              <div>
                <label style={s.label}>
                  Product {categoryId && <span style={s.filterBadge}>(filtered)</span>}
                </label>
                <select value={currentItem.productId}
                  onChange={(e) => {
                    const prod = products.find(p => p.ProductID === parseInt(e.target.value));
                    setCurrentItem({ productId: e.target.value, quantity: '', unitCost: prod?.CostPrice || '' });
                  }}
                  style={s.select} onFocus={onFocus} onBlur={onBlur}>
                  <option value="">Select product...</option>
                  {products.map(p => (
                    <option key={p.ProductID} value={p.ProductID}>
                      {p.ProductCode} - {p.ProductName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={s.label}>Qty</label>
                <input type="number" value={currentItem.quantity}
                  onChange={(e) => setCurrentItem({...currentItem, quantity: e.target.value})}
                  style={s.input} min="1" onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div>
                <label style={s.label}>Cost</label>
                <input type="number" value={currentItem.unitCost}
                  onChange={(e) => setCurrentItem({...currentItem, unitCost: e.target.value})}
                  style={s.input} step="0.01" min="0" onFocus={onFocus} onBlur={onBlur} />
              </div>
              <button type="button" onClick={addToCart} disabled={!canAdd}
                style={canAdd ? s.addItemBtn : s.addItemBtnDisabled}>
                <HiOutlinePlusCircle size={16} /> Add
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div style={s.card}>
            <div style={s.cardGlow}></div>
            <h3 style={s.cardTitle}><HiOutlineInboxArrowDown size={18} style={{ color: '#22c55e' }} /> Cart Items ({cartItems.length})</h3>
            {cartItems.length > 0 ? (
              <div style={s.tableWrap}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      {['Product', 'Qty', 'Cost', 'Subtotal', ''].map(h => (
                        <th key={h} style={s.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item, index) => (
                      <tr key={index}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.04)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                        <td style={s.td}>
                          <div style={s.productName}>{item.productName}</div>
                          <span style={s.productCode}>{item.productCode}</span>
                        </td>
                        <td style={s.td}>{item.quantity}</td>
                        <td style={s.td}>{formatCurrency(item.unitCost)}</td>
                        <td style={s.td}>
                          <span style={s.costText}>{formatCurrency(item.quantity * item.unitCost)}</span>
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
                No items added yet. Select products above.
              </div>
            )}
          </div>
        </div>

        {/* Right: Summary */}
        <div style={s.summaryCard}>
          <h3 style={s.cardTitle}><HiOutlineBanknotes size={18} style={{ color: '#a78bfa' }} /> Purchase Summary</h3>

          <div style={s.summaryDivider}>
            <div style={s.summaryRow}>
              <span>Supplier:</span>
              <strong style={{ color: '#e2e8f0' }}>{suppliers.find(sup => sup.SupplierID == supplierId)?.SupplierName || '-'}</strong>
            </div>
            <div style={s.summaryRow}>
              <span>Warehouse:</span>
              <strong style={{ color: '#e2e8f0' }}>{warehouses.find(w => w.WarehouseID == warehouseId)?.WarehouseName || '-'}</strong>
            </div>
            <div style={s.summaryRow}>
              <span>Items:</span>
              <strong style={{ color: '#e2e8f0' }}>{cartItems.length}</strong>
            </div>
          </div>

          <div style={s.totalRow}>
            <span style={{ color: '#e2e8f0' }}>Total:</span>
            <span style={{ color: '#a78bfa' }}>{formatCurrency(calculateTotal())}</span>
          </div>

          <button onClick={handleSubmit} disabled={!canSubmit}
            style={canSubmit ? s.submitBtn : s.submitBtnDisabled}>
            {submitting ? 'Processing...' : <><HiOutlineInboxArrowDown size={18} /> Record Purchase</>}
          </button>
        </div>
      </div>
    </div>
  );
}
