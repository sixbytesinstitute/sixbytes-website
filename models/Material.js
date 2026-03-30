import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
  title: String,
  fileUrl: String,
  class: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Material ||
  mongoose.model("Material", materialSchema);