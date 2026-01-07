/**
 * Purchases API Route
 * ===================
 * 
 * GET  /api/purchases - Returns all purchase records
 * POST /api/purchases - Creates a new purchase (stock in)
 * 
 * When a purchase is created:
 * 1. The purchase record is inserted into the Purchases table
 * 2. A trigger automatically increases the product stock
 * 3. A StockLedger entry is created for audit trail
 */

import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

/**
 * GET /api/purchases
 * Fetches all purchase records
 */
export async function GET() {
  try {
    const query = `
      SELECT 
        pur.PurchaseID,
        pur.ProductID,
        p.ProductCode,
        p.ProductName,
        pur.SupplierID,
        s.SupplierName,
        pur.Quantity,
        pur.UnitCost,
        pur.TotalCost,
        pur.PurchaseDate,
        pur.ReferenceNumber,
        pur.Notes,
        pur.CreatedBy,
        pur.CreatedAt
      FROM Purchases pur
      INNER JOIN Products p ON pur.ProductID = p.ProductID
      INNER JOIN Suppliers s ON pur.SupplierID = s.SupplierID
      ORDER BY pur.PurchaseDate DESC, pur.PurchaseID DESC
    `;

    const result = await executeQuery(query);

    // Calculate summary
    const summary = {
      totalPurchases: result.recordset.length,
      totalCost: result.recordset.reduce(
        (sum, p) => sum + parseFloat(p.TotalCost || 0),
        0
      ).toFixed(2),
      totalUnits: result.recordset.reduce(
        (sum, p) => sum + parseInt(p.Quantity || 0),
        0
      ),
    };

    return NextResponse.json({
      success: true,
      message: 'Purchases fetched successfully',
      summary,
      data: result.recordset,
    });
  } catch (error) {
    console.error('Error fetching purchases:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch purchases',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/purchases
 * Creates a new purchase record (stock in)
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      productId,
      supplierId,
      quantity,
      unitCost,
      referenceNumber,
      notes,
      createdBy,
    } = body;

    // Validation
    if (!productId || !supplierId || !quantity || unitCost === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
          requiredFields: ['productId', 'supplierId', 'quantity', 'unitCost'],
        },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Quantity must be greater than 0',
        },
        { status: 400 }
      );
    }

    if (unitCost < 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unit cost cannot be negative',
        },
        { status: 400 }
      );
    }

    // Check product exists
    const productQuery = `SELECT ProductID, ProductName, CurrentStock FROM Products WHERE ProductID = @productId`;
    const productResult = await executeQuery(productQuery, { productId });

    if (productResult.recordset.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product not found',
        },
        { status: 404 }
      );
    }

    const previousStock = productResult.recordset[0].CurrentStock;

    // Insert purchase (trigger will update stock)
    const insertQuery = `
      INSERT INTO Purchases (
        ProductID, SupplierID, Quantity, UnitCost, 
        ReferenceNumber, Notes, CreatedBy
      )
      OUTPUT INSERTED.*
      VALUES (
        @productId, @supplierId, @quantity, @unitCost,
        @referenceNumber, @notes, @createdBy
      )
    `;

    const result = await executeQuery(insertQuery, {
      productId,
      supplierId,
      quantity,
      unitCost,
      referenceNumber: referenceNumber || `PO-${Date.now()}`,
      notes: notes || null,
      createdBy: createdBy || 'System',
    });

    // Get updated stock
    const updatedProductQuery = `SELECT CurrentStock FROM Products WHERE ProductID = @productId`;
    const updatedProduct = await executeQuery(updatedProductQuery, { productId });

    return NextResponse.json(
      {
        success: true,
        message: 'Purchase recorded successfully',
        data: {
          ...result.recordset[0],
          previousStock,
          newStock: updatedProduct.recordset[0].CurrentStock,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating purchase:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create purchase',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
