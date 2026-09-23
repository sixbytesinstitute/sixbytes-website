import test from "node:test"
import assert from "node:assert/strict"

import {
  createBlock,
  blocksToHtml,
  htmlToBlocks,
  getTemplateBlocks,
  extractFaqSchema,
  extractFaqSchemaFromHtml,
  BLOCK_PALETTE,
} from "../lib/resource-blocks.ts"
import { isSafeResourceHtml } from "../lib/seo-policy.ts"

test("Block palette contains all 8 block types", () => {
  assert.equal(BLOCK_PALETTE.length, 8)
  const types = BLOCK_PALETTE.map((b) => b.type)
  assert.ok(types.includes("heading"))
  assert.ok(types.includes("paragraph"))
  assert.ok(types.includes("question_card"))
  assert.ok(types.includes("code_box"))
  assert.ok(types.includes("formula_callout"))
  assert.ok(types.includes("concept_callout"))
  assert.ok(types.includes("table"))
  assert.ok(types.includes("toc"))
})

test("createBlock generates blocks with unique IDs and valid defaults", () => {
  const h = createBlock("heading")
  assert.equal(h.type, "heading")
  assert.ok(h.id.startsWith("blk_"))

  const q = createBlock("question_card")
  assert.equal(q.type, "question_card")
  assert.equal(q.badge, "Board Question")

  const c = createBlock("code_box")
  assert.equal(c.type, "code_box")
  assert.equal(c.language, "Python")

  const f = createBlock("formula_callout")
  assert.equal(f.type, "formula_callout")

  const t = createBlock("table")
  assert.equal(t.type, "table")
  assert.equal(t.headers.length, 2)
})

test("blocksToHtml serializes QuestionBlock with correct classes", () => {
  const blocks = [
    {
      id: "q1",
      type: "question_card",
      badge: "CBSE 2025 • 3 Marks",
      question: "State Ohm's Law.",
      solution: "<p>V = IR where V is voltage, I is current, R is resistance.</p>",
    },
  ]

  const html = blocksToHtml(blocks)
  assert.ok(html.includes('class="qa-card"'))
  assert.ok(html.includes('class="qa-question"'))
  assert.ok(html.includes('class="qa-badge-question"'))
  assert.ok(html.includes("CBSE 2025 • 3 Marks"))
  assert.ok(html.includes("State Ohm's Law."))
  assert.ok(html.includes('class="qa-solution"'))
  assert.ok(html.includes('class="qa-badge-solution"'))
  assert.ok(html.includes("V = IR"))
  assert.ok(isSafeResourceHtml(html), "Question HTML must be safe for SEO policy")
})

test("blocksToHtml serializes CodeBlock with program-box class", () => {
  const blocks = [
    {
      id: "c1",
      type: "code_box",
      language: "Python",
      caption: "Fibonacci Series",
      code: "def fib(n):\n    return n if n <= 1 else fib(n-1) + fib(n-2)",
    },
  ]

  const html = blocksToHtml(blocks)
  assert.ok(html.includes('class="reaction-label"'))
  assert.ok(html.includes("Fibonacci Series"))
  assert.ok(html.includes('class="program-box"'))
  assert.ok(html.includes("<code>"))
  assert.ok(html.includes("def fib(n):"))
  assert.ok(isSafeResourceHtml(html), "Code HTML must be safe for SEO policy")
})

test("blocksToHtml serializes TableBlock with table, thead, and tbody", () => {
  const blocks = [
    {
      id: "t1",
      type: "table",
      caption: "Comparison Matrix",
      headers: ["Property", "Concave Mirror", "Convex Mirror"],
      rows: [["Nature of Image", "Real & Inverted", "Virtual & Erect"]],
    },
  ]

  const html = blocksToHtml(blocks)
  assert.ok(html.includes("<h4>Comparison Matrix</h4>"))
  assert.ok(html.includes("<table>"))
  assert.ok(html.includes("<th>Concave Mirror</th>"))
  assert.ok(html.includes("<td>Virtual &amp; Erect</td>"))
  assert.ok(isSafeResourceHtml(html), "Table HTML must be safe for SEO policy")
})

test("blocksToHtml generates TOC dynamically from headings", () => {
  const blocks = [
    { id: "h1", type: "heading", level: 2, text: "Reflection of Light" },
    { id: "t1", type: "toc" },
    { id: "h2", type: "heading", level: 3, text: "Laws of Reflection" },
  ]

  const html = blocksToHtml(blocks)
  assert.ok(html.includes('class="toc-box"'))
  assert.ok(html.includes('class="toc-title"'))
  assert.ok(html.includes('href="#reflection-of-light"'))
  assert.ok(html.includes('href="#laws-of-reflection"'))
  assert.ok(isSafeResourceHtml(html), "TOC HTML must be safe for SEO policy")
})

test("Templates generate non-empty block arrays for all resource types", () => {
  for (const type of ["topic_guide", "question_bank", "formula_sheet", "program_tutorial"]) {
    const template = getTemplateBlocks(type)
    assert.ok(template.length > 0, `Template for ${type} should have blocks`)
    const html = blocksToHtml(template)
    assert.ok(html.length > 0, `Compiled HTML for ${type} should not be empty`)
    assert.ok(isSafeResourceHtml(html), `Template ${type} compiled HTML must be safe`)
  }
})

test("extractFaqSchema generates Schema.org FAQPage structured data from blocks", () => {
  const blocks = [
    {
      id: "q1",
      type: "question_card",
      badge: "CBSE 2025",
      question: "What is Dispersion?",
      solution: "<p>The splitting of white light into its component colors.</p>",
    },
  ]

  const schema = extractFaqSchema(blocks)
  assert.ok(schema)
  assert.equal(schema["@context"], "https://schema.org")
  assert.equal(schema["@type"], "FAQPage")
  assert.equal(schema.mainEntity.length, 1)
  assert.equal(schema.mainEntity[0].name, "What is Dispersion?")
  assert.equal(schema.mainEntity[0].acceptedAnswer.text, "The splitting of white light into its component colors.")
})

test("extractFaqSchemaFromHtml extracts FAQPage schema from raw HTML", () => {
  const blocks = [
    {
      id: "q1",
      type: "question_card",
      badge: "CBSE 2024",
      question: "Define Snell's Law.",
      solution: "<p>The ratio of sine of angle of incidence to sine of refraction is constant.</p>",
    },
  ]

  const html = blocksToHtml(blocks)
  const schema = extractFaqSchemaFromHtml(html)
  assert.ok(schema)
  assert.equal(schema["@context"], "https://schema.org")
  assert.equal(schema["@type"], "FAQPage")
  assert.equal(schema.mainEntity.length, 1)
  assert.ok(schema.mainEntity[0].name.includes("Define Snell's Law."))
  assert.ok(schema.mainEntity[0].acceptedAnswer.text.includes("sine of angle of incidence"))
})

test("extractFaqSchemaFromHtml returns null when no qa-card exists", () => {
  const html = "<h2>Overview</h2><p>This is a plain guide without questions.</p>"
  const schema = extractFaqSchemaFromHtml(html)
  assert.equal(schema, null)
})
