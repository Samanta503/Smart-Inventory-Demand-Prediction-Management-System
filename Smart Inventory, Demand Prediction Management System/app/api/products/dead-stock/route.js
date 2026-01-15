/**
 * Dead Stock Products API Route
 * =============================
 * 
 * GET /api/products/dead-stock
 * Returns products that have not been sold in the last 90 days
 * 
 * Dead stock represents inventory that isn't selling and ties up capital.
 * This endpoint helps identify products that may need:
 * - Clearance sales
 * - Marketing campaigns
 * - Return to supplier
 * - Write-off decisions
 */

import { NextResponse } from 'next/server';
import { executeStoredProcedure, executeQuery } from '@/lib/db';

/**
 * GET /api/products/dead-stock
 * 
 * Query Parameters:
 * - days: number (optional) - Number of days without sales to consider as dead stock
 *         Default is 90 days
 */
export async function GET(request) {
  try {
    // Get the 'days' parameter from the URL query string
    const { searchParams } = new URL(request.url);
    const daysWithoutSale = parseInt(searchParams.get('days')) || 90;

    // Validate the days parameter
    if (daysWithoutSale < 1 || daysWithoutSale > 365) {
      return NextResponse.json(
        {
          success: false,
          message: 'Days parameter must be between 1 and 365',
        },
        { status: 400 }
      );
    }

    // Use raw SQL query instead of stored procedure for more control
    // This query finds products with no sales or no sales in the specified period
    const query = `
      SELECT 
        p.ProductID,
        p.ProductCode,
        p.ProductName,
        p.Description,
        c.CategoryName,
        s.SupplierName,
        s.Email AS SupplierEmail,
        p.CurrentStock,
        p.CostPrice,
        p.SellingPrice,
        -- Calculate the value of dead stock (money tied up)
        (p.CurrentStock * p.CostPrice) AS DeadStockValue,
        -- Get the last sale date
        MAX(sa.SaleDate) AS LastSaleDate,
        -- Calculate days since last sale
        CASE 
          WHEN MAX(sa.SaleDate) IS NULL THEN 'Never Sold'
          ELSE CONCAT(DATEDIFF(NOW(), MAX(sa.SaleDate)), ' days')
        END AS DaysSinceLastSale,
        -- Numeric days for sorting
        CASE 
          WHEN MAX(sa.SaleDate) IS NULL THEN 9999
          ELSE DATEDIFF(NOW(), MAX(sa.SaleDate))
        END AS DaysSinceLastSaleNum,
        -- Recommendation based on age
        CASE 
          WHEN MAX(sa.SaleDate) IS NULL THEN 'Review product viability - Never sold'
          WHEN DATEDIFF(NOW(), MAX(sa.SaleDate)) >= 180 THEN 'Consider clearance sale or return to supplier'
          WHEN DATEDIFF(NOW(), MAX(sa.SaleDate)) >= 120 THEN 'Run promotional campaign'
          ELSE 'Monitor closely'
        END AS Recommendation
      FROM Products p
      INNER JOIN Categories c ON p.CategoryID = c.CategoryID
      INNER JOIN Suppliers s ON p.SupplierID = s.SupplierID
      LEFT JOIN Sales sa ON p.ProductID = sa.ProductID
      WHERE p.IsActive = 1
        AND p.CurrentStock > 0
      GROUP BY 
        p.ProductID,
        p.ProductCode,
        p.ProductName,
        p.Description,
        c.CategoryName,
        s.SupplierName,
        s.Email,
        p.CurrentStock,
        p.CostPrice,
        p.SellingPrice
      HAVING 
        -- Never sold OR no sales in specified period
        MAX(sa.SaleDate) IS NULL
        OR DATEDIFF(NOW(), MAX(sa.SaleDate)) >= @daysWithoutSale
      ORDER BY DaysSinceLastSaleNum DESC
    `;

    const result = await executeQuery(query, { daysWithoutSale });
    const data = result.recordset;

    // Calculate summary statistics
    const summary = {
      daysThreshold: daysWithoutSale,
      totalDeadStockProducts: data.length,
      neverSoldCount: data.filter(p => p.DaysSinceLastSale === 'Never Sold').length,
      totalDeadStockValue: data.reduce(
        (sum, p) => sum + parseFloat(p.DeadStockValue || 0),
        0
      ).toFixed(2),
      // Potential recovery if sold at cost
      potentialRecoveryAtCost: data.reduce(
        (sum, p) => sum + parseFloat(p.DeadStockValue || 0),
        0
      ).toFixed(2),
      // Potential revenue if sold at full price
      potentialRevenueAtFullPrice: data.reduce(
        (sum, p) => sum + (parseFloat(p.CurrentStock) * parseFloat(p.SellingPrice)),
        0
      ).toFixed(2),
    };

    return NextResponse.json({
      success: true,
      message: `Dead stock products (no sales in ${daysWithoutSale}+ days) fetched successfully`,
      summary,
      data: data,
    });
  } catch (error) {
    console.error('Error fetching dead stock products:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch dead stock products',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
