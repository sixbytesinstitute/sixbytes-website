import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import connectDB from "@/lib/mongodb";
import Resource from "@/models/Resource";
import { withAuth } from "@/lib/middleware-auth";
import { submitUrlsToIndexNow } from "@/lib/indexnow";
import { isSafeResourceHtml, SEO_LIMITS } from "@/lib/seo-policy";
import { escapeRegex } from "@/lib/sanitize";

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
        targetClass, board, chapter, content, keywords, published, resourceType,
      } = body;

      if (!title || !metaDescription || !subject || !targetClass || !content) {
        return NextResponse.json(
          { success: false, error: "Title, meta description, subject, class, and content are required" },
          { status: 400 }
        );
      }

      if (typeof title !== "string" || title.trim().length > SEO_LIMITS.title) {
        return NextResponse.json(
          { success: false, error: `Title must be ${SEO_LIMITS.title} characters or fewer` },
          { status: 400 }
        );
      }

      if (typeof metaDescription !== "string" || metaDescription.trim().length > SEO_LIMITS.description) {
        return NextResponse.json(
          { success: false, error: `Meta description must be ${SEO_LIMITS.description} characters or fewer` },
          { status: 400 }
        );
      }

      if (typeof content !== "string" || !isSafeResourceHtml(content)) {
        return NextResponse.json(
          { success: false, error: "Article content contains unsupported or unsafe HTML" },
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
        board: board || "CBSE & ICSE",
        chapter: chapter || null,
        content,
        keywords: keywords || [],
        published: published || false,
        resourceType: resourceType || "topic_guide",
        createdBy: user.userId,
      });

      revalidateTag("published-resources", "max");
      revalidatePath("/resources");

      if (resource.published) {
        revalidateTag(`published-resource:${resource.slug}`, "max");
        revalidatePath(`/resources/${resource.slug}`);
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
  ["admin", "manager"]
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
        const safeSearch = escapeRegex(search);
        filter.$or = [
          { title: { $regex: safeSearch, $options: "i" } },
          { metaDescription: { $regex: safeSearch, $options: "i" } },
          { keywords: { $regex: safeSearch, $options: "i" } },
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
  ["admin", "manager"]
);
