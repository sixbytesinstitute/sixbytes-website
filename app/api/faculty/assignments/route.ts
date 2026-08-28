import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Assignment from "@/models/Assignment";
import User from "@/models/User";
import { withAuth } from "@/lib/middleware-auth";
import { extractDriveFileId } from "@/lib/gdrive";

// ─── POST: Create assignment ────────────────────────────
export const POST = withAuth(
  async (req: NextRequest, { user }) => {
    try {
      await connectDB();

      const body = await req.json();
      const { title, description, targetClass, subject, dueDate, fileUrl, fileName } = body;

      if (!title || !targetClass || !subject || !dueDate) {
        return NextResponse.json(
          { success: false, error: "Title, class, subject, and due date are required" },
          { status: 400 }
        );
      }

      // Verify faculty is assigned to this class
      const faculty = await User.findById(user.userId);
      if (!faculty || (targetClass !== "All" && !faculty.assignedClasses.includes(targetClass))) {
        return NextResponse.json(
          { success: false, error: "You are not assigned to this class" },
          { status: 403 }
        );
      }

      // Validate Google Drive URL if provided
      if (fileUrl && !extractDriveFileId(fileUrl)) {
        return NextResponse.json(
          { success: false, error: "Invalid Google Drive URL. Please paste a valid Google Drive shareable link." },
          { status: 400 }
        );
      }

      const assignment = await Assignment.create({
        title: title.trim(),
        description: description || "",
        targetClass,
        subject,
        dueDate: new Date(dueDate),
        fileUrl: fileUrl || null,
        fileName: fileName || null,
        createdBy: user.userId,
      });

      return NextResponse.json(
        { success: true, message: "Assignment created successfully", assignment },
        { status: 201 }
      );
    } catch (error) {
      console.error("CREATE ASSIGNMENT ERROR:", error);
      return NextResponse.json(
        { success: false, error: "Failed to create assignment" },
        { status: 500 }
      );
    }
  },
  ["faculty", "admin"]
);

// ─── GET: List assignments for faculty's classes ────────
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

      // Faculty sees assignments for their assigned classes
      const filter: Record<string, unknown> = {
        $or: [
          { targetClass: { $in: faculty.assignedClasses } },
          { targetClass: "All" },
          { createdBy: user.userId },
        ],
      };

      const assignments = await Assignment.find(filter)
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })
        .lean();

      return NextResponse.json({
        success: true,
        count: assignments.length,
        assignments,
      });
    } catch (error) {
      console.error("LIST ASSIGNMENTS ERROR:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch assignments" },
        { status: 500 }
      );
    }
  },
  ["faculty", "admin"]
);
