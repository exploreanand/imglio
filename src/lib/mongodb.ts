import { MongoClient, Db } from 'mongodb';

// Skip MongoDB connection if URI is not available
const shouldSkipConnection = !process.env.MONGODB_URI;

if (!shouldSkipConnection && !process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env.MONGODB_URI || '';
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  useUnifiedTopology: true,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (shouldSkipConnection) {
  // Create a dummy promise that resolves to null during build time
  clientPromise = Promise.resolve(null as any);
} else if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
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
