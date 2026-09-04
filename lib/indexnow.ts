/**
 * IndexNow Auto-Submission Utility
 * Automatically pings Bing, Yandex, and IndexNow search engines when content is published or updated.
 */

const INDEXNOW_KEY = "e3d489b52a7140f0985f47289f6b2169";
const HOST = "sixbytes.in";
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

export async function submitUrlsToIndexNow(urls: string[]): Promise<boolean> {
  if (!urls || urls.length === 0) return false;

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

  try {
    const promises = endpoints.map((endpoint) =>
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(6000),
      }).catch((err) => {
        console.warn(`[IndexNow] Error pinging ${endpoint}:`, err.message);
        return null;
      })
    );

    await Promise.all(promises);
    return true;
  } catch (err) {
    console.warn("[IndexNow] Submission exception:", err);
    return false;
  }
}
