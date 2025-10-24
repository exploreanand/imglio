import { auth } from './auth';

export async function safeAuth() {
  try {
    return await auth();
  } catch (error) {
    // Log the error for debugging
    console.error('Auth error:', error);
    
    // Return null to prevent app crashes
    return null;
  }
}
