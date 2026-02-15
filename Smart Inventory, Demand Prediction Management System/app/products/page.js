'use client';

/**
 * Products List Page
 * ==================
 * 
 * Displays all products in a table with their details,
 * stock status, and quick actions.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HiOutlineCube, HiOutlineSparkles, HiOutlineMagnifyingGlass, HiOutlineExclamationTriangle } from 'react-icons/hi2';

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

  /**
   * Fetch all products from API
   */
  async function fetchProducts() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/products');
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      setProducts(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Format currency values
   */
  function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value || 0);
  }

  /**
   * Get badge class based on stock status
   */
  function getStockBadge(status) {
    switch (status) {
      case 'Out of Stock':
        return 'badge badge-danger';
      case 'Low Stock':
        return 'badge badge-warning';
      default:
        return 'badge badge-success';
    }
  }

  /**
   * Filter products based on search term
   */
  const filteredProducts = products.filter(product =>
    product.ProductName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.ProductCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.CategoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading products...
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="alert alert-danger">
        <span><HiOutlineExclamationTriangle size={16} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /></span>
        Error: {error}
        <button className="btn btn-sm btn-secondary" onClick={fetchProducts} style={{ marginLeft: 'auto' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">
            <span className="page-title-icon"><HiOutlineCube size={24} /></span>
            Products
          </h1>
          <p className="page-subtitle">
            Manage your product inventory • {products.length} products total
          </p>
        </div>
        <div className="page-header-actions">
          <Link href="/products/add" className="btn btn-primary">
            <HiOutlineSparkles size={16} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> Add Product
          </Link>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <div style={{ position: 'relative' }}>
            <HiOutlineMagnifyingGlass size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search by name, code, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                padding: '14px 18px 14px 38px',
                fontSize: '15px',
                borderRadius: '10px'
              }}
            />
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="card">
        {filteredProducts.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Supplier</th>
                  <th>Cost</th>
                  <th>Price</th>
                  <th>Total Stock</th>
                  <th>Warehouse Stock</th>
                  <th>Status</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.ProductID}>
                    <td>
                      <code style={{ 
                        backgroundColor: 'var(--bg-tertiary)', 
                        padding: '2px 6px', 
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        {product.ProductCode}
                      </code>
                    </td>
                    <td>
                      <strong>{product.ProductName}</strong>
                      {product.Description && (
                        <div className="text-muted" style={{ fontSize: '12px' }}>
                          {product.Description.substring(0, 50)}...
                        </div>
                      )}
                    </td>
                    <td>{product.CategoryName}</td>
                    <td>{product.SupplierName}</td>
                    <td>{formatCurrency(product.CostPrice)}</td>
                    <td>{formatCurrency(product.SellingPrice)}</td>
                    <td>
                      <strong>{product.CurrentStock}</strong>
                      <span className="text-muted"> / {product.ReorderLevel}</span>
                    </td>
                    <td>
                      {product.warehouseStocks && product.warehouseStocks.length > 0 ? (
                        <div style={{ fontSize: '12px' }}>
                          {product.warehouseStocks.map((ws, idx) => (
                            <div key={idx} style={{ marginBottom: '2px' }}>
                              <span style={{ 
                                backgroundColor: 'var(--primary-light)', 
                                color: 'var(--primary)',
                                padding: '2px 6px', 
                                borderRadius: '4px',
                                marginRight: '4px'
                              }}>
                                {ws.warehouseName}
                              </span>
                              <strong>{ws.quantity}</strong>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted" style={{ fontSize: '12px' }}>Not allocated</span>
                      )}
                    </td>
                    <td>
                      <span className={getStockBadge(product.StockStatus)}>
                        {product.StockStatus}
                      </span>
                    </td>
                    <td>{formatCurrency(product.StockValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <span className="icon"><HiOutlineCube size={24} /></span>
            <h3>No products found</h3>
            <p>
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Start by adding your first product'}
            </p>
            {!searchTerm && (
              <Link href="/products/add" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Add Product
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Summary Card */}
      {products.length > 0 && (
        <div className="card">
          <h3 className="card-title">Inventory Summary</h3>
          <div className="stats-grid" style={{ marginTop: '1rem' }}>
            <div className="stat-card primary">
              <span className="stat-value">{products.length}</span>
              <span className="stat-label">Total Products</span>
            </div>
            <div className="stat-card info">
              <span className="stat-value">
                {formatCurrency(products.reduce((sum, p) => sum + (parseFloat(p.StockValue) || 0), 0))}
              </span>
              <span className="stat-label">Total Inventory Value</span>
            </div>
            <div className="stat-card warning">
              <span className="stat-value">
                {products.filter(p => p.StockStatus === 'Low Stock').length}
              </span>
              <span className="stat-label">Low Stock Items</span>
            </div>
            <div className="stat-card danger">
              <span className="stat-value">
                {products.filter(p => p.StockStatus === 'Out of Stock').length}
              </span>
              <span className="stat-label">Out of Stock</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
