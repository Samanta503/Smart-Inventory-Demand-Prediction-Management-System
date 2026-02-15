/**
 * Users API Route
 * ===============
 * 
 * GET  /api/users - Returns all users (Admin view)
 * POST /api/users - Create a new user
 * PUT  /api/users - Update an existing user
 */

import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import bcrypt from 'bcryptjs';

/**
 * GET /api/users
 * Returns all users with their activity summary
 */
export async function GET() {
  try {
    const query = `
      SELECT 
        u.UserID,
        u.FullName,
        u.Username,
        u.Role,
        u.IsActive,
        u.CreatedAt,
        u.UpdatedAt,
        (SELECT COUNT(*) FROM SalesHeaders sh WHERE sh.CreatedByUserID = u.UserID) AS TotalSales,
        (SELECT COUNT(*) FROM PurchaseHeaders ph WHERE ph.CreatedByUserID = u.UserID) AS TotalPurchases
      FROM Users u
      ORDER BY u.CreatedAt DESC
    `;

    const result = await executeQuery(query);

    return NextResponse.json({
      success: true,
      message: 'Users fetched successfully',
      count: result.recordset.length,
      data: result.recordset,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users', error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users
 * Create a new user
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, username, password, role } = body;

    if (!fullName || !username || !password) {
      return NextResponse.json(
        { success: false, message: 'Full name, username and password are required' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const checkQuery = `SELECT UserID FROM Users WHERE Username = ?`;
    const existing = await executeQuery(checkQuery, [username]);
    if (existing.recordset.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Username already exists' },
        { status: 409 }
      );
    }

    // Hash the password before storing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const insertQuery = `
      INSERT INTO Users (FullName, Username, PasswordHash, Role, IsActive)
      VALUES (?, ?, ?, ?, 1)
    `;
    await executeQuery(insertQuery, [fullName, username, hashedPassword, role || 'SALES']);

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create user', error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/users
 * Update an existing user (edit info or toggle active status)
 */
export async function PUT(request) {
  try {
    const body = await request.json();
    const { userId, fullName, username, role, isActive } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    // If only toggling active status
    if (isActive !== undefined && !fullName) {
      const toggleQuery = `UPDATE Users SET IsActive = ? WHERE UserID = ?`;
      await executeQuery(toggleQuery, [isActive ? 1 : 0, userId]);
      return NextResponse.json({
        success: true,
        message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      });
    }

    // Full update
    if (!fullName || !username) {
      return NextResponse.json(
        { success: false, message: 'Full name and username are required' },
        { status: 400 }
      );
    }

    // Check if username is taken by another user
    const checkQuery = `SELECT UserID FROM Users WHERE Username = ? AND UserID != ?`;
    const existing = await executeQuery(checkQuery, [username, userId]);
    if (existing.recordset.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Username already taken by another user' },
        { status: 409 }
      );
    }

    const updateQuery = `
      UPDATE Users 
      SET FullName = ?, Username = ?, Role = ?
      WHERE UserID = ?
    `;
    await executeQuery(updateQuery, [fullName, username, role || 'SALES', userId]);

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update user', error: error.message },
      { status: 500 }
    );
  }
}
