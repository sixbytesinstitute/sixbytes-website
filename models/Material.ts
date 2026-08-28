import mongoose from "mongoose";
import { CLASSES, MATERIAL_CATEGORIES } from "@/lib/constants";

// Re-export for backward compatibility
export { MATERIAL_CATEGORIES };

const MaterialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Material title is required"],
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  fileUrl: {
    type: String,
    required: [true, "File URL (Google Drive link) is required"],
  },
  fileName: {
    type: String,
    default: null,
  },
  class: {
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
  category: {
    type: String,
    required: true,
    enum: MATERIAL_CATEGORIES,
    default: "Class Notes",
    index: true,
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

export default mongoose.models.Material ||
  mongoose.model("Material", MaterialSchema);
