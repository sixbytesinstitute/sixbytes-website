import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { withAuth } from "@/lib/middleware-auth";

// ─── GET: List students in faculty's assigned classes ───
export const GET = withAuth(
  async (req: NextRequest, { user }) => {
    try {
      await connectDB();

      const faculty = await User.findById(user.userId);
      if (!faculty) {
        return NextResponse.json(
          { success: false, error: "Faculty not found" },
          { status: 404 }
        );
      }

      const { searchParams } = new URL(req.url);
      const filterClass = searchParams.get("class");

      // Build filter: students in faculty's assigned classes
      const filter: Record<string, unknown> = {
        role: "student",
        isActive: true,
      };

      if (filterClass && faculty.assignedClasses.includes(filterClass)) {
        filter.class = filterClass;
      } else {
        filter.class = { $in: faculty.assignedClasses };
      }

      const students = await User.find(filter)
        .select("name email phone class stream createdAt")
        .sort({ name: 1 })
        .lean();

      return NextResponse.json({
        success: true,
        count: students.length,
        students,
      });
    } catch (error) {
      console.error("LIST STUDENTS ERROR:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch students" },
        { status: 500 }
      );
    }
  },
  ["faculty", "admin"]
);
