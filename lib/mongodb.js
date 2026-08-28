import mongoose from "mongoose";
import dns from "dns";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // ignore in edge/restricted runtimes
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    throw new Error("Please define MONGO_URI in your environment variables");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
export default connectDB;