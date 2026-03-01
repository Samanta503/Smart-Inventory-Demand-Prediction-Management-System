/**
 * Low Stock & Out of Stock Products API Route
 * ============================================
 *
 * GET /api/products/low-stock
 * Returns all products where current stock is at or below reorder level,
 * including both low-stock (stock > 0) and out-of-stock (stock = 0) products.
 *
 * Query Parameters:
 * - filter: 'all' | 'low-stock' | 'out-of-stock' (default: 'all')
 */

import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';

    // Build WHERE condition based on filter
    let stockCondition = 'p.CurrentStock <= p.ReorderLevel';
    if (filter === 'low-stock') {
      stockCondition = 'p.CurrentStock > 0 AND p.CurrentStock <= p.ReorderLevel';
    } else if (filter === 'out-of-stock') {
      stockCondition = 'p.CurrentStock = 0';
    }

    const query = `
      SELECT 
        p.ProductID,
        p.ProductCode,
        p.ProductName,
        p.Description,
        c.CategoryName,
        s.SupplierName,
        s.Email AS SupplierEmail,
        s.Phone AS SupplierPhone,
        p.CurrentStock,
        p.ReorderLevel,
        (p.ReorderLevel - p.CurrentStock) AS UnitsNeeded,
        (p.ReorderLevel * 2) AS SuggestedOrderQuantity,
        p.CostPrice,
        ((p.ReorderLevel * 2) * p.CostPrice) AS EstimatedRestockCost,
        p.Unit,
        CASE 
          WHEN p.CurrentStock = 0 THEN 'CRITICAL - Out of Stock'
          WHEN p.CurrentStock <= (p.ReorderLevel / 2) THEN 'HIGH - Very Low'
          ELSE 'MEDIUM - Below Reorder Level'
        END AS UrgencyLevel,
        CASE 
          WHEN p.CurrentStock = 0 THEN 1
          WHEN p.CurrentStock <= (p.ReorderLevel / 2) THEN 2
          ELSE 3
        END AS Priority,
        CASE 
          WHEN p.CurrentStock = 0 THEN 'OUT_OF_STOCK'
          ELSE 'LOW_STOCK'
        END AS StockStatus
      FROM Products p
      INNER JOIN Categories c ON p.CategoryID = c.CategoryID
      INNER JOIN Suppliers s ON p.SupplierID = s.SupplierID
      WHERE ${stockCondition}
        AND p.IsActive = 1
      ORDER BY Priority ASC, p.CurrentStock ASC
    `;

    const result = await executeQuery(query);
    const data = result.recordset;

    const summary = {
      totalProducts: data.length,
      lowStockCount: data.filter(p => p.CurrentStock > 0).length,
      outOfStockCount: data.filter(p => p.CurrentStock === 0).length,
      totalEstimatedRestockCost: data.reduce(
        (sum, p) => sum + parseFloat(p.EstimatedRestockCost || 0),
        0
      ).toFixed(2),
    };

    return NextResponse.json({
      success: true,
      message: 'Stock alert products fetched successfully',
      filter,
      summary,
      data,
    });
  } catch (error) {
    console.error('Error fetching low stock products:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch low stock products',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
