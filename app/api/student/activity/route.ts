import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware-auth";
import { logActivity, getActivityData, calculateStreak } from "@/lib/activity";

/**
 * GET /api/student/activity
 * Returns the student's activity data for streak display and contribution graph.
 * Query params: ?range=year|month|week (default: year)
 */
export const GET = withAuth(async (req: NextRequest, { user }) => {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "year";

    const today = new Date();
    const endDate = today.toISOString().slice(0, 10);

    let startDate: string;
    switch (range) {
      case "week": {
        const d = new Date(today);
        d.setDate(d.getDate() - 7);
        startDate = d.toISOString().slice(0, 10);
        break;
      }
      case "month": {
        const d = new Date(today);
        d.setMonth(d.getMonth() - 1);
        startDate = d.toISOString().slice(0, 10);
        break;
      }
      case "year":
      default: {
        const d = new Date(today);
        d.setFullYear(d.getFullYear() - 1);
        startDate = d.toISOString().slice(0, 10);
        break;
      }
    }

    const [activities, streak] = await Promise.all([
      getActivityData(user.userId, startDate, endDate),
      calculateStreak(user.userId),
    ]);

    // Calculate total stats
    const totalActions = activities.reduce((sum, a) => sum + a.totalActions, 0);
    const totalResourceViews = activities.reduce((sum, a) => sum + a.resourceViews, 0);
    const totalTutorQuestions = activities.reduce((sum, a) => sum + a.tutorQuestions, 0);
    const activeDays = activities.filter((a) => a.totalActions > 0).length;

    return NextResponse.json({
      success: true,
      streak,
      stats: {
        totalActions,
        totalResourceViews,
        totalTutorQuestions,
        activeDays,
      },
      activities,
    });
  } catch (error) {
    console.error("ACTIVITY GET ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch activity data" },
      { status: 500 }
    );
  }
});

/**
 * POST /api/student/activity
 * Logs a student activity event.
 * Body: { type: "resourceView" | "tutorQuestion" | "login" }
 */
export const POST = withAuth(async (req: NextRequest, { user }) => {
  try {
    const body = await req.json();
    const { type } = body;

    if (!type || !["resourceView", "tutorQuestion", "login"].includes(type)) {
      return NextResponse.json(
        { success: false, error: "Invalid activity type" },
        { status: 400 }
      );
    }

    await logActivity(user.userId, type);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ACTIVITY POST ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to log activity" },
      { status: 500 }
    );
  }
});
