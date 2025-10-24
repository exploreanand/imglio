import { auth } from './auth';

export async function safeAuth() {
  try {
    return await auth();
  } catch (error) {
    // Log the error for debugging
    console.error('Auth error:', error);
    
    // Check if it's a MongoDB-related error
    if (error instanceof Error) {
      if (error.message.includes('MongoDB') || 
          error.message.includes('connection') ||
          error.message.includes('ENOTFOUND') ||
          error.message.includes('authentication failed') ||
          error.message.includes('IP not in whitelist') ||
          error.message.includes('timeout')) {
        console.log('MongoDB connection issue detected, returning null session');
        return null;
      }
    }
    
    // For other errors, still return null to prevent app crashes
    return null;
  }
}
