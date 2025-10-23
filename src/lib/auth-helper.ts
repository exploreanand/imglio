import { auth } from './auth';

export async function safeAuth() {
  try {
    return await auth();
  } catch (error) {
    // During build time or if MongoDB is not available, return null
    console.error('Auth error:', error);
    return null;
  }
}
