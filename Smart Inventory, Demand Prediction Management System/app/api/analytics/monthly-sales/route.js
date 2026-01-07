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

    const monthlySummaryQuery = `
      SELECT 
        YEAR(s.SaleDate) AS SaleYear,
        MONTH(s.SaleDate) AS SaleMonth,
        DATENAME(MONTH, s.SaleDate) AS MonthName,
        COUNT(DISTINCT s.SaleID) AS TotalTransactions,
        SUM(s.Quantity) AS TotalUnitsSold,
        SUM(s.TotalAmount) AS TotalRevenue,
        SUM(s.TotalAmount - (s.Quantity * p.CostPrice)) AS TotalProfit,
        AVG(s.TotalAmount) AS AverageTransactionValue,
        COUNT(DISTINCT s.ProductID) AS UniqueProductsSold,
        COUNT(DISTINCT s.CustomerName) AS UniqueCustomers
      FROM Sales s
      INNER JOIN Products p ON s.ProductID = p.ProductID
      WHERE YEAR(s.SaleDate) = @year
        ${month ? 'AND MONTH(s.SaleDate) = @month' : ''}
      GROUP BY 
        YEAR(s.SaleDate),
        MONTH(s.SaleDate),
        DATENAME(MONTH, s.SaleDate)
      ORDER BY SaleYear DESC, SaleMonth DESC
    `;

    const monthlySummary = await executeQuery(monthlySummaryQuery, { year, month });

    // ===============================
    // TOP SELLING PRODUCTS
    // ===============================

    const topProductsQuery = `
      SELECT TOP 10
        p.ProductID,
        p.ProductCode,
        p.ProductName,
        c.CategoryName,
        SUM(s.Quantity) AS TotalUnitsSold,
        SUM(s.TotalAmount) AS TotalRevenue,
        SUM(s.TotalAmount - (s.Quantity * p.CostPrice)) AS TotalProfit,
        COUNT(s.SaleID) AS NumberOfSales,
        AVG(s.Quantity) AS AvgUnitsPerSale
      FROM Sales s
      INNER JOIN Products p ON s.ProductID = p.ProductID
      INNER JOIN Categories c ON p.CategoryID = c.CategoryID
      WHERE YEAR(s.SaleDate) = @year
        ${month ? 'AND MONTH(s.SaleDate) = @month' : ''}
      GROUP BY 
        p.ProductID,
        p.ProductCode,
        p.ProductName,
        c.CategoryName
      ORDER BY TotalRevenue DESC
    `;

    const topProducts = await executeQuery(topProductsQuery, { year, month });

    // ===============================
    // CATEGORY PERFORMANCE
    // ===============================

    const categoryPerformanceQuery = `
      SELECT 
        c.CategoryID,
        c.CategoryName,
        COUNT(DISTINCT s.SaleID) AS TotalTransactions,
        SUM(s.Quantity) AS TotalUnitsSold,
        SUM(s.TotalAmount) AS TotalRevenue,
        SUM(s.TotalAmount - (s.Quantity * p.CostPrice)) AS TotalProfit,
        COUNT(DISTINCT p.ProductID) AS UniqueProductsSold,
        -- Calculate percentage of total revenue
        CAST(SUM(s.TotalAmount) * 100.0 / 
          (SELECT SUM(TotalAmount) FROM Sales WHERE YEAR(SaleDate) = @year 
           ${month ? 'AND MONTH(SaleDate) = @month' : ''}) AS DECIMAL(5,2)) AS RevenuePercentage
      FROM Sales s
      INNER JOIN Products p ON s.ProductID = p.ProductID
      INNER JOIN Categories c ON p.CategoryID = c.CategoryID
      WHERE YEAR(s.SaleDate) = @year
        ${month ? 'AND MONTH(s.SaleDate) = @month' : ''}
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
        CAST(s.SaleDate AS DATE) AS SaleDate,
        COUNT(DISTINCT s.SaleID) AS Transactions,
        SUM(s.Quantity) AS UnitsSold,
        SUM(s.TotalAmount) AS Revenue
      FROM Sales s
      WHERE YEAR(s.SaleDate) = @year
        ${month ? 'AND MONTH(s.SaleDate) = @month' : ''}
      GROUP BY CAST(s.SaleDate AS DATE)
      ORDER BY SaleDate DESC
    `;

    const dailyTrend = await executeQuery(dailyTrendQuery, { year, month });

    // ===============================
    // CALCULATE OVERALL STATISTICS
    // ===============================

    const overallStats = {
      year,
      month: month || 'All',
      totalRevenue: monthlySummary.recordset.reduce(
        (sum, m) => sum + parseFloat(m.TotalRevenue || 0),
        0
      ).toFixed(2),
      totalProfit: monthlySummary.recordset.reduce(
        (sum, m) => sum + parseFloat(m.TotalProfit || 0),
        0
      ).toFixed(2),
      totalTransactions: monthlySummary.recordset.reduce(
        (sum, m) => sum + parseInt(m.TotalTransactions || 0),
        0
      ),
      totalUnitsSold: monthlySummary.recordset.reduce(
        (sum, m) => sum + parseInt(m.TotalUnitsSold || 0),
        0
      ),
      averageMonthlyRevenue: monthlySummary.recordset.length > 0
        ? (monthlySummary.recordset.reduce(
            (sum, m) => sum + parseFloat(m.TotalRevenue || 0),
            0
          ) / monthlySummary.recordset.length).toFixed(2)
        : '0.00',
    };

    return NextResponse.json({
      success: true,
      message: 'Monthly sales analytics fetched successfully',
      overallStats,
      monthlySummary: monthlySummary.recordset,
      topProducts: topProducts.recordset,
      categoryPerformance: categoryPerformance.recordset,
      dailyTrend: dailyTrend.recordset,
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
