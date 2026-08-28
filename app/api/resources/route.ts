import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Resource from "@/models/Resource";

// ─── GET: List published resources (PUBLIC) ─────────────
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject");
    const targetClass = searchParams.get("class");
    const search = searchParams.get("search");

    const filter: Record<string, unknown> = { published: true };

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
      .select("slug title metaDescription subject targetClass chapter viewCount createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: resources.length,
      resources,
    });
  } catch (error) {
    console.error("PUBLIC RESOURCES ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}
