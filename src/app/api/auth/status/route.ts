import { NextResponse } from 'next/server';
import { verifyToken, getUserById } from '@/lib/db/models/auth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Get the token from cookies
    const cookieJar = cookies();
    const token = cookieJar.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({
        authenticated: false,
        message: 'Not authenticated'
      });
    }
    
    // Verify the token
    const decoded = verifyToken(token) as { id: number };
    
    // Get the user
    const user = await getUserById(decoded.id);
    
    if (!user) {
      return NextResponse.json({
        authenticated: false,
        message: 'User not found'
      });
    }
    
    return NextResponse.json({
      authenticated: true,
      message: 'Authenticated',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error('Auth status error:', error);
    
    return NextResponse.json({
      authenticated: false,
      message: 'Authentication error',
      error: error instanceof Error ? error.message : String(error)
    });
  }
} 