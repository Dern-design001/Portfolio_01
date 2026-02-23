const { MongoClient } = require('mongodb');

// Module-level cache for connection reuse across serverless invocations
let cachedClient = null;
let cachedDb = null;

/**
 * Connects to MongoDB Atlas with connection pooling optimized for serverless
 * Reuses existing connections across warm starts to improve performance
 * 
 * @returns {Promise<{db: Db, client: MongoClient}>} MongoDB database and client instances
 * @throws {Error} If connection fails or MONGODB_URI is not configured
 */
async function connectToDatabase() {
  // Return cached connection if available (warm start)
  if (cachedClient && cachedDb) {
    console.log('Using cached MongoDB connection');
    return { db: cachedDb, client: cachedClient };
  }

  // Validate environment variable
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    const error = new Error(
      'MONGODB_URI environment variable is not defined. ' +
      'Please configure it in your .env file or Vercel environment variables.'
    );
    console.error('MongoDB connection error:', error.message);
    throw error;
  }

  try {
    console.log('Establishing new MongoDB connection...');
    
    // Create new client with connection pooling configuration
    const client = new MongoClient(uri, {
      maxPoolSize: 10, // Appropriate pool size for serverless
      minPoolSize: 1,
      maxIdleTimeMS: 60000, // Close idle connections after 60 seconds
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if can't connect
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    // Connect to MongoDB
    await client.connect();
    
    // Get database instance (uses database name from connection string)
    const db = client.db();
    
    console.log('MongoDB connection established successfully');
    
    // Cache the connection for reuse
    cachedClient = client;
    cachedDb = db;
    
    return { db, client };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    
    // Provide descriptive error messages based on error type
    if (error.name === 'MongoServerSelectionError') {
      throw new Error(
        'Unable to connect to MongoDB Atlas. Please check: ' +
        '1) Your connection string is correct, ' +
        '2) Your IP address is whitelisted in MongoDB Atlas, ' +
        '3) Your cluster is running. ' +
        `Original error: ${error.message}`
      );
    } else if (error.name === 'MongoParseError') {
      throw new Error(
        'Invalid MongoDB connection string format. ' +
        'Please verify your MONGODB_URI environment variable. ' +
        `Original error: ${error.message}`
      );
    } else if (error.message.includes('authentication')) {
      throw new Error(
        'MongoDB authentication failed. Please verify your username and password. ' +
        `Original error: ${error.message}`
      );
    } else {
      throw new Error(
        `MongoDB connection error: ${error.message}`
      );
    }
  }
}

module.exports = { connectToDatabase };
