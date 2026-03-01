'use client';

/**
 * Add Product Page
 * ================
 * 
 * Professional dark-themed form to add a new product to the inventory.
 * Includes validation, category/supplier selection, and live profit preview.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineLightBulb,
  HiOutlinePlusCircle,
  HiOutlineCube,
  HiOutlineTag,
  HiOutlineBuildingStorefront,
  HiOutlineBanknotes,
  HiOutlineArchiveBox,
  HiOutlineDocumentText,
  HiOutlineCodeBracket,
  HiOutlineScale,
  HiOutlineBuildingOffice,
  HiOutlineArrowTrendingUp,
  HiOutlineShieldCheck,
} from 'react-icons/hi2';

// Dark theme styles matching Dashboard
const s = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    padding: '1.5rem 2rem 2rem',
  },
  // Header
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    padding: '1.5rem 1.75rem',
    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
    borderRadius: '20px',
    border: '1px solid rgba(59, 130, 246, 0.15)',
    backdropFilter: 'blur(20px)',
    position: 'relative',
    overflow: 'hidden',
  },
  headerGlow: {
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 40%)',
    pointerEvents: 'none',
  },
  headerContent: { position: 'relative', zIndex: 1 },
  headerTitle: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: '-0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  titleIcon: {
    width: '42px',
    height: '42px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
    color: 'white',
  },
  headerSubtitle: {
    color: 'rgba(148, 163, 184, 0.8)',
    fontSize: '0.9rem',
    marginTop: '0.35rem',
  },
  backBtn: {
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '0.65rem 1.25rem',
    borderRadius: '10px',
    color: '#94a3b8',
    fontWeight: '500',
    fontSize: '13px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    position: 'relative',
    zIndex: 1,
  },
  // Layout
  formLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 340px',
    gap: '1.25rem',
    alignItems: 'start',
  },
  // Cards
  card: {
    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%)',
    borderRadius: '18px',
    padding: '1.5rem',
    marginBottom: '1.25rem',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    position: 'relative',
    overflow: 'hidden',
  },
  cardGlow: {
    position: 'absolute',
    top: '-50%',
    right: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle at 70% 30%, rgba(139, 92, 246, 0.04) 0%, transparent 40%)',
    pointerEvents: 'none',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    marginBottom: '1.25rem',
    paddingBottom: '0.9rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    position: 'relative',
    zIndex: 1,
  },
  sectionIcon: {
    width: '34px',
    height: '34px',
    borderRadius: '9px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: '600',
  },
  // Form elements
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    position: 'relative',
    zIndex: 1,
  },
  formRow3: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '1rem',
    position: 'relative',
    zIndex: 1,
  },
  formGroup: {
    marginBottom: '1rem',
    position: 'relative',
    zIndex: 1,
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: 'rgba(148, 163, 184, 0.9)',
    marginBottom: '0.4rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  required: {
    color: '#f87171',
    marginLeft: '2px',
  },
  input: {
    width: '100%',
    padding: '0.7rem 0.9rem',
    fontSize: '14px',
    borderRadius: '10px',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    background: 'rgba(15, 23, 42, 0.6)',
    color: '#e2e8f0',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  textarea: {
    width: '100%',
    padding: '0.7rem 0.9rem',
    fontSize: '14px',
    borderRadius: '10px',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    background: 'rgba(15, 23, 42, 0.6)',
    color: '#e2e8f0',
    outline: 'none',
    transition: 'all 0.2s ease',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  select: {
    width: '100%',
    padding: '0.7rem 0.9rem',
    fontSize: '14px',
    borderRadius: '10px',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    background: 'rgba(15, 23, 42, 0.6)',
    color: '#e2e8f0',
    outline: 'none',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  help: {
    fontSize: '11px',
    color: 'rgba(148, 163, 184, 0.5)',
    marginTop: '0.3rem',
  },
  // Alerts
  successAlert: {
    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
    borderRadius: '12px',
    padding: '1rem 1.25rem',
    marginBottom: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    color: '#4ade80',
    fontSize: '14px',
    fontWeight: '500',
  },
  errorAlert: {
    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
    borderRadius: '12px',
    padding: '1rem 1.25rem',
    marginBottom: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#f87171',
    fontSize: '14px',
    fontWeight: '500',
  },
  // Profit card
  profitCard: {
    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
    borderRadius: '16px',
    padding: '1.25rem',
    border: '1px solid rgba(59, 130, 246, 0.15)',
    backdropFilter: 'blur(20px)',
    position: 'relative',
    overflow: 'hidden',
  },
  profitGlow: {
    position: 'absolute',
    top: '-30%',
    right: '-30%',
    width: '150%',
    height: '150%',
    background: 'radial-gradient(circle at 70% 30%, rgba(34, 197, 94, 0.08) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  profitRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.6rem',
    fontSize: '13px',
    position: 'relative',
    zIndex: 1,
  },
  profitLabel: {
    color: 'rgba(148, 163, 184, 0.7)',
  },
  profitValue: {
    color: '#e2e8f0',
    fontWeight: '600',
  },
  profitDivider: {
    margin: '0.75rem 0',
    border: 'none',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
  },
  // Buttons
  submitBtn: {
    flex: 1,
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    border: 'none',
    padding: '0.85rem 1.5rem',
    borderRadius: '12px',
    color: 'white',
    fontWeight: '600',
    fontSize: '15px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.35)',
  },
  cancelBtn: {
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '0.85rem 1.5rem',
    borderRadius: '12px',
    color: '#94a3b8',
    fontWeight: '500',
    fontSize: '15px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
  },
  // Side panel
  sidePanel: {
    position: 'sticky',
    top: '1.5rem',
  },
  tipCard: {
    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%)',
    borderRadius: '16px',
    padding: '1.25rem',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    marginBottom: '1rem',
  },
  tipTitle: {
    color: '#ffffff',
    fontSize: '0.9rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.85rem',
  },
  tipItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
    fontSize: '12px',
    color: 'rgba(148, 163, 184, 0.7)',
    marginBottom: '0.6rem',
    lineHeight: '1.5',
  },
  tipDot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    background: '#3b82f6',
    flexShrink: 0,
    marginTop: '6px',
  },
  // Loader
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
    gap: '1.5rem',
    background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '3px solid rgba(59, 130, 246, 0.2)',
    borderTop: '3px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: 'rgba(148, 163, 184, 0.8)',
    fontSize: '15px',
    fontWeight: '500',
  },
};

// Focus/blur handlers
const handleFocus = (e) => {
  e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
};
const handleBlur = (e) => {
  e.target.style.borderColor = 'rgba(59, 130, 246, 0.2)';
  e.target.style.boxShadow = 'none';
};

export default function AddProductPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    productCode: '',
    productName: '',
    description: '',
    categoryId: '',
    supplierId: '',
    warehouseId: '',
    unit: 'pieces',
    costPrice: '',
    sellingPrice: '',
    currentStock: '0',
    reorderLevel: '10',
  });

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesRes, suppliersRes, warehousesRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/suppliers'),
          fetch('/api/warehouses'),
        ]);
        const categoriesData = await categoriesRes.json();
        const suppliersData = await suppliersRes.json();
        const warehousesData = await warehousesRes.json();
        if (categoriesData.success && categoriesData.data) setCategories(categoriesData.data);
        if (suppliersData.success && suppliersData.data) setSuppliers(suppliersData.data);
        if (warehousesData.success && warehousesData.data) setWarehouses(warehousesData.data);
      } catch (err) {
        console.error('Error fetching dropdown data:', err);
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      if (!formData.productCode || !formData.productName || !formData.categoryId ||
          !formData.supplierId || !formData.costPrice || !formData.sellingPrice) {
        throw new Error('Please fill in all required fields');
      }
      const initialStock = parseInt(formData.currentStock) || 0;
      if (initialStock > 0 && !formData.warehouseId) {
        throw new Error('Please select a warehouse for the initial stock');
      }
      const costPrice = parseFloat(formData.costPrice);
      const sellingPrice = parseFloat(formData.sellingPrice);
      if (sellingPrice < costPrice) {
        throw new Error('Selling price must be greater than or equal to cost price');
      }
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productCode: formData.productCode,
          productName: formData.productName,
          description: formData.description,
          categoryId: parseInt(formData.categoryId),
          supplierId: parseInt(formData.supplierId),
          warehouseId: formData.warehouseId ? parseInt(formData.warehouseId) : null,
          unit: formData.unit,
          costPrice,
          sellingPrice,
          currentStock: parseInt(formData.currentStock) || 0,
          reorderLevel: parseInt(formData.reorderLevel) || 10,
        }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      setSuccess(true);
      setTimeout(() => router.push('/products'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Computed values
  const costPrice = parseFloat(formData.costPrice) || 0;
  const sellingPrice = parseFloat(formData.sellingPrice) || 0;
  const profitMargin = sellingPrice - costPrice;
  const profitPercent = costPrice > 0 ? ((profitMargin / costPrice) * 100).toFixed(1) : 0;
  const totalStockValue = (parseInt(formData.currentStock) || 0) * costPrice;
  const hasPrices = formData.costPrice && formData.sellingPrice;
  const filledFields = [
    formData.productCode, formData.productName, formData.categoryId,
    formData.supplierId, formData.costPrice, formData.sellingPrice
  ].filter(Boolean).length;
  const progress = Math.round((filledFields / 6) * 100);

  if (loadingData) {
    return (
      <div style={s.loadingContainer}>
        <div style={s.spinner}></div>
        <span style={s.loadingText}>Loading form data...</span>
      </div>
    );
  }

  return (
    <div style={s.container}>
      {/* Page Header */}
      <div style={s.header}>
        <div style={s.headerGlow}></div>
        <div style={s.headerContent}>
          <h1 style={s.headerTitle}>
            <span style={s.titleIcon}><HiOutlinePlusCircle size={22} /></span>
            Add New Product
          </h1>
          <p style={s.headerSubtitle}>Fill in the details below to add a new product to your inventory</p>
        </div>
        <Link href="/products" style={s.backBtn}>
          <HiOutlineArrowLeft size={15} /> Back to Products
        </Link>
      </div>

      {/* Alerts */}
      {success && (
        <div style={s.successAlert}>
          <HiOutlineCheckCircle size={18} />
          Product added successfully! Redirecting to products...
        </div>
      )}
      {error && (
        <div style={s.errorAlert}>
          <HiOutlineExclamationTriangle size={18} />
          {error}
        </div>
      )}

      {/* Main layout: Form + Side panel */}
      <div style={s.formLayout}>
        {/* Left: Form */}
        <div>
          <form onSubmit={handleSubmit}>
            {/* Section 1: Basic Information */}
            <div style={s.card}>
              <div style={s.cardGlow}></div>
              <div style={s.sectionHeader}>
                <span style={{ ...s.sectionIcon, background: 'rgba(59, 130, 246, 0.15)' }}>
                  <HiOutlineCube size={18} style={{ color: '#60a5fa' }} />
                </span>
                <span style={s.sectionTitle}>Basic Information</span>
              </div>
              <div style={s.formRow}>
                <div style={s.formGroup}>
                  <label style={s.label}>Product Code <span style={s.required}>*</span></label>
                  <input
                    type="text" name="productCode" placeholder="e.g., ELEC-001"
                    value={formData.productCode} onChange={handleChange}
                    onFocus={handleFocus} onBlur={handleBlur}
                    style={s.input} required
                  />
                  <div style={s.help}>Unique identifier for the product</div>
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Product Name <span style={s.required}>*</span></label>
                  <input
                    type="text" name="productName" placeholder="e.g., Wireless Mouse"
                    value={formData.productName} onChange={handleChange}
                    onFocus={handleFocus} onBlur={handleBlur}
                    style={s.input} required
                  />
                </div>
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Description</label>
                <textarea
                  name="description" placeholder="Brief product description..."
                  value={formData.description} onChange={handleChange}
                  onFocus={handleFocus} onBlur={handleBlur}
                  style={s.textarea} rows={3}
                />
              </div>
            </div>

            {/* Section 2: Classification */}
            <div style={s.card}>
              <div style={s.cardGlow}></div>
              <div style={s.sectionHeader}>
                <span style={{ ...s.sectionIcon, background: 'rgba(139, 92, 246, 0.15)' }}>
                  <HiOutlineTag size={18} style={{ color: '#a78bfa' }} />
                </span>
                <span style={s.sectionTitle}>Classification</span>
              </div>
              <div style={s.formRow}>
                <div style={s.formGroup}>
                  <label style={s.label}>Category <span style={s.required}>*</span></label>
                  <select
                    name="categoryId" value={formData.categoryId}
                    onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur}
                    style={s.select} required
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.CategoryID} value={cat.CategoryID}>{cat.CategoryName}</option>
                    ))}
                  </select>
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Supplier <span style={s.required}>*</span></label>
                  <select
                    name="supplierId" value={formData.supplierId}
                    onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur}
                    style={s.select} required
                  >
                    <option value="">Select a supplier</option>
                    {suppliers.map(sup => (
                      <option key={sup.SupplierID} value={sup.SupplierID}>{sup.SupplierName}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ ...s.formGroup, maxWidth: '50%' }}>
                <label style={s.label}>Unit of Measurement</label>
                <select
                  name="unit" value={formData.unit}
                  onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur}
                  style={s.select}
                >
                  <option value="pieces">Pieces</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="liters">Liters</option>
                  <option value="meters">Meters</option>
                  <option value="boxes">Boxes</option>
                  <option value="packs">Packs</option>
                  <option value="sets">Sets</option>
                  <option value="units">Units</option>
                </select>
              </div>
            </div>

            {/* Section 3: Pricing */}
            <div style={s.card}>
              <div style={s.cardGlow}></div>
              <div style={s.sectionHeader}>
                <span style={{ ...s.sectionIcon, background: 'rgba(34, 197, 94, 0.15)' }}>
                  <HiOutlineBanknotes size={18} style={{ color: '#4ade80' }} />
                </span>
                <span style={s.sectionTitle}>Pricing</span>
              </div>
              <div style={s.formRow}>
                <div style={s.formGroup}>
                  <label style={s.label}>Cost Price ($) <span style={s.required}>*</span></label>
                  <input
                    type="number" name="costPrice" placeholder="0.00"
                    min="0" step="0.01"
                    value={formData.costPrice} onChange={handleChange}
                    onFocus={handleFocus} onBlur={handleBlur}
                    style={s.input} required
                  />
                  <div style={s.help}>Price you pay to supplier</div>
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Selling Price ($) <span style={s.required}>*</span></label>
                  <input
                    type="number" name="sellingPrice" placeholder="0.00"
                    min="0" step="0.01"
                    value={formData.sellingPrice} onChange={handleChange}
                    onFocus={handleFocus} onBlur={handleBlur}
                    style={s.input} required
                  />
                  <div style={s.help}>Price customer pays</div>
                </div>
              </div>
              {/* Live profit indicator */}
              {hasPrices && (
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  marginTop: '0.25rem',
                  position: 'relative',
                  zIndex: 1,
                }}>
                  <div style={{
                    flex: 1,
                    padding: '0.7rem 1rem',
                    borderRadius: '10px',
                    background: profitMargin >= 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${profitMargin >= 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}>
                    <HiOutlineArrowTrendingUp size={16} style={{ color: profitMargin >= 0 ? '#4ade80' : '#f87171' }} />
                    <span style={{ fontSize: '13px', color: profitMargin >= 0 ? '#4ade80' : '#f87171', fontWeight: '600' }}>
                      Margin: ${profitMargin.toFixed(2)} ({profitPercent}%)
                    </span>
                  </div>
                  {profitMargin < 0 && (
                    <div style={{
                      padding: '0.7rem 1rem',
                      borderRadius: '10px',
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '12px',
                      color: '#fbbf24',
                    }}>
                      <HiOutlineExclamationTriangle size={14} />
                      Loss per unit
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Section 4: Stock & Warehouse */}
            <div style={s.card}>
              <div style={s.cardGlow}></div>
              <div style={s.sectionHeader}>
                <span style={{ ...s.sectionIcon, background: 'rgba(6, 182, 212, 0.15)' }}>
                  <HiOutlineArchiveBox size={18} style={{ color: '#22d3ee' }} />
                </span>
                <span style={s.sectionTitle}>Stock & Warehouse</span>
              </div>
              <div style={s.formRow3}>
                <div style={s.formGroup}>
                  <label style={s.label}>Warehouse</label>
                  <select
                    name="warehouseId" value={formData.warehouseId}
                    onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur}
                    style={s.select}
                  >
                    <option value="">Select a warehouse</option>
                    {warehouses.map(wh => (
                      <option key={wh.WarehouseID} value={wh.WarehouseID}>{wh.WarehouseName}</option>
                    ))}
                  </select>
                  <div style={s.help}>For initial stock placement</div>
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Initial Stock</label>
                  <input
                    type="number" name="currentStock" placeholder="0" min="0"
                    value={formData.currentStock} onChange={handleChange}
                    onFocus={handleFocus} onBlur={handleBlur}
                    style={s.input}
                  />
                  <div style={s.help}>Starting inventory quantity</div>
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Reorder Level</label>
                  <input
                    type="number" name="reorderLevel" placeholder="10" min="0"
                    value={formData.reorderLevel} onChange={handleChange}
                    onFocus={handleFocus} onBlur={handleBlur}
                    style={s.input}
                  />
                  <div style={s.help}>Alert threshold</div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" style={{
                ...s.submitBtn,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }} disabled={loading}>
                {loading ? (
                  <>
                    <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    Adding Product...
                  </>
                ) : (
                  <>
                    <HiOutlinePlusCircle size={18} />
                    Add Product
                  </>
                )}
              </button>
              <Link href="/products" style={s.cancelBtn}>
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Right: Side panel */}
        <div style={s.sidePanel}>
          {/* Progress Card */}
          <div style={s.tipCard}>
            <div style={s.tipTitle}>
              <HiOutlineShieldCheck size={16} style={{ color: '#60a5fa' }} />
              Form Progress
            </div>
            <div style={{
              width: '100%',
              height: '6px',
              borderRadius: '3px',
              background: 'rgba(255, 255, 255, 0.06)',
              marginBottom: '0.6rem',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                borderRadius: '3px',
                background: progress === 100
                  ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                  : 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                transition: 'width 0.4s ease',
              }}></div>
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(148, 163, 184, 0.6)', textAlign: 'center' }}>
              {progress === 100 ? (
                <span style={{ color: '#4ade80' }}>All required fields filled!</span>
              ) : (
                <>{filledFields}/6 required fields completed</>
              )}
            </div>
          </div>

          {/* Live Preview Card */}
          {hasPrices && (
            <div style={s.profitCard}>
              <div style={s.profitGlow}></div>
              <div style={{
                ...s.tipTitle,
                marginBottom: '1rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              }}>
                <HiOutlineBanknotes size={16} style={{ color: '#4ade80' }} />
                Pricing Preview
              </div>
              <div style={s.profitRow}>
                <span style={s.profitLabel}>Cost Price</span>
                <span style={s.profitValue}>${costPrice.toFixed(2)}</span>
              </div>
              <div style={s.profitRow}>
                <span style={s.profitLabel}>Selling Price</span>
                <span style={s.profitValue}>${sellingPrice.toFixed(2)}</span>
              </div>
              <hr style={s.profitDivider} />
              <div style={s.profitRow}>
                <span style={s.profitLabel}>Profit / Unit</span>
                <span style={{
                  ...s.profitValue,
                  color: profitMargin >= 0 ? '#4ade80' : '#f87171',
                }}>${profitMargin.toFixed(2)}</span>
              </div>
              <div style={s.profitRow}>
                <span style={s.profitLabel}>Margin</span>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '700',
                  background: profitMargin >= 0 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: profitMargin >= 0 ? '#4ade80' : '#f87171',
                  border: `1px solid ${profitMargin >= 0 ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
                }}>{profitPercent}%</span>
              </div>
              {totalStockValue > 0 && (
                <>
                  <hr style={s.profitDivider} />
                  <div style={s.profitRow}>
                    <span style={s.profitLabel}>Stock Value</span>
                    <span style={s.profitValue}>${totalStockValue.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Tips Card */}
          <div style={{ ...s.tipCard, marginTop: hasPrices ? '1rem' : 0 }}>
            <div style={s.tipTitle}>
              <HiOutlineLightBulb size={16} style={{ color: '#fbbf24' }} />
              Quick Tips
            </div>
            <div style={s.tipItem}>
              <div style={s.tipDot}></div>
              <span>Use a consistent code format (e.g., ELEC-001, CLTH-002)</span>
            </div>
            <div style={s.tipItem}>
              <div style={s.tipDot}></div>
              <span>Set reorder level based on average weekly sales</span>
            </div>
            <div style={s.tipItem}>
              <div style={s.tipDot}></div>
              <span>Selling price must be ≥ cost price</span>
            </div>
            <div style={s.tipItem}>
              <div style={s.tipDot}></div>
              <span>Warehouse is required only if you set initial stock {'>'} 0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
