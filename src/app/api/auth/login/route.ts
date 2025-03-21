import { NextResponse } from 'next/server';
import { login } from '@/lib/db/models/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Log in the user
    const { user, token } = await login(email, password);
    
    // Set the token as a cookie
    const cookieJar = cookies();
    cookieJar.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    
    return NextResponse.json({
      success: true,
      message: 'Logged in successfully',
      user
    });
    
  } catch (error) {
    console.error('Login error:', error);
    
    // Handle invalid credentials
    if (error instanceof Error && error.message === 'Invalid credentials') {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to log in', 
        error: error instanceof Error ? error.message : String(error) 
      }, 
      { status: 500 }
    );
  }
} 