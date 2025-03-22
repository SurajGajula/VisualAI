import { NextResponse } from 'next/server';
import { verifyToken, getUserById } from '@/lib/db/models/auth';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(token) as { id: number };
    
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

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
      path: '/',
    });
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to logout' },
      { status: 500 }
    );
  }
} 