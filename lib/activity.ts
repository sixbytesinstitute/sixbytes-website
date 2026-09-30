import connectDB from "./mongodb";
import UserActivity from "../models/UserActivity";

/**
 * Logs a user activity event for the current day.
 * Uses MongoDB upsert so there's exactly one document per user per day.
 *
 * @param userId - The user's MongoDB ObjectId string
 * @param type - The type of activity: "resourceView" | "tutorQuestion" | "login"
 */
export async function logActivity(
  userId: string,
  type: "resourceView" | "tutorQuestion" | "login"
): Promise<void> {
  try {
    await connectDB();

    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

    const incrementField: Record<string, number> = { totalActions: 1 };

    switch (type) {
      case "resourceView":
        incrementField.resourceViews = 1;
        break;
      case "tutorQuestion":
        incrementField.tutorQuestions = 1;
        break;
      case "login":
        incrementField.logins = 1;
        break;
    }

    await UserActivity.updateOne(
      { userId, date: today },
      { $inc: incrementField },
      { upsert: true }
    );
  } catch (error) {
    // Activity logging should never block the main request
    console.error("ACTIVITY LOG ERROR:", error);
  }
}

/**
 * Fetches a user's activity data for a given date range.
 * Returns an array of { date, totalActions, resourceViews, tutorQuestions, logins }.
 */
export async function getActivityData(
  userId: string,
  startDate: string,
  endDate: string
): Promise<
  {
    date: string;
    totalActions: number;
    resourceViews: number;
    tutorQuestions: number;
    logins: number;
  }[]
> {
  await connectDB();

  const activities = await UserActivity.find({
    userId,
    date: { $gte: startDate, $lte: endDate },
  })
    .select("date totalActions resourceViews tutorQuestions logins -_id")
    .sort({ date: 1 })
    .lean();

  return activities as {
    date: string;
    totalActions: number;
    resourceViews: number;
    tutorQuestions: number;
    logins: number;
  }[];
}

/**
 * Calculates the current streak (consecutive days with at least 1 action).
 * Counts backwards from today.
 */
export async function calculateStreak(userId: string): Promise<number> {
  await connectDB();

  // Fetch last 365 days of activity, sorted descending
  const today = new Date();
  const yearAgo = new Date(today);
  yearAgo.setFullYear(yearAgo.getFullYear() - 1);

  const activities = await UserActivity.find({
    userId,
    date: {
      $gte: yearAgo.toISOString().slice(0, 10),
      $lte: today.toISOString().slice(0, 10),
    },
    totalActions: { $gt: 0 },
  })
    .select("date -_id")
    .sort({ date: -1 })
    .lean();

  if (activities.length === 0) return 0;

  // Build a Set of active dates for O(1) lookup
  const activeDates = new Set(activities.map((a) => (a as { date: string }).date));

  let streak = 0;
  const checkDate = new Date(today);

  // Start from today and count backwards
  while (true) {
    const dateStr = checkDate.toISOString().slice(0, 10);
    if (activeDates.has(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // If today has no activity yet, check if yesterday started the streak
      if (streak === 0) {
        checkDate.setDate(checkDate.getDate() - 1);
        const yesterdayStr = checkDate.toISOString().slice(0, 10);
        if (activeDates.has(yesterdayStr)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
          continue;
        }
      }
      break;
    }
  }

  return streak;
}
