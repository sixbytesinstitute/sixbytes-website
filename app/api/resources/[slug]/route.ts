import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Resource from "@/models/Resource";

// ─── GET: Single resource by slug (PUBLIC) ──────────────
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    const { slug } = await params;

    const resource = await Resource.findOneAndUpdate(
      { slug, published: true },
      { $inc: { viewCount: 1 } }, // Increment view count
      { new: true }
    ).lean();

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
