import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// In development, we can default to a local string if not provided for testing, 
// but for production it must be set.
// For now, I will not throw immediately to allow build without env, but warn.

interface MongooseConn {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: MongooseConn = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (!MONGODB_URI) {
     console.warn('MONGODB_URI not defined in .env.local');
     // throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI || 'mongodb://localhost:27017/kalpavruksha', opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
