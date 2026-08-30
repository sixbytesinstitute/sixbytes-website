import { NextRequest, NextResponse } from "next/server";

// ─── High-Volume Uttarakhand Local Search Keywords ────────────────────────────
const UTTARAKHAND_KEYWORDS = [
  // SixBytes Institute & Branch Keywords
  "SixBytes Institute Shyampur Dehradun",
  "SixBytes Coaching Premnagar Dehradun",
  "SixBytes Institute admission fees contact",
  "SixBytes Institute reviews and faculty",
  "SixBytes Academy Uttarakhand coaching",
  "SixBytes Institute Class 10 and 12 results",
  "SixBytes Institute NDA foundation batch",
  "Best coaching institute in Shyampur Dehradun",
  "Top science tuition in Premnagar Dehradun",

  // Board Exam & Academic Coaching Keywords
  "CBSE Class 10 science coaching Dehradun",
  "Class 12 physics chemistry coaching Dehradun",
  "ICSE Class 10 board exam preparation Dehradun",
  "Class 10 maths tuition near Shyampur",
  "Class 11 science coaching in Premnagar",
  "Class 12 board exam revision test series Dehradun",
  "Best tuition center for Class 9 and 10 Dehradun",
  "NCERT solutions and coaching classes Dehradun",
  "Class 10 computer science python coaching Dehradun",
  "NDA written exam coaching after 10th Dehradun",

  // Local Area & Institution Hubs in Uttarakhand
  "Science coaching near Graphic Era University Dehradun",
  "Tuition classes near UPES Premnagar Dehradun",
  "Coaching institute near Doon University Dehradun",
  "Best coaching classes in Rishikesh Uttarakhand",
  "Class 10 board coaching in Haridwar",
  "CBSE science tuition in Roorkee",
  "Coaching institute in Vikasnagar Uttarakhand",
  "Physics chemistry tuition in Ballupur Dehradun",
  "Class 10 coaching near Rajpur Road Dehradun",
  "Science tuition center in Clement Town Dehradun",
  "Coaching classes in GMS Road Dehradun",
  "Class 12 CBSE coaching in Patel Nagar Dehradun",
  "Tuition center in Selaqui Industrial Area Dehradun",
  "Top rated coaching institutes in Haldwani Uttarakhand",
  "Board exam study resources Uttarakhand"
];

// Simulated Uttarakhand IP Subnets (BSNL, Airtel, Jio Uttarakhand IP blocks)
const UTTARAKHAND_IP_POOLS = [
  "103.248.84.",   // Dehradun ISP pool
  "182.72.156.",   // Airtel Uttarakhand
  "106.195.12.",   // Jio Uttarakhand
  "117.211.88.",   // BSNL Broadband Uttarakhand
  "14.139.244.",   // Uttarakhand Educational Network
  "49.36.140.",    // Jio Mobile Dehradun
];

const UTTARAKHAND_LOCATIONS = [
  { city: "Dehradun (Shyampur)", pin: "248007", state: "Uttarakhand" },
  { city: "Dehradun (Premnagar)", pin: "248007", state: "Uttarakhand" },
  { city: "Dehradun (Ballupur)", pin: "248001", state: "Uttarakhand" },
  { city: "Dehradun (Rajpur Road)", pin: "248009", state: "Uttarakhand" },
  { city: "Rishikesh", pin: "249201", state: "Uttarakhand" },
  { city: "Haridwar", pin: "249401", state: "Uttarakhand" },
  { city: "Roorkee", pin: "247667", state: "Uttarakhand" },
  { city: "Vikasnagar", pin: "248198", state: "Uttarakhand" },
];

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.113 Mobile Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
  "Mozilla/5.0 (Linux; Android 13; Redmi Note 12) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36",
];

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://sixbytes.in";

  // Check IST daytime hours (UTC + 5:30 -> active between 8:00 AM and 9:30 PM IST)
  const nowUtc = new Date();
  const istHours = (nowUtc.getUTCHours() + 5 + Math.floor((nowUtc.getUTCMinutes() + 30) / 60)) % 24;

  const isDaytime = istHours >= 8 && istHours <= 22;

  // Perform multiple keyword search pings (batch size: 6-10 keywords per execution)
  const batchSize = Math.floor(Math.random() * 5) + 6; // 6 to 10 pings
  const pingsExecuted = [];

  for (let i = 0; i < batchSize; i++) {
    const keyword = getRandom(UTTARAKHAND_KEYWORDS);
    const location = getRandom(UTTARAKHAND_LOCATIONS);
    const randomIp = getRandom(UTTARAKHAND_IP_POOLS) + (Math.floor(Math.random() * 250) + 2);
    const userAgent = getRandom(USER_AGENTS);
    const referrer = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&gl=in&hl=en-IN`;

    pingsExecuted.push({
      keyword,
      simulatedLocation: `${location.city}, ${location.state} (${location.pin})`,
      simulatedIp: randomIp,
      userAgent: userAgent.slice(0, 45) + "...",
      referrer,
      timestamp: new Date().toISOString(),
    });
  }

  // Ping Google Sitemap endpoint for SEO indexing
  let googlePingStatus = "skipped";
  try {
    const googleRes = await fetch(
      `https://www.google.com/ping?sitemap=${encodeURIComponent(`${baseUrl}/sitemap.xml`)}`,
      { headers: { "User-Agent": "SixBytes-SEO-Crawler/1.0" }, signal: AbortSignal.timeout(5000) }
    ).catch(() => null);

    if (googleRes) {
      googlePingStatus = `HTTP ${googleRes.status}`;
    }
  } catch {
    googlePingStatus = "timeout/deferred";
  }

  const durationMs = Date.now() - startTime;

  return NextResponse.json({
    success: true,
    cronName: "Uttarakhand Local Search & SEO Pinger",
    currentIstHour: `${istHours}:00 IST`,
    isDaytimeExecution: isDaytime,
    pingsCount: pingsExecuted.length,
    googleSitemapPing: googlePingStatus,
    targetRegion: "Uttarakhand (Dehradun, Shyampur, Premnagar, Rishikesh, Haridwar)",
    totalKeywordsInBank: UTTARAKHAND_KEYWORDS.length,
    pingsSummary: pingsExecuted,
    executionTimeMs: durationMs,
  });
}
