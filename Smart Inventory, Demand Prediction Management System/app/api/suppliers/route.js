/**
 * Suppliers API Route
 * ===================
 * 
 * GET  /api/suppliers - Returns all suppliers
 * POST /api/suppliers - Creates a new supplier
 */

import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

/**
 * GET /api/suppliers
 * Fetches all suppliers with their statistics
 */
export async function GET() {
  try {
    const query = `
      SELECT 
        s.SupplierID,
        s.SupplierName,
        s.ContactPerson,
        s.Email,
        s.Phone,
        s.Address,
        s.City,
        s.Country,
        s.IsActive,
        s.CreatedAt,
        s.UpdatedAt,
        -- Count products from this supplier
        (SELECT COUNT(*) FROM Products p WHERE p.SupplierID = s.SupplierID) AS ProductCount,
        -- Total inventory value
        (SELECT IFNULL(SUM(p.CurrentStock * p.CostPrice), 0) 
         FROM Products p WHERE p.SupplierID = s.SupplierID) AS TotalInventoryValue
      FROM Suppliers s
      ORDER BY s.SupplierName ASC
    `;

    const result = await executeQuery(query);

    return NextResponse.json({
      success: true,
      message: 'Suppliers fetched successfully',
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching suppliers:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch suppliers',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/suppliers
 * Creates a new supplier
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      supplierName,
      contactPerson,
      email,
      phone,
      address,
      city,
      country,
    } = body;

    // Validation
    if (!supplierName) {
      return NextResponse.json(
        {
          success: false,
          message: 'Supplier name is required',
        },
        { status: 400 }
      );
    }

    // Insert new supplier
    const insertQuery = `
      INSERT INTO Suppliers (
        SupplierName, ContactPerson, Email, Phone, Address, City, Country
      )
      VALUES (
        @supplierName, @contactPerson, @email, @phone, @address, @city, @country
      )
    `;

    await executeQuery(insertQuery, {
      supplierName,
      contactPerson: contactPerson || null,
      email: email || null,
      phone: phone || null,
      address: address || null,
      city: city || null,
      country: country || null,
    });

    // Get the inserted supplier
    const getInsertedQuery = `SELECT * FROM Suppliers ORDER BY SupplierID DESC LIMIT 1`;
    const result = await executeQuery(getInsertedQuery);

    return NextResponse.json(
      {
        success: true,
        message: 'Supplier created successfully',
        data: result[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating supplier:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create supplier',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
