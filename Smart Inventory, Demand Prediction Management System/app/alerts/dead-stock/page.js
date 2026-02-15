'use client';

import { HiOutlineExclamationTriangle, HiOutlineArrowPath, HiOutlineNoSymbol, HiOutlineBanknotes, HiOutlineSparkles, HiOutlineLightBulb, HiOutlineArrowTrendingUp, HiOutlineArrowLeft } from 'react-icons/hi2';

/**
 * Dead Stock Page
 * ===============
 * 
 * Displays products that haven't been sold in 90+ days.
 * Dead stock ties up capital and may need clearance sales.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DeadStockPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [days, setDays] = useState(90);

  useEffect(() => {
    fetchDeadStock();
  }, [days]);

  /**
   * Fetch dead stock products from API
   */
  async function fetchDeadStock() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/products/dead-stock?days=${days}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      setProducts(result.data || []);
      setSummary(result.summary || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Format currency
   */
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
        Analyzing stock movement...
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <span><HiOutlineExclamationTriangle size={20} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /></span>
        Error: {error}
        <button className="btn btn-sm btn-secondary" onClick={fetchDeadStock} style={{ marginLeft: 'auto' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title"><HiOutlineNoSymbol size={24} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> Dead Stock Analysis</h1>
          <p className="page-subtitle">
            Products with no sales in {days}+ days
          </p>
        </div>
        <button className="btn btn-secondary" onClick={fetchDeadStock}>
          <HiOutlineArrowPath size={16} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> Refresh
        </button>
      </div>

      {/* Days Filter */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Show products with no sales in:</span>
          <select
            className="form-select"
            style={{ width: 'auto' }}
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
          >
            <option value={30}>30 days</option>
            <option value={60}>60 days</option>
            <option value={90}>90 days</option>
            <option value={120}>120 days</option>
            <option value={180}>180 days</option>
            <option value={365}>365 days</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="stats-grid">
          <div className="stat-card danger">
            <span className="stat-icon"><HiOutlineNoSymbol size={24} /></span>
            <span className="stat-value">{summary.totalDeadStockProducts}</span>
            <span className="stat-label">Dead Stock Items</span>
          </div>
          <div className="stat-card warning">
            <span className="stat-icon"><HiOutlineNoSymbol size={24} /></span>
            <span className="stat-value">{summary.neverSoldCount}</span>
            <span className="stat-label">Never Sold</span>
          </div>
          <div className="stat-card danger">
            <span className="stat-icon"><HiOutlineBanknotes size={24} /></span>
            <span className="stat-value">{formatCurrency(summary.totalDeadStockValue)}</span>
            <span className="stat-label">Capital Tied Up</span>
          </div>
          <div className="stat-card info">
            <span className="stat-icon"><HiOutlineBanknotes size={24} /></span>
            <span className="stat-value">{formatCurrency(summary.potentialRevenueAtFullPrice)}</span>
            <span className="stat-label">Potential Revenue</span>
          </div>
        </div>
      )}

      {/* Dead Stock Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Dead Stock Products</h2>
          <span className="card-subtitle">
            Consider clearance sales or returns
          </span>
        </div>

        {products.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Cost Value</th>
                  <th>Last Sale</th>
                  <th>Days Since Sale</th>
                  <th>Recommendation</th>
                  <th>Supplier</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.ProductID}>
                    <td>
                      <strong>{product.ProductName}</strong>
                      <div className="text-muted" style={{ fontSize: '12px' }}>
                        {product.ProductCode}
                      </div>
                    </td>
                    <td>{product.CategoryName}</td>
                    <td>
                      <strong>{product.CurrentStock}</strong>
                      <span className="text-muted"> units</span>
                    </td>
                    <td className="text-danger">
                      <strong>{formatCurrency(product.DeadStockValue)}</strong>
                    </td>
                    <td>
                      {product.LastSaleDate 
                        ? new Date(product.LastSaleDate).toLocaleDateString() 
                        : <span className="badge badge-secondary">Never</span>
                      }
                    </td>
                    <td>
                      <span className={
                        product.DaysSinceLastSale === 'Never Sold' 
                          ? 'badge badge-danger' 
                          : product.DaysSinceLastSaleNum >= 180 
                            ? 'badge badge-danger' 
                            : 'badge badge-warning'
                      }>
                        {product.DaysSinceLastSale}
                      </span>
                    </td>
                    <td style={{ maxWidth: '200px', fontSize: '13px' }}>
                      {product.Recommendation}
                    </td>
                    <td>
                      {product.SupplierName}
                      {product.SupplierEmail && (
                        <div className="text-muted" style={{ fontSize: '11px' }}>
                          {product.SupplierEmail}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <span className="icon"><HiOutlineSparkles size={48} /></span>
            <h3>No dead stock!</h3>
            <p>All products have been sold within the last {days} days.</p>
          </div>
        )}
      </div>

      {/* Tips Card */}
      <div className="card">
        <h3 className="card-title"><HiOutlineLightBulb size={20} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> Tips for Managing Dead Stock</h3>
        <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Run promotional campaigns</strong> - Offer discounts to move slow-moving items
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Bundle with popular products</strong> - Create package deals
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Contact supplier for returns</strong> - Some suppliers accept returns for credit
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Donate for tax benefits</strong> - Consider charitable donations
          </li>
          <li>
            <strong>Write off and dispose</strong> - Last resort for unsellable items
          </li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="card">
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/alerts" className="btn btn-secondary">
            <HiOutlineArrowLeft size={16} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> Back to Alerts
          </Link>
          <Link href="/analytics/sales" className="btn btn-primary">
            <HiOutlineArrowTrendingUp size={16} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> View Sales Analytics
          </Link>
        </div>
      </div>
    </div>
  );
}
