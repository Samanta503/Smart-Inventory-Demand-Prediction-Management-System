'use client';

/**
 * Categories Page
 * ===============
 * 
 * Manage product categories - view all and add new.
 * Professional Dark Theme - Matching Dashboard & Products
 */

import { useState, useEffect } from 'react';
import {
  HiOutlineTag,
  HiOutlineXMark,
  HiOutlinePlusCircle,
  HiOutlineExclamationTriangle,
  HiOutlineFolderOpen,
  HiOutlineCube,
  HiOutlineCalendarDays,
  HiOutlineSparkles,
  HiOutlineSquares2X2,
  HiOutlineClipboardDocumentList,
} from 'react-icons/hi2';

// Professional Dark Theme Styles - Matching Dashboard
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
    background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
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
    textDecoration: 'none',
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
  // Stats
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
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
  // Table Card
  tableCard: {
    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%)',
    borderRadius: '18px',
    padding: '0',
    marginBottom: '1.25rem',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  },
  tableTitle: {
    color: '#ffffff',
    fontSize: '1.05rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  tableCount: {
    background: 'rgba(59, 130, 246, 0.15)',
    color: '#93c5fd',
    padding: '0.25rem 0.7rem',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    border: '1px solid rgba(59, 130, 246, 0.2)',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0',
  },
  th: {
    textAlign: 'left',
    padding: '0.85rem 1.25rem',
    fontSize: '11px',
    fontWeight: '600',
    color: 'rgba(148, 163, 184, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    background: 'rgba(15, 23, 42, 0.4)',
  },
  td: {
    padding: '1rem 1.25rem',
    fontSize: '13px',
    color: '#e2e8f0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    transition: 'background 0.2s ease',
  },
  tr: {
    transition: 'all 0.2s ease',
  },
  // Category Name
  catName: {
    fontWeight: '600',
    color: '#ffffff',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  catIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    flexShrink: 0,
  },
  // Description
  catDesc: {
    color: 'rgba(148, 163, 184, 0.7)',
    fontSize: '13px',
    maxWidth: '300px',
  },
  // Product Count Badge
  productBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.3rem 0.85rem',
    fontSize: '12px',
    fontWeight: '600',
    borderRadius: '20px',
    background: 'rgba(59, 130, 246, 0.15)',
    color: '#93c5fd',
    border: '1px solid rgba(59, 130, 246, 0.25)',
  },
  // Date
  dateBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.3rem 0.75rem',
    fontSize: '12px',
    fontWeight: '500',
    borderRadius: '8px',
    background: 'rgba(139, 92, 246, 0.12)',
    color: '#c4b5fd',
    border: '1px solid rgba(139, 92, 246, 0.2)',
  },
  // Empty state
  emptyState: {
    padding: '4rem 2rem',
    textAlign: 'center',
    color: 'rgba(148, 163, 184, 0.6)',
  },
  emptyIcon: {
    width: '64px',
    height: '64px',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.25rem',
    border: '1px solid rgba(59, 130, 246, 0.2)',
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

// Color palette for category icons
const catColors = [
  { bg: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' },
  { bg: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa' },
  { bg: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' },
  { bg: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' },
  { bg: 'rgba(236, 72, 153, 0.2)', color: '#f472b6' },
  { bg: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee' },
  { bg: 'rgba(239, 68, 68, 0.2)', color: '#f87171' },
  { bg: 'rgba(168, 85, 247, 0.2)', color: '#c084fc' },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ categoryName: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      setLoading(true);
      const response = await fetch('/api/categories');
      const result = await response.json();
      if (result.success) {
        setCategories(result.data || []);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      setNewCategory({ categoryName: '', description: '' });
      setShowForm(false);
      fetchCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function getCatColor(index) {
    return catColors[index % catColors.length];
  }

  const totalProducts = categories.reduce((sum, c) => sum + (c.ProductCount || 0), 0);
  const activeCategories = categories.length;
  const avgProducts = activeCategories > 0 ? Math.round(totalProducts / activeCategories) : 0;

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
        <span style={styles.loadingText}>Loading categories...</span>
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
              <HiOutlineTag size={22} />
            </div>
            Categories
          </h1>
          <p style={styles.headerSubtitle}>
            Organize and manage your product categories
          </p>
        </div>
        <button
          style={showForm ? styles.cancelBtn : styles.addBtn}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? (
            <><HiOutlineXMark size={18} /> Cancel</>
          ) : (
            <><HiOutlinePlusCircle size={18} /> Add Category</>
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

      {/* Add Category Form */}
      {showForm && (
        <div style={styles.formCard}>
          <div style={styles.formGlow} />
          <h3 style={styles.formTitle}>
            <HiOutlineSparkles size={20} style={{ color: '#a78bfa' }} />
            Add New Category
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Category Name *</label>
                <input
                  type="text"
                  style={styles.formInput}
                  value={newCategory.categoryName}
                  onChange={(e) => setNewCategory({ ...newCategory, categoryName: e.target.value })}
                  placeholder="Enter category name..."
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Description</label>
                <input
                  type="text"
                  style={styles.formInput}
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Brief description (optional)..."
                />
              </div>
            </div>
            <button type="submit" style={{
              ...styles.submitBtn,
              opacity: submitting ? 0.7 : 1,
              cursor: submitting ? 'not-allowed' : 'pointer',
            }} disabled={submitting}>
              {submitting ? (
                'Adding...'
              ) : (
                <><HiOutlinePlusCircle size={16} /> Add Category</>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statGlow, background: 'rgba(245, 158, 11, 0.3)' }} />
          <div style={{ ...styles.statIcon, background: 'rgba(245, 158, 11, 0.2)' }}>
            <HiOutlineSquares2X2 size={20} style={{ color: '#fbbf24' }} />
          </div>
          <div style={styles.statValue}>{activeCategories}</div>
          <div style={styles.statLabel}>Total Categories</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statGlow, background: 'rgba(59, 130, 246, 0.3)' }} />
          <div style={{ ...styles.statIcon, background: 'rgba(59, 130, 246, 0.2)' }}>
            <HiOutlineCube size={20} style={{ color: '#60a5fa' }} />
          </div>
          <div style={styles.statValue}>{totalProducts}</div>
          <div style={styles.statLabel}>Total Products</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statGlow, background: 'rgba(139, 92, 246, 0.3)' }} />
          <div style={{ ...styles.statIcon, background: 'rgba(139, 92, 246, 0.2)' }}>
            <HiOutlineClipboardDocumentList size={20} style={{ color: '#a78bfa' }} />
          </div>
          <div style={styles.statValue}>{avgProducts}</div>
          <div style={styles.statLabel}>Avg. Products/Category</div>
        </div>
      </div>

      {/* Categories Table */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <h3 style={styles.tableTitle}>
            <HiOutlineFolderOpen size={18} style={{ color: '#60a5fa' }} />
            All Categories
          </h3>
          <span style={styles.tableCount}>{categories.length} total</span>
        </div>

        {categories.length > 0 ? (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Products</th>
                  <th style={styles.th}>Created</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, index) => {
                  const color = getCatColor(index);
                  return (
                    <tr key={cat.CategoryID} style={styles.tr}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={styles.td}>
                        <span style={{
                          background: 'rgba(255, 255, 255, 0.06)',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '6px',
                          fontSize: '12px',
                          color: 'rgba(148, 163, 184, 0.7)',
                          fontFamily: 'monospace',
                        }}>
                          #{cat.CategoryID}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.catName}>
                          <div style={{
                            ...styles.catIcon,
                            background: color.bg,
                            color: color.color,
                          }}>
                            <HiOutlineTag size={16} />
                          </div>
                          {cat.CategoryName}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.catDesc}>
                          {cat.Description || (
                            <span style={{ fontStyle: 'italic', opacity: 0.4 }}>No description</span>
                          )}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.productBadge}>
                          <HiOutlineCube size={12} />
                          {cat.ProductCount} products
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.dateBadge}>
                          <HiOutlineCalendarDays size={12} />
                          {new Date(cat.CreatedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <HiOutlineTag size={28} style={{ color: '#60a5fa' }} />
            </div>
            <h3 style={styles.emptyTitle}>No categories yet</h3>
            <p style={styles.emptyText}>Add your first category to start organizing products</p>
          </div>
        )}
      </div>
    </div>
  );
}
