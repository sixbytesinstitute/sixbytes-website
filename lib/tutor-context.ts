import connectDB from "./mongodb"
import Resource from "../models/Resource"

const MAX_CONTEXT_LENGTH = 3500

function stripHtml(html: string): string {
  if (!html) return ""
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim()
}

/**
 * Returns contextual metadata for any standard website route.
 */
export function getRoutePageContext(pathname?: string, pageTitle?: string): { pageTitle: string; context: string } {
  if (!pathname || pathname === "/") {
    return {
      pageTitle: "Home Page",
      context: "User is viewing the SixBytes Educational Institute homepage (overview of learning philosophy, scientific coaching methodology, ICSE/CBSE programs, and faculty).",
    }
  }

  if (pathname === "/courses") {
    return {
      pageTitle: "Courses & Batches",
      context: "User is browsing SixBytes academic courses (ICSE & CBSE Classes 9–12, Foundation engineering & medical batches, small-batch mentoring, curriculum).",
    }
  }

  if (pathname === "/about") {
    return {
      pageTitle: "About SixBytes Institute",
      context: "User is reading about SixBytes Institute's founding, research on student learning psychology, faculty, and academic philosophy.",
    }
  }

  if (pathname === "/results") {
    return {
      pageTitle: "Student Results & Success Stories",
      context: "User is viewing SixBytes academic track record, board toppers, percentiles, and testimonials.",
    }
  }

  if (pathname === "/contact") {
    return {
      pageTitle: "Admissions & Inquiries",
      context: "User is on the contact & admissions page (inquiries regarding batches, test-prep counseling, institute location in Dehradun).",
    }
  }

  if (pathname === "/resources") {
    return {
      pageTitle: "Academic Resource Library",
      context: "User is browsing the SixBytes open curriculum library (study guides, revision notes, formula sheets, solved problems).",
    }
  }

  if (pathname === "/dashboard") {
    return {
      pageTitle: "Student Learning Dashboard",
      context: "Student is on their personal dashboard (activity tracking, learning velocity momentum curve, streak telemetry, and quick study links).",
    }
  }

  if (pathname.startsWith("/admin/users")) {
    return {
      pageTitle: "Admin Portal • User Directory",
      context: "Administrator is in the User Management Directory managing accounts, changing user roles (Student, Faculty, Manager, Admin), and student enrollments.",
    }
  }

  if (pathname.startsWith("/admin/resources")) {
    return {
      pageTitle: "Admin Portal • Resource Studio",
      context: "Administrator is in the Resource Studio drafting, editing, and publishing academic study guides and formulas.",
    }
  }

  if (pathname.startsWith("/admin")) {
    return {
      pageTitle: "Admin Portal • Executive Overview",
      context: "Administrator is viewing the administrative command center.",
    }
  }

  if (pathname.startsWith("/faculty")) {
    return {
      pageTitle: "Faculty Portal",
      context: "Faculty member is viewing student batches, study materials, assignments, or notices.",
    }
  }

  if (pathname.startsWith("/manager")) {
    return {
      pageTitle: "Manager Portal",
      context: "Manager is reviewing institute operations, materials, and student workflows.",
    }
  }

  const title = pageTitle ? pageTitle.split("|")[0].trim() : pathname
  return {
    pageTitle: title,
    context: `User is viewing page: ${pathname} (${title}).`,
  }
}

export async function fetchTutorContext(
  userMessage: string,
  resourceSlug?: string,
  pathname?: string,
  pageTitle?: string
): Promise<{ context: string; resourceTitle?: string; isResourcePage: boolean }> {
  try {
    await connectDB()

    // 1. Direct page context if student is actively reading a specific resource guide
    if (resourceSlug) {
      const resource = await Resource.findOne({
        slug: resourceSlug,
        published: true,
      })
        .select("title subject targetClass content keywords")
        .lean() as { title?: string; subject?: string; targetClass?: string; content?: string } | null

      if (resource) {
        const plain = stripHtml(resource.content || "")
        const preview = plain.slice(0, MAX_CONTEXT_LENGTH)
        return {
          context: `Subject: ${resource.subject}\nClass: ${resource.targetClass}\nTopic: ${resource.title}\n\nExcerpts:\n${preview}`,
          resourceTitle: resource.title,
          isResourcePage: true,
        }
      }
    }

    // 2. If the user is on a standard non-resource webpage, lock context to the CURRENT opened webpage
    const isResourceRoute = pathname?.startsWith("/resources/") && !pathname.endsWith("/resources")
    if (!isResourceRoute && pathname) {
      const routeInfo = getRoutePageContext(pathname, pageTitle)
      return {
        context: routeInfo.context,
        resourceTitle: routeInfo.pageTitle,
        isResourcePage: false,
      }
    }

    // 3. Keyword-based discovery ONLY when on resource library or explicit academic lookup
    const stopWords = new Set([
      "what", "is", "the", "how", "why", "when", "where", "can", "you",
      "tell", "explain", "please", "help", "with", "this", "that", "about",
      "from", "into", "some", "have", "been", "will", "would", "should",
      "give", "step", "first", "next", "formula", "analogy", "intuitive",
      "hint", "answer", "solve", "need", "know", "mean", "mode"
    ])

    const tokens = userMessage
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 3 && !stopWords.has(t))
      .slice(0, 4)

    if (tokens.length > 0) {
      // Use exact word boundary regex so "give" never matches "Ogive"
      const regexQuery = tokens.map((t) => new RegExp(`\\b${t}\\b`, "i"))

      const matchedResources = await Resource.find({
        published: true,
        $or: [
          { title: { $in: regexQuery } },
          { keywords: { $in: regexQuery } },
        ],
      })
        .select("title subject targetClass content")
        .limit(1)
        .lean() as Array<{ title?: string; subject?: string; targetClass?: string; content?: string }>

      if (matchedResources.length > 0 && matchedResources[0]) {
        const clean = stripHtml(matchedResources[0].content || "").slice(0, 1500)
        return {
          context: `Topic: ${matchedResources[0].title} (${matchedResources[0].subject}, Class ${matchedResources[0].targetClass})\nSummary Content: ${clean}`,
          resourceTitle: matchedResources[0].title,
          isResourcePage: true,
        }
      }
    }

    // Fallback to route context
    const routeInfo = getRoutePageContext(pathname, pageTitle)
    return {
      context: routeInfo.context,
      resourceTitle: routeInfo.pageTitle,
      isResourcePage: false,
    }
  } catch (err) {
    console.error("[Tutor Context] Error querying context:", err)
    const routeInfo = getRoutePageContext(pathname, pageTitle)
    return {
      context: routeInfo.context,
      resourceTitle: routeInfo.pageTitle,
      isResourcePage: false,
    }
  }
}
