import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local')
}

const MONGODB_URI: string = process.env.MONGODB_URI;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let globalWithMongoose = global as typeof globalThis & {
  mongoose: {
    conn: null | typeof mongoose;
    promise: null | Promise<typeof mongoose>;
  };
};

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  try {
    if (globalWithMongoose.mongoose.conn) {
      console.log('Using existing MongoDB connection');
      return globalWithMongoose.mongoose.conn;
    }

    if (!globalWithMongoose.mongoose.promise) {
      const opts = {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
        authSource: 'admin'
      };

      console.log('Creating new MongoDB connection...');
      globalWithMongoose.mongoose.promise = mongoose.connect(MONGODB_URI, opts);
    }

    globalWithMongoose.mongoose.conn = await globalWithMongoose.mongoose.promise;
    console.log('MongoDB connected successfully');
    return globalWithMongoose.mongoose.conn;
  } catch (error: any) {
    console.error('MongoDB connection error:', {
      message: error.message,
      code: error.code,
      codeName: error.codeName
    });
    globalWithMongoose.mongoose.promise = null;
    throw error;
  }
}
