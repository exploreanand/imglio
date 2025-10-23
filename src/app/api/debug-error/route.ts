import { NextRequest, NextResponse } from 'next/server';
import { safeAuth } from '@/lib/auth-helper';

export async function GET(request: NextRequest) {
  try {
    console.log('Debug error endpoint called');
    
    // Test auth
    const session = await safeAuth();
    console.log('Session result:', session ? 'authenticated' : 'not authenticated');
    
    return NextResponse.json({
      success: true,
      message: 'Debug endpoint working',
      session: session ? 'authenticated' : 'not authenticated',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Debug error endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
