import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { withAuth } from "@/lib/middleware-auth";

export const GET = withAuth(async (req: NextRequest, { user }) => {
  try {
    await connectDB();

    const dbUser = await User.findById(user.userId).select("-password");

    if (!dbUser || !dbUser.isActive) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: dbUser._id,
        name: dbUser.name,
        email: dbUser.email,
        phone: dbUser.phone,
        role: dbUser.role,
        class: dbUser.class,
        stream: dbUser.stream,
        subjects: dbUser.subjects,
        assignedClasses: dbUser.assignedClasses,
        mustChangePassword: dbUser.mustChangePassword,
        createdAt: dbUser.createdAt,
      },
    });
  } catch (error) {
    console.error("ME ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
});
