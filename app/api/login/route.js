import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Student from "@/models/Student";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: "Please provide both email and password",
      });
    }

    // check user (case-insensitive email lookup)
    const user = await Student.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: "Account not found with this email",
      });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({
        success: false,
        error: "Incorrect password. Please try again.",
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        class: user.class || "10",
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json({
      success: false,
      error: "An unexpected server error occurred. Please try again.",
    });
  }
}