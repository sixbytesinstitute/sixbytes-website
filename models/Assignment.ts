import mongoose from "mongoose";
import { CLASSES } from "./User";

const AssignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Assignment title is required"],
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  targetClass: {
    type: String,
    required: [true, "Target class is required"],
    enum: [...CLASSES, "All"],
    index: true,
  },
  subject: {
    type: String,
    required: [true, "Subject is required"],
    index: true,
  },
  dueDate: {
    type: Date,
    required: [true, "Due date is required"],
  },

  // Google Drive file link (optional attachment)
  fileUrl: {
    type: String,
    default: null,
  },
  fileName: {
    type: String,
    default: null,
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
});

export default mongoose.models.Assignment ||
  mongoose.model("Assignment", AssignmentSchema);
