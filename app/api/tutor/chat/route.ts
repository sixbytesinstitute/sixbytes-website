import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken, COOKIE_NAME } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import UserActivity from "@/models/UserActivity"
import { logActivity } from "@/lib/activity"
import { buildTutorPrompt } from "@/lib/tutor-prompt"
import { fetchTutorContext } from "@/lib/tutor-context"

// In-memory rate limiting & IP tracking for anonymous visitors
const anonDailyUsage = new Map<string, { date: string; count: number }>()

const FREE_ANON_LIMIT = 3
const FREE_REGISTERED_LIMIT = 10
const ENROLLED_STUDENT_LIMIT = 40

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  return req.headers.get("x-real-ip") || "unknown"
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message, resourceSlug, history, pathname, pageTitle } = body

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "A message is required." },
        { status: 400 }
      )
    }

    if (message.length > 600) {
      return NextResponse.json(
        { error: "Message too long. Please keep questions under 600 characters." },
        { status: 400 }
      )
    }

    const today = new Date().toISOString().slice(0, 10)

    // Check user authentication
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(COOKIE_NAME)
    const token = sessionCookie?.value ? verifyToken(sessionCookie.value) : null

    let userId: string | null = null
    let isEnrolled = false
    let studentClass = ""
    let remainingQuestions = 0
    let userRole = "anonymous"

    if (token) {
      await connectDB()
      const dbUser = await User.findById(token.userId).select("isEnrolled class role").lean() as {
        isEnrolled?: boolean
        class?: string
        role?: string
      } | null

      if (dbUser) {
        userId = token.userId
        userRole = dbUser.role || "student"
        isEnrolled = dbUser.isEnrolled ?? false
        studentClass = dbUser.class || ""

        // Staff roles (admin, manager, faculty) get unlimited access — no quota checks
        const isStaff = userRole === "admin" || userRole === "manager" || userRole === "faculty"

        if (isStaff) {
          remainingQuestions = 99999
        } else if (isEnrolled) {
          // Track and limit enrolled student usage (40 questions/day) to prevent API exhaustion
          const todayActivity = await UserActivity.findOne({
            userId,
            date: today,
          }).select("tutorQuestions").lean() as { tutorQuestions?: number } | null

          const askedToday = todayActivity?.tutorQuestions || 0
          if (askedToday >= ENROLLED_STUDENT_LIMIT) {
            return NextResponse.json(
              {
                error: `Daily Bity quota reached (${ENROLLED_STUDENT_LIMIT}/${ENROLLED_STUDENT_LIMIT} questions). Your allocation resets at midnight!`,
                code: "LIMIT_REACHED",
                tier: "enrolled",
                limit: ENROLLED_STUDENT_LIMIT,
                remaining: 0,
              },
              { status: 429 }
            )
          }

          remainingQuestions = ENROLLED_STUDENT_LIMIT - askedToday - 1
        } else {
          // Check today's usage for free registered user (10 questions/day)
          const todayActivity = await UserActivity.findOne({
            userId,
            date: today,
          }).select("tutorQuestions").lean() as { tutorQuestions?: number } | null

          const askedToday = todayActivity?.tutorQuestions || 0
          if (askedToday >= FREE_REGISTERED_LIMIT) {
            return NextResponse.json(
              {
                error: `Daily limit reached (${FREE_REGISTERED_LIMIT}/${FREE_REGISTERED_LIMIT} questions used). Enroll at SixBytes for extended quota (40/day) and complete mentor access!`,
                code: "LIMIT_REACHED",
                tier: "free_registered",
                limit: FREE_REGISTERED_LIMIT,
                remaining: 0,
              },
              { status: 429 }
            )
          }

          remainingQuestions = FREE_REGISTERED_LIMIT - askedToday - 1
        }
      }
    }

    // Anonymous visitor check (3 questions/day)
    if (!userId) {
      const clientIp = getClientIp(req)
      const usage = anonDailyUsage.get(clientIp)

      let askedToday = 0
      if (usage && usage.date === today) {
        askedToday = usage.count
      }

      if (askedToday >= FREE_ANON_LIMIT) {
        return NextResponse.json(
          {
            error: `Daily limit reached for visitors (${FREE_ANON_LIMIT}/${FREE_ANON_LIMIT} questions). Create a free SixBytes account to get 10 questions daily!`,
            code: "LIMIT_REACHED",
            tier: "anonymous",
            limit: FREE_ANON_LIMIT,
            remaining: 0,
          },
          { status: 429 }
        )
      }

      anonDailyUsage.set(clientIp, { date: today, count: askedToday + 1 })
      remainingQuestions = FREE_ANON_LIMIT - askedToday - 1
    }

    // 1. Fetch SixBytes Context (tied to the current opened webpage or study resource)
    const { context, resourceTitle, isResourcePage } = await fetchTutorContext(
      message,
      resourceSlug,
      pathname,
      pageTitle
    )

    // 2. Build Socratic Intuition System Prompt
    const systemPrompt = buildTutorPrompt(context, resourceTitle, studentClass)

    // 3. Call LLM (Custom Fine-Tuned Model OR Gemini API with multi-key fallback)
    const customApiUrl = process.env.CUSTOM_AI_API_URL || process.env.OPENAI_BASE_URL || process.env.OPENAI_API_BASE
    const openAiKey = process.env.OPENAI_API_KEY || process.env.CUSTOM_AI_KEY
    const geminiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_AI_API_KEY ||
      process.env.GEMINI_KEY

    let answerText = ""

    // 3A. Priority 1: Custom Fine-Tuned / OpenAI-compatible endpoint
    if (customApiUrl || openAiKey) {
      try {
        const baseUrl = customApiUrl?.replace(/\/$/, "") || "https://api.openai.com/v1"
        const modelName = process.env.CUSTOM_AI_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini"
        const formattedMessages = [
          { role: "system", content: systemPrompt },
        ]

        if (Array.isArray(history)) {
          for (const item of history.slice(-6)) {
            if (item.role === "user" || item.role === "assistant") {
              formattedMessages.push({
                role: item.role,
                content: item.content || item.text || "",
              })
            }
          }
        }
        formattedMessages.push({ role: "user", content: message })

        const endpoint = baseUrl.endsWith("/chat/completions") ? baseUrl : `${baseUrl}/chat/completions`
        const openAiRes = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(openAiKey ? { Authorization: `Bearer ${openAiKey}` } : {}),
          },
          body: JSON.stringify({
            model: modelName,
            messages: formattedMessages,
            temperature: 0.35,
            max_tokens: 600,
          }),
        })

        if (openAiRes.ok) {
          const openAiData = await openAiRes.json()
          answerText = openAiData?.choices?.[0]?.message?.content || ""
        } else {
          console.error("[Custom AI API Error]", openAiRes.status, await openAiRes.text())
        }
      } catch (customErr) {
        console.error("[Custom AI Error]", customErr)
      }
    }

    // 3B. Priority 2: Gemini API with multi-model fallback (if custom model not configured or failed)
    if (!answerText && geminiKey) {
      const formattedContents: Array<{ role: string; parts: Array<{ text: string }> }> = []

      if (Array.isArray(history)) {
        for (const item of history.slice(-6)) {
          if (item.role === "user" || item.role === "model" || item.role === "assistant") {
            formattedContents.push({
              role: item.role === "assistant" ? "model" : item.role,
              parts: [{ text: item.content || item.text || "" }],
            })
          }
        }
      }

      formattedContents.push({
        role: "user",
        parts: [{ text: message }],
      })

      // Ordered fallback chain: try each model until one succeeds
      const modelsToTry = process.env.GEMINI_MODEL
        ? [process.env.GEMINI_MODEL]
        : ["gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-flash-latest"]

      for (const model of modelsToTry) {
        try {
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`

          const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              system_instruction: {
                parts: [{ text: systemPrompt }],
              },
              contents: formattedContents,
              generationConfig: {
                temperature: 0.5,
                maxOutputTokens: 1024,
              },
            }),
          })

          if (response.ok) {
            const resData = await response.json()
            answerText = resData?.candidates?.[0]?.content?.parts?.[0]?.text || ""
            if (answerText) break
          } else {
            const errText = await response.text()
            console.warn(`[Gemini ${model} Error]`, response.status, errText.slice(0, 200))
          }
        } catch (geminiErr) {
          console.warn(`[Gemini ${model} Error]`, geminiErr)
        }
      }
    }

    // 3C. Priority 3: Natural conversational fallback (when all API models are offline)
    if (!answerText) {
      const queryLower = message.toLowerCase().trim()

      // Handle user introductions naturally
      const nameMatch = message.match(/(?:my name is|i am|i'm|this is)\s+([A-Z][a-zA-Z\s]+)/i)
      if (nameMatch) {
        const userName = nameMatch[1].trim()
        answerText =
          `Hello **${userName}**! 👋 Great to meet you.\n\n` +
          `I'm **Bity**, your SixBytes AI companion. How can I help you today?`
      }
      // Handle simple greetings
      else if (/^(hi|hello|hey|good\s*(morning|afternoon|evening)|greetings|sup|yo)[!.,\s]*$/i.test(queryLower)) {
        answerText =
          `Hello! 👋 I'm **Bity**, your SixBytes AI companion.\n\n` +
          `How can I help you today? I can assist with:\n` +
          `* Academic questions (Physics, Chemistry, Maths, CS, Biology)\n` +
          `* Navigating the SixBytes platform\n` +
          `* Creating & managing SEO articles\n` +
          `* Any general questions you have!`
      }
      // Handle SEO articles / resource creation questions
      else if (queryLower.includes("seo") || queryLower.includes("article") || (queryLower.includes("how to") && (queryLower.includes("add") || queryLower.includes("create") || queryLower.includes("publish")))) {
        answerText =
          `Here's how to **add & publish SEO articles** in SixBytes:\n\n` +
          `1. Go to **Admin Portal** → \`/admin/resources\`\n` +
          `2. Click **"New Resource"** or **"Create Article"**\n` +
          `3. Fill in the details:\n` +
          `   * **Title**: Descriptive headline (e.g. "Class 10 Chemical Reactions Guide")\n` +
          `   * **Slug**: Auto-generated URL path\n` +
          `   * **Subject & Class**: Select the target audience\n` +
          `   * **Resource Type**: Notes, Formula Sheet, Solved Paper, etc.\n` +
          `   * **SEO Meta Description**: 150-160 char summary for Google\n` +
          `   * **Keywords**: Comma-separated search terms\n` +
          `   * **Content Body**: Full guide with headings and examples\n` +
          `4. Toggle **"Published"** to active → Click **"Save Resource"**\n\n` +
          `The platform automatically updates \`/sitemap.xml\` and the public library at \`/resources\`.`
      }
      // General fallback — conversational and helpful
      else {
        answerText =
          `I'm currently running in offline mode, so my responses are limited right now.\n\n` +
          `Regarding: *"${message.trim()}"*\n\n` +
          `I'll be able to give you a much better answer once my AI backend reconnects. In the meantime, feel free to ask about:\n` +
          `* How to use the SixBytes platform\n` +
          `* Creating SEO articles and resources\n` +
          `* Basic academic concepts\n\n` +
          `Please try again in a moment!`
      }
    }

    // 4. Log student activity if logged in
    if (userId) {
      logActivity(userId, "tutorQuestion").catch(() => {})
    }

    const isStaff = userRole === "admin" || userRole === "manager" || userRole === "faculty"

    return NextResponse.json({
      success: true,
      answer: answerText,
      remaining: isStaff ? 99999 : Math.max(0, remainingQuestions),
      isEnrolled,
      isStaff,
      userRole,
      resourceTitle,
    })
  } catch (err: unknown) {
    const error = err as Error
    console.error("[Bity Route Error]", error)
    return NextResponse.json(
      {
        error: "Bity is currently refreshing its neural index. Please try again in a few moments.",
        details: error?.message,
      },
      { status: 500 }
    )
  }
}
