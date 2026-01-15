/**
 * Products API Route
 * ==================
 * 
 * Handles GET (list all products) and POST (add new product) requests
 * 
 * GET  /api/products - Returns all products with category and supplier info
 * POST /api/products - Creates a new product
 */

import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

/**
 * GET /api/products
 * Fetches all products from the database with their category and supplier details
 */
export async function GET() {
  try {
    // SQL query to get all products with related data
    // We use INNER JOIN to include category and supplier names
    const query = `
      SELECT 
        p.ProductID,
        p.ProductCode,
        p.ProductName,
        p.Description,
        p.CategoryID,
        c.CategoryName,
        p.SupplierID,
        s.SupplierName,
        p.Unit,
        p.CostPrice,
        p.SellingPrice,
        p.CurrentStock,
        p.ReorderLevel,
        p.IsActive,
        p.CreatedAt,
        p.UpdatedAt,
        -- Calculate profit margin for each product
        (p.SellingPrice - p.CostPrice) AS ProfitMargin,
        -- Calculate total stock value
        (p.CurrentStock * p.CostPrice) AS StockValue,
        -- Determine stock status
        CASE 
          WHEN p.CurrentStock = 0 THEN 'Out of Stock'
          WHEN p.CurrentStock <= p.ReorderLevel THEN 'Low Stock'
          ELSE 'In Stock'
        END AS StockStatus
      FROM Products p
      INNER JOIN Categories c ON p.CategoryID = c.CategoryID
      INNER JOIN Suppliers s ON p.SupplierID = s.SupplierID
      WHERE p.IsActive = 1
      ORDER BY p.ProductName ASC
    `;

    // Execute the query
    const result = await executeQuery(query);

    // Return the products as JSON
    // result is an array of rows in MySQL
    return NextResponse.json({
      success: true,
      message: 'Products fetched successfully',
      count: result.recordset.length,
      data: result.recordset,
    });
  } catch (error) {
    // Log the error for debugging
    console.error('Error fetching products:', error);

    // Return error response
    // Never expose detailed error messages in production!
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch products',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * Creates a new product in the database
 * 
 * Request body should contain:
 * - productCode: string (required, unique)
 * - productName: string (required)
 * - description: string (optional)
 * - categoryId: number (required)
 * - supplierId: number (required)
 * - unit: string (optional, default: 'pieces')
 * - costPrice: number (required)
 * - sellingPrice: number (required)
 * - currentStock: number (optional, default: 0)
 * - reorderLevel: number (optional, default: 10)
 */
export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();

    // Destructure required fields from the body
    const {
      productCode,
      productName,
      description,
      categoryId,
      supplierId,
      unit = 'pieces',
      costPrice,
      sellingPrice,
      currentStock = 0,
      reorderLevel = 10,
    } = body;

    // ===============================
    // VALIDATION
    // ===============================
    
    // Check for required fields
    if (!productCode || !productName || !categoryId || !supplierId || costPrice === undefined || sellingPrice === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
          requiredFields: ['productCode', 'productName', 'categoryId', 'supplierId', 'costPrice', 'sellingPrice'],
        },
        { status: 400 }
      );
    }

    // Validate price logic
    if (sellingPrice < costPrice) {
      return NextResponse.json(
        {
          success: false,
          message: 'Selling price cannot be less than cost price',
        },
        { status: 400 }
      );
    }

    // Validate numeric values
    if (costPrice < 0 || sellingPrice < 0 || currentStock < 0 || reorderLevel < 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Price and stock values cannot be negative',
        },
        { status: 400 }
      );
    }

    // ===============================
    // CHECK FOR DUPLICATE PRODUCT CODE
    // ===============================
    
    const checkQuery = `
      SELECT ProductID FROM Products WHERE ProductCode = @productCode
    `;
    const checkResult = await executeQuery(checkQuery, { productCode });
    
    if (checkResult.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product code already exists',
        },
        { status: 409 } // 409 Conflict
      );
    }

    // ===============================
    // INSERT NEW PRODUCT
    // ===============================
    
    const insertQuery = `
      INSERT INTO Products (
        ProductCode,
        ProductName,
        Description,
        CategoryID,
        SupplierID,
        Unit,
        CostPrice,
        SellingPrice,
        CurrentStock,
        ReorderLevel,
        IsActive
      )
      VALUES (
        @productCode,
        @productName,
        @description,
        @categoryId,
        @supplierId,
        @unit,
        @costPrice,
        @sellingPrice,
        @currentStock,
        @reorderLevel,
        1
      )
    `;

    // Execute insert
    await executeQuery(insertQuery, {
      productCode,
      productName,
      description: description || null,
      categoryId,
      supplierId,
      unit,
      costPrice,
      sellingPrice,
      currentStock,
      reorderLevel,
    });

    // Get the inserted product
    const getInsertedQuery = `SELECT * FROM Products WHERE ProductCode = @productCode`;
    const result = await executeQuery(getInsertedQuery, { productCode });

    

    // Return the created product
    return NextResponse.json(
      {
        success: true,
        message: 'Product created successfully',
        data: result[0],
      },
      { status: 201 } // 201 Created
    );
  } catch (error) {
    console.error('Error creating product:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create product',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
