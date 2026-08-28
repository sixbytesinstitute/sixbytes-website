import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Resource from "@/models/Resource";
import { withAuth } from "@/lib/middleware-auth";

// ─── PUT: Update resource ───────────────────────────────
export const PUT = withAuth(
  async (req: NextRequest, { params }) => {
    try {
      await connectDB();
      const id = params?.id;
      const body = await req.json();

      const allowedFields = [
        "title", "slug", "metaDescription", "subject",
        "targetClass", "chapter", "content", "keywords", "published",
      ];

      const updates: Record<string, unknown> = {};
      for (const field of allowedFields) {
        if (body[field] !== undefined) {
          updates[field] = body[field];
        }
      }
      updates.updatedAt = new Date();

      const resource = await Resource.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });

      if (!resource) {
        return NextResponse.json(
          { success: false, error: "Resource not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Resource updated successfully",
        resource,
      });
    } catch (error) {
      console.error("UPDATE RESOURCE ERROR:", error);
      return NextResponse.json(
        { success: false, error: "Failed to update resource" },
        { status: 500 }
      );
    }
  },
  ["admin"]
);

// ─── DELETE: Delete resource ────────────────────────────
export const DELETE = withAuth(
  async (req: NextRequest, { params }) => {
    try {
      await connectDB();
      const id = params?.id;

      const resource = await Resource.findByIdAndDelete(id);

      if (!resource) {
        return NextResponse.json(
          { success: false, error: "Resource not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Resource deleted successfully",
      });
    } catch (error) {
      console.error("DELETE RESOURCE ERROR:", error);
      return NextResponse.json(
        { success: false, error: "Failed to delete resource" },
        { status: 500 }
      );
    }
  },
  ["admin"]
);
