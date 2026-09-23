import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Resource from "@/models/Resource";
import { escapeRegex } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

// ─── GET: List published resources (PUBLIC) ─────────────
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject");
    const targetClass = searchParams.get("class");
    const board = searchParams.get("board");
    const type = searchParams.get("type");
    const search = searchParams.get("search");

    const filter: Record<string, unknown> = { published: true };

    if (subject) {
      if (subject === "Computer Science" || subject === "Computer") {
        filter.subject = { $in: ["Computer", "Computer Science"] };
      } else if (subject === "Science") {
        filter.subject = { $in: ["Science", "Physics", "Chemistry", "Biology"] };
      } else {
        filter.subject = subject;
      }
    }
    if (targetClass) filter.targetClass = targetClass;
    if (type) filter.resourceType = type;
    if (board) {
      const safeBoard = escapeRegex(board);
      filter.$or = [
        { board: { $regex: safeBoard, $options: "i" } },
        { keywords: { $regex: safeBoard, $options: "i" } },
      ];
    }
    if (search) {
      const safeSearch = escapeRegex(search);
      const searchConditions = [
        { title: { $regex: safeSearch, $options: "i" } },
        { metaDescription: { $regex: safeSearch, $options: "i" } },
        { keywords: { $regex: safeSearch, $options: "i" } },
        { board: { $regex: safeSearch, $options: "i" } },
        { subject: { $regex: safeSearch, $options: "i" } },
      ];
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchConditions }];
        delete filter.$or;
      } else {
        filter.$or = searchConditions;
      }
    }

    const resources = await Resource.find(filter)
      .select("slug title metaDescription subject targetClass board resourceType chapter keywords viewCount createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        count: resources.length,
        resources,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("PUBLIC RESOURCES ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}
