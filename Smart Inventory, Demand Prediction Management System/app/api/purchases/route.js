/**
 * Purchases API Route
 * ===================
 * 
 * GET  /api/purchases - Returns all purchase records (headers with items)
 * POST /api/purchases - Creates a new purchase (header + multiple items)
 * 
 * New structure uses PurchaseHeaders + PurchaseItems for multi-item transactions
 */

import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

/**
 * GET /api/purchases
 * Fetches all purchase headers with their items
 */
export async function GET() {
  try {
    // Get purchase headers with supplier and warehouse info
    const headersQuery = `
      SELECT 
        ph.PurchaseID,
        ph.SupplierID,
        s.SupplierName,
        ph.WarehouseID,
        w.WarehouseName,
        ph.PurchaseDate,
        ph.ReferenceNumber,
        ph.Status,
        ph.CreatedByUserID,
        u.FullName AS CreatedByName,
        ph.Notes,
        ph.CreatedAt,
        (SELECT SUM(pi.LineTotal) FROM PurchaseItems pi WHERE pi.PurchaseID = ph.PurchaseID) AS TotalCost,
        (SELECT COUNT(*) FROM PurchaseItems pi WHERE pi.PurchaseID = ph.PurchaseID) AS ItemCount
      FROM PurchaseHeaders ph
      INNER JOIN Suppliers s ON ph.SupplierID = s.SupplierID
      INNER JOIN Warehouses w ON ph.WarehouseID = w.WarehouseID
      INNER JOIN Users u ON ph.CreatedByUserID = u.UserID
      WHERE ph.Status != 'CANCELLED'
      ORDER BY ph.PurchaseDate DESC, ph.PurchaseID DESC
    `;

    const headersResult = await executeQuery(headersQuery);
    const headers = headersResult.recordset;

    // Get all items for these purchases
    const itemsQuery = `
      SELECT 
        pi.PurchaseItemID,
        pi.PurchaseID,
        pi.ProductID,
        p.ProductCode,
        p.ProductName,
        pi.Quantity,
        pi.UnitCost,
        pi.LineTotal,
        pi.Notes
      FROM PurchaseItems pi
      INNER JOIN Products p ON pi.ProductID = p.ProductID
      ORDER BY pi.PurchaseID, pi.PurchaseItemID
    `;

    const itemsResult = await executeQuery(itemsQuery);
    const items = itemsResult.recordset;

    // Group items by PurchaseID
    const itemsByPurchaseId = {};
    items.forEach(item => {
      if (!itemsByPurchaseId[item.PurchaseID]) {
        itemsByPurchaseId[item.PurchaseID] = [];
      }
      itemsByPurchaseId[item.PurchaseID].push(item);
    });

    // Attach items to headers
    const purchasesWithItems = headers.map(header => ({
      ...header,
      items: itemsByPurchaseId[header.PurchaseID] || []
    }));

    // Calculate summary
    const summary = {
      totalPurchases: headers.length,
      totalCost: headers.reduce((sum, p) => sum + parseFloat(p.TotalCost || 0), 0).toFixed(2),
      totalUnits: items.reduce((sum, i) => sum + parseInt(i.Quantity || 0), 0),
    };

    return NextResponse.json({
      success: true,
      message: 'Purchases fetched successfully',
      summary,
      data: purchasesWithItems,
    });
  } catch (error) {
    console.error('Error fetching purchases:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch purchases', error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/purchases
 * Creates a new purchase with header and items
 * 
 * Request body:
 * {
 *   supplierId: number,
 *   warehouseId: number,
 *   createdByUserId: number (default: 1),
 *   notes: string,
 *   items: [{ productId, quantity, unitCost, notes }]
 * }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { supplierId, warehouseId, createdByUserId = 1, notes, items } = body;

    // Validation
    if (!supplierId || !warehouseId || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Supplier, warehouse, and at least one item are required' },
        { status: 400 }
      );
    }

    // Validate items
    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0 || !item.unitCost) {
        return NextResponse.json(
          { success: false, message: 'Each item must have productId, positive quantity, and unitCost' },
          { status: 400 }
        );
      }
    }

    // Generate reference number
    const referenceNumber = `PO-${Date.now()}`;

    // Insert header
    const headerQuery = `
      INSERT INTO PurchaseHeaders (SupplierID, WarehouseID, ReferenceNumber, CreatedByUserID, Notes)
      VALUES (?, ?, ?, ?, ?)
    `;
    await executeQuery(headerQuery, {
      supplierId,
      warehouseId,
      referenceNumber,
      createdByUserId,
      notes: notes || null
    });

    // Get the inserted PurchaseID
    const purchaseIdResult = await executeQuery('SELECT LAST_INSERT_ID() AS PurchaseID');
    const purchaseId = purchaseIdResult[0].PurchaseID;

    // Insert items (triggers will handle stock updates)
    for (const item of items) {
      const itemQuery = `
        INSERT INTO PurchaseItems (PurchaseID, ProductID, Quantity, UnitCost, Notes)
        VALUES (?, ?, ?, ?, ?)
      `;
      await executeQuery(itemQuery, {
        purchaseId,
        productId: item.productId,
        quantity: item.quantity,
        unitCost: item.unitCost,
        notes: item.notes || null
      });
    }

    // Get the complete purchase
    const resultQuery = `
      SELECT 
        ph.*,
        s.SupplierName,
        w.WarehouseName,
        (SELECT SUM(LineTotal) FROM PurchaseItems WHERE PurchaseID = ph.PurchaseID) AS TotalCost
      FROM PurchaseHeaders ph
      INNER JOIN Suppliers s ON ph.SupplierID = s.SupplierID
      INNER JOIN Warehouses w ON ph.WarehouseID = w.WarehouseID
      WHERE ph.PurchaseID = ?
    `;
    const result = await executeQuery(resultQuery, { purchaseId });

    return NextResponse.json({
      success: true,
      message: 'Purchase created successfully',
      data: result[0],
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating purchase:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create purchase', error: error.message },
      { status: 500 }
    );
  }
}
