import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken, COOKIE_NAME, COOKIE_CONFIG } from "@/lib/auth";

/**
 * POST /api/auth/register
 * Self-registration for free (non-enrolled) student accounts.
 * These users get isEnrolled=false and see the lite dashboard.
 */
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, password, phone } = body;

    // ── Validate inputs ──
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== "string") {
      return NextResponse.json(
        { success: false, error: "Phone number is required" },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid 10-digit phone number" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // ── Check for existing account ──
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists. Please log in." },
        { status: 409 }
      );
    }

    // ── Create the user ──
    const hashedPassword = await bcrypt.hash(password, 12);
    const starterAvatars = ["scholar-owl", "rocket-voyager", "lightning-spark", "sunset", "ocean", "aurora"];
    const initialAvatar = starterAvatars[Math.floor(Math.random() * starterAvatars.length)];

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: cleanPhone.slice(-10),
      password: hashedPassword,
      role: "student",
      isEnrolled: false,
      mustChangePassword: false, // they set their own password
      isActive: true,
      avatar: initialAvatar,
    });

    // ── Sign JWT & set cookie ──
    const token = signToken({
      userId: newUser._id.toString(),
      role: "student",
      email: normalizedEmail,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: "student",
        isEnrolled: false,
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
  } catch (error: unknown) {
    console.error("REGISTER ERROR:", error);

    // Handle Mongoose duplicate key error
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
