/**
 * Dashboard Analytics API Route
 * =============================
 * 
 * GET /api/analytics/dashboard
 * Returns summary statistics for the dashboard
 * Updated for new schema with SalesHeaders/Items, PurchaseHeaders/Items
 * 
 * Query Parameters:
 * - year: Selected year (default: current year)
 * - month: Selected month 1-12 (default: current month)
 * - week: Selected week 1-53 (default: current week)
 */

import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

/**
 * GET /api/analytics/dashboard
 * Fetches all dashboard metrics in one call
 */
export async function GET(request) {
  try {
    // Parse query parameters for custom date selection
    const { searchParams } = new URL(request.url);
    const selectedYear = parseInt(searchParams.get('year')) || new Date().getFullYear();
    const selectedMonth = parseInt(searchParams.get('month')) || (new Date().getMonth() + 1);
    const selectedWeek = parseInt(searchParams.get('week')) || null; // Will calculate current week if null

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
        AVG(CAST(CurrentStock AS DECIMAL)) AS AverageStock
      FROM Products
      WHERE IsActive = 1
    `;
    const inventory = await executeQuery(inventoryQuery);

    // ===============================
    // SALES OVERVIEW (This Month) - Using new SalesHeaders/SalesItems
    // ===============================
    
    const salesQuery = `
      SELECT 
        COUNT(DISTINCT sh.SaleID) AS TotalSales,
        IFNULL(SUM(si.Quantity), 0) AS TotalUnitsSold,
        IFNULL(SUM(si.LineTotal), 0) AS TotalRevenue,
        IFNULL(AVG(si.LineTotal), 0) AS AverageOrderValue
      FROM SalesHeaders sh
      LEFT JOIN SalesItems si ON sh.SaleID = si.SaleID
      WHERE YEAR(sh.SaleDate) = YEAR(NOW())
        AND MONTH(sh.SaleDate) = MONTH(NOW())
        AND sh.Status = 'COMPLETED'
    `;
    const sales = await executeQuery(salesQuery);

    // ===============================
    // PURCHASES OVERVIEW (This Month) - Using new PurchaseHeaders/PurchaseItems
    // ===============================
    
    const purchasesQuery = `
      SELECT 
        COUNT(DISTINCT ph.PurchaseID) AS TotalPurchases,
        IFNULL(SUM(pi.Quantity), 0) AS TotalUnitsReceived,
        IFNULL(SUM(pi.LineTotal), 0) AS TotalPurchaseCost
      FROM PurchaseHeaders ph
      LEFT JOIN PurchaseItems pi ON ph.PurchaseID = pi.PurchaseID
      WHERE YEAR(ph.PurchaseDate) = YEAR(NOW())
        AND MONTH(ph.PurchaseDate) = MONTH(NOW())
        AND ph.Status = 'COMPLETED'
    `;
    const purchases = await executeQuery(purchasesQuery);

    // ===============================
    // WEEKLY STATISTICS (Selected Week or Current Week)
    // ===============================
    
    // Calculate the week number for the selected date if not provided
    const weekCondition = selectedWeek 
      ? `YEARWEEK(sh.SaleDate, 1) = YEARWEEK(CONCAT(${selectedYear}, '-01-01'), 1) + ${selectedWeek - 1}`
      : `YEARWEEK(sh.SaleDate, 1) = YEARWEEK(CONCAT(${selectedYear}, '-', LPAD(${selectedMonth}, 2, '0'), '-01'), 1)`;
    
    const weekConditionPurchase = selectedWeek 
      ? `YEARWEEK(ph.PurchaseDate, 1) = YEARWEEK(CONCAT(${selectedYear}, '-01-01'), 1) + ${selectedWeek - 1}`
      : `YEARWEEK(ph.PurchaseDate, 1) = YEARWEEK(CONCAT(${selectedYear}, '-', LPAD(${selectedMonth}, 2, '0'), '-01'), 1)`;

    const weeklyStatsQuery = `
      SELECT 
        -- Sales
        IFNULL((
          SELECT SUM(si.LineTotal) 
          FROM SalesHeaders sh 
          JOIN SalesItems si ON sh.SaleID = si.SaleID 
          WHERE sh.Status = 'COMPLETED' 
            AND ${weekCondition}
        ), 0) AS WeeklySales,
        IFNULL((
          SELECT COUNT(DISTINCT sh.SaleID) 
          FROM SalesHeaders sh 
          WHERE sh.Status = 'COMPLETED' 
            AND ${weekCondition}
        ), 0) AS WeeklySalesCount,
        -- Purchases (Cost)
        IFNULL((
          SELECT SUM(pi.LineTotal) 
          FROM PurchaseHeaders ph 
          JOIN PurchaseItems pi ON ph.PurchaseID = pi.PurchaseID 
          WHERE ph.Status = 'COMPLETED' 
            AND ${weekConditionPurchase}
        ), 0) AS WeeklyPurchases,
        -- Cost of Goods Sold (COGS) - using product cost price
        IFNULL((
          SELECT SUM(si.Quantity * p.CostPrice) 
          FROM SalesHeaders sh 
          JOIN SalesItems si ON sh.SaleID = si.SaleID 
          JOIN Products p ON si.ProductID = p.ProductID
          WHERE sh.Status = 'COMPLETED' 
            AND ${weekCondition}
        ), 0) AS WeeklyCOGS
    `;
    const weeklyStats = await executeQuery(weeklyStatsQuery);

    // ===============================
    // MONTHLY STATISTICS (Selected Month)
    // ===============================
    
    const monthlyStatsQuery = `
      SELECT 
        -- Sales
        IFNULL((
          SELECT SUM(si.LineTotal) 
          FROM SalesHeaders sh 
          JOIN SalesItems si ON sh.SaleID = si.SaleID 
          WHERE sh.Status = 'COMPLETED' 
            AND YEAR(sh.SaleDate) = ${selectedYear}
            AND MONTH(sh.SaleDate) = ${selectedMonth}
        ), 0) AS MonthlySales,
        IFNULL((
          SELECT COUNT(DISTINCT sh.SaleID) 
          FROM SalesHeaders sh 
          WHERE sh.Status = 'COMPLETED' 
            AND YEAR(sh.SaleDate) = ${selectedYear}
            AND MONTH(sh.SaleDate) = ${selectedMonth}
        ), 0) AS MonthlySalesCount,
        -- Purchases (Cost)
        IFNULL((
          SELECT SUM(pi.LineTotal) 
          FROM PurchaseHeaders ph 
          JOIN PurchaseItems pi ON ph.PurchaseID = pi.PurchaseID 
          WHERE ph.Status = 'COMPLETED' 
            AND YEAR(ph.PurchaseDate) = ${selectedYear}
            AND MONTH(ph.PurchaseDate) = ${selectedMonth}
        ), 0) AS MonthlyPurchases,
        -- Cost of Goods Sold (COGS)
        IFNULL((
          SELECT SUM(si.Quantity * p.CostPrice) 
          FROM SalesHeaders sh 
          JOIN SalesItems si ON sh.SaleID = si.SaleID 
          JOIN Products p ON si.ProductID = p.ProductID
          WHERE sh.Status = 'COMPLETED' 
            AND YEAR(sh.SaleDate) = ${selectedYear}
            AND MONTH(sh.SaleDate) = ${selectedMonth}
        ), 0) AS MonthlyCOGS
    `;
    const monthlyStats = await executeQuery(monthlyStatsQuery);

    // ===============================
    // YEARLY STATISTICS (Selected Year)
    // ===============================
    
    const yearlyStatsQuery = `
      SELECT 
        -- Sales
        IFNULL((
          SELECT SUM(si.LineTotal) 
          FROM SalesHeaders sh 
          JOIN SalesItems si ON sh.SaleID = si.SaleID 
          WHERE sh.Status = 'COMPLETED' 
            AND YEAR(sh.SaleDate) = ${selectedYear}
        ), 0) AS YearlySales,
        IFNULL((
          SELECT COUNT(DISTINCT sh.SaleID) 
          FROM SalesHeaders sh 
          WHERE sh.Status = 'COMPLETED' 
            AND YEAR(sh.SaleDate) = ${selectedYear}
        ), 0) AS YearlySalesCount,
        -- Purchases (Cost)
        IFNULL((
          SELECT SUM(pi.LineTotal) 
          FROM PurchaseHeaders ph 
          JOIN PurchaseItems pi ON ph.PurchaseID = pi.PurchaseID 
          WHERE ph.Status = 'COMPLETED' 
            AND YEAR(ph.PurchaseDate) = ${selectedYear}
        ), 0) AS YearlyPurchases,
        -- Cost of Goods Sold (COGS)
        IFNULL((
          SELECT SUM(si.Quantity * p.CostPrice) 
          FROM SalesHeaders sh 
          JOIN SalesItems si ON sh.SaleID = si.SaleID 
          JOIN Products p ON si.ProductID = p.ProductID
          WHERE sh.Status = 'COMPLETED' 
            AND YEAR(sh.SaleDate) = ${selectedYear}
        ), 0) AS YearlyCOGS
    `;
    const yearlyStats = await executeQuery(yearlyStatsQuery);

    // Calculate Profit/Loss for each period
    const weekly = weeklyStats.recordset[0] || {};
    const monthly = monthlyStats.recordset[0] || {};
    const yearly = yearlyStats.recordset[0] || {};

    const periodStats = {
      weekly: {
        sales: parseFloat(weekly.WeeklySales) || 0,
        salesCount: parseInt(weekly.WeeklySalesCount) || 0,
        purchases: parseFloat(weekly.WeeklyPurchases) || 0,
        cogs: parseFloat(weekly.WeeklyCOGS) || 0,
        grossProfit: (parseFloat(weekly.WeeklySales) || 0) - (parseFloat(weekly.WeeklyCOGS) || 0),
        netProfit: (parseFloat(weekly.WeeklySales) || 0) - (parseFloat(weekly.WeeklyCOGS) || 0),
      },
      monthly: {
        sales: parseFloat(monthly.MonthlySales) || 0,
        salesCount: parseInt(monthly.MonthlySalesCount) || 0,
        purchases: parseFloat(monthly.MonthlyPurchases) || 0,
        cogs: parseFloat(monthly.MonthlyCOGS) || 0,
        grossProfit: (parseFloat(monthly.MonthlySales) || 0) - (parseFloat(monthly.MonthlyCOGS) || 0),
        netProfit: (parseFloat(monthly.MonthlySales) || 0) - (parseFloat(monthly.MonthlyCOGS) || 0),
      },
      yearly: {
        sales: parseFloat(yearly.YearlySales) || 0,
        salesCount: parseInt(yearly.YearlySalesCount) || 0,
        purchases: parseFloat(yearly.YearlyPurchases) || 0,
        cogs: parseFloat(yearly.YearlyCOGS) || 0,
        grossProfit: (parseFloat(yearly.YearlySales) || 0) - (parseFloat(yearly.YearlyCOGS) || 0),
        netProfit: (parseFloat(yearly.YearlySales) || 0) - (parseFloat(yearly.YearlyCOGS) || 0),
      },
    };

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
    // RECENT SALES (Last 5) - Updated for new schema
    // ===============================
    
    const recentSalesQuery = `
      SELECT 
        sh.SaleID,
        sh.InvoiceNumber,
        c.CustomerName,
        w.WarehouseName,
        (SELECT SUM(LineTotal) FROM SalesItems WHERE SaleID = sh.SaleID) AS TotalAmount,
        (SELECT COUNT(*) FROM SalesItems WHERE SaleID = sh.SaleID) AS ItemCount,
        sh.SaleDate
      FROM SalesHeaders sh
      INNER JOIN Customers c ON sh.CustomerID = c.CustomerID
      INNER JOIN Warehouses w ON sh.WarehouseID = w.WarehouseID
      WHERE sh.Status = 'COMPLETED'
      ORDER BY sh.SaleDate DESC
      LIMIT 5
    `;
    const recentSales = await executeQuery(recentSalesQuery);

    // ===============================
    // TOP SELLING PRODUCTS (This Month)
    // ===============================
    
    const topProductsQuery = `
      SELECT 
        p.ProductID,
        p.ProductName,
        SUM(si.Quantity) AS UnitsSold,
        SUM(si.LineTotal) AS Revenue
      FROM SalesItems si
      INNER JOIN Products p ON si.ProductID = p.ProductID
      INNER JOIN SalesHeaders sh ON si.SaleID = sh.SaleID
      WHERE YEAR(sh.SaleDate) = YEAR(NOW())
        AND MONTH(sh.SaleDate) = MONTH(NOW())
        AND sh.Status = 'COMPLETED'
      GROUP BY p.ProductID, p.ProductName
      ORDER BY Revenue DESC
      LIMIT 5
    `;
    const topProducts = await executeQuery(topProductsQuery);

    // ===============================
    // CATEGORY DISTRIBUTION
    // ===============================
    
    const categoryQuery = `
      SELECT 
        c.CategoryName,
        COUNT(p.ProductID) AS ProductCount,
        IFNULL(SUM(p.CurrentStock), 0) AS TotalStock,
        IFNULL(SUM(p.CurrentStock * p.CostPrice), 0) AS InventoryValue
      FROM Categories c
      LEFT JOIN Products p ON c.CategoryID = p.CategoryID AND p.IsActive = 1
      GROUP BY c.CategoryID, c.CategoryName
      ORDER BY InventoryValue DESC
    `;
    const categories = await executeQuery(categoryQuery);

    // ===============================
    // WAREHOUSE SUMMARY
    // ===============================
    
    const warehouseQuery = `
      SELECT 
        w.WarehouseID,
        w.WarehouseName,
        IFNULL(SUM(ps.OnHandQty), 0) AS TotalStock,
        COUNT(DISTINCT ps.ProductID) AS ProductCount
      FROM Warehouses w
      LEFT JOIN ProductStocks ps ON w.WarehouseID = ps.WarehouseID
      WHERE w.IsActive = 1
      GROUP BY w.WarehouseID, w.WarehouseName
    `;
    const warehouses = await executeQuery(warehouseQuery);

    return NextResponse.json({
      success: true,
      message: 'Dashboard data fetched successfully',
      data: {
        inventory: inventory.recordset[0] || {},
        sales: sales.recordset[0] || {},
        purchases: purchases.recordset[0] || {},
        periodStats,
        selectedPeriod: {
          year: selectedYear,
          month: selectedMonth,
          week: selectedWeek,
        },
        alerts: alerts.recordset[0] || {},
        recentSales: recentSales.recordset || [],
        topProducts: topProducts.recordset || [],
        categories: categories.recordset || [],
        warehouses: warehouses.recordset || [],
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
