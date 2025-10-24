import { MongoClient, Db } from 'mongodb';

// Skip MongoDB connection if URI is not available
const shouldSkipConnection = !process.env.MONGODB_URI;

// Create a safe client promise
let clientPromise: Promise<MongoClient>;

if (shouldSkipConnection) {
  console.log('MongoDB: Skipping connection - MONGODB_URI not set');
  // Create a dummy promise that resolves to null when MongoDB is not available
  clientPromise = Promise.resolve(null as any);
} else {
  const uri = process.env.MONGODB_URI!;
  console.log('MongoDB: Initializing connection...');
  
  const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000, // Increased timeout
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000, // Added connection timeout
    useUnifiedTopology: true,
  };

  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      const client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect().catch(error => {
        console.error('MongoDB: Connection failed in development:', error.message);
        throw error;
      });
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    const client = new MongoClient(uri, options);
    clientPromise = client.connect().catch(error => {
      console.error('MongoDB: Connection failed in production:', error.message);
      // Log specific error types for easier debugging
      if (error.message.includes('ENOTFOUND')) {
        console.error('MongoDB: DNS resolution failed - check cluster URL');
      } else if (error.message.includes('authentication failed')) {
        console.error('MongoDB: Authentication failed - check username/password');
      } else if (error.message.includes('IP not in whitelist')) {
        console.error('MongoDB: IP not in whitelist - check MongoDB Atlas Network Access');
      } else if (error.message.includes('timeout')) {
        console.error('MongoDB: Connection timeout - check network connectivity');
      }
      throw error;
    });
  }
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

export async function getDatabase(): Promise<Db> {
  if (shouldSkipConnection) {
    throw new Error('MongoDB connection is not available - MONGODB_URI not set');
  }
  
  try {
    const client = await clientPromise;
    if (!client) {
      throw new Error('MongoDB client is not available');
    }
    
    // Test the connection by pinging the database
    await client.db('admin').command({ ping: 1 });
    console.log('MongoDB: Connection verified successfully');
    
    return client.db('imglio');
  } catch (error) {
    console.error('MongoDB: Database access failed:', error);
    throw error;
  }
}
