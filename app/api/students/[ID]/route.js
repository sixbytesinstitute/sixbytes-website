import { connectDB } from "@/lib/mongodb";
import Student from "@/models/Student";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    await Student.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: "Student deleted",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
