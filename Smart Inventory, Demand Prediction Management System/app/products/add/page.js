'use client';

/**
 * Add Product Page
 * ================
 * 
 * Form to add a new product to the inventory.
 * Includes validation and category/supplier selection.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HiOutlineArrowLeft, HiOutlineCheckCircle, HiOutlineExclamationTriangle, HiOutlineLightBulb, HiOutlinePlusCircle } from 'react-icons/hi2';

export default function AddProductPage() {
  // Router for navigation after form submission
  const router = useRouter();

  // Form data state
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

  // State for categories, suppliers, and warehouses (dropdown options)
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Fetch categories and suppliers when component mounts
   */
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch categories, suppliers, and warehouses in parallel
        const [categoriesRes, suppliersRes, warehousesRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/suppliers'),
          fetch('/api/warehouses'),
        ]);

        const categoriesData = await categoriesRes.json();
        const suppliersData = await suppliersRes.json();
        const warehousesData = await warehousesRes.json();

        if (categoriesData.success && categoriesData.data) {
          setCategories(categoriesData.data);
        }
        if (suppliersData.success && suppliersData.data) {
          setSuppliers(suppliersData.data);
        }
        if (warehousesData.success && warehousesData.data) {
          setWarehouses(warehousesData.data);
        }
      } catch (err) {
        console.error('Error fetching dropdown data:', err);
      } finally {
        setLoadingData(false);
      }
    }

    fetchData();
  }, []);

  /**
   * Handle form input changes
   */
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  /**
   * Handle form submission
   */
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate required fields
      if (!formData.productCode || !formData.productName || !formData.categoryId || 
          !formData.supplierId || !formData.costPrice || !formData.sellingPrice) {
        throw new Error('Please fill in all required fields');
      }

      // Validate warehouse if initial stock is provided
      const initialStock = parseInt(formData.currentStock) || 0;
      if (initialStock > 0 && !formData.warehouseId) {
        throw new Error('Please select a warehouse for the initial stock');
      }

      // Validate prices
      const costPrice = parseFloat(formData.costPrice);
      const sellingPrice = parseFloat(formData.sellingPrice);

      if (sellingPrice < costPrice) {
        throw new Error('Selling price must be greater than or equal to cost price');
      }

      // Send data to API
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productCode: formData.productCode,
          productName: formData.productName,
          description: formData.description,
          categoryId: parseInt(formData.categoryId),
          supplierId: parseInt(formData.supplierId),
          warehouseId: formData.warehouseId ? parseInt(formData.warehouseId) : null,
          unit: formData.unit,
          costPrice: costPrice,
          sellingPrice: sellingPrice,
          currentStock: parseInt(formData.currentStock) || 0,
          reorderLevel: parseInt(formData.reorderLevel) || 10,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      setSuccess(true);

      // Redirect to products list after 1.5 seconds
      setTimeout(() => {
        router.push('/products');
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Show loading while fetching dropdown data
  if (loadingData) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading form data...
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Add New Product</h1>
          <p className="page-subtitle">
            Add a new product to your inventory
          </p>
        </div>
        <Link href="/products" className="btn btn-secondary">
          <HiOutlineArrowLeft size={16} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> Back to Products
        </Link>
      </div>

      {/* Success Message */}
      {success && (
        <div className="alert alert-success">
          <span><HiOutlineCheckCircle size={16} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /></span>
          Product added successfully! Redirecting...
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger">
          <span><HiOutlineExclamationTriangle size={16} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /></span>
          {error}
        </div>
      )}

      {/* Add Product Form */}
      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Product Code and Name */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Product Code *
              </label>
              <input
                type="text"
                name="productCode"
                className="form-input"
                placeholder="e.g., ELEC-001"
                value={formData.productCode}
                onChange={handleChange}
                required
              />
              <span className="form-help">Unique identifier for the product</span>
            </div>

            <div className="form-group">
              <label className="form-label">
                Product Name *
              </label>
              <input
                type="text"
                name="productName"
                className="form-input"
                placeholder="e.g., Wireless Mouse"
                value={formData.productName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">
              Description
            </label>
            <textarea
              name="description"
              className="form-textarea"
              placeholder="Product description..."
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          {/* Category and Supplier */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Category *
              </label>
              <select
                name="categoryId"
                className="form-select"
                value={formData.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.CategoryID} value={cat.CategoryID}>
                    {cat.CategoryName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Supplier *
              </label>
              <select
                name="supplierId"
                className="form-select"
                value={formData.supplierId}
                onChange={handleChange}
                required
              >
                <option value="">Select a supplier</option>
                {suppliers.map(sup => (
                  <option key={sup.SupplierID} value={sup.SupplierID}>
                    {sup.SupplierName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Unit */}
          <div className="form-group">
            <label className="form-label">
              Unit of Measurement
            </label>
            <select
              name="unit"
              className="form-select"
              value={formData.unit}
              onChange={handleChange}
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

          {/* Prices */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Cost Price ($) *
              </label>
              <input
                type="number"
                name="costPrice"
                className="form-input"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={formData.costPrice}
                onChange={handleChange}
                required
              />
              <span className="form-help">Price you pay to supplier</span>
            </div>

            <div className="form-group">
              <label className="form-label">
                Selling Price ($) *
              </label>
              <input
                type="number"
                name="sellingPrice"
                className="form-input"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={formData.sellingPrice}
                onChange={handleChange}
                required
              />
              <span className="form-help">Price customer pays</span>
            </div>
          </div>

          {/* Stock Settings */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Warehouse *
              </label>
              <select
                name="warehouseId"
                className="form-select"
                value={formData.warehouseId}
                onChange={handleChange}
                required
              >
                <option value="">Select a warehouse</option>
                {warehouses.map(wh => (
                  <option key={wh.WarehouseID} value={wh.WarehouseID}>
                    {wh.WarehouseName}
                  </option>
                ))}
              </select>
              <span className="form-help">Where will the initial stock be stored</span>
            </div>

            <div className="form-group">
              <label className="form-label">
                Initial Stock
              </label>
              <input
                type="number"
                name="currentStock"
                className="form-input"
                placeholder="0"
                min="0"
                value={formData.currentStock}
                onChange={handleChange}
              />
              <span className="form-help">Starting inventory quantity</span>
            </div>

            <div className="form-group">
              <label className="form-label">
                Reorder Level
              </label>
              <input
                type="number"
                name="reorderLevel"
                className="form-input"
                placeholder="10"
                min="0"
                value={formData.reorderLevel}
                onChange={handleChange}
              />
              <span className="form-help">Alert when stock falls below this</span>
            </div>
          </div>

          {/* Profit Margin Display */}
          {formData.costPrice && formData.sellingPrice && (
            <div className="alert alert-info" style={{ marginTop: '1rem' }}>
              <span><HiOutlineLightBulb size={16} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /></span>
              Profit Margin: ${(parseFloat(formData.sellingPrice) - parseFloat(formData.costPrice)).toFixed(2)} 
              ({((parseFloat(formData.sellingPrice) - parseFloat(formData.costPrice)) / parseFloat(formData.costPrice) * 100).toFixed(1)}%)
            </div>
          )}

          {/* Submit Button */}
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
            <button 
              type="submit" 
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                  Adding...
                </>
              ) : (
                <><HiOutlinePlusCircle size={16} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> Add Product</>
              )}
            </button>
            <Link href="/products" className="btn btn-secondary btn-lg">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
