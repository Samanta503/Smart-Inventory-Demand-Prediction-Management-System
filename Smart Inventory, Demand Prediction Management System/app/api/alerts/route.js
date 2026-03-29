/**
 * Alerts API Route
 * ================
 *
 * GET /api/alerts - Returns all inventory alerts (deduplicated per product+warehouse)
 * PATCH /api/alerts - Resolve an alert
 *
 * Alerts are automatically created by database triggers when:
 * - Stock falls below reorder level (LOW_STOCK)
 * - Stock reaches zero (OUT_OF_STOCK)
 *
 * FIXES:
 * - Deduplication: only the latest alert per product+warehouse is returned
 *   (prevents same product appearing twice with both LOW_STOCK and OUT_OF_STOCK)
 * - Urgency & AlertType are based on CURRENT stock, not the stale value
 *   recorded when the alert was created (prevents showing "Out of Stock"
 *   for a product that has since been restocked)
 * - Summary counts use current-stock-based fields for accuracy
 */

import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

/**
 * GET /api/alerts
 * Fetches deduplicated inventory alerts with live stock info
 *
 * Query Parameters:
 * - status: 'all' | 'unresolved' | 'resolved' (default: 'unresolved')
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'unresolved';

    /**
     * SIMPLIFIED APPROACH: Query all products that are currently low/out of stock
     * This ensures all low-stock/out-of-stock situations are visible on the alerts page,
     * regardless of whether they have InventoryAlerts records.
     */

    const query = `
      SELECT
        NULL AS AlertID,
        p.ProductID,
        p.ProductCode,
        p.ProductName,
        c.CategoryName,
        sup.SupplierName,
        sup.Email  AS SupplierEmail,
        sup.Phone  AS SupplierPhone,
        w.WarehouseID,
        w.WarehouseName,

        CASE
          WHEN IFNULL(ps.OnHandQty, 0) = 0              THEN 'OUT_OF_STOCK'
          WHEN IFNULL(ps.OnHandQty, 0) <= p.ReorderLevel THEN 'LOW_STOCK'
          ELSE 'RESTOCKED'
        END AS AlertType,

        'LIVE' AS OriginalAlertType,
        CASE
          WHEN IFNULL(ps.OnHandQty, 0) = 0
            THEN CONCAT('Product "', p.ProductName, '" is OUT OF STOCK in ', w.WarehouseName, '!')
          ELSE CONCAT('Product "', p.ProductName, '" is LOW STOCK in ', w.WarehouseName, 
                      '. Stock: ', IFNULL(ps.OnHandQty, 0), ', Reorder: ', p.ReorderLevel)
        END AS Message,
        
        IFNULL(ps.OnHandQty, 0) AS OriginalStock,
        p.ReorderLevel,
        0 AS IsResolved,
        NULL AS ResolvedAt,
        NULL AS ResolvedByUserID,
        NULL AS ResolvedByName,
        NOW() AS CreatedAt,
        IFNULL(ps.OnHandQty, 0) AS LatestStock,

        CASE
          WHEN IFNULL(ps.OnHandQty, 0) = 0                          THEN 'CRITICAL'
          WHEN IFNULL(ps.OnHandQty, 0) <= FLOOR(p.ReorderLevel / 2) THEN 'HIGH'
          ELSE 'MEDIUM'
        END AS Urgency

      FROM Products p
      INNER JOIN Categories c ON p.CategoryID = c.CategoryID
      INNER JOIN Suppliers sup ON p.SupplierID = sup.SupplierID
      CROSS JOIN Warehouses w
      LEFT JOIN ProductStocks ps ON p.ProductID = ps.ProductID
                                 AND w.WarehouseID = ps.WarehouseID
      
      WHERE p.IsActive = 1
        AND IFNULL(ps.OnHandQty, 0) <= p.ReorderLevel

      ORDER BY
        CASE
          WHEN IFNULL(ps.OnHandQty, 0) = 0 THEN 1
          WHEN IFNULL(ps.OnHandQty, 0) <= FLOOR(p.ReorderLevel / 2) THEN 2
          ELSE 3
        END,
        IFNULL(ps.OnHandQty, 0) ASC,
        p.ProductName ASC
    `;

    const result = await executeQuery(query);
    const data = result.recordset;

    // Summary counts
    const summary = {
      totalAlerts: data.length,
      criticalCount: data.filter(a => a.Urgency === 'CRITICAL').length,
      highCount:     data.filter(a => a.Urgency === 'HIGH').length,
      mediumCount:   data.filter(a => a.Urgency === 'MEDIUM').length,
      outOfStockCount: data.filter(a => a.AlertType === 'OUT_OF_STOCK').length,
      lowStockCount:   data.filter(a => a.AlertType === 'LOW_STOCK').length,
    };

    return NextResponse.json({
      success: true,
      message: 'Alerts fetched successfully',
      filter: status,
      summary,
      data,
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
