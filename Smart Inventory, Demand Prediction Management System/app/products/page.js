'use client';

/**
 * Products List Page
 * ==================
 * 
 * Displays all products in a table with their details,
 * stock status, and quick actions.
 * 
 * Professional Dark Theme - Matching Dashboard
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HiOutlineCube, HiOutlineSparkles, HiOutlineMagnifyingGlass, HiOutlineExclamationTriangle, HiOutlineArchiveBox, HiOutlineBanknotes, HiOutlineExclamationCircle, HiOutlineXCircle } from 'react-icons/hi2';

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
  // Search card
  searchCard: {
    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%)',
    borderRadius: '16px',
    padding: '1rem 1.25rem',
    marginBottom: '1.25rem',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  searchWrapper: {
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'rgba(148, 163, 184, 0.5)',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '12px 18px 12px 40px',
    fontSize: '14px',
    borderRadius: '10px',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    background: 'rgba(15, 23, 42, 0.6)',
    color: '#e2e8f0',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  // Table card
  tableCard: {
    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%)',
    borderRadius: '18px',
    padding: '0',
    marginBottom: '1.25rem',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
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
    padding: '0.85rem 1rem',
    fontSize: '11px',
    fontWeight: '600',
    color: 'rgba(148, 163, 184, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    background: 'rgba(15, 23, 42, 0.4)',
  },
  td: {
    padding: '0.85rem 1rem',
    fontSize: '13px',
    color: '#e2e8f0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
  },
  // Badges
  badgeSuccess: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.3rem 0.75rem',
    fontSize: '11px',
    fontWeight: '600',
    borderRadius: '20px',
    background: 'rgba(34, 197, 94, 0.15)',
    color: '#4ade80',
    border: '1px solid rgba(34, 197, 94, 0.25)',
  },
  badgeWarning: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.3rem 0.75rem',
    fontSize: '11px',
    fontWeight: '600',
    borderRadius: '20px',
    background: 'rgba(245, 158, 11, 0.15)',
    color: '#fbbf24',
    border: '1px solid rgba(245, 158, 11, 0.25)',
  },
  badgeDanger: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.3rem 0.75rem',
    fontSize: '11px',
    fontWeight: '600',
    borderRadius: '20px',
    background: 'rgba(239, 68, 68, 0.15)',
    color: '#f87171',
    border: '1px solid rgba(239, 68, 68, 0.25)',
  },
  // Code badge
  codeBadge: {
    background: 'rgba(59, 130, 246, 0.15)',
    color: '#93c5fd',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    fontFamily: 'monospace',
    border: '1px solid rgba(59, 130, 246, 0.2)',
  },
  // Warehouse tag
  warehouseTag: {
    background: 'rgba(139, 92, 246, 0.15)',
    color: '#c4b5fd',
    padding: '2px 8px',
    borderRadius: '6px',
    marginRight: '6px',
    fontSize: '11px',
    border: '1px solid rgba(139, 92, 246, 0.2)',
  },
  // Summary section
  summaryCard: {
    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
    borderRadius: '18px',
    padding: '1.5rem',
    border: '1px solid rgba(59, 130, 246, 0.15)',
    backdropFilter: 'blur(20px)',
    position: 'relative',
    overflow: 'hidden',
  },
  summaryGlow: {
    position: 'absolute',
    top: '-50%',
    right: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle at 70% 30%, rgba(139, 92, 246, 0.06) 0%, transparent 40%)',
    pointerEvents: 'none',
  },
  summaryTitle: {
    color: '#ffffff',
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    position: 'relative',
    zIndex: 1,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
    position: 'relative',
    zIndex: 1,
  },
  statCard: {
    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.7) 100%)',
    borderRadius: '14px',
    padding: '1.1rem',
    border: '1px solid rgba(255, 255, 255, 0.06)',
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
    fontSize: '1.35rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '0.15rem',
    position: 'relative',
    zIndex: 1,
  },
  statLabel: {
    fontSize: '0.75rem',
    color: 'rgba(148, 163, 184, 0.8)',
    fontWeight: '500',
    position: 'relative',
    zIndex: 1,
  },
  // Empty state
  emptyState: {
    padding: '3rem 2rem',
    textAlign: 'center',
    color: 'rgba(148, 163, 184, 0.6)',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
    opacity: 0.5,
    color: 'rgba(148, 163, 184, 0.4)',
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
  // Loading & Error
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
  errorCard: {
    background: 'linear-gradient(145deg, rgba(127, 29, 29, 0.3) 0%, rgba(15, 23, 42, 0.9) 100%)',
    borderRadius: '16px',
    padding: '1.5rem',
    margin: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    border: '1px solid rgba(239, 68, 68, 0.3)',
  },
  retryBtn: {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    background: 'rgba(239, 68, 68, 0.15)',
    color: '#fca5a5',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    marginLeft: 'auto',
    transition: 'all 0.2s ease',
  },
  // Muted text
  mutedText: {
    color: 'rgba(148, 163, 184, 0.6)',
  },
  strongText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  productName: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '13px',
  },
  productDesc: {
    color: 'rgba(148, 163, 184, 0.6)',
    fontSize: '11px',
    marginTop: '2px',
  },
};

export default function ProductsPage() {
  // State variables
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch products when component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/products');
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      setProducts(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value || 0);
  }

  function getStockBadgeStyle(status) {
    switch (status) {
      case 'Out of Stock': return styles.badgeDanger;
      case 'Low Stock': return styles.badgeWarning;
      default: return styles.badgeSuccess;
    }
  }

  const filteredProducts = products.filter(product =>
    product.ProductName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.ProductCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.CategoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <span style={styles.loadingText}>Loading products...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ ...styles.container }}>
        <div style={styles.errorCard}>
          <HiOutlineExclamationTriangle size={24} style={{ color: '#f87171', flexShrink: 0 }} />
          <span style={{ color: '#fca5a5', fontSize: '14px' }}>Error: {error}</span>
          <button style={styles.retryBtn} onClick={fetchProducts}>Retry</button>
        </div>
      </div>
    );
  }

  const lowStockCount = products.filter(p => p.StockStatus === 'Low Stock').length;
  const outOfStockCount = products.filter(p => p.StockStatus === 'Out of Stock').length;
  const totalValue = products.reduce((sum, p) => sum + (parseFloat(p.StockValue) || 0), 0);

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.header}>
        <div style={styles.headerGlow}></div>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>
            <span style={styles.titleIcon}><HiOutlineCube size={22} /></span>
            Products
          </h1>
          <p style={styles.headerSubtitle}>
            Manage your product inventory • {products.length} products total
          </p>
        </div>
        <Link href="/products/add" style={styles.addBtn}>
          <HiOutlineSparkles size={16} /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div style={styles.searchCard}>
        <div style={styles.searchWrapper}>
          <HiOutlineMagnifyingGlass size={16} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by name, code, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(59, 130, 246, 0.2)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* Products Table */}
      <div style={styles.tableCard}>
        {filteredProducts.length > 0 ? (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {['Code', 'Product Name', 'Category', 'Supplier', 'Cost', 'Price', 'Total Stock', 'Warehouse Stock', 'Status', 'Value'].map((header) => (
                    <th key={header} style={styles.th}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.ProductID}
                    style={{ transition: 'background 0.2s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={styles.td}>
                      <span style={styles.codeBadge}>{product.ProductCode}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.productName}>{product.ProductName}</div>
                      {product.Description && (
                        <div style={styles.productDesc}>
                          {product.Description.substring(0, 50)}...
                        </div>
                      )}
                    </td>
                    <td style={styles.td}>{product.CategoryName}</td>
                    <td style={styles.td}>{product.SupplierName}</td>
                    <td style={styles.td}>{formatCurrency(product.CostPrice)}</td>
                    <td style={styles.td}>{formatCurrency(product.SellingPrice)}</td>
                    <td style={styles.td}>
                      <span style={styles.strongText}>{product.CurrentStock}</span>
                      <span style={styles.mutedText}> / {product.ReorderLevel}</span>
                    </td>
                    <td style={styles.td}>
                      {product.warehouseStocks && product.warehouseStocks.length > 0 ? (
                        <div style={{ fontSize: '12px' }}>
                          {product.warehouseStocks.map((ws, idx) => (
                            <div key={idx} style={{ marginBottom: '3px', display: 'flex', alignItems: 'center' }}>
                              <span style={styles.warehouseTag}>{ws.warehouseName}</span>
                              <span style={styles.strongText}>{ws.quantity}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span style={{ ...styles.mutedText, fontSize: '12px' }}>Not allocated</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      <span style={getStockBadgeStyle(product.StockStatus)}>
                        {product.StockStatus}
                      </span>
                    </td>
                    <td style={{ ...styles.td, fontWeight: '500' }}>{formatCurrency(product.StockValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}><HiOutlineCube size={48} /></div>
            <h3 style={styles.emptyTitle}>No products found</h3>
            <p style={styles.emptyText}>
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Start by adding your first product'}
            </p>
            {!searchTerm && (
              <Link href="/products/add" style={{ ...styles.addBtn, marginTop: '1.25rem', display: 'inline-flex' }}>
                Add Product
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Inventory Summary */}
      {products.length > 0 && (
        <div style={styles.summaryCard}>
          <div style={styles.summaryGlow}></div>
          <h3 style={styles.summaryTitle}>
            <HiOutlineArchiveBox size={20} style={{ color: '#60a5fa' }} />
            Inventory Summary
          </h3>
          <div style={styles.statsGrid}>
            {/* Total Products */}
            <div style={styles.statCard}>
              <div style={{ ...styles.statGlow, background: 'rgba(59, 130, 246, 0.3)' }}></div>
              <div style={{ ...styles.statIcon, background: 'rgba(59, 130, 246, 0.15)' }}>
                <HiOutlineCube size={20} style={{ color: '#60a5fa' }} />
              </div>
              <div style={styles.statValue}>{products.length}</div>
              <div style={styles.statLabel}>Total Products</div>
            </div>
            {/* Total Value */}
            <div style={styles.statCard}>
              <div style={{ ...styles.statGlow, background: 'rgba(6, 182, 212, 0.3)' }}></div>
              <div style={{ ...styles.statIcon, background: 'rgba(6, 182, 212, 0.15)' }}>
                <HiOutlineBanknotes size={20} style={{ color: '#22d3ee' }} />
              </div>
              <div style={styles.statValue}>{formatCurrency(totalValue)}</div>
              <div style={styles.statLabel}>Total Inventory Value</div>
            </div>
            {/* Low Stock */}
            <div style={styles.statCard}>
              <div style={{ ...styles.statGlow, background: 'rgba(245, 158, 11, 0.3)' }}></div>
              <div style={{ ...styles.statIcon, background: 'rgba(245, 158, 11, 0.15)' }}>
                <HiOutlineExclamationCircle size={20} style={{ color: '#fbbf24' }} />
              </div>
              <div style={styles.statValue}>{lowStockCount}</div>
              <div style={styles.statLabel}>Low Stock Items</div>
            </div>
            {/* Out of Stock */}
            <div style={styles.statCard}>
              <div style={{ ...styles.statGlow, background: 'rgba(239, 68, 68, 0.3)' }}></div>
              <div style={{ ...styles.statIcon, background: 'rgba(239, 68, 68, 0.15)' }}>
                <HiOutlineXCircle size={20} style={{ color: '#f87171' }} />
              </div>
              <div style={styles.statValue}>{outOfStockCount}</div>
              <div style={styles.statLabel}>Out of Stock</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
