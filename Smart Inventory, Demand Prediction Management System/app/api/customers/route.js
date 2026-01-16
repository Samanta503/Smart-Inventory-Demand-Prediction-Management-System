/**
 * Customers API Route
 * ===================
 * 
 * GET  /api/customers - Returns all customers
 * POST /api/customers - Creates a new customer
 */

import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

/**
 * GET /api/customers
 */
export async function GET() {
  try {
    // Get customers with purchase summary
    const query = `
      SELECT 
        c.CustomerID,
        c.CustomerName,
        c.Email,
        c.Phone,
        c.Address,
        c.City,
        c.Country,
        c.IsActive,
        c.CreatedAt,
        c.UpdatedAt,
        COALESCE(stats.TotalOrders, 0) AS TotalOrders,
        COALESCE(stats.TotalItemsBought, 0) AS TotalItemsBought,
        COALESCE(stats.TotalSpent, 0) AS TotalSpent,
        stats.LastPurchaseDate
      FROM Customers c
      LEFT JOIN (
        SELECT 
          sh.CustomerID,
          COUNT(DISTINCT sh.SaleID) AS TotalOrders,
          SUM(si.Quantity) AS TotalItemsBought,
          SUM(si.LineTotal) AS TotalSpent,
          MAX(sh.SaleDate) AS LastPurchaseDate
        FROM SalesHeaders sh
        INNER JOIN SalesItems si ON sh.SaleID = si.SaleID
        WHERE sh.Status != 'CANCELLED'
        GROUP BY sh.CustomerID
      ) stats ON c.CustomerID = stats.CustomerID
      WHERE c.IsActive = 1
      ORDER BY c.CustomerName ASC
    `;

    const result = await executeQuery(query);
    const customers = result.recordset;

    // Get purchase history for all customers
    const historyQuery = `
      SELECT 
        sh.CustomerID,
        sh.SaleID,
        sh.InvoiceNumber,
        sh.SaleDate,
        sh.Status,
        w.WarehouseName,
        si.ProductID,
        p.ProductName,
        p.ProductCode,
        si.Quantity,
        si.UnitPrice,
        si.LineTotal
      FROM SalesHeaders sh
      INNER JOIN SalesItems si ON sh.SaleID = si.SaleID
      INNER JOIN Products p ON si.ProductID = p.ProductID
      INNER JOIN Warehouses w ON sh.WarehouseID = w.WarehouseID
      WHERE sh.Status != 'CANCELLED'
      ORDER BY sh.SaleDate DESC, sh.SaleID DESC
    `;

    const historyResult = await executeQuery(historyQuery);
    const allHistory = historyResult.recordset;

    // Group history by customer
    const historyByCustomer = {};
    allHistory.forEach(item => {
      if (!historyByCustomer[item.CustomerID]) {
        historyByCustomer[item.CustomerID] = [];
      }
      historyByCustomer[item.CustomerID].push(item);
    });

    // Attach history to customers
    const customersWithHistory = customers.map(customer => ({
      ...customer,
      purchaseHistory: historyByCustomer[customer.CustomerID] || []
    }));

    return NextResponse.json({
      success: true,
      message: 'Customers fetched successfully',
      count: customersWithHistory.length,
      data: customersWithHistory,
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch customers', error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/customers
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { customerName, email, phone, address, city, country } = body;

    if (!customerName) {
      return NextResponse.json(
        { success: false, message: 'Customer name is required' },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO Customers (CustomerName, Email, Phone, Address, City, Country)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await executeQuery(insertQuery, {
      customerName,
      email: email || null,
      phone: phone || null,
      address: address || null,
      city: city || null,
      country: country || null
    });

    // Get the inserted customer
    const selectQuery = `SELECT * FROM Customers WHERE CustomerID = LAST_INSERT_ID()`;
    const result = await executeQuery(selectQuery);

    return NextResponse.json({
      success: true,
      message: 'Customer created successfully',
      data: result.recordset[0],
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create customer', error: error.message },
      { status: 500 }
    );
  }
}
