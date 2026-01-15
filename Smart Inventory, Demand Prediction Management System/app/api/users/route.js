/**
 * Users API Route
 * ===============
 * 
 * GET /api/users - Returns all users (for dropdowns)
 */

import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

/**
 * GET /api/users
 */
export async function GET() {
  try {
    const query = `
      SELECT 
        UserID,
        FullName,
        Username,
        Role,
        IsActive,
        CreatedAt
      FROM Users
      WHERE IsActive = 1
      ORDER BY FullName ASC
    `;

    const result = await executeQuery(query);

    return NextResponse.json({
      success: true,
      message: 'Users fetched successfully',
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users', error: error.message },
      { status: 500 }
    );
  }
}
