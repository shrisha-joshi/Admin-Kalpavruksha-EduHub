import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseConn {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Properly type the global cache
declare global {
  var mongoose: MongooseConn | undefined;
}

let cached: MongooseConn = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect() {
  if (!MONGODB_URI) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('MONGODB_URI must be defined in production environment');
    }
    console.warn('MONGODB_URI not defined in .env.local, using localhost fallback');
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
