import mongoose from "mongoose";
import dns from "dns";

// Only use custom DNS on local Windows dev to avoid breaking DNS in AWS/Vercel serverless
if (process.platform === "win32" && !process.env.VERCEL) {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  } catch (e) {
    // ignore in edge/restricted runtimes
  }
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
    const serverSelectionTimeoutMS = Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || 10000);
    const connectTimeoutMS = Number(process.env.MONGO_CONNECT_TIMEOUT_MS || 10000);

    cached.promise = mongoose
      .connect(MONGO_URI, { serverSelectionTimeoutMS, connectTimeoutMS })
      .then((mongoose) => mongoose)
      .catch((error) => {
        cached.promise = null;
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
export default connectDB;
