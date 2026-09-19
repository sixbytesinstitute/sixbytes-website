const baseUrl = (process.env.SEO_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const publicPaths = ["/", "/about", "/courses", "/results", "/resources", "/contact"];

function decodeHtml(value = "") {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function getMeta(html, attribute, value) {
  const pattern = new RegExp(`<meta[^>]+${attribute}=["']${value}["'][^>]*>`, "i");
  const tag = html.match(pattern)?.[0] || "";
  return decodeHtml(tag.match(/content=["']([^"']*)["']/i)?.[1] || "");
}

function getCanonical(html) {
  return decodeHtml(html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] || "");
}

async function fetchPage(path) {
  const url = new URL(path, baseUrl).toString();
  const response = await fetch(url);
  const html = await response.text();
  const title = decodeHtml(html.match(/<title>(.*?)<\/title>/is)?.[1] || "");
  const description = getMeta(html, "name", "description");
  const canonical = getCanonical(html);
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const og = {
    title: getMeta(html, "property", "og:title"),
    description: getMeta(html, "property", "og:description"),
    image: getMeta(html, "property", "og:image"),
  };

  return {
    path,
    status: response.status,
    title,
    description,
    canonical,
    h1Count,
    og,
    internalResourceLinks: (html.match(/href=["']\/resources\//gi) || []).length,
  };
}

function printPageReport(result) {
  const problems = [];
  if (result.status !== 200) problems.push(`HTTP ${result.status}`);
  if (!result.title || result.title.length > 60) problems.push(`title ${result.title.length}/60`);
  if (!result.description || result.description.length > 160) problems.push(`description ${result.description.length}/160`);
  if (result.h1Count !== 1) problems.push(`${result.h1Count} H1 tags`);
  if (!result.canonical) problems.push("missing canonical");
  if (!result.og.title || !result.og.description || !result.og.image) problems.push("incomplete Open Graph tags");

  console.log(`${problems.length ? "FAIL" : "PASS"} ${result.path} — ${problems.join(", ") || "metadata and headings valid"}`);
  return problems.length;
}

async function run() {
  console.log(`SEO audit target: ${baseUrl}`);
  let failures = 0;

  for (const path of publicPaths) {
    try {
      failures += printPageReport(await fetchPage(path));
    } catch (error) {
      failures += 1;
      console.error(`FAIL ${path} — ${error.message}`);
    }
  }

  try {
    const sitemapResponse = await fetch(new URL("/sitemap.xml", baseUrl));
    const sitemap = await sitemapResponse.text();
    const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/gi)].map((match) => decodeHtml(match[1]));
    const resourceUrls = sitemapUrls.filter((url) => url.includes("/resources/") && !url.endsWith("/resources/"));
    const resourceIndex = await fetchPage("/resources");
    console.log(`SITEMAP ${sitemapUrls.length} URLs — ${resourceUrls.length} resource URLs; resource index exposes ${resourceIndex.internalResourceLinks} internal resource links`);

    for (const url of resourceUrls) {
      const path = new URL(url).pathname;
      try {
        failures += printPageReport(await fetchPage(path));
      } catch (error) {
        failures += 1;
        console.error(`FAIL ${path} — ${error.message}`);
      }
    }
  } catch (error) {
    failures += 1;
    console.error(`FAIL /sitemap.xml — ${error.message}`);
  }

  process.exitCode = failures ? 1 : 0;
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
