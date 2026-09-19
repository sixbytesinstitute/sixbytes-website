import mongoose from "mongoose";
import fs from "fs";

const TITLE_LIMIT = 60;
const DESCRIPTION_LIMIT = 160;

function truncateAtWord(value, limit) {
  const normalized = String(value || "").trim().replace(/\s+/g, " ");
  if (normalized.length <= limit) return normalized;

  const truncated = normalized.slice(0, limit + 1).trim();
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > Math.floor(limit * 0.6) ? truncated.slice(0, lastSpace) : truncated.slice(0, limit)).trim();
}

// Read MongoDB URI from .env.local
const envContent = fs.readFileSync(".env.local", "utf-8");
let mongoUri = "";
for (const line of envContent.split("\n")) {
  if (line.trim().startsWith("MONGO_URI=")) {
    mongoUri = line.trim().split("=").slice(1).join("=");
    break;
  }
}

if (!mongoUri) {
  console.error("MONGO_URI not found in .env.local");
  process.exit(1);
}

async function fixMetadata() {
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");

  const collection = mongoose.connection.db.collection("resources");
  const all = await collection.find({}).toArray();

  let updatedCount = 0;
  for (const item of all) {
    const updates = {};

    if (item.title && item.title.length > TITLE_LIMIT) {
      updates.title = truncateAtWord(item.title, TITLE_LIMIT);
    }

    if (item.metaDescription && item.metaDescription.length > DESCRIPTION_LIMIT) {
      updates.metaDescription = truncateAtWord(item.metaDescription, DESCRIPTION_LIMIT);
    }

    if (!item.resourceType) {
      if (
        item.slug.includes("questions") ||
        item.slug.includes("solved") ||
        item.slug.includes("pyq") ||
        item.title.toLowerCase().includes("questions") ||
        item.title.toLowerCase().includes("solved")
      ) {
        updates.resourceType = "question_bank";
      } else {
        updates.resourceType = "topic_guide";
      }
    }

    if (!item.targetClass) {
      updates.targetClass = "10";
    }

    if (!item.board) {
      updates.board = "CBSE & ICSE";
    }

    if (item.published === undefined || item.published === null) {
      updates.published = true;
    }

    if (Object.keys(updates).length > 0) {
      await collection.updateOne({ _id: item._id }, { $set: updates });
      console.log(`Updated ${item.slug}:`, updates);
      updatedCount++;
    }
  }

  console.log(`\nDone. Updated ${updatedCount} out of ${all.length} resources.`);
  process.exit(0);
}

fixMetadata().catch((err) => {
  console.error(err);
  process.exit(1);
});
