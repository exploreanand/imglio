import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('imglio');
    
    // Test the connection by pinging the database
    await db.admin().ping();
    
    // Get database stats
    const stats = await db.stats();
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful!',
      database: 'imglio',
      stats: {
        collections: stats.collections,
        dataSize: stats.dataSize,
        storageSize: stats.storageSize
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
