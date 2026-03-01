'use client';

/**
 * Warehouses Page
 * ===============
 * 
 * View and manage warehouses with stock overview.
 * Professional Dark Theme - Matching Dashboard & Products
 */

import { useState, useEffect } from 'react';
import {
  HiOutlineBuildingOffice,
  HiOutlineXMark,
  HiOutlinePlusCircle,
  HiOutlineExclamationTriangle,
  HiOutlineCube,
  HiOutlineMapPin,
  HiOutlineSparkles,
  HiOutlineGlobeAlt,
  HiOutlineArchiveBox,
  HiOutlineChartBar,
  HiOutlineCheckBadge,
} from 'react-icons/hi2';

// Professional Dark Theme Styles
const styles = {
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
  headerContent: {
    position: 'relative',
    zIndex: 1,
  },
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
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
    color: 'white',
  },
  headerSubtitle: {
    color: 'rgba(148, 163, 184, 0.8)',
    fontSize: '0.9rem',
    marginTop: '0.35rem',
  },
  addBtn: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    color: 'white',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.35)',
    position: 'relative',
    zIndex: 1,
  },
  cancelBtn: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    color: 'white',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.35)',
    position: 'relative',
    zIndex: 1,
  },
  // Error Alert
  alertDanger: {
    background: 'linear-gradient(145deg, rgba(127, 29, 29, 0.3) 0%, rgba(15, 23, 42, 0.9) 100%)',
    borderRadius: '14px',
    padding: '1rem 1.25rem',
    marginBottom: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#fca5a5',
    fontSize: '14px',
  },
  // Form Card
  formCard: {
    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
    borderRadius: '20px',
    padding: '1.75rem',
    marginBottom: '1.5rem',
    border: '1px solid rgba(59, 130, 246, 0.15)',
    backdropFilter: 'blur(20px)',
    position: 'relative',
    overflow: 'hidden',
  },
  formGlow: {
    position: 'absolute',
    top: '-50%',
    right: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle at 70% 30%, rgba(139, 92, 246, 0.06) 0%, transparent 40%)',
    pointerEvents: 'none',
  },
  formTitle: {
    color: '#ffffff',
    fontSize: '1.15rem',
    fontWeight: '600',
    marginBottom: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    position: 'relative',
    zIndex: 1,
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.25rem',
    marginBottom: '1.25rem',
    position: 'relative',
    zIndex: 1,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  formLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'rgba(148, 163, 184, 0.9)',
  },
  formInput: {
    padding: '0.7rem 1rem',
    borderRadius: '10px',
    border: '1px solid rgba(59, 130, 246, 0.25)',
    background: 'rgba(15, 23, 42, 0.6)',
    color: '#e2e8f0',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s ease',
    width: '100%',
  },
  submitBtn: {
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    border: 'none',
    padding: '0.7rem 1.75rem',
    borderRadius: '10px',
    color: 'white',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(34, 197, 94, 0.35)',
    position: 'relative',
    zIndex: 1,
  },
  // Stats Grid
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  statCard: {
    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%)',
    borderRadius: '16px',
    padding: '1.25rem',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
  },
  statGlow: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    filter: 'blur(30px)',
    opacity: 0.4,
    pointerEvents: 'none',
  },
  statIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.75rem',
    position: 'relative',
    zIndex: 1,
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '0.15rem',
    position: 'relative',
    zIndex: 1,
  },
  statLabel: {
    fontSize: '0.8rem',
    color: 'rgba(148, 163, 184, 0.8)',
    fontWeight: '500',
    position: 'relative',
    zIndex: 1,
  },
  // Section Header
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: '1.1rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  sectionCount: {
    background: 'rgba(59, 130, 246, 0.15)',
    color: '#93c5fd',
    padding: '0.25rem 0.7rem',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    border: '1px solid rgba(59, 130, 246, 0.2)',
  },
  // Warehouse Card Grid
  warehouseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '1.25rem',
    marginBottom: '1.5rem',
  },
  // Individual Warehouse Card
  warehouseCard: {
    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%)',
    borderRadius: '18px',
    padding: '1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'default',
    position: 'relative',
    overflow: 'hidden',
  },
  cardGlow: {
    position: 'absolute',
    top: '-30%',
    right: '-30%',
    width: '160px',
    height: '160px',
    borderRadius: '50%',
    filter: 'blur(50px)',
    opacity: 0.15,
    pointerEvents: 'none',
    transition: 'opacity 0.35s ease',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.25rem',
    position: 'relative',
    zIndex: 1,
  },
  cardIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.5rem',
    flexShrink: 0,
  },
  cardName: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
    letterSpacing: '-0.2px',
  },
  cardLocation: {
    margin: '0.3rem 0 0',
    fontSize: '13px',
    color: 'rgba(148, 163, 184, 0.7)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
  },
  activeBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    padding: '0.3rem 0.75rem',
    fontSize: '11px',
    fontWeight: '600',
    borderRadius: '20px',
    background: 'rgba(34, 197, 94, 0.15)',
    color: '#4ade80',
    border: '1px solid rgba(34, 197, 94, 0.25)',
  },
  // Warehouse Metrics
  metricsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
    marginBottom: '1rem',
    position: 'relative',
    zIndex: 1,
  },
  metricBox: {
    textAlign: 'center',
    padding: '0.85rem 0.75rem',
    borderRadius: '12px',
    position: 'relative',
    overflow: 'hidden',
  },
  metricValue: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: '-0.5px',
    marginBottom: '0.15rem',
  },
  metricLabel: {
    fontSize: '11px',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },
  // Address Footer
  addressBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    background: 'rgba(15, 23, 42, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    fontSize: '12px',
    color: 'rgba(148, 163, 184, 0.6)',
    position: 'relative',
    zIndex: 1,
  },
  // Empty State
  emptyState: {
    gridColumn: '1 / -1',
    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%)',
    borderRadius: '18px',
    padding: '4rem 2rem',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    textAlign: 'center',
  },
  emptyIcon: {
    width: '68px',
    height: '68px',
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.25rem',
    border: '1px solid rgba(99, 102, 241, 0.2)',
  },
  emptyTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: 'rgba(148, 163, 184, 0.8)',
    marginBottom: '0.5rem',
  },
  emptyText: {
    fontSize: '0.85rem',
    color: 'rgba(148, 163, 184, 0.5)',
  },
  // Loading
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

