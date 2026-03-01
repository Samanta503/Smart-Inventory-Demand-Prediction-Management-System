/**
 * Monthly Sales Analytics API Route
 * ==================================
 * 
 * GET /api/analytics/monthly-sales
 * Returns monthly sales data for trend analysis and demand prediction
 * 
 * This endpoint provides:
 * - Monthly revenue and unit sales
 * - Top selling products
 * - Category performance
 * - Year-over-year comparisons
 */

import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

/**
 * GET /api/analytics/monthly-sales
 * 
 * Query Parameters:
 * - year: number (optional) - Filter by specific year (default: current year)
 * - month: number (optional) - Filter by specific month (1-12)
 */
export async function GET(request) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year')) || new Date().getFullYear();
    const month = searchParams.get('month') ? parseInt(searchParams.get('month')) : null;

    // ===============================
    // MONTHLY SUMMARY
    // ===============================

    const monthCondition = month ? 'AND MONTH(sh.SaleDate) = @month' : '';
    const monthConditionSub = month ? 'AND MONTH(sh2.SaleDate) = @month' : '';

    const monthlySummaryQuery = `
      SELECT 
        YEAR(sh.SaleDate) AS SalesYear,
        MONTH(sh.SaleDate) AS SalesMonth,
        MONTHNAME(sh.SaleDate) AS MonthName,
        COUNT(DISTINCT sh.SaleID) AS TotalSales,
        IFNULL(SUM(si.Quantity), 0) AS TotalUnitsSold,
        IFNULL(SUM(si.LineTotal), 0) AS TotalRevenue,
        IFNULL(SUM(si.Quantity * (si.UnitPrice - p.CostPrice)), 0) AS TotalProfit,
        IFNULL(AVG(si.LineTotal), 0) AS AverageTransactionValue,
        COUNT(DISTINCT si.ProductID) AS UniqueProductsSold,
        COUNT(DISTINCT sh.CustomerID) AS UniqueCustomers
      FROM SalesHeaders sh
      LEFT JOIN SalesItems si ON sh.SaleID = si.SaleID
      LEFT JOIN Products p ON si.ProductID = p.ProductID
      WHERE YEAR(sh.SaleDate) = @year
        AND sh.Status = 'COMPLETED'
        ${monthCondition}
      GROUP BY 
        YEAR(sh.SaleDate),
        MONTH(sh.SaleDate),
        MONTHNAME(sh.SaleDate)
      ORDER BY SalesYear DESC, SalesMonth DESC
    `;

    const monthlySummary = await executeQuery(monthlySummaryQuery, { year, month });

    // ===============================
    // TOP SELLING PRODUCTS
    // ===============================

    const topProductsQuery = `
      SELECT 
        p.ProductID,
        p.ProductCode,
        p.ProductName,
        c.CategoryName,
        SUM(si.Quantity) AS TotalUnitsSold,
        SUM(si.LineTotal) AS TotalRevenue,
        SUM(si.Quantity * (si.UnitPrice - p.CostPrice)) AS TotalProfit,
        COUNT(DISTINCT sh.SaleID) AS NumberOfSales,
        AVG(si.Quantity) AS AvgUnitsPerSale
      FROM SalesItems si
      INNER JOIN SalesHeaders sh ON sh.SaleID = si.SaleID
      INNER JOIN Products p ON si.ProductID = p.ProductID
      INNER JOIN Categories c ON p.CategoryID = c.CategoryID
      WHERE YEAR(sh.SaleDate) = @year
        AND sh.Status = 'COMPLETED'
        ${monthCondition}
      GROUP BY 
        p.ProductID,
        p.ProductCode,
        p.ProductName,
        c.CategoryName
      ORDER BY TotalRevenue DESC
      LIMIT 10
    `;

    const topProducts = await executeQuery(topProductsQuery, { year, month });

    // ===============================
    // CATEGORY PERFORMANCE
    // ===============================

    const categoryPerformanceQuery = `
      SELECT 
        c.CategoryID,
        c.CategoryName,
        COUNT(DISTINCT sh.SaleID) AS TotalTransactions,
        SUM(si.Quantity) AS TotalUnitsSold,
        SUM(si.LineTotal) AS TotalRevenue,
        SUM(si.Quantity * (si.UnitPrice - p.CostPrice)) AS TotalProfit,
        COUNT(DISTINCT p.ProductID) AS UniqueProductsSold,
        CAST(SUM(si.LineTotal) * 100.0 / NULLIF(
          (SELECT SUM(si2.LineTotal)
           FROM SalesHeaders sh2
           JOIN SalesItems si2 ON sh2.SaleID = si2.SaleID
           WHERE YEAR(sh2.SaleDate) = @year
             AND sh2.Status = 'COMPLETED'
             ${monthConditionSub}
          ), 0
        ) AS DECIMAL(5,2)) AS RevenuePercentage
      FROM SalesItems si
      INNER JOIN SalesHeaders sh ON sh.SaleID = si.SaleID
      INNER JOIN Products p ON si.ProductID = p.ProductID
      INNER JOIN Categories c ON p.CategoryID = c.CategoryID
      WHERE YEAR(sh.SaleDate) = @year
        AND sh.Status = 'COMPLETED'
        ${monthCondition}
      GROUP BY 
        c.CategoryID,
        c.CategoryName
      ORDER BY TotalRevenue DESC
    `;

    const categoryPerformance = await executeQuery(categoryPerformanceQuery, { year, month });

    // ===============================
    // DAILY TREND (for the month or year)
    // ===============================

    const dailyTrendQuery = `
      SELECT 
        DATE(sh.SaleDate) AS SaleDate,
        COUNT(DISTINCT sh.SaleID) AS Transactions,
        IFNULL(SUM(si.Quantity), 0) AS UnitsSold,
        IFNULL(SUM(si.LineTotal), 0) AS Revenue
      FROM SalesHeaders sh
      LEFT JOIN SalesItems si ON sh.SaleID = si.SaleID
      WHERE YEAR(sh.SaleDate) = @year
        AND sh.Status = 'COMPLETED'
        ${monthCondition}
      GROUP BY DATE(sh.SaleDate)
      ORDER BY SaleDate DESC
    `;

    const dailyTrend = await executeQuery(dailyTrendQuery, { year, month });

    // Get the recordset arrays
    const monthlySummaryData = monthlySummary.recordset;
    const topProductsData = topProducts.recordset;
    const categoryPerformanceData = categoryPerformance.recordset;
    const dailyTrendData = dailyTrend.recordset;

    // ===============================
    // CALCULATE OVERALL STATISTICS
    // ===============================

    const overallStats = {
      year,
      month: month || 'All',
      totalRevenue: monthlySummaryData.reduce(
        (sum, m) => sum + parseFloat(m.TotalRevenue || 0),
        0
      ).toFixed(2),
      totalProfit: monthlySummaryData.reduce(
        (sum, m) => sum + parseFloat(m.TotalProfit || 0),
        0
      ).toFixed(2),
      totalTransactions: monthlySummaryData.reduce(
        (sum, m) => sum + parseInt((m.TotalSales ?? m.TotalTransactions) || 0),
        0
      ),
      totalUnitsSold: monthlySummaryData.reduce(
        (sum, m) => sum + parseInt(m.TotalUnitsSold || 0),
        0
      ),
      averageMonthlyRevenue: monthlySummaryData.length > 0
        ? (monthlySummaryData.reduce(
            (sum, m) => sum + parseFloat(m.TotalRevenue || 0),
            0
          ) / monthlySummaryData.length).toFixed(2)
        : '0.00',
    };

    return NextResponse.json({
      success: true,
      message: 'Monthly sales analytics fetched successfully',
      overallStats,
      monthlySummary: monthlySummaryData,
      data: monthlySummaryData,
      topProducts: topProductsData,
      categoryPerformance: categoryPerformanceData,
      dailyTrend: dailyTrendData,
    });
  } catch (error) {
    console.error('Error fetching monthly sales analytics:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch monthly sales analytics',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
