import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { withAuth } from "@/lib/middleware-auth";

export const PUT = withAuth(async (req: NextRequest, { user }) => {
  try {
    await connectDB();

    const body = await req.json();
    const { name, phone, email, avatar } = body;

    // Validate
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    if (!phone || !phone.trim()) {
      return NextResponse.json(
        { success: false, error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Basic phone validation (Indian format: 10 digits)
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid 10-digit phone number" },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email is already taken by another user
    if (normalizedEmail !== user.email) {
      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user.userId },
      });

      if (existingUser) {
        return NextResponse.json(
          { success: false, error: "This email is already registered to another account" },
          { status: 409 }
        );
      }
    }

    // Build update payload
    const updatePayload: Record<string, unknown> = {
      name: name.trim(),
      phone: cleanPhone.slice(-10),
      email: normalizedEmail,
      updatedAt: new Date(),
    };

    // Include avatar if provided
    if (typeof avatar === "string") {
      updatePayload.avatar = avatar;
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      updatePayload,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        class: updatedUser.class,
        stream: updatedUser.stream,
        subjects: updatedUser.subjects,
        assignedClasses: updatedUser.assignedClasses,
        avatar: updatedUser.avatar || "",
      },
    });
  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
});
