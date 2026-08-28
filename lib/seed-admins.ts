/**
 * Seed script to create admin accounts.
 *
 * Usage: npx tsx lib/seed-admins.ts
 *
 * This script reads environment variables from .env.local manually
 * without requiring the dotenv package.
 */

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { readFileSync } from "fs";
import { resolve } from "path";
import dns from "dns";

// Fix Windows DNS querySrv ECONNREFUSED issue
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // ignore if in constrained environment
}

// ─── Parse .env.local manually ──────────────────────────
function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), ".env.local");
    const content = readFileSync(envPath, "utf-8");
    const lines = content.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) continue;

      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim();

      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    console.error("❌ Could not read .env.local file");
    process.exit(1);
  }
}

loadEnv();

const MONGO_URI = process.env.MONGO_URI;
const ADMIN1_EMAIL = process.env.ADMIN1_EMAIL;
const ADMIN1_PASSWORD = process.env.ADMIN1_PASSWORD;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in .env.local");
  process.exit(1);
}

if (!ADMIN1_EMAIL || !ADMIN1_PASSWORD) {
  console.error("❌ ADMIN1_EMAIL and ADMIN1_PASSWORD are required in .env.local");
  process.exit(1);
}

// Inline schema to avoid module resolution issues with tsx
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  phone: String,
  password: String,
  role: { type: String, enum: ["admin", "faculty", "student"] },
  class: String,
  stream: String,
  subjects: [String],
  assignedClasses: [String],
  mustChangePassword: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function seed() {
  console.log("🔗 Connecting to MongoDB...");
  await mongoose.connect(MONGO_URI as string);
  console.log("✅ Connected to MongoDB");

  const existing = await User.findOne({ email: ADMIN1_EMAIL!.toLowerCase() });
  if (existing) {
    console.log(`⚠️  Admin already exists: ${ADMIN1_EMAIL}`);
  } else {
    const hashed = await bcrypt.hash(ADMIN1_PASSWORD!, 10);
    await User.create({
      name: "Admin",
      email: ADMIN1_EMAIL!.toLowerCase(),
      phone: "0000000000",
      password: hashed,
      role: "admin",
      class: "",
      stream: "N/A",
      mustChangePassword: false,
      isActive: true,
    });
    console.log(`✅ Admin created: ${ADMIN1_EMAIL}`);
  }

  await mongoose.disconnect();
  console.log("🔌 Disconnected from MongoDB");
  console.log("\n✨ Seed complete!");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
