import mongoose from "mongoose";

// ─── Constants ──────────────────────────────────────────
export const CLASSES = ["9", "10", "11", "12", "NDA"] as const;
export const STREAMS = ["PCM", "PCB", "General", "Defence", "N/A"] as const;
export const ROLES = ["admin", "faculty", "student"] as const;
export const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Hindi",
  "Social Science",
  "GAT",
  "Computer Science",
] as const;

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
