import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Notice from "@/models/Notice";
import User from "@/models/User";
import { withAuth } from "@/lib/middleware-auth";

// ─── POST: Create notice ───────────────────────────────
export const POST = withAuth(
  async (req: NextRequest, { user }) => {
    try {
      await connectDB();

      const body = await req.json();
      const { title, content, targetClass, priority } = body;

      if (!title || !content) {
        return NextResponse.json(
          { success: false, error: "Title and content are required" },
          { status: 400 }
        );
      }

      // Verify faculty assignment
      const faculty = await User.findById(user.userId);
      if (!faculty) {
        return NextResponse.json(
          { success: false, error: "Faculty not found" },
          { status: 404 }
        );
      }

      const classTarget = targetClass || "All";

      // Faculty can only post to own classes (admin can post to All)
      if (
        faculty.role === "faculty" &&
        classTarget !== "All" &&
        !faculty.assignedClasses.includes(classTarget)
      ) {
        return NextResponse.json(
          { success: false, error: "You are not assigned to this class" },
          { status: 403 }
        );
      }

      const notice = await Notice.create({
        title: title.trim(),
        content: content.trim(),
        targetClass: classTarget,
        priority: priority || "normal",
        createdBy: user.userId,
      });

      return NextResponse.json(
        { success: true, message: "Notice posted successfully", notice },
        { status: 201 }
      );
    } catch (error) {
      console.error("CREATE NOTICE ERROR:", error);
      return NextResponse.json(
        { success: false, error: "Failed to create notice" },
        { status: 500 }
      );
    }
  },
  ["faculty", "admin"]
);

// ─── GET: List notices created by this faculty ──────────
export const GET = withAuth(
  async (req: NextRequest, { user }) => {
    try {
      await connectDB();

      const notices = await Notice.find({ createdBy: user.userId })
        .sort({ createdAt: -1 })
        .lean();

      return NextResponse.json({
        success: true,
        count: notices.length,
        notices,
      });
    } catch (error) {
      console.error("LIST NOTICES ERROR:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch notices" },
        { status: 500 }
      );
    }
  },
  ["faculty", "admin"]
);
