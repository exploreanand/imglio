// Conditionally import and export the appropriate auth configuration
// This prevents MongoDB imports when not needed

const shouldUseMongoDB = !!process.env.MONGODB_URI;

let authExports: any;

if (shouldUseMongoDB) {
  // Import MongoDB-based auth when MONGODB_URI is available
  authExports = require('./auth-mongodb');
} else {
  // Import JWT-based auth when MongoDB is not available
  authExports = require('./auth-jwt');
}

// Export the appropriate auth functions
export const handlers = authExports.handlers;
export const auth = authExports.auth;
export const signIn = authExports.signIn;
export const signOut = authExports.signOut;
