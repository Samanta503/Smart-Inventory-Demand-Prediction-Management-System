/**
 * Dashboard Analytics API Route
 * =============================
 * 
 * GET /api/analytics/dashboard
 * Returns summary statistics for the dashboard
 */

import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

/**
 * GET /api/analytics/dashboard
 * Fetches all dashboard metrics in one call
 */
export async function GET() {
  try {
    // ===============================
    // INVENTORY OVERVIEW
    // ===============================
    
    const inventoryQuery = `
      SELECT 
        COUNT(*) AS TotalProducts,
        SUM(CurrentStock) AS TotalUnits,
        SUM(CurrentStock * CostPrice) AS TotalInventoryValue,
        SUM(CASE WHEN CurrentStock <= ReorderLevel THEN 1 ELSE 0 END) AS LowStockProducts,
        SUM(CASE WHEN CurrentStock = 0 THEN 1 ELSE 0 END) AS OutOfStockProducts,
        AVG(CAST(CurrentStock AS FLOAT)) AS AverageStock
      FROM Products
      WHERE IsActive = 1
    `;
    const inventory = await executeQuery(inventoryQuery);

    // ===============================
    // SALES OVERVIEW (This Month)
    // ===============================
    
    const salesQuery = `
      SELECT 
        COUNT(*) AS TotalSales,
        SUM(Quantity) AS TotalUnitsSold,
        SUM(TotalAmount) AS TotalRevenue,
        AVG(TotalAmount) AS AverageOrderValue
      FROM Sales
      WHERE YEAR(SaleDate) = YEAR(GETDATE())
        AND MONTH(SaleDate) = MONTH(GETDATE())
    `;
    const sales = await executeQuery(salesQuery);

    // ===============================
    // PURCHASES OVERVIEW (This Month)
    // ===============================
    
    const purchasesQuery = `
      SELECT 
        COUNT(*) AS TotalPurchases,
        SUM(Quantity) AS TotalUnitsReceived,
        SUM(TotalCost) AS TotalPurchaseCost
      FROM Purchases
      WHERE YEAR(PurchaseDate) = YEAR(GETDATE())
        AND MONTH(PurchaseDate) = MONTH(GETDATE())
    `;
    const purchases = await executeQuery(purchasesQuery);

    // ===============================
    // ALERTS OVERVIEW
    // ===============================
    
    const alertsQuery = `
      SELECT 
        COUNT(*) AS TotalUnresolvedAlerts,
        SUM(CASE WHEN AlertType = 'OUT_OF_STOCK' THEN 1 ELSE 0 END) AS OutOfStockAlerts,
        SUM(CASE WHEN AlertType = 'LOW_STOCK' THEN 1 ELSE 0 END) AS LowStockAlerts
      FROM InventoryAlerts
      WHERE IsResolved = 0
    `;
    const alerts = await executeQuery(alertsQuery);

    // ===============================
    // RECENT SALES (Last 5)
    // ===============================
    
    const recentSalesQuery = `
      SELECT TOP 5
        s.SaleID,
        p.ProductName,
        s.Quantity,
        s.TotalAmount,
        s.CustomerName,
        s.SaleDate
      FROM Sales s
      INNER JOIN Products p ON s.ProductID = p.ProductID
      ORDER BY s.SaleDate DESC
    `;
    const recentSales = await executeQuery(recentSalesQuery);

    // ===============================
    // TOP SELLING PRODUCTS (This Month)
    // ===============================
    
    const topProductsQuery = `
      SELECT TOP 5
        p.ProductID,
        p.ProductName,
        SUM(s.Quantity) AS UnitsSold,
        SUM(s.TotalAmount) AS Revenue
      FROM Sales s
      INNER JOIN Products p ON s.ProductID = p.ProductID
      WHERE YEAR(s.SaleDate) = YEAR(GETDATE())
        AND MONTH(s.SaleDate) = MONTH(GETDATE())
      GROUP BY p.ProductID, p.ProductName
      ORDER BY Revenue DESC
    `;
    const topProducts = await executeQuery(topProductsQuery);

    // ===============================
    // CATEGORY DISTRIBUTION
    // ===============================
    
    const categoryQuery = `
      SELECT 
        c.CategoryName,
        COUNT(p.ProductID) AS ProductCount,
        SUM(p.CurrentStock) AS TotalStock,
        SUM(p.CurrentStock * p.CostPrice) AS InventoryValue
      FROM Categories c
      LEFT JOIN Products p ON c.CategoryID = p.CategoryID AND p.IsActive = 1
      GROUP BY c.CategoryID, c.CategoryName
      ORDER BY InventoryValue DESC
    `;
    const categories = await executeQuery(categoryQuery);

    return NextResponse.json({
      success: true,
      message: 'Dashboard data fetched successfully',
      data: {
        inventory: inventory.recordset[0],
        sales: sales.recordset[0],
        purchases: purchases.recordset[0],
        alerts: alerts.recordset[0],
        recentSales: recentSales.recordset,
        topProducts: topProducts.recordset,
        categories: categories.recordset,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch dashboard data',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
