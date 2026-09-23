import { chromium } from "playwright"

const BASE_URL = process.env.TARGET_URL || "https://sixbytes.in"

const VISITORS = [
  {
    name: "Student Ankit (CBSE Class 10)",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    pages: ["/", "/courses", "/resources", "/about"],
  },
  {
    name: "Student Priya (ICSE Class 10)",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    pages: ["/", "/resources", "/results", "/courses"],
  },
  {
    name: "Parent Sharma (Premnagar)",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0",
    pages: ["/", "/about", "/courses", "/contact"],
  },
  {
    name: "Teacher Singh (Senior Educator)",
    userAgent:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    pages: ["/", "/courses", "/resources", "/results"],
  },
  {
    name: "Student Rahul (Class 12 Science)",
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Mobile/15E148 Safari/604.1",
    pages: ["/", "/resources", "/courses", "/about"],
  },
  {
    name: "Parent Gupta (NDA Aspirant Parent)",
    userAgent:
      "Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.6613.88 Mobile Safari/537.36",
    pages: ["/", "/contact", "/courses", "/results"],
  },
  {
    name: "Student Neha (Class 9 Foundation)",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0",
    pages: ["/", "/courses", "/about", "/resources"],
  },
  {
    name: "Student Vikram (NDA & RIMC Aspirant)",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    pages: ["/", "/courses", "/results", "/contact"],
  },
  {
    name: "Student Sneha (Board Revision)",
    userAgent:
      "Mozilla/5.0 (Linux; Android 13; Pixel 7 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.6533.103 Mobile Safari/537.36",
    pages: ["/", "/resources", "/results", "/courses"],
  },
  {
    name: "Parent Verma (Sainik School Admission)",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
    pages: ["/", "/courses", "/contact", "/about"],
  },
  {
    name: "Student Aarav (CBSE Science Guides)",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0",
    pages: ["/", "/resources", "/about", "/courses"],
  },
  {
    name: "Parent Rawat (Class 11 PCM Enrolment)",
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 16_7_10 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
    pages: ["/", "/about", "/courses", "/contact"],
  },
  {
    name: "Student Rohit (Class 10 PYQ Solutions)",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    pages: ["/resources", "/courses", "/"],
  },
  {
    name: "Student Tanvi (Class 12 Maths Formulae)",
    userAgent:
      "Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.6613.88 Mobile Safari/537.36",
    pages: ["/resources", "/courses", "/about"],
  },
  {
    name: "Parent Negi (Premnagar Defence Aspirant)",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0",
    pages: ["/courses", "/results", "/contact"],
  },
  {
    name: "Student Ayush (ICSE Physics Revision)",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15",
    pages: ["/resources", "/courses", "/"],
  },
  {
    name: "Student Mansi (Computer Science Python Notes)",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0",
    pages: ["/resources", "/courses", "/results"],
  },
  {
    name: "Parent Chauhan (CBSE Coaching Dehradun)",
    userAgent:
      "Mozilla/5.0 (Linux; Android 13; SM-A536B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.6613.99 Mobile Safari/537.36",
    pages: ["/", "/courses", "/contact"],
  },
]

async function runVisitorSession(browser, visitor, index) {
  console.log(`[Start] Visitor ${index + 1}/${VISITORS.length}: ${visitor.name}`)

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
    // Run all 12 visitors CONCURRENTLY so they appear simultaneously as Active Users in GA Realtime!
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
