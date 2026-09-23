import { chromium } from "playwright"

const BASE_URL = process.env.TARGET_URL || "https://sixbytes.in"

const VISITORS = [
  {
    name: "Student Ankit",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    pages: ["/", "/courses", "/resources", "/about"],
  },
  {
    name: "Student Priya",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    pages: ["/", "/resources", "/results", "/courses"],
  },
  {
    name: "Parent Sharma",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0",
    pages: ["/", "/about", "/courses", "/contact"],
  },
  {
    name: "Teacher Singh",
    userAgent:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    pages: ["/", "/courses", "/resources", "/results"],
  },
  {
    name: "Student Rahul",
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Mobile/15E148 Safari/604.1",
    pages: ["/", "/resources", "/courses", "/about"],
  },
  {
    name: "Parent Gupta",
    userAgent:
      "Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.6613.88 Mobile Safari/537.36",
    pages: ["/", "/contact", "/courses", "/results"],
  },
  {
    name: "Student Neha",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0",
    pages: ["/", "/courses", "/about", "/resources"],
  },
]

async function runVisitorSession(browser, visitor, index) {
  console.log(`[Start] Visitor ${index + 1}: ${visitor.name}`)

  const context = await browser.newContext({
    userAgent: visitor.userAgent,
    locale: "en-IN",
    timezoneId: "Asia/Kolkata",
    geolocation: { latitude: 30.3165, longitude: 78.0322 }, // Dehradun coordinates
    permissions: ["geolocation"],
    viewport: visitor.userAgent.includes("Mobile")
      ? { width: 390, height: 844 }
      : { width: 1366, height: 768 },
  })

  const page = await context.newPage()

  try {
    for (const path of visitor.pages) {
      const fullUrl = `${BASE_URL}${path}`
      console.log(`[Visit] ${visitor.name} navigating to ${fullUrl}`)

      try {
        await page.goto(fullUrl, { waitUntil: "domcontentloaded", timeout: 30000 })
      } catch (err) {
        console.warn(`[Warn] ${visitor.name} load timed out for ${path}: ${err.message}`)
      }

      // Wait 10-18 seconds on page so Google Analytics records active engagement
      const dwellMs = Math.floor(Math.random() * 8000) + 10000
      console.log(`[Engage] ${visitor.name} browsing ${path} for ${Math.round(dwellMs / 1000)}s...`)

      // Small natural scroll to simulate genuine human reading
      try {
        await page.evaluate(() => window.scrollBy(0, 300))
      } catch {}

      await new Promise((r) => setTimeout(r, dwellMs))
    }

    console.log(`[Complete] ${visitor.name} finished session.`)
  } catch (err) {
    console.error(`[Error] Visitor ${visitor.name} failed:`, err)
  } finally {
    await context.close()
  }
}

async function main() {
  console.log(`Launching real browser simulation targeting: ${BASE_URL}`)
  console.log(`Simulating ${VISITORS.length} simultaneous active visitors...`)

  const browser = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
    ],
  })

  try {
    // Run all 7 visitors CONCURRENTLY so they appear simultaneously as Active Users in GA Realtime!
    await Promise.all(
      VISITORS.map((visitor, idx) => runVisitorSession(browser, visitor, idx))
    )
    console.log("All visitor sessions completed successfully!")
  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  console.error("Simulation run failed:", err)
  process.exit(1)
})
