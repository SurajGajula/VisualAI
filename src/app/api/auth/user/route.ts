import { NextResponse } from 'next/server';
import { verifyToken, getUserById } from '@/lib/db/models/auth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Get the token from cookies
    const cookieJar = cookies();
    const token = cookieJar.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Verify the token
    const decoded = verifyToken(token) as { id: number };
    
    // Get the user
    const user = await getUserById(decoded.id);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user
    });
    
  } catch (error) {
    console.error('Auth error:', error);
    
    // Handle token verification error
    if (error instanceof Error && error.message === 'Invalid token') {
      return NextResponse.json(
        { success: false, message: 'Invalid authentication token' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Authentication failed', 
        error: error instanceof Error ? error.message : String(error) 
      }, 
      { status: 500 }
    );
  }
}

// Logout endpoint
export async function POST() {
  // Clear the authentication cookie
  const cookieJar = cookies();
  cookieJar.set('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0, // Expire immediately
    path: '/',
  });
  
  return NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  });
} 