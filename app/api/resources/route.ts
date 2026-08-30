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
    const board = searchParams.get("board");
    const search = searchParams.get("search");

    const filter: Record<string, unknown> = { published: true };

    if (subject) filter.subject = subject;
    if (targetClass) filter.targetClass = targetClass;
    if (board) {
      filter.$or = [
        { board: { $regex: board, $options: "i" } },
        { keywords: { $regex: board, $options: "i" } },
      ];
    }
    if (search) {
      const searchConditions = [
        { title: { $regex: search, $options: "i" } },
        { metaDescription: { $regex: search, $options: "i" } },
        { keywords: { $regex: search, $options: "i" } },
        { board: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
      ];
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchConditions }];
        delete filter.$or;
      } else {
        filter.$or = searchConditions;
      }
    }

    const resources = await Resource.find(filter)
      .select("slug title metaDescription subject targetClass board chapter keywords viewCount createdAt")
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
