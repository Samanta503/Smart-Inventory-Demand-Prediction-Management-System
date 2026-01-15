/**
 * Categories API Route
 * ====================
 * 
 * GET  /api/categories - Returns all categories
 * POST /api/categories - Creates a new category
 */

import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

/**
 * GET /api/categories
 * Fetches all categories from the database
 */
export async function GET() {
  try {
    const query = `
      SELECT 
        c.CategoryID,
        c.CategoryName,
        c.Description,
        c.CreatedAt,
        c.UpdatedAt,
        -- Count products in each category
        (SELECT COUNT(*) FROM Products p WHERE p.CategoryID = c.CategoryID) AS ProductCount
      FROM Categories c
      ORDER BY c.CategoryName ASC
    `;

    const result = await executeQuery(query);

    return NextResponse.json({
      success: true,
      message: 'Categories fetched successfully',
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch categories',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/categories
 * Creates a new category
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { categoryName, description } = body;

    // Validation
    if (!categoryName) {
      return NextResponse.json(
        {
          success: false,
          message: 'Category name is required',
        },
        { status: 400 }
      );
    }

    // Check for duplicate
    const checkQuery = `SELECT CategoryID FROM Categories WHERE CategoryName = @categoryName`;
    const checkResult = await executeQuery(checkQuery, { categoryName });

    if (checkResult.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Category already exists',
        },
        { status: 409 }
      );
    }

    // Insert new category
    const insertQuery = `
      INSERT INTO Categories (CategoryName, Description)
      VALUES (@categoryName, @description)
    `;

    await executeQuery(insertQuery, {
      categoryName,
      description: description || null,
    });

    // Get the inserted category
    const getInsertedQuery = `SELECT * FROM Categories WHERE CategoryName = @categoryName`;
    const result = await executeQuery(getInsertedQuery, { categoryName });

    return NextResponse.json(
      {
        success: true,
        message: 'Category created successfully',
        data: result[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create category',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
