import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Student from "@/models/Student";
import bcrypt from "bcrypt";
import { signToken, COOKIE_NAME, COOKIE_CONFIG } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: "Please provide both email and password",
      }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check in unified User model first
    const unifiedUser = await User.findOne({ email: normalizedEmail, isActive: true });

    if (unifiedUser) {
      const isMatch = await bcrypt.compare(password, unifiedUser.password);
      if (!isMatch) {
        return NextResponse.json({
          success: false,
          error: "Incorrect password. Please try again.",
        }, { status: 401 });
      }

      const token = signToken({
        userId: unifiedUser._id.toString(),
        role: unifiedUser.role,
        email: unifiedUser.email,
        class: unifiedUser.class || undefined,
      });

      const response = NextResponse.json({
        success: true,
        user: {
          id: unifiedUser._id,
          name: unifiedUser.name,
          email: unifiedUser.email,
          role: unifiedUser.role,
          class: unifiedUser.class,
          stream: unifiedUser.stream,
          mustChangePassword: unifiedUser.mustChangePassword,
        },
      });

      response.cookies.set(COOKIE_NAME, token, {
        httpOnly: COOKIE_CONFIG.httpOnly,
        secure: COOKIE_CONFIG.secure,
        sameSite: COOKIE_CONFIG.sameSite,
        path: COOKIE_CONFIG.path,
        maxAge: COOKIE_CONFIG.maxAge,
      });

      return response;
    }

    // 2. Fallback to legacy Student model
    const legacyStudent = await Student.findOne({ email: normalizedEmail });

    if (legacyStudent) {
      const isMatch = await bcrypt.compare(password, legacyStudent.password);
      if (!isMatch) {
        return NextResponse.json({
          success: false,
          error: "Incorrect password. Please try again.",
        }, { status: 401 });
      }

      return NextResponse.json({
        success: true,
        user: {
          id: legacyStudent._id,
          name: legacyStudent.name,
          email: legacyStudent.email,
          role: "student",
          class: legacyStudent.class || "10",
        },
      });
    }

    return NextResponse.json({
      success: false,
      error: "No account found with this email",
    }, { status: 401 });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json({
      success: false,
      error: "An unexpected server error occurred. Please try again.",
    }, { status: 500 });
  }
}