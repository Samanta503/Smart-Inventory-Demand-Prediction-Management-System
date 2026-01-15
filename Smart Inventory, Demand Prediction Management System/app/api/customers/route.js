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
    const query = `
      SELECT 
        CustomerID,
        CustomerName,
        Email,
        Phone,
        Address,
        City,
        Country,
        IsActive,
        CreatedAt,
        UpdatedAt
      FROM Customers
      WHERE IsActive = 1
      ORDER BY CustomerName ASC
    `;

    const result = await executeQuery(query);

    return NextResponse.json({
      success: true,
      message: 'Customers fetched successfully',
      count: result.recordset.length,
      data: result.recordset,
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
