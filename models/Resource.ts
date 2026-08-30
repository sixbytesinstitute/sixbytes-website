import mongoose from "mongoose";
import { CLASSES } from "./User";

const ResourceSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: [true, "URL slug is required"],
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  metaDescription: {
    type: String,
    required: [true, "Meta description is required for SEO"],
    maxlength: 160,
  },
  subject: {
    type: String,
    required: [true, "Subject is required"],
    index: true,
  },
  targetClass: {
    type: String,
    required: true,
    enum: [...CLASSES, "All"],
  },
  board: {
    type: String,
    default: "CBSE & ICSE",
    index: true,
  },
  chapter: {
    type: String,
    default: null,
  },

  // Rich text HTML content — the actual article body
  content: {
    type: String,
    required: [true, "Article content is required"],
  },

  keywords: {
    type: [String],
    default: [],
  },
  published: {
    type: Boolean,
    default: false,
    index: true,
  },
  viewCount: {
    type: Number,
    default: 0,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-update `updatedAt` on save
ResourceSchema.pre("save", function () {
  this.updatedAt = new Date();
});

export default mongoose.models.Resource ||
  mongoose.model("Resource", ResourceSchema);
