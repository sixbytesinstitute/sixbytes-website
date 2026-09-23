import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken, COOKIE_NAME, COOKIE_CONFIG } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return NextResponse.json(
        { success: false, error: "Please provide both email and password" },
        { status: 400 }
      );
    }

    // Find user (case-insensitive email)
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      isActive: true,
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password. Please try again." },
        { status: 401 }
      );
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password. Please try again." },
        { status: 401 }
      );
    }

    // Sign JWT
    const token = signToken({
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
      class: user.class || undefined,
    });

    // Build response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        class: user.class,
        stream: user.stream,
        mustChangePassword: user.mustChangePassword,
      },
    });

    // Set httpOnly cookie
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: COOKIE_CONFIG.httpOnly,
      secure: COOKIE_CONFIG.secure,
      sameSite: COOKIE_CONFIG.sameSite,
      path: COOKIE_CONFIG.path,
      maxAge: COOKIE_CONFIG.maxAge,
    });

    return response;
  } catch (error: any) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
