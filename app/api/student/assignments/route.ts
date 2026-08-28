import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Assignment from "@/models/Assignment";
import { withAuth } from "@/lib/middleware-auth";

// ─── GET: Assignments for student's class ───────────────
export const GET = withAuth(
  async (req: NextRequest, { user }) => {
    try {
      await connectDB();

      const assignments = await Assignment.find({
        $or: [
          { targetClass: user.class },
          { targetClass: "All" },
        ],
      })
        .populate("createdBy", "name")
        .sort({ dueDate: -1 })
        .lean();

      return NextResponse.json({
        success: true,
        count: assignments.length,
        assignments,
      });
    } catch (error) {
      console.error("STUDENT ASSIGNMENTS ERROR:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch assignments" },
        { status: 500 }
      );
    }
  },
  ["student"]
);
