import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Material from "@/models/Material";
import User from "@/models/User";
import { withAuth } from "@/lib/middleware-auth";
import { extractDriveFileId } from "@/lib/gdrive";

// ─── POST: Create material ─────────────────────────────
export const POST = withAuth(
  async (req: NextRequest, { user }) => {
    try {
      await connectDB();

      const body = await req.json();
      const { title, description, fileUrl, fileName, class: matClass, subject, category } = body;

      if (!title || !fileUrl || !matClass || !subject || !category) {
        return NextResponse.json(
          { success: false, error: "Title, file URL, class, subject, and category are required" },
          { status: 400 }
        );
      }

      // Verify faculty is assigned to this class
      const faculty = await User.findById(user.userId);
      if (!faculty || (matClass !== "All" && !faculty.assignedClasses.includes(matClass))) {
        return NextResponse.json(
          { success: false, error: "You are not assigned to this class" },
          { status: 403 }
        );
      }

      // Validate Google Drive URL
      if (!extractDriveFileId(fileUrl)) {
        return NextResponse.json(
          { success: false, error: "Invalid Google Drive URL" },
          { status: 400 }
        );
      }

      const material = await Material.create({
        title: title.trim(),
        description: description || "",
        fileUrl,
        fileName: fileName || null,
        class: matClass,
        subject,
        category,
        createdBy: user.userId,
      });

      return NextResponse.json(
        { success: true, message: "Material uploaded successfully", material },
        { status: 201 }
      );
    } catch (error) {
      console.error("CREATE MATERIAL ERROR:", error);
      return NextResponse.json(
        { success: false, error: "Failed to create material" },
        { status: 500 }
      );
    }
  },
  ["faculty", "admin"]
);

// ─── GET: List materials for faculty's classes ──────────
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

      const filter: Record<string, unknown> = {
        $or: [
          { class: { $in: faculty.assignedClasses } },
          { class: "All" },
        ],
      };

      const materials = await Material.find(filter)
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })
        .lean();

      return NextResponse.json({
        success: true,
        count: materials.length,
        materials,
      });
    } catch (error) {
      console.error("LIST MATERIALS ERROR:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch materials" },
        { status: 500 }
      );
    }
  },
  ["faculty", "admin"]
);
