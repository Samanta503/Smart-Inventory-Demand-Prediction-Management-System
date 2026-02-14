/**
 * Suppliers API Route
 * ===================
 * 
 * GET  /api/suppliers - Returns all suppliers with their categories
 * POST /api/suppliers - Creates a new supplier with category assignments
 * PATCH /api/suppliers - Updates supplier categories
 */

import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

/**
 * GET /api/suppliers
 * Fetches all suppliers with their statistics and categories (derived from products)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    let query = `
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
    `;

    // If categoryId is provided, filter suppliers who have products in that category
    if (categoryId) {
      query += `
        WHERE s.SupplierID IN (
          SELECT DISTINCT p.SupplierID FROM Products p WHERE p.CategoryID = ?
        )
      `;
    }

    query += ` ORDER BY s.SupplierName ASC`;

    const result = await executeQuery(query, categoryId ? [parseInt(categoryId)] : []);
    const suppliers = result.recordset;

    // Derive categories for each supplier from their products
    const categoriesQuery = `
      SELECT DISTINCT
        p.SupplierID,
        c.CategoryID,
        c.CategoryName
      FROM Products p
      INNER JOIN Categories c ON p.CategoryID = c.CategoryID
      ORDER BY c.CategoryName
    `;
    const categoriesResult = await executeQuery(categoriesQuery);
    
    // Group categories by supplier
    const categoriesBySupplier = {};
    categoriesResult.recordset.forEach(row => {
      if (!categoriesBySupplier[row.SupplierID]) {
        categoriesBySupplier[row.SupplierID] = [];
      }
      categoriesBySupplier[row.SupplierID].push({
        CategoryID: row.CategoryID,
        CategoryName: row.CategoryName
      });
    });

    // Attach categories to suppliers
    const suppliersWithCategories = suppliers.map(supplier => ({
      ...supplier,
      categories: categoriesBySupplier[supplier.SupplierID] || []
    }));

    return NextResponse.json({
      success: true,
      message: 'Suppliers fetched successfully',
      count: suppliersWithCategories.length,
      data: suppliersWithCategories,
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
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await executeQuery(insertQuery, [
      supplierName,
      contactPerson || null,
      email || null,
      phone || null,
      address || null,
      city || null,
      country || null,
    ]);

    // Get the inserted supplier ID
    const getInsertedQuery = `SELECT LAST_INSERT_ID() AS SupplierID`;
    const insertedResult = await executeQuery(getInsertedQuery);
    const supplierId = insertedResult.recordset[0].SupplierID;

    // Get the full supplier
    const getSupplierQuery = `SELECT * FROM Suppliers WHERE SupplierID = ?`;
    const result = await executeQuery(getSupplierQuery, [supplierId]);

    return NextResponse.json(
      {
        success: true,
        message: 'Supplier created successfully',
        data: result.recordset[0],
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

/**
 * PATCH /api/suppliers
 * Updates supplier details
 */
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { supplierId, supplierName, contactPerson, email, phone, address, city, country } = body;

    if (!supplierId) {
      return NextResponse.json(
        { success: false, message: 'Supplier ID is required' },
        { status: 400 }
      );
    }

    const updateQuery = `
      UPDATE Suppliers SET
        SupplierName = COALESCE(?, SupplierName),
        ContactPerson = COALESCE(?, ContactPerson),
        Email = COALESCE(?, Email),
        Phone = COALESCE(?, Phone),
        Address = COALESCE(?, Address),
        City = COALESCE(?, City),
        Country = COALESCE(?, Country)
      WHERE SupplierID = ?
    `;

    await executeQuery(updateQuery, [
      supplierName || null,
      contactPerson || null,
      email || null,
      phone || null,
      address || null,
      city || null,
      country || null,
      supplierId,
    ]);

    return NextResponse.json({
      success: true,
      message: 'Supplier updated successfully',
    });
  } catch (error) {
    console.error('Error updating supplier:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update supplier',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
