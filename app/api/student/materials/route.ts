import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Material from "@/models/Material";
import { withAuth } from "@/lib/middleware-auth";

// ─── GET: Materials for student's class ─────────────────
export const GET = withAuth(
  async (req: NextRequest, { user }) => {
    try {
      await connectDB();

      const { searchParams } = new URL(req.url);
      const subject = searchParams.get("subject");
      const category = searchParams.get("category");
      const search = searchParams.get("search");

      const filter: Record<string, unknown> = {
        $or: [
          { class: user.class },
          { class: "All" },
        ],
      };

      if (subject) filter.subject = subject;
      if (category) filter.category = category;
      if (search) {
        filter.title = { $regex: search, $options: "i" };
      }

      const materials = await Material.find(filter)
        .populate("createdBy", "name")
        .sort({ createdAt: -1 })
        .lean();

      return NextResponse.json({
        success: true,
        count: materials.length,
        materials,
      });
    } catch (error) {
      console.error("STUDENT MATERIALS ERROR:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch materials" },
        { status: 500 }
      );
    }
  },
  ["student"]
);
