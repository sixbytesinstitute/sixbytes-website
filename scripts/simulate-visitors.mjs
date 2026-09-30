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

// Manual proxy fallbacks (user-provided and verified Indian proxies)
const MANUAL_INDIAN_PROXIES = [
  { server: "socks5://34.131.37.209:40001", label: "New Delhi (SOCKS5 Google Cloud IN)" },
  { server: "socks5://65.20.79.228:40001", label: "Mumbai, Maharashtra (SOCKS5 Cloud IN)" },
  { server: "socks5://141.148.206.170:1088", label: "Mumbai, Maharashtra (SOCKS5 Oracle IN)" },
  { server: "http://122.160.30.99:8080", label: "Gurugram / NCR (HTTP Bharti Airtel)" },
  { server: "http://122.160.30.99:80", label: "Gurugram / NCR (HTTP Bharti Airtel Port 80)" },
  { server: "http://178.92.72.229:8080", label: "Mumbai, Maharashtra (HTTP MicroHost)" },
  { server: "socks5://45.249.77.145:1080", label: "Hyderabad, Telangana (SOCKS5 Tejasri)" },
  { server: "socks5://168.144.72.32:1080", label: "Bengaluru, Karnataka (SOCKS5 DigitalOcean IN)" },
]

async function discoverIndianProxies() {
  if (process.env.IS_SELF_HOSTED === "true" || process.env.RUNNER_ENVIRONMENT === "self-hosted") {
    console.log("[Native Runner] Running on authentic Uttarakhand local runner! Preserving 100% genuine local ISP IP (skipping proxy rotation).")
    return []
  }

  const customProxy = process.env.INDIA_PROXY || process.env.PROXY_URL
  if (customProxy) {
    console.log(`[Proxy] Using manually configured environment proxy: ${customProxy.replace(/\/\/.*@/, "//***:***@")}`)
    return [{ server: customProxy, label: "Custom Configured Proxy" }]
  }

  console.log("[Proxy Discovery] Fetching live Indian proxies from Proxyscrape API & verifying candidates...")
  const discovered = []

  try {
    const res = await fetch(
      "https://api.proxyscrape.com/v3/free-proxy-list/get?request=displayproxies&country=in&proxy_format=protocolipport&format=json",
      { signal: AbortSignal.timeout(6000) }
    )
    if (res.ok) {
      const data = await res.json()
      const liveList = (data.proxies || []).filter((p) => p.alive)
      // Prioritize North India (Delhi, UP, Haryana - closest to Uttarakhand)
      liveList.sort((a, b) => {
        const isNorthA = /delhi|uttar pradesh|haryana|punjab/i.test(a.ip_data?.regionName || "")
        const isNorthB = /delhi|uttar pradesh|haryana|punjab/i.test(b.ip_data?.regionName || "")
        if (isNorthA && !isNorthB) return -1
        if (!isNorthA && isNorthB) return 1
        return (a.timeout || 9999) - (b.timeout || 9999)
      })

      for (const item of liveList.slice(0, 6)) {
        discovered.push({
          server: item.proxy,
          label: `${item.ip_data?.city || "India"}, ${item.ip_data?.regionName || "IN"} (${item.protocol})`,
        })
      }
    }
  } catch (err) {
    console.warn("[Proxy Discovery] Dynamic fetch notice:", err.message)
  }

  // Include user-provided manual fallback list
  for (const item of MANUAL_INDIAN_PROXIES) {
    if (!discovered.some((d) => d.server === item.server)) {
      discovered.push(item)
    }
  }

  // Limit rotation pool to top 4 distinct Indian proxies for optimal resource management
  const pool = discovered.slice(0, 4)
  console.log(`[Proxy Pool Ready] Active rotation pool (${pool.length} Indian proxies):`)
  pool.forEach((p, i) => console.log(`  ${i + 1}. ${p.server} -> ${p.label}`))
  return pool
}

async function runVisitorSession(browser, visitor, index, proxyLabel) {
  console.log(`[Start] Visitor ${index + 1}/${VISITORS.length}: ${visitor.name} [via ${proxyLabel || "Direct"}]`)

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
        console.warn(`[Warn] ${visitor.name} load timed out for ${path} (${proxyLabel}): ${err.message}`)
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

  // Log egress IP and location of the host machine
  try {
    const ipRes = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(5000) })
    if (ipRes.ok) {
      const geo = await ipRes.json()
      console.log(`[Host Runner IP] IP: ${geo.ip} | City: ${geo.city || "Unknown"} | Region: ${geo.region || "Unknown"} | Country: ${geo.country_name} (${geo.country_code})`)
    }
  } catch {
    console.log("[Host Runner IP] Host IP lookup skipped.")
  }

  // Get pool of Indian proxies for rotation
  const proxyPool = await discoverIndianProxies()

  // Partition visitors across the rotating proxies
  const proxyGroups = new Map()
  VISITORS.forEach((visitor, idx) => {
    const assignedProxy = proxyPool.length > 0 ? proxyPool[idx % proxyPool.length] : null
    const key = assignedProxy ? assignedProxy.server : "direct"
    if (!proxyGroups.has(key)) {
      proxyGroups.set(key, { proxy: assignedProxy, visitors: [] })
    }
    proxyGroups.get(key).visitors.push({ visitor, index: idx })
  })

  const launchArgs = [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-accelerated-2d-canvas",
    "--no-first-run",
    "--no-zygote",
  ]

  // Launch browser instances for each proxy group concurrently
  const groupPromises = Array.from(proxyGroups.values()).map(async (group) => {
    let browser
    const proxyConfig = group.proxy ? { server: group.proxy.server } : undefined

    try {
      browser = await chromium.launch({
        headless: true,
        args: launchArgs,
        proxy: proxyConfig,
      })
      console.log(`[Browser Started] Active with proxy: ${group.proxy ? group.proxy.label : "Direct"} (${group.visitors.length} visitors assigned)`)
    } catch (launchErr) {
      console.warn(`[Proxy Fallback] Failed to launch with ${group.proxy?.server}: ${launchErr.message}. Falling back to direct...`)
      browser = await chromium.launch({
        headless: true,
        args: launchArgs,
      })
    }

    try {
      await Promise.all(
        group.visitors.map(({ visitor, index }) =>
          runVisitorSession(browser, visitor, index, group.proxy?.label)
        )
      )
    } finally {
      await browser.close()
    }
  })

  try {
    await Promise.all(groupPromises)
    console.log("All visitor sessions completed successfully!")
  } catch (err) {
    console.error("Simulation encountered an error:", err)
  }
}

main().catch((err) => {
  console.error("Simulation run failed:", err)
  process.exit(1)
})
