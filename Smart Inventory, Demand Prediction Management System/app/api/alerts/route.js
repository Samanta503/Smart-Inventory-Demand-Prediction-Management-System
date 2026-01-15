/**
 * Alerts API Route
 * ================
 * 
 * GET /api/alerts - Returns all inventory alerts
 * PATCH /api/alerts - Resolve an alert
 * 
 * Alerts are automatically created by database triggers when:
 * - Stock falls below reorder level (LOW_STOCK)
 * - Stock reaches zero (OUT_OF_STOCK)
 */

import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

/**
 * GET /api/alerts
 * Fetches all inventory alerts with warehouse info
 * 
 * Query Parameters:
 * - status: 'all' | 'unresolved' | 'resolved' (default: 'unresolved')
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'unresolved';

    let whereClause = '';
    if (status === 'unresolved') {
      whereClause = 'WHERE a.IsResolved = 0';
    } else if (status === 'resolved') {
      whereClause = 'WHERE a.IsResolved = 1';
    }

    const query = `
      SELECT 
        a.AlertID,
        a.ProductID,
        p.ProductCode,
        p.ProductName,
        c.CategoryName,
        sup.SupplierName,
        sup.Email AS SupplierEmail,
        sup.Phone AS SupplierPhone,
        a.WarehouseID,
        w.WarehouseName,
        a.AlertType,
        a.Message,
        a.CurrentStock,
        a.ReorderLevel,
        a.IsResolved,
        a.ResolvedAt,
        a.ResolvedByUserID,
        u.FullName AS ResolvedByName,
        a.CreatedAt,
        -- Current stock might have changed since alert was created
        IFNULL(ps.OnHandQty, 0) AS LatestStock,
        -- Calculate urgency
        CASE 
          WHEN a.AlertType = 'OUT_OF_STOCK' THEN 'CRITICAL'
          WHEN IFNULL(ps.OnHandQty, 0) <= (p.ReorderLevel / 2) THEN 'HIGH'
          ELSE 'MEDIUM'
        END AS Urgency
      FROM InventoryAlerts a
      INNER JOIN Products p ON a.ProductID = p.ProductID
      INNER JOIN Categories c ON p.CategoryID = c.CategoryID
      INNER JOIN Suppliers sup ON p.SupplierID = sup.SupplierID
      INNER JOIN Warehouses w ON a.WarehouseID = w.WarehouseID
      LEFT JOIN ProductStocks ps ON a.ProductID = ps.ProductID AND a.WarehouseID = ps.WarehouseID
      LEFT JOIN Users u ON a.ResolvedByUserID = u.UserID
      ${whereClause}
      ORDER BY 
        CASE 
          WHEN a.AlertType = 'OUT_OF_STOCK' THEN 1
          WHEN IFNULL(ps.OnHandQty, 0) <= (p.ReorderLevel / 2) THEN 2
          ELSE 3
        END,
        a.CreatedAt DESC
    `;

    const result = await executeQuery(query);
    const data = result.recordset;

    // Summary statistics
    const summary = {
      totalAlerts: data.length,
      criticalCount: data.filter(a => a.Urgency === 'CRITICAL').length,
      highCount: data.filter(a => a.Urgency === 'HIGH').length,
      mediumCount: data.filter(a => a.Urgency === 'MEDIUM').length,
      outOfStockCount: data.filter(a => a.AlertType === 'OUT_OF_STOCK').length,
      lowStockCount: data.filter(a => a.AlertType === 'LOW_STOCK').length,
    };

    return NextResponse.json({
      success: true,
      message: 'Alerts fetched successfully',
      filter: status,
      summary,
      data: data,
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);

    return NextResponse.json(
      { success: false, message: 'Failed to fetch alerts', error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/alerts
 * Resolve an alert
 */
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { alertId, resolvedByUserId } = body;

    if (!alertId) {
      return NextResponse.json(
        { success: false, message: 'Alert ID is required' },
        { status: 400 }
      );
    }

    const updateQuery = `
      UPDATE InventoryAlerts
      SET 
        IsResolved = 1,
        ResolvedAt = NOW(),
        ResolvedByUserID = ?
      WHERE AlertID = ?
    `;

    await executeQuery(updateQuery, [resolvedByUserId || 1, alertId]);

    // Get updated alert
    const selectQuery = `SELECT * FROM InventoryAlerts WHERE AlertID = ?`;
    const result = await executeQuery(selectQuery, [alertId]);

    if (result.recordset.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Alert not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Alert resolved successfully',
      data: result.recordset[0],
    });
  } catch (error) {
    console.error('Error resolving alert:', error);

    return NextResponse.json(
      { success: false, message: 'Failed to resolve alert', error: error.message },
      { status: 500 }
    );
  }
}
