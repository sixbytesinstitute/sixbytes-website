import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  class: String,

  attendance: [
    {
      date: Date,
      status: String, // present / absent
    },
  ],

  results: [
    {
      subject: String,
      marks: Number,
      total: Number,
    },
  ],

  materials: [
    {
      title: String,
      fileUrl: String,
    },
  ],
});

export default mongoose.models.Student ||
  mongoose.model("Student", StudentSchema);