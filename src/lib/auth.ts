// Conditionally export from the appropriate auth configuration
// This prevents MongoDB imports when not needed

const shouldUseMongoDB = !!process.env.MONGODB_URI;

if (shouldUseMongoDB) {
  // Export MongoDB-based auth when MONGODB_URI is available
  export * from './auth-mongodb';
} else {
  // Export JWT-based auth when MongoDB is not available
  export * from './auth-jwt';
}
