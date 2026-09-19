import { NextRequest, NextResponse } from "next/server";
import { isCronAuthorized } from "@/lib/cron-auth";

const CRON_SECRET = process.env.CRON_SECRET;

export function GET(request: NextRequest) {
  if (!isCronAuthorized(request.headers.get("authorization"), CRON_SECRET)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    {
      success: false,
      deprecated: true,
      error: "Synthetic resource reads have been removed. Use /api/cron/seo-maintenance.",
    },
    { status: 410 },
  );
}
