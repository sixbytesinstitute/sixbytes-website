/**
 * Automated Bulk Indexing Script: IndexNow
 * Submits all pages and educational resources from sitemap.xml to Bing, Yahoo, Yandex,
 * and all participating search engines in a single batch request.
 */

const INDEXNOW_KEY = "e3d489b52a7140f0985f47289f6b2169";
const HOST = "sixbytes.in";
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

async function fetchSitemapUrls() {
  const res = await fetch(`https://${HOST}/sitemap.xml`);
  const text = await res.text();
  const matches = text.match(/<loc>(.*?)<\/loc>/g) || [];
  return matches.map((m) => m.replace(/<\/?loc>/g, "").trim());
}

async function submitIndexNow() {
  console.log("🔍 Fetching all live URLs from sitemap...");
  const urls = await fetchSitemapUrls();
  console.log(`Found ${urls.length} total URLs to index in bulk:`);
  urls.forEach((u, i) => console.log(` ${i + 1}. ${u}`));

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  const endpoints = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
  ];

  console.log("\n🚀 Submitting all URLs in bulk to search engines...");
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
      });

      console.log(`📡 [${endpoint}] -> HTTP ${response.status} (${response.statusText})`);
      if (response.status === 200 || response.status === 202) {
        console.log(`   ✅ Success: ${urls.length} URLs submitted to search engine queue!`);
      } else {
        const errText = await response.text().catch(() => "");
        console.log(`   ⚠️ Response: ${errText}`);
      }
    } catch (err) {
      console.error(`   ❌ Failed to connect to ${endpoint}:`, err.message);
    }
  }

  console.log("\n🏁 Bulk indexing submission process complete.");
}

submitIndexNow().catch(console.error);
