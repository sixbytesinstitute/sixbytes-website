import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { withAuth } from "@/lib/middleware-auth";

// ─── GET: Single user details ───────────────────────────
export const GET = withAuth(
  async (req: NextRequest, { params }) => {
    try {
      await connectDB();
      const id = params?.id;

      const user = await User.findById(id).select("-password").lean();

      if (!user) {
        return NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, user });
    } catch (error) {
      console.error("GET USER ERROR:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch user" },
        { status: 500 }
      );
    }
  },
  ["admin"]
);

// ─── PUT: Update user ───────────────────────────────────
export const PUT = withAuth(
  async (req: NextRequest, { params }) => {
    try {
      await connectDB();
      const id = params?.id;
      const body = await req.json();

      // Fields that admin can update (never password via this route)
      const allowedFields = [
        "name", "phone", "class", "stream",
        "subjects", "assignedClasses", "isActive", "role",
      ];

      const updates: Record<string, unknown> = {};
      for (const field of allowedFields) {
        if (body[field] !== undefined) {
          updates[field] = body[field];
        }
      }
      updates.updatedAt = new Date();

      const user = await User.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      }).select("-password");

      if (!user) {
        return NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "User updated successfully",
        user,
      });
    } catch (error) {
      console.error("UPDATE USER ERROR:", error);
      return NextResponse.json(
        { success: false, error: "Failed to update user" },
        { status: 500 }
      );
    }
  },
  ["admin"]
);

// ─── DELETE: Soft-delete (deactivate) user ──────────────
export const DELETE = withAuth(
  async (req: NextRequest, { params }) => {
    try {
      await connectDB();
      const id = params?.id;

      const user = await User.findByIdAndUpdate(
        id,
        { isActive: false, updatedAt: new Date() },
        { new: true }
      ).select("-password");

      if (!user) {
        return NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "User deactivated successfully",
      });
    } catch (error) {
      console.error("DELETE USER ERROR:", error);
      return NextResponse.json(
        { success: false, error: "Failed to deactivate user" },
        { status: 500 }
      );
    }
  },
  ["admin"]
);
