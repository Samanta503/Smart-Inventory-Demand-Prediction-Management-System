/**
 * Supplier Performance API Route
 * ==============================
 * 
 * GET /api/analytics/supplier-performance
 * Returns supplier performance scores and metrics
 */

import { NextResponse } from 'next/server';
import { executeStoredProcedure, executeQuery } from '@/lib/db';

/**
 * GET /api/analytics/supplier-performance
 * Fetches supplier performance metrics
 */
export async function GET() {
  try {
    // Use the stored procedure we created
    const result = await executeStoredProcedure('sp_GetSupplierPerformanceScore');

    return NextResponse.json({
      success: true,
      message: 'Supplier performance data fetched successfully',
      count: result.recordset.length,
      data: result.recordset,
    });
  } catch (error) {
    console.error('Error fetching supplier performance:', error);

    // Fallback query if stored procedure fails
    try {
      const fallbackQuery = `
        SELECT 
          s.SupplierID,
          s.SupplierName,
          s.ContactPerson,
          s.Email,
          s.Phone,
          COUNT(DISTINCT p.ProductID) AS ProductCount,
          ISNULL(SUM(p.CurrentStock * p.CostPrice), 0) AS InventoryValue,
          COUNT(DISTINCT pur.PurchaseID) AS PurchaseCount,
          ISNULL(SUM(pur.TotalCost), 0) AS TotalPurchaseValue,
          s.IsActive
        FROM Suppliers s
        LEFT JOIN Products p ON s.SupplierID = p.SupplierID
        LEFT JOIN Purchases pur ON s.SupplierID = pur.SupplierID
        GROUP BY 
          s.SupplierID,
          s.SupplierName,
          s.ContactPerson,
          s.Email,
          s.Phone,
          s.IsActive
        ORDER BY InventoryValue DESC
      `;

      const fallbackResult = await executeQuery(fallbackQuery);

      return NextResponse.json({
        success: true,
        message: 'Supplier performance data fetched successfully (fallback)',
        count: fallbackResult.recordset.length,
        data: fallbackResult.recordset,
      });
    } catch (fallbackError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch supplier performance data',
          error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        },
        { status: 500 }
      );
    }
  }
}
