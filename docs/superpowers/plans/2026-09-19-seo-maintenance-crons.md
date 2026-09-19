# Legitimate SEO Maintenance and Search Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use bite-sized test-first tasks.

## Objective

Replace the existing synthetic traffic/search jobs with auditable SEO maintenance, make scheduled failures visible, protect cron endpoints, and count real resource-library searches in GA4/Clarity.

## Scope and files

- `app/api/cron/seo-maintenance/route.ts`: protected, read-only sitemap/robots/public-route/resource-API health check.
- `app/api/cron/local-search-pinger/route.ts`: remove the synthetic-search behavior and return a safe deprecation response.
- `app/api/cron/resource-reader/route.ts`: remove synthetic reads and view-count mutation; return a safe deprecation response.
- `vercel.json`: schedule only the maintenance endpoint.
- `.github/workflows/traffic-crons.yml`: call the protected maintenance endpoint, fail on non-2xx or `{ success: false }`, and remove deprecated Google sitemap pinging.
- `lib/cron-auth.ts`: shared bearer-token validation for scheduled routes.
- `lib/analytics.ts`: add a real resource-search event helper.
- `app/resources/resources-client.tsx`: emit the search event after a successful user-triggered search request.
- `tests/seo-and-roles.test.mjs`: cover cron authorization/response helpers and search analytics payload behavior where practical.
- `docs/superpowers/plans/2026-09-19-seo-maintenance-crons.md`: this plan.

## Task sequence

1. Write failing tests for cron authorization, maintenance result semantics, and resource-search event payloads; run the test suite and confirm the expected failures.
2. Implement the shared cron authorization and read-only maintenance checks with bounded timeouts and non-sensitive error responses.
3. Replace the two synthetic cron handlers with deprecation responses so old URLs cannot mutate analytics or resource view counts.
4. Update Vercel and GitHub schedules to invoke only the protected maintenance check; remove `|| true` and the deprecated Google sitemap ping.
5. Add consent-aware real search-event tracking to the resource library without fabricating referrers, users, IPs, or views.
6. Run unit tests, TypeScript/build checks, lint on changed files, and a local authenticated maintenance-route smoke test.
7. Review the staged diff for secrets and commit/push only after all checks pass.

## Acceptance criteria

- No scheduled job fabricates search traffic, IPs, referrers, user agents, or resource reads.
- No cron endpoint mutates `viewCount`.
- Unauthenticated cron requests return `401`; a wrong secret never runs checks.
- GitHub Actions fails when the deployed endpoint fails.
- The maintenance response reports sitemap URL count and resource URL count without secrets.
- Real resource searches emit `resource_search` with the query and active filters.
- `MONGO_URI` remains a Vercel environment variable and is never committed.
