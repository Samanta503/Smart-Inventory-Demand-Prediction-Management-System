/**
 * Sales API Route
 * ===============
 * 
 * GET  /api/sales - Returns all sales records (headers with items)
 * POST /api/sales - Creates a new sale (header + multiple items)
 * 
 * New structure uses SalesHeaders + SalesItems for multi-item transactions
 */

import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

/**
 * GET /api/sales
 * Fetches all sales headers with their items
 */
export async function GET() {
  try {
    // Get sales headers with customer and warehouse info
    const headersQuery = `
      SELECT 
        sh.SaleID,
        sh.CustomerID,
        c.CustomerName,
        sh.WarehouseID,
        w.WarehouseName,
        sh.SaleDate,
        sh.InvoiceNumber,
        sh.Status,
        sh.CreatedByUserID,
        u.FullName AS CreatedByName,
        sh.Notes,
        sh.CreatedAt,
        (SELECT SUM(si.LineTotal) FROM SalesItems si WHERE si.SaleID = sh.SaleID) AS TotalAmount,
        (SELECT COUNT(*) FROM SalesItems si WHERE si.SaleID = sh.SaleID) AS ItemCount
      FROM SalesHeaders sh
      INNER JOIN Customers c ON sh.CustomerID = c.CustomerID
      INNER JOIN Warehouses w ON sh.WarehouseID = w.WarehouseID
      INNER JOIN Users u ON sh.CreatedByUserID = u.UserID
      WHERE sh.Status != 'CANCELLED'
      ORDER BY sh.SaleDate DESC, sh.SaleID DESC
    `;

    const headers = await executeQuery(headersQuery);

    // Get all items for these sales
    const itemsQuery = `
      SELECT 
        si.SaleItemID,
        si.SaleID,
        si.ProductID,
        p.ProductCode,
        p.ProductName,
        p.CostPrice,
        si.Quantity,
        si.UnitPrice,
        si.LineTotal,
        si.Notes,
        (si.Quantity * (si.UnitPrice - p.CostPrice)) AS Profit
      FROM SalesItems si
      INNER JOIN Products p ON si.ProductID = p.ProductID
      ORDER BY si.SaleID, si.SaleItemID
    `;

    const items = await executeQuery(itemsQuery);

    // Group items by SaleID
    const itemsBySaleId = {};
    items.forEach(item => {
      if (!itemsBySaleId[item.SaleID]) {
        itemsBySaleId[item.SaleID] = [];
      }
      itemsBySaleId[item.SaleID].push(item);
    });

    // Attach items to headers
    const salesWithItems = headers.map(header => ({
      ...header,
      items: itemsBySaleId[header.SaleID] || []
    }));

    // Calculate summary
    const summary = {
      totalSales: headers.length,
      totalRevenue: headers.reduce((sum, s) => sum + parseFloat(s.TotalAmount || 0), 0).toFixed(2),
      totalProfit: items.reduce((sum, i) => sum + parseFloat(i.Profit || 0), 0).toFixed(2),
      totalItemsSold: items.reduce((sum, i) => sum + parseInt(i.Quantity || 0), 0),
    };

    return NextResponse.json({
      success: true,
      message: 'Sales fetched successfully',
      summary,
      data: salesWithItems,
    });
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch sales', error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sales
 * Creates a new sale with header and items
 * 
 * Request body:
 * {
 *   customerId: number,
 *   warehouseId: number,
 *   createdByUserId: number (default: 1),
 *   notes: string,
 *   items: [{ productId, quantity, unitPrice, notes }]
 * }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { customerId, warehouseId, createdByUserId = 1, notes, items } = body;

    // Validation
    if (!customerId || !warehouseId || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Customer, warehouse, and at least one item are required' },
        { status: 400 }
      );
    }

    // Validate each item has stock
    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return NextResponse.json(
          { success: false, message: 'Each item must have productId and positive quantity' },
          { status: 400 }
        );
      }

      // Check stock in warehouse
      const stockQuery = `
        SELECT IFNULL(OnHandQty, 0) AS OnHandQty 
        FROM ProductStocks 
        WHERE ProductID = ? AND WarehouseID = ?
      `;
      const stockResult = await executeQuery(stockQuery, { productId: item.productId, warehouseId });
      const available = stockResult[0]?.OnHandQty || 0;
      
      if (available < item.quantity) {
        const prodQuery = `SELECT ProductName FROM Products WHERE ProductID = ?`;
        const prodResult = await executeQuery(prodQuery, { productId: item.productId });
        const productName = prodResult[0]?.ProductName || 'Unknown';
        return NextResponse.json(
          { success: false, message: `Insufficient stock for "${productName}". Available: ${available}` },
          { status: 400 }
        );
      }
    }

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}`;

    // Insert header
    const headerQuery = `
      INSERT INTO SalesHeaders (CustomerID, WarehouseID, InvoiceNumber, CreatedByUserID, Notes)
      VALUES (?, ?, ?, ?, ?)
    `;
    await executeQuery(headerQuery, {
      customerId,
      warehouseId,
      invoiceNumber,
      createdByUserId,
      notes: notes || null
    });

    // Get the inserted SaleID
    const saleIdResult = await executeQuery('SELECT LAST_INSERT_ID() AS SaleID');
    const saleId = saleIdResult[0].SaleID;

    // Insert items (triggers will handle stock updates)
    for (const item of items) {
      // Get default price if not provided
      let unitPrice = item.unitPrice;
      if (!unitPrice) {
        const priceQuery = `SELECT SellingPrice FROM Products WHERE ProductID = ?`;
        const priceResult = await executeQuery(priceQuery, { productId: item.productId });
        unitPrice = priceResult[0]?.SellingPrice || 0;
      }

      const itemQuery = `
        INSERT INTO SalesItems (SaleID, ProductID, Quantity, UnitPrice, Notes)
        VALUES (?, ?, ?, ?, ?)
      `;
      await executeQuery(itemQuery, {
        saleId,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        notes: item.notes || null
      });
    }

    // Get the complete sale
    const resultQuery = `
      SELECT 
        sh.*,
        c.CustomerName,
        w.WarehouseName,
        (SELECT SUM(LineTotal) FROM SalesItems WHERE SaleID = sh.SaleID) AS TotalAmount
      FROM SalesHeaders sh
      INNER JOIN Customers c ON sh.CustomerID = c.CustomerID
      INNER JOIN Warehouses w ON sh.WarehouseID = w.WarehouseID
      WHERE sh.SaleID = ?
    `;
    const result = await executeQuery(resultQuery, { saleId });

    return NextResponse.json({
      success: true,
      message: 'Sale created successfully',
      data: result[0],
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating sale:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create sale', error: error.message },
      { status: 500 }
    );
  }
}
