import { NextRequest, NextResponse } from "next/server";
import { isCronAuthorized } from "@/lib/cron-auth";
import { isSuccessfulHttpStatus, parseSitemapUrls, SEO_HEALTH_PATHS } from "@/lib/seo-maintenance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REQUEST_TIMEOUT_MS = 8000;
const CRON_SECRET = process.env.CRON_SECRET;

type CheckResult = {
  ok: boolean;
  status: number;
  error?: "request_failed" | "invalid_json" | "unsuccessful_status";
};

async function checkUrl(url: string): Promise<CheckResult> {
  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: { "User-Agent": "SixBytes-SEO-Maintenance/1.0" },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    return {
      ok: isSuccessfulHttpStatus(response.status),
      status: response.status,
      ...(isSuccessfulHttpStatus(response.status) ? {} : { error: "unsuccessful_status" }),
    };
  } catch {
    return { ok: false, status: 0, error: "request_failed" };
  }
}

export async function GET(request: NextRequest) {
  if (!isCronAuthorized(request.headers.get("authorization"), CRON_SECRET)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "https://sixbytes.in").replace(/\/$/, "");
  const checks: Record<string, CheckResult> = {};

  for (const path of SEO_HEALTH_PATHS) {
    checks[path] = await checkUrl(`${baseUrl}${path}`);
  }

  const robots = await checkUrl(`${baseUrl}/robots.txt`);
  const sitemap = await checkUrl(`${baseUrl}/sitemap.xml`);
  const resourcesApi = await checkUrl(`${baseUrl}/api/resources`);

  let sitemapUrls: string[] = [];
  if (sitemap.ok) {
    try {
      const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`, {
        cache: "no-store",
        headers: { "User-Agent": "SixBytes-SEO-Maintenance/1.0" },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      sitemapUrls = parseSitemapUrls(await sitemapResponse.text());
    } catch {
      sitemapUrls = [];
    }
  }

  let resourcesApiCheck = resourcesApi;
  if (resourcesApi.ok) {
    try {
      const resourcesResponse = await fetch(`${baseUrl}/api/resources`, {
        cache: "no-store",
        headers: { "User-Agent": "SixBytes-SEO-Maintenance/1.0" },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      const payload = (await resourcesResponse.json()) as { success?: boolean };
      if (payload.success !== true) {
        resourcesApiCheck = { ...resourcesApi, ok: false, error: "invalid_json" };
      }
    } catch {
      resourcesApiCheck = { ok: false, status: resourcesApi.status, error: "invalid_json" };
    }
  }

  const allChecks = [...Object.values(checks), robots, sitemap, resourcesApiCheck];
  const success = allChecks.every((check) => check.ok);

  return NextResponse.json(
    {
      success,
      checkedAt: new Date().toISOString(),
      checks: {
        pages: checks,
        robots,
        sitemap,
        resourcesApi: resourcesApiCheck,
      },
      sitemapSummary: {
        urlCount: sitemapUrls.length,
        resourceUrlCount: sitemapUrls.filter((url) => /\/resources\//.test(url)).length,
      },
    },
    { status: success ? 200 : 503 },
  );
}
