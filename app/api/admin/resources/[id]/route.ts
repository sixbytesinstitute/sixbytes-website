import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Resource from "@/models/Resource";
import { withAuth } from "@/lib/middleware-auth";
import { submitUrlsToIndexNow } from "@/lib/indexnow";
import { isSafeResourceHtml, SEO_LIMITS } from "@/lib/seo-policy";

// ─── PUT: Update resource ───────────────────────────────
export const PUT = withAuth(
  async (req: NextRequest, { params }) => {
    try {
      await connectDB();
      const id = params?.id;

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { success: false, error: "Invalid resource ID" },
          { status: 400 }
        );
      }

      const body = await req.json();

      const allowedFields = [
        "title", "slug", "metaDescription", "subject",
        "targetClass", "board", "chapter", "content", "keywords", "published", "resourceType",
      ];

      const updates: Record<string, unknown> = {};
      for (const field of allowedFields) {
        if (body[field] !== undefined) {
          updates[field] = body[field];
        }
      }

      if (updates.title !== undefined && (typeof updates.title !== "string" || updates.title.trim().length > SEO_LIMITS.title)) {
        return NextResponse.json(
          { success: false, error: `Title must be ${SEO_LIMITS.title} characters or fewer` },
          { status: 400 }
        );
      }

      if (updates.metaDescription !== undefined && (typeof updates.metaDescription !== "string" || updates.metaDescription.trim().length > SEO_LIMITS.description)) {
        return NextResponse.json(
          { success: false, error: `Meta description must be ${SEO_LIMITS.description} characters or fewer` },
          { status: 400 }
        );
      }

      if (updates.content !== undefined && (typeof updates.content !== "string" || !isSafeResourceHtml(updates.content))) {
        return NextResponse.json(
          { success: false, error: "Article content contains unsupported or unsafe HTML" },
          { status: 400 }
        );
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

      revalidateTag("published-resources", "max");
      revalidateTag(`published-resource:${resource.slug}`, "max");
      revalidatePath("/resources");
      revalidatePath(`/resources/${resource.slug}`);

      if (resource.published) {
        submitUrlsToIndexNow([`https://sixbytes.in/resources/${resource.slug}`]).catch(() => {});
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
  ["admin", "manager"]
);

// ─── DELETE: Delete resource ────────────────────────────
export const DELETE = withAuth(
  async (req: NextRequest, { params }) => {
    try {
      await connectDB();
      const id = params?.id;

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { success: false, error: "Invalid resource ID" },
          { status: 400 }
        );
      }

      const resource = await Resource.findByIdAndDelete(id);

      if (!resource) {
        return NextResponse.json(
          { success: false, error: "Resource not found" },
          { status: 404 }
        );
      }

      revalidateTag("published-resources", "max");
      revalidateTag(`published-resource:${resource.slug}`, "max");
      revalidatePath("/resources");
      revalidatePath(`/resources/${resource.slug}`);

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
  ["admin", "manager"]
);

// ─── GET: Fetch single resource with full content ───────
export const GET = withAuth(
  async (req: NextRequest, { params }) => {
    try {
      await connectDB();
      const id = params?.id;

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { success: false, error: "Invalid resource ID" },
          { status: 400 }
        );
      }

      const resource = await Resource.findById(id).lean();

      if (!resource) {
        return NextResponse.json(
          { success: false, error: "Resource not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        resource,
      });
    } catch (error) {
      console.error("GET RESOURCE ERROR:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch resource" },
        { status: 500 }
      );
    }
  },
  ["admin", "manager"]
);

