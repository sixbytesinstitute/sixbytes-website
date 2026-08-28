import mongoose from "mongoose";
import { CLASSES } from "./User";

const NoticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Notice title is required"],
  },
  content: {
    type: String,
    required: [true, "Notice content is required"],
  },
  targetClass: {
    type: String,
    default: "All",
    enum: [...CLASSES, "All"],
    index: true,
  },
  priority: {
    type: String,
    default: "normal",
    enum: ["normal", "urgent", "exam_alert"],
  },
  pinned: {
    type: Boolean,
    default: false,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
});

export default mongoose.models.Notice ||
  mongoose.model("Notice", NoticeSchema);