// Card color accents
const cardAccents = [
  { glow: 'rgba(59, 130, 246, 0.5)', icon: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' },
  { glow: 'rgba(139, 92, 246, 0.5)', icon: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa' },
  { glow: 'rgba(6, 182, 212, 0.5)', icon: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee' },
  { glow: 'rgba(245, 158, 11, 0.5)', icon: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' },
  { glow: 'rgba(236, 72, 153, 0.5)', icon: 'rgba(236, 72, 153, 0.2)', color: '#f472b6' },
  { glow: 'rgba(34, 197, 94, 0.5)', icon: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' },
];

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    warehouseName: '',
    address: '',
    city: '',
    country: '',
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/warehouses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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

  function getAccent(index) {
    return cardAccents[index % cardAccents.length];
  }

  const totalStock = warehouses.reduce((sum, w) => sum + parseInt(w.TotalStock || 0), 0);
  const totalProducts = warehouses.reduce((sum, w) => sum + parseInt(w.ProductCount || 0), 0);
  const avgStock = warehouses.length > 0 ? Math.round(totalStock / warehouses.length) : 0;

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
        <span style={styles.loadingText}>Loading warehouses...</span>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.header}>
        <div style={styles.headerGlow} />
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>
            <div style={styles.titleIcon}>
              <HiOutlineBuildingOffice size={22} />
            </div>
            Warehouses
          </h1>
          <p style={styles.headerSubtitle}>
            Manage warehouse locations and stock levels
          </p>
        </div>
        <button
          style={showForm ? styles.cancelBtn : styles.addBtn}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? (
            <><HiOutlineXMark size={18} /> Cancel</>
          ) : (
            <><HiOutlinePlusCircle size={18} /> Add Warehouse</>
          )}
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div style={styles.alertDanger}>
          <HiOutlineExclamationTriangle size={18} />
          {error}
        </div>
      )}

      {/* Add Warehouse Form */}
      {showForm && (
        <div style={styles.formCard}>
          <div style={styles.formGlow} />
          <h3 style={styles.formTitle}>
            <HiOutlineSparkles size={20} style={{ color: '#a78bfa' }} />
            Add New Warehouse
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Warehouse Name *</label>
                <input
                  type="text"
                  name="warehouseName"
                  style={styles.formInput}
                  value={formData.warehouseName}
                  onChange={handleChange}
                  placeholder="Enter warehouse name..."
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>City</label>
                <input
                  type="text"
                  name="city"
                  style={styles.formInput}
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City name..."
                />
              </div>
            </div>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Country</label>
                <input
                  type="text"
                  name="country"
                  style={styles.formInput}
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country name..."
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Address</label>
                <input
                  type="text"
                  name="address"
                  style={styles.formInput}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Full address..."
                />
              </div>
            </div>
            <button
              type="submit"
              style={{
                ...styles.submitBtn,
                opacity: submitting ? 0.7 : 1,
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
              disabled={submitting}
            >
              {submitting ? (
                'Adding...'
              ) : (
                <><HiOutlinePlusCircle size={16} /> Add Warehouse</>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statGlow, background: 'rgba(99, 102, 241, 0.3)' }} />
          <div style={{ ...styles.statIcon, background: 'rgba(99, 102, 241, 0.2)' }}>
            <HiOutlineBuildingOffice size={20} style={{ color: '#818cf8' }} />
          </div>
          <div style={styles.statValue}>{warehouses.length}</div>
          <div style={styles.statLabel}>Total Warehouses</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statGlow, background: 'rgba(59, 130, 246, 0.3)' }} />
          <div style={{ ...styles.statIcon, background: 'rgba(59, 130, 246, 0.2)' }}>
            <HiOutlineArchiveBox size={20} style={{ color: '#60a5fa' }} />
          </div>
          <div style={styles.statValue}>{totalStock.toLocaleString()}</div>
          <div style={styles.statLabel}>Total Stock Units</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statGlow, background: 'rgba(34, 197, 94, 0.3)' }} />
          <div style={{ ...styles.statIcon, background: 'rgba(34, 197, 94, 0.2)' }}>
            <HiOutlineCube size={20} style={{ color: '#4ade80' }} />
          </div>
          <div style={styles.statValue}>{totalProducts}</div>
          <div style={styles.statLabel}>Total Products</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statGlow, background: 'rgba(245, 158, 11, 0.3)' }} />
          <div style={{ ...styles.statIcon, background: 'rgba(245, 158, 11, 0.2)' }}>
            <HiOutlineChartBar size={20} style={{ color: '#fbbf24' }} />
          </div>
          <div style={styles.statValue}>{avgStock.toLocaleString()}</div>
          <div style={styles.statLabel}>Avg Stock / Warehouse</div>
        </div>
      </div>

      {/* Section Header */}
      <div style={styles.sectionHeader}>
        <h3 style={styles.sectionTitle}>
          <HiOutlineGlobeAlt size={18} style={{ color: '#60a5fa' }} />
          All Warehouses
        </h3>
        <span style={styles.sectionCount}>{warehouses.length} locations</span>
      </div>

      {/* Warehouses Grid */}
      <div style={styles.warehouseGrid}>
        {warehouses.length > 0 ? (
          warehouses.map((warehouse, index) => {
            const accent = getAccent(index);
            return (
              <div
                key={warehouse.WarehouseID}
                style={styles.warehouseCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = `1px solid rgba(59, 130, 246, 0.2)`;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ ...styles.cardGlow, background: accent.glow }} />

                {/* Card Header */}
                <div style={styles.cardHeader}>
                  <div>
                    <div style={{ ...styles.cardIcon, background: accent.icon }}>
                      <HiOutlineBuildingOffice size={22} style={{ color: accent.color }} />
                    </div>
                    <h3 style={styles.cardName}>{warehouse.WarehouseName}</h3>
                    <p style={styles.cardLocation}>
                      <HiOutlineMapPin size={13} />
                      {warehouse.City || 'Unknown'}{warehouse.Country ? `, ${warehouse.Country}` : ''}
                    </p>
                  </div>
                  <span style={styles.activeBadge}>
                    <HiOutlineCheckBadge size={13} />
                    Active
                  </span>
                </div>

                {/* Metrics */}
                <div style={styles.metricsRow}>
                  <div style={{
                    ...styles.metricBox,
                    background: 'rgba(59, 130, 246, 0.08)',
                    border: '1px solid rgba(59, 130, 246, 0.12)',
                  }}>
                    <div style={styles.metricValue}>
                      {parseInt(warehouse.TotalStock || 0).toLocaleString()}
                    </div>
                    <div style={{ ...styles.metricLabel, color: '#60a5fa' }}>
                      Stock Units
                    </div>
                  </div>
                  <div style={{
                    ...styles.metricBox,
                    background: 'rgba(139, 92, 246, 0.08)',
                    border: '1px solid rgba(139, 92, 246, 0.12)',
                  }}>
                    <div style={styles.metricValue}>
                      {warehouse.ProductCount || 0}
                    </div>
                    <div style={{ ...styles.metricLabel, color: '#a78bfa' }}>
                      Products
                    </div>
                  </div>
                </div>

                {/* Address */}
                {warehouse.Address && (
                  <div style={styles.addressBar}>
                    <HiOutlineMapPin size={13} style={{ flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {warehouse.Address}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <HiOutlineBuildingOffice size={30} style={{ color: '#818cf8' }} />
            </div>
            <h3 style={styles.emptyTitle}>No warehouses yet</h3>
            <p style={styles.emptyText}>Add your first warehouse to start managing inventory locations</p>
          </div>
        )}
      </div>
    </div>
  );
}
