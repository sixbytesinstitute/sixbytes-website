import mongoose from "mongoose";
import { CLASSES, STREAMS, ROLES, SUBJECTS } from "@/lib/constants";

// Re-export constants for backward compatibility
export { CLASSES, STREAMS, ROLES, SUBJECTS };

// ─── Schema ─────────────────────────────────────────────
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  role: {
    type: String,
    required: true,
    enum: ROLES,
    index: true,
  },

  // ── Student-specific fields ───────────────────────────
  class: {
    type: String,
    enum: [...CLASSES, ""],
    default: "",
    index: true,
  },
  stream: {
    type: String,
    enum: STREAMS,
    default: "N/A",
  },

  // ── Faculty-specific fields ───────────────────────────
  subjects: {
    type: [String],
    default: [],
  },
  assignedClasses: {
    type: [String],
    default: [],
  },

  // ── Account status ────────────────────────────────────
  mustChangePassword: {
    type: Boolean,
    default: true,
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },

  // ── Profile avatar ────────────────────────────────────
  avatar: {
    type: String,
    default: "",
    trim: true,
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

// Update `updatedAt` on every save
UserSchema.pre("save", function () {
  this.updatedAt = new Date();
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
