/**
 * Login API Route
 * ===============
 * 
 * POST /api/auth/login - Authenticate user with username and password
 */

import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Find user by username
    const query = `
      SELECT UserID, FullName, Username, PasswordHash, Role, IsActive
      FROM Users
      WHERE Username = ?
    `;
    const result = await executeQuery(query, [username]);

    if (result.recordset.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const user = result.recordset[0];

    // Check if user is active
    if (!user.IsActive) {
      return NextResponse.json(
        { success: false, message: 'Your account has been deactivated. Contact admin.' },
        { status: 403 }
      );
    }

    // Verify password
    // Support both bcrypt hashed passwords and legacy plain-text passwords
    let passwordValid = false;

    if (user.PasswordHash.startsWith('$2a$') || user.PasswordHash.startsWith('$2b$')) {
      // Bcrypt hashed password
      passwordValid = await bcrypt.compare(password, user.PasswordHash);
    } else {
      // Legacy plain-text password (from seed data)
      passwordValid = (password === user.PasswordHash);
    }

    if (!passwordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Return user info (excluding password)
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        userId: user.UserID,
        fullName: user.FullName,
        username: user.Username,
        role: user.Role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Login failed. Please try again.', error: error.message },
      { status: 500 }
    );
  }
}
