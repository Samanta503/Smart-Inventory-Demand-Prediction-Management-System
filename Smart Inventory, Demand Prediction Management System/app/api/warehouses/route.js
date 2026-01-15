/**
 * Warehouses API Route
 * ====================
 * 
 * GET  /api/warehouses - Returns all warehouses
 * POST /api/warehouses - Creates a new warehouse
 */

import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

/**
 * GET /api/warehouses
 */
export async function GET() {
  try {
    const query = `
      SELECT 
        w.WarehouseID,
        w.WarehouseName,
        w.Address,
        w.City,
        w.Country,
        w.IsActive,
        w.CreatedAt,
        w.UpdatedAt,
        (SELECT COUNT(*) FROM ProductStocks ps WHERE ps.WarehouseID = w.WarehouseID AND ps.OnHandQty > 0) AS ProductCount,
        (SELECT IFNULL(SUM(ps.OnHandQty), 0) FROM ProductStocks ps WHERE ps.WarehouseID = w.WarehouseID) AS TotalStock
      FROM Warehouses w
      WHERE w.IsActive = 1
      ORDER BY w.WarehouseName ASC
    `;

    const result = await executeQuery(query);

    return NextResponse.json({
      success: true,
      message: 'Warehouses fetched successfully',
      count: result.recordset.length,
      data: result.recordset,
    });
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch warehouses', error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/warehouses
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { warehouseName, address, city, country } = body;

    if (!warehouseName) {
      return NextResponse.json(
        { success: false, message: 'Warehouse name is required' },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO Warehouses (WarehouseName, Address, City, Country)
      VALUES (?, ?, ?, ?)
    `;

    await executeQuery(insertQuery, {
      warehouseName,
      address: address || null,
      city: city || null,
      country: country || null
    });

    const selectQuery = `SELECT * FROM Warehouses WHERE WarehouseID = LAST_INSERT_ID()`;
    const result = await executeQuery(selectQuery);

    return NextResponse.json({
      success: true,
      message: 'Warehouse created successfully',
      data: result[0],
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating warehouse:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create warehouse', error: error.message },
      { status: 500 }
    );
  }
}
