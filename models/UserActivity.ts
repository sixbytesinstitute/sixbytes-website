import mongoose from "mongoose";

/**
 * UserActivity — Tracks daily student activity for streaks and contribution graphs.
 * One document per user per day. Upserted on each activity event.
 */
const UserActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  /** Date string in YYYY-MM-DD format (UTC) — one doc per user per day */
  date: {
    type: String,
    required: true,
    index: true,
  },
  /** Number of resource pages viewed on this day */
  resourceViews: {
    type: Number,
    default: 0,
  },
  /** Number of tutor questions asked on this day */
  tutorQuestions: {
    type: Number,
    default: 0,
  },
  /** Number of times the student logged in on this day */
  logins: {
    type: Number,
    default: 0,
  },
  /** Total activity count (sum of all actions) for heatmap intensity */
  totalActions: {
    type: Number,
    default: 0,
  },
});

// Compound index for efficient per-user date lookups
UserActivitySchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.models.UserActivity ||
  mongoose.model("UserActivity", UserActivitySchema);
