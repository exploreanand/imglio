import { MongoClient, Db } from 'mongodb';

// Skip MongoDB connection if URI is not available
const shouldSkipConnection = !process.env.MONGODB_URI;

// Create a safe client promise
let clientPromise: Promise<MongoClient>;

if (shouldSkipConnection) {
  // Create a dummy promise that resolves to null when MongoDB is not available
  clientPromise = Promise.resolve(null as any);
} else {
  const uri = process.env.MONGODB_URI!;
  const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
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
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    const client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

export async function getDatabase(): Promise<Db> {
  if (shouldSkipConnection) {
    throw new Error('MongoDB connection is not available - MONGODB_URI not set');
  }
  const client = await clientPromise;
  if (!client) {
    throw new Error('MongoDB client is not available');
  }
  return client.db('imglio');
}
