import fs from "fs";

async function checkSeo(url) {
  const res = await fetch(url);
  const text = await res.text();

  const titleMatch = text.match(/<title>(.*?)<\/title>/i);
  const descMatch = text.match(/<meta[^>]+name=["']description["'][^>]+content=["'](.*?)["']/i);
  const canonMatch = text.match(/<link[^>]+rel=["']canonical["'][^>]+href=["'](.*?)["']/i);
  const robotsMatch = text.match(/<meta[^>]+name=["']robots["'][^>]+content=["'](.*?)["']/i);
  const ogTitleMatch = text.match(/<meta[^>]+property=["']og:title["'][^>]+content=["'](.*?)["']/i);

  console.log(`\n=== SEO Audit: ${url} ===`);
  console.log("Status:", res.status);
  console.log("Title:", titleMatch ? titleMatch[1] : "NONE");
  console.log("Description:", descMatch ? descMatch[1] : "NONE");
  console.log("Canonical:", canonMatch ? canonMatch[1] : "NONE");
  console.log("Robots:", robotsMatch ? robotsMatch[1] : "DEFAULT");
  console.log("OG Title:", ogTitleMatch ? ogTitleMatch[1] : "NONE");
  console.log("Body has <h1>:", text.includes("<h1"));
}

async function run() {
  await checkSeo("https://sixbytes.in/about");
  await checkSeo("https://sixbytes.in/courses");
  await checkSeo("https://sixbytes.in/resources");
  await checkSeo("https://sixbytes.in/resources/carbon-and-its-compounds-class-10-chemistry-ncert-notes");
  await checkSeo("https://sixbytes.in/resources/real-numbers-class-10-maths-ncert-notes");
}

run().catch(console.error);
