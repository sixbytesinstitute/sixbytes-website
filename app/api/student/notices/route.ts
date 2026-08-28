import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Notice from "@/models/Notice";
import { withAuth } from "@/lib/middleware-auth";

// ─── GET: Notices for student's class ───────────────────
export const GET = withAuth(
  async (req: NextRequest, { user }) => {
    try {
      await connectDB();

      const now = new Date();

      const notices = await Notice.find({
        $or: [
          { targetClass: user.class },
          { targetClass: "All" },
        ],
        // Exclude expired notices
        $and: [
          {
            $or: [
              { expiresAt: null },
              { expiresAt: { $gt: now } },
            ],
          },
        ],
      })
        .populate("createdBy", "name")
        .sort({ pinned: -1, createdAt: -1 }) // Pinned first, then newest
        .lean();

      return NextResponse.json({
        success: true,
        count: notices.length,
        notices,
      });
    } catch (error) {
      console.error("STUDENT NOTICES ERROR:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch notices" },
        { status: 500 }
      );
    }
  },
  ["student"]
);
