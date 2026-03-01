/**
 * Low Stock Products API Route
 * ============================
 * 
 * GET /api/products/low-stock
 * Returns all products where current stock is at or below reorder level
 * 
 * This endpoint is critical for inventory management as it helps
 * identify products that need to be reordered soon.
 */

import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

/**
 * GET /api/products/low-stock
 * Fetches products with low stock levels
 */
export async function GET() {
  try {
    // Query uses the vw_LowStockProducts view we created in the database
    // The view already filters for products where CurrentStock <= ReorderLevel
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
        -- Calculate how many units are needed to reach reorder level
        (p.ReorderLevel - p.CurrentStock) AS UnitsNeeded,
        -- Suggest order quantity (2x reorder level is a common practice)
        (p.ReorderLevel * 2) AS SuggestedOrderQuantity,
        p.CostPrice,
        -- Calculate estimated cost to restock
        ((p.ReorderLevel * 2) * p.CostPrice) AS EstimatedRestockCost,
        p.Unit,
        -- Categorize the urgency level
        CASE 
          WHEN p.CurrentStock = 0 THEN 'CRITICAL - Out of Stock'
          WHEN p.CurrentStock <= (p.ReorderLevel / 2) THEN 'HIGH - Very Low'
          ELSE 'MEDIUM - Below Reorder Level'
        END AS UrgencyLevel,
        -- Priority number for sorting (lower = more urgent)
        CASE 
          WHEN p.CurrentStock = 0 THEN 1
          WHEN p.CurrentStock <= (p.ReorderLevel / 2) THEN 2
          ELSE 3
        END AS Priority
      FROM Products p
      INNER JOIN Categories c ON p.CategoryID = c.CategoryID
      INNER JOIN Suppliers s ON p.SupplierID = s.SupplierID
      WHERE p.CurrentStock <= p.ReorderLevel
        AND p.IsActive = 1
      ORDER BY Priority ASC, p.CurrentStock ASC
    `;

    const result = await executeQuery(query);
    const data = result.recordset;

    // Calculate summary statistics
    const summary = {
      totalLowStockProducts: data.length,
      outOfStockCount: data.filter(p => p.CurrentStock === 0).length,
      criticalCount: data.filter(p => p.Priority === 1 || p.Priority === 2).length,
      totalEstimatedRestockCost: data.reduce(
        (sum, p) => sum + parseFloat(p.EstimatedRestockCost || 0),
        0
      ).toFixed(2),
    };

    return NextResponse.json({
      success: true,
      message: 'Low stock products fetched successfully',
      summary,
      data: data,
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
