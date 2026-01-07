/**
 * Sales API Route
 * ===============
 * 
 * GET  /api/sales - Returns all sales records
 * POST /api/sales - Creates a new sale record
 * 
 * When a sale is created:
 * 1. The sale record is inserted into the Sales table
 * 2. A trigger automatically decreases the product stock
 * 3. If stock falls below reorder level, an alert is created
 */

import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

/**
 * GET /api/sales
 * Fetches all sales records with product details
 */
export async function GET() {
  try {
    const query = `
      SELECT 
        s.SaleID,
        s.ProductID,
        p.ProductCode,
        p.ProductName,
        c.CategoryName,
        s.Quantity,
        s.UnitPrice,
        s.TotalAmount,
        s.SaleDate,
        s.CustomerName,
        s.InvoiceNumber,
        s.Notes,
        s.CreatedBy,
        s.CreatedAt,
        -- Calculate profit for this sale
        (s.TotalAmount - (s.Quantity * p.CostPrice)) AS Profit
      FROM Sales s
      INNER JOIN Products p ON s.ProductID = p.ProductID
      INNER JOIN Categories c ON p.CategoryID = c.CategoryID
      ORDER BY s.SaleDate DESC, s.SaleID DESC
    `;

    const result = await executeQuery(query);

    // Calculate summary
    const summary = {
      totalSales: result.recordset.length,
      totalRevenue: result.recordset.reduce(
        (sum, s) => sum + parseFloat(s.TotalAmount || 0),
        0
      ).toFixed(2),
      totalProfit: result.recordset.reduce(
        (sum, s) => sum + parseFloat(s.Profit || 0),
        0
      ).toFixed(2),
    };

    return NextResponse.json({
      success: true,
      message: 'Sales fetched successfully',
      summary,
      data: result.recordset,
    });
  } catch (error) {
    console.error('Error fetching sales:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch sales',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sales
 * Creates a new sale record
 * 
 * Request body should contain:
 * - productId: number (required) - ID of the product being sold
 * - quantity: number (required) - Number of units sold
 * - unitPrice: number (optional) - Price per unit (defaults to product's selling price)
 * - customerName: string (optional) - Customer name
 * - invoiceNumber: string (optional) - Invoice reference
 * - notes: string (optional) - Additional notes
 * - createdBy: string (optional) - Who processed the sale
 * 
 * NOTE: The database trigger will automatically:
 * - Decrease the product stock
 * - Create a StockLedger entry
 * - Create an InventoryAlert if stock falls below reorder level
 */
export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();

    const {
      productId,
      quantity,
      unitPrice,
      customerName,
      invoiceNumber,
      notes,
      createdBy,
    } = body;

    // ===============================
    // VALIDATION
    // ===============================

    // Check required fields
    if (!productId || !quantity) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
          requiredFields: ['productId', 'quantity'],
        },
        { status: 400 }
      );
    }

    // Validate quantity
    if (quantity <= 0 || !Number.isInteger(quantity)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Quantity must be a positive integer',
        },
        { status: 400 }
      );
    }

    // ===============================
    // CHECK PRODUCT EXISTS AND HAS STOCK
    // ===============================

    const productQuery = `
      SELECT 
        ProductID,
        ProductName,
        CurrentStock,
        SellingPrice,
        IsActive
      FROM Products 
      WHERE ProductID = @productId
    `;

    const productResult = await executeQuery(productQuery, { productId });

    // Check if product exists
    if (productResult.recordset.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product not found',
        },
        { status: 404 }
      );
    }

    const product = productResult.recordset[0];

    // Check if product is active
    if (!product.IsActive) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product is not available for sale',
        },
        { status: 400 }
      );
    }

    // Check if enough stock is available
    if (product.CurrentStock < quantity) {
      return NextResponse.json(
        {
          success: false,
          message: `Insufficient stock. Available: ${product.CurrentStock}, Requested: ${quantity}`,
          availableStock: product.CurrentStock,
        },
        { status: 400 }
      );
    }

    // ===============================
    // INSERT SALE RECORD
    // ===============================

    // Use provided unit price or default to product's selling price
    const finalUnitPrice = unitPrice !== undefined ? unitPrice : product.SellingPrice;

    // Generate invoice number if not provided
    const finalInvoiceNumber = invoiceNumber || `INV-${Date.now()}`;

    const insertQuery = `
      INSERT INTO Sales (
        ProductID,
        Quantity,
        UnitPrice,
        SaleDate,
        CustomerName,
        InvoiceNumber,
        Notes,
        CreatedBy
      )
      OUTPUT 
        INSERTED.SaleID,
        INSERTED.ProductID,
        INSERTED.Quantity,
        INSERTED.UnitPrice,
        INSERTED.TotalAmount,
        INSERTED.SaleDate,
        INSERTED.CustomerName,
        INSERTED.InvoiceNumber,
        INSERTED.Notes,
        INSERTED.CreatedBy,
        INSERTED.CreatedAt
      VALUES (
        @productId,
        @quantity,
        @unitPrice,
        GETDATE(),
        @customerName,
        @invoiceNumber,
        @notes,
        @createdBy
      )
    `;

    const result = await executeQuery(insertQuery, {
      productId,
      quantity,
      unitPrice: finalUnitPrice,
      customerName: customerName || null,
      invoiceNumber: finalInvoiceNumber,
      notes: notes || null,
      createdBy: createdBy || 'System',
    });

    // Get updated stock after the trigger has executed
    const updatedProductQuery = `
      SELECT CurrentStock FROM Products WHERE ProductID = @productId
    `;
    const updatedProduct = await executeQuery(updatedProductQuery, { productId });

    // Prepare response data
    const saleRecord = result.recordset[0];
    const responseData = {
      ...saleRecord,
      productName: product.ProductName,
      previousStock: product.CurrentStock,
      newStock: updatedProduct.recordset[0].CurrentStock,
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Sale recorded successfully',
        data: responseData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating sale:', error);

    // Check for specific error from trigger
    if (error.message && error.message.includes('Insufficient stock')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Insufficient stock to complete this sale',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create sale',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
