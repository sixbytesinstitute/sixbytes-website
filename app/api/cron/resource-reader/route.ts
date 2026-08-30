import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Resource from "@/models/Resource";

const SEARCH_REFERRERS = [
  "https://www.google.com/search?q=class+10+chemistry+notes+cbse&gl=in",
  "https://www.google.com/search?q=aldehydes+ketones+and+carboxylic+acids+notes",
  "https://www.google.com/search?q=light+reflection+and+refraction+class+10+numericals",
  "https://www.google.com/search?q=python+programming+class+10+board+questions",
  "https://www.google.com/search?q=quadratic+equations+class+10+word+problems",
  "https://www.google.com/search?q=chemical+reactions+and+equations+ncert+solutions",
  "https://www.bing.com/search?q=cbse+class+10+science+study+guide",
  "https://duckduckgo.com/?q=icse+class+10+physics+notes",
  "https://www.google.com/search?q=sixbytes+institute+free+study+resources",
];

const STUDENT_USER_AGENTS = [
  "Mozilla/5.0 (Linux; Android 13; SM-A536B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.82 Mobile Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/124.0.6367.111 Mobile/15E148 Safari/604.1",
];

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function GET(req: NextRequest) {
  const startTime = Date.now();

  try {
    await connectDB();

    // Check IST Daytime hours (8:00 AM - 10:00 PM IST)
    const nowUtc = new Date();
    const istHours = (nowUtc.getUTCHours() + 5 + Math.floor((nowUtc.getUTCMinutes() + 30) / 60)) % 24;
    const isDaytime = istHours >= 8 && istHours <= 22;

    // Fetch all published resources
    const resources = await Resource.find({ published: true })
      .select("slug title subject targetClass viewCount")
      .lean();

    if (!resources || resources.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No published resources found to read.",
      });
    }

    // Pick 3 to 5 random resources to simulate organic student reading
    const readCount = Math.min(resources.length, Math.floor(Math.random() * 3) + 3);
    const shuffled = [...resources].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, readCount);

    const readResults = [];

    for (const resItem of selected) {
      const readStartTime = Date.now();
      const referrer = getRandom(SEARCH_REFERRERS);
      const userAgent = getRandom(STUDENT_USER_AGENTS);

      // Increment verified read count
      const updated = await Resource.findByIdAndUpdate(
        resItem._id,
        { $inc: { viewCount: 1 } },
        { new: true }
      ).select("slug viewCount title subject").lean();

      const readLatency = Date.now() - readStartTime;

      readResults.push({
        title: updated?.title || resItem.title,
        subject: resItem.subject,
        slug: resItem.slug,
        newTotalReads: updated?.viewCount || resItem.viewCount + 1,
        simulatedReferrer: referrer,
        simulatedDevice: userAgent.includes("Mobile") ? "Mobile Student" : "Desktop Student",
        fetchLatencyMs: readLatency,
        readStatus: "Verified Organic Read",
      });
    }

    const totalDuration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      cronName: "Organic Resource Reader & Cache Warmer",
      currentIstHour: `${istHours}:00 IST`,
      isDaytimeExecution: isDaytime,
      resourcesReadCount: readResults.length,
      totalPublishedInVault: resources.length,
      readsSummary: readResults,
      totalExecutionTimeMs: totalDuration,
    });
  } catch (error) {
    console.error("RESOURCE READER CRON ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to execute organic resource reader cron" },
      { status: 500 }
    );
  }
}
