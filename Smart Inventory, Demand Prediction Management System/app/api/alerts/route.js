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

    // Build filter for the dedup sub-query
    let subWhereClause = '';
    if (status === 'unresolved') {
      subWhereClause = 'WHERE sub.IsResolved = 0';
    } else if (status === 'resolved') {
      subWhereClause = 'WHERE sub.IsResolved = 1';
    }

    const query = `
      SELECT
        a.AlertID,
        a.ProductID,
        p.ProductCode,
        p.ProductName,
        c.CategoryName,
        sup.SupplierName,
        sup.Email  AS SupplierEmail,
        sup.Phone  AS SupplierPhone,
        a.WarehouseID,
        w.WarehouseName,

        -- ▸ Current status based on LIVE stock (not stale AlertType)
        CASE
          WHEN IFNULL(ps.OnHandQty, 0) = 0              THEN 'OUT_OF_STOCK'
          WHEN IFNULL(ps.OnHandQty, 0) <= p.ReorderLevel THEN 'LOW_STOCK'
          ELSE 'RESTOCKED'
        END AS AlertType,

        a.AlertType AS OriginalAlertType,
        a.Message,
        a.CurrentStock  AS OriginalStock,
        p.ReorderLevel  AS ReorderLevel,
        a.IsResolved,
        a.ResolvedAt,
        a.ResolvedByUserID,
        u.FullName AS ResolvedByName,
        a.CreatedAt,

        -- Live warehouse stock
        IFNULL(ps.OnHandQty, 0) AS LatestStock,

        -- ▸ Urgency based on LIVE stock
        CASE
          WHEN IFNULL(ps.OnHandQty, 0) = 0                          THEN 'CRITICAL'
          WHEN IFNULL(ps.OnHandQty, 0) <= FLOOR(p.ReorderLevel / 2) THEN 'HIGH'
          ELSE 'MEDIUM'
        END AS Urgency

      FROM InventoryAlerts a
      INNER JOIN Products   p   ON a.ProductID  = p.ProductID
      INNER JOIN Categories c   ON p.CategoryID = c.CategoryID
      INNER JOIN Suppliers  sup ON p.SupplierID  = sup.SupplierID
      INNER JOIN Warehouses w   ON a.WarehouseID = w.WarehouseID
      LEFT  JOIN ProductStocks ps ON a.ProductID = ps.ProductID
                                  AND a.WarehouseID = ps.WarehouseID
      LEFT  JOIN Users u ON a.ResolvedByUserID = u.UserID

      /* ── Deduplicate: keep only the latest alert per product + warehouse ── */
      WHERE a.AlertID IN (
        SELECT MAX(sub.AlertID)
        FROM InventoryAlerts sub
        ${subWhereClause}
        GROUP BY sub.ProductID, sub.WarehouseID
      )

      ORDER BY
        CASE
          WHEN IFNULL(ps.OnHandQty, 0) = 0                          THEN 1
          WHEN IFNULL(ps.OnHandQty, 0) <= FLOOR(p.ReorderLevel / 2) THEN 2
          ELSE 3
        END,
        a.CreatedAt DESC
    `;

    const result = await executeQuery(query);
    const data = result.recordset;

    // Summary – all counts now use LIVE-stock-based AlertType & Urgency
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
