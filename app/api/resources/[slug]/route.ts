import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Resource from "@/models/Resource";

// ─── GET: Single resource by slug (Idempotent - does not mutate view count) ──
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    const { slug } = await params;

    const resource = await Resource.findOne({ slug, published: true }).lean();

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
    console.error("PUBLIC RESOURCE DETAIL ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch resource" },
      { status: 500 }
    );
  }
}

// ─── POST: Record verified student view (Session-guarded / reader pings) ────
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    const { slug } = await params;

    const resource = await Resource.findOneAndUpdate(
      { slug, published: true },
      { $inc: { viewCount: 1 } },
      { new: true }
    ).select("slug viewCount").lean();

    if (!resource) {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      slug: resource.slug,
      viewCount: resource.viewCount,
    });
  } catch (error) {
    console.error("RECORD VIEW ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record view" },
      { status: 500 }
    );
  }
}
