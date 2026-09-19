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

const FALLBACK_URI =
  "mongodb://admin:admin0@ac-ejwcdln-shard-00-00.6fz9hht.mongodb.net:27017,ac-ejwcdln-shard-00-01.6fz9hht.mongodb.net:27017,ac-ejwcdln-shard-00-02.6fz9hht.mongodb.net:27017/?ssl=true&authSource=admin&replicaSet=atlas-r043ne-shard-0&retryWrites=true&w=majority";

export async function connectDB() {
  let MONGO_URI = process.env.MONGO_URI;

  // Validate or fallback to MongoDB Atlas URI if unset or incorrectly set
  if (!MONGO_URI || (!MONGO_URI.startsWith("mongodb://") && !MONGO_URI.startsWith("mongodb+srv://"))) {
    MONGO_URI = FALLBACK_URI;
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
