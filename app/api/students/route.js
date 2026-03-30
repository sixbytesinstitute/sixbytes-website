import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Student from "@/models/Student";
import bcrypt from "bcrypt";

// 📌 POST → Create Student
export async function POST(req) {
  try {
    // 1. Connect DB
    await connectDB();

    // 2. Get request body
    const body = await req.json();
    const { name, email, password, class: studentClass } = body;

    // 3. Validate fields
    if (!name || !email || !password || !studentClass) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // 4. Check if user already exists
    const existingUser = await Student.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User already exists" },
        { status: 400 }
      );
    }

    // 5. Hash password 🔒
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Create student
    const student = await Student.create({
      name,
      email,
      password: hashedPassword,
      class: studentClass,
    });

    // 7. Return response
    return NextResponse.json(
      {
        success: true,
        student,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// 📌 GET → Fetch All Students


export async function GET() {
  try {
    await connectDB();

    const students = await Student.find().select("-password");

    return Response.json({
      success: true,
      students,
    });

  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}