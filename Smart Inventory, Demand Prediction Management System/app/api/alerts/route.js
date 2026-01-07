/**
 * Alerts API Route
 * ================
 * 
 * GET /api/alerts - Returns all inventory alerts
 * 
 * Alerts are automatically created by database triggers when:
 * - Stock falls below reorder level (LOW_STOCK)
 * - Stock reaches zero (OUT_OF_STOCK)
 */

import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

/**
 * GET /api/alerts
 * Fetches all inventory alerts
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
        s.SupplierName,
        s.Email AS SupplierEmail,
        s.Phone AS SupplierPhone,
        a.AlertType,
        a.Message,
        a.CurrentStock,
        a.ReorderLevel,
        a.IsResolved,
        a.ResolvedAt,
        a.ResolvedBy,
        a.CreatedAt,
        -- Current stock might have changed since alert was created
        p.CurrentStock AS LatestStock,
        -- Calculate urgency
        CASE 
          WHEN a.AlertType = 'OUT_OF_STOCK' THEN 'CRITICAL'
          WHEN p.CurrentStock <= (p.ReorderLevel / 2) THEN 'HIGH'
          ELSE 'MEDIUM'
        END AS Urgency
      FROM InventoryAlerts a
      INNER JOIN Products p ON a.ProductID = p.ProductID
      INNER JOIN Categories c ON p.CategoryID = c.CategoryID
      INNER JOIN Suppliers s ON p.SupplierID = s.SupplierID
      ${whereClause}
      ORDER BY 
        CASE 
          WHEN a.AlertType = 'OUT_OF_STOCK' THEN 1
          WHEN p.CurrentStock <= (p.ReorderLevel / 2) THEN 2
          ELSE 3
        END,
        a.CreatedAt DESC
    `;

    const result = await executeQuery(query);

    // Summary statistics
    const summary = {
      totalAlerts: result.recordset.length,
      criticalCount: result.recordset.filter(a => a.Urgency === 'CRITICAL').length,
      highCount: result.recordset.filter(a => a.Urgency === 'HIGH').length,
      mediumCount: result.recordset.filter(a => a.Urgency === 'MEDIUM').length,
      outOfStockCount: result.recordset.filter(a => a.AlertType === 'OUT_OF_STOCK').length,
      lowStockCount: result.recordset.filter(a => a.AlertType === 'LOW_STOCK').length,
    };

    return NextResponse.json({
      success: true,
      message: 'Alerts fetched successfully',
      filter: status,
      summary,
      data: result.recordset,
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch alerts',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      },
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
    const { alertId, resolvedBy } = body;

    if (!alertId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Alert ID is required',
        },
        { status: 400 }
      );
    }

    const updateQuery = `
      UPDATE InventoryAlerts
      SET 
        IsResolved = 1,
        ResolvedAt = GETDATE(),
        ResolvedBy = @resolvedBy
      OUTPUT INSERTED.*
      WHERE AlertID = @alertId
    `;

    const result = await executeQuery(updateQuery, {
      alertId,
      resolvedBy: resolvedBy || 'System',
    });

    if (result.recordset.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Alert not found',
        },
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
      {
        success: false,
        message: 'Failed to resolve alert',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
