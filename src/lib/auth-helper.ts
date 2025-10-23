import { auth } from './auth';

export async function safeAuth() {
  try {
    return await auth();
  } catch (error) {
    // During build time or if MongoDB is not available, return null
    console.error('Auth error:', error);
    
    // Check if it's a MongoDB connection error
    if (error instanceof Error) {
      if (error.message.includes('MongoDB') || 
          error.message.includes('connection') ||
          error.message.includes('build time')) {
        console.log('MongoDB connection not available, returning null session');
        return null;
      }
    }
    
    // For other errors, still return null to prevent app crashes
    return null;
  }
}
