import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Resource from "@/models/Resource";
import { withAuth } from "@/lib/middleware-auth";
import { submitUrlsToIndexNow } from "@/lib/indexnow";

// ─── Slug generator ─────────────────────────────────────
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ─── POST: Create SEO resource article ──────────────────
export const POST = withAuth(
  async (req: NextRequest, { user }) => {
    try {
      await connectDB();

      const body = await req.json();
      const {
        title, slug, metaDescription, subject,
        targetClass, chapter, content, keywords, published,
      } = body;

      if (!title || !metaDescription || !subject || !targetClass || !content) {
        return NextResponse.json(
          { success: false, error: "Title, meta description, subject, class, and content are required" },
          { status: 400 }
        );
      }

      // Auto-generate slug from title if not provided
      const finalSlug = slug ? generateSlug(slug) : generateSlug(title);

      // Check for duplicate slug
      const existing = await Resource.findOne({ slug: finalSlug });
      if (existing) {
        return NextResponse.json(
          { success: false, error: `A resource with slug "${finalSlug}" already exists` },
          { status: 409 }
        );
      }

      const resource = await Resource.create({
        title: title.trim(),
        slug: finalSlug,
        metaDescription: metaDescription.trim(),
        subject,
        targetClass,
        chapter: chapter || null,
        content,
        keywords: keywords || [],
        published: published || false,
        createdBy: user.userId,
      });

      if (resource.published) {
        submitUrlsToIndexNow([`https://sixbytes.in/resources/${resource.slug}`]).catch(() => {});
      }

      return NextResponse.json(
        {
          success: true,
          message: "Resource created successfully",
          resource: {
            id: resource._id,
            slug: resource.slug,
            title: resource.title,
            published: resource.published,
          },
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("CREATE RESOURCE ERROR:", error);
      return NextResponse.json(
        { success: false, error: "Failed to create resource" },
        { status: 500 }
      );
    }
  },
  ["admin"]
);

// ─── GET: List all resources (including unpublished) ────
export const GET = withAuth(
  async (req: NextRequest) => {
    try {
      await connectDB();

      const { searchParams } = new URL(req.url);
      const subject = searchParams.get("subject");
      const targetClass = searchParams.get("class");
      const search = searchParams.get("search");

      const filter: Record<string, unknown> = {};
      if (subject) filter.subject = subject;
      if (targetClass) filter.targetClass = targetClass;
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: "i" } },
          { metaDescription: { $regex: search, $options: "i" } },
          { keywords: { $regex: search, $options: "i" } },
        ];
      }

      const resources = await Resource.find(filter)
        .select("-content") // Don't send full content in list view
        .sort({ createdAt: -1 })
        .lean();

      return NextResponse.json({
        success: true,
        count: resources.length,
        resources,
      });
    } catch (error) {
      console.error("LIST RESOURCES ERROR:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch resources" },
        { status: 500 }
      );
    }
  },
  ["admin"]
);
