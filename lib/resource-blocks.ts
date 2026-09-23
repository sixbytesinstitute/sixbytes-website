/**
 * Resource Block System
 * Defines visual content blocks and compiles them to/from semantic HTML
 * matching the production CSS classes in resource-detail-client.tsx
 */

// ─── Block Type Definitions ─────────────────────────────

export type BlockType =
  | "heading"
  | "paragraph"
  | "question_card"
  | "code_box"
  | "formula_callout"
  | "concept_callout"
  | "table"
  | "toc";

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface HeadingBlock extends BaseBlock {
  type: "heading";
  level: 2 | 3 | 4;
  text: string;
}

export interface ParagraphBlock extends BaseBlock {
  type: "paragraph";
  html: string; // Supports inline HTML: <strong>, <em>, <code>, <a>, <ul>, <ol>, <li>
}

export interface QuestionBlock extends BaseBlock {
  type: "question_card";
  badge: string; // e.g. "CBSE 2024 • 3 Marks"
  question: string; // Question text (plain text or simple HTML)
  solution: string; // Step-by-step solution HTML
}

export interface CodeBlock extends BaseBlock {
  type: "code_box";
  language: string; // e.g. "Python", "Java", "C++", "HTML", "JavaScript"
  code: string; // Raw code content
  caption: string; // Optional label above the box
}

export interface FormulaBlock extends BaseBlock {
  type: "formula_callout";
  title: string; // e.g. "Key Formula"
  content: string; // Formula text/HTML (can include <code> for inline math)
}

export interface ConceptBlock extends BaseBlock {
  type: "concept_callout";
  title: string; // e.g. "Exam Pro-Tip", "Common Mistake", "Board Important"
  content: string; // Callout body HTML
}

export interface TableBlock extends BaseBlock {
  type: "table";
  caption: string; // Table title
  headers: string[];
  rows: string[][]; // Each row is an array of cell values
}

export interface TocBlock extends BaseBlock {
  type: "toc";
  // Auto-generated from heading blocks – no extra data needed
}

export type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | QuestionBlock
  | CodeBlock
  | FormulaBlock
  | ConceptBlock
  | TableBlock
  | TocBlock;

// ─── ID Generator ───────────────────────────────────────

let _counter = 0;
export function generateBlockId(): string {
  return `blk_${Date.now()}_${++_counter}`;
}

// ─── Block Factory ──────────────────────────────────────

export function createBlock(type: BlockType): ContentBlock {
  const id = generateBlockId();

  switch (type) {
    case "heading":
      return { id, type, level: 2, text: "" };
    case "paragraph":
      return { id, type, html: "" };
    case "question_card":
      return { id, type, badge: "Board Question", question: "", solution: "" };
    case "code_box":
      return { id, type, language: "Python", code: "", caption: "" };
    case "formula_callout":
      return { id, type, title: "Key Formula", content: "" };
    case "concept_callout":
      return { id, type, title: "Exam Pro-Tip", content: "" };
    case "table":
      return { id, type, caption: "", headers: ["Column 1", "Column 2"], rows: [["", ""]] };
    case "toc":
      return { id, type };
  }
}

// ─── Block Labels & Icons (for UI palette) ──────────────

export const BLOCK_PALETTE: { type: BlockType; label: string; icon: string; description: string }[] = [
  { type: "heading", label: "Heading", icon: "H", description: "Section heading (H2, H3, H4)" },
  { type: "paragraph", label: "Text Block", icon: "¶", description: "Rich text paragraph, lists, inline code" },
  { type: "question_card", label: "Question & Solution", icon: "Q", description: "Solved board question with collapsible answer" },
  { type: "code_box", label: "Code / Program", icon: "</>", description: "Copyable code block with language tag" },
  { type: "formula_callout", label: "Formula Callout", icon: "ƒ", description: "Math/Science formula highlight box" },
  { type: "concept_callout", label: "Exam Tip / Caution", icon: "!", description: "Important exam tips or common mistakes" },
  { type: "table", label: "Comparison Table", icon: "⊞", description: "Multi-column data comparison table" },
  { type: "toc", label: "Table of Contents", icon: "≡", description: "Auto-generated from headings" },
];

// ─── Serializer: Blocks → HTML ──────────────────────────

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function headingToHtml(block: HeadingBlock): string {
  const tag = `h${block.level}`;
  const anchor = slugify(block.text);
  return `<${tag} id="${anchor}">${escapeHtml(block.text)}</${tag}>`;
}

function paragraphToHtml(block: ParagraphBlock): string {
  // html field already contains formatted HTML (from contentEditable or raw input)
  return block.html;
}

function questionToHtml(block: QuestionBlock): string {
  return `<div class="qa-card">
  <div class="qa-question">
    <div class="qa-badge-question">${escapeHtml(block.badge)}</div>
    <p><strong>${escapeHtml(block.question)}</strong></p>
  </div>
  <div class="qa-solution">
    <div class="qa-badge-solution">✓ Solution</div>
    ${block.solution}
  </div>
</div>`;
}

function codeToHtml(block: CodeBlock): string {
  const label = block.caption
    ? `<div class="reaction-label">${escapeHtml(block.caption)}</div>`
    : "";
  return `${label}<pre class="program-box"><code>${escapeHtml(block.code)}</code></pre>`;
}

function formulaToHtml(block: FormulaBlock): string {
  return `<div class="formula-callout">
  <strong>${escapeHtml(block.title)}</strong>
  <div>${block.content}</div>
</div>`;
}

function conceptToHtml(block: ConceptBlock): string {
  return `<div class="concept-callout">
  <strong>${escapeHtml(block.title)}</strong>
  <div>${block.content}</div>
</div>`;
}

function tableToHtml(block: TableBlock): string {
  const caption = block.caption
    ? `<h4>${escapeHtml(block.caption)}</h4>`
    : "";
  const ths = block.headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("");
  const trs = block.rows
    .map((row) => {
      const tds = row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("");
      return `<tr>${tds}</tr>`;
    })
    .join("\n");

  return `${caption}<table>
  <thead><tr>${ths}</tr></thead>
  <tbody>${trs}</tbody>
</table>`;
}

function tocToHtml(blocks: ContentBlock[]): string {
  const headings = blocks.filter(
    (b): b is HeadingBlock => b.type === "heading" && (b.level === 2 || b.level === 3)
  );

  if (headings.length === 0) {
    return `<div class="toc-box"><div class="toc-title">📑 In This Article</div><p><em>Add headings to auto-generate the table of contents.</em></p></div>`;
  }

  const items = headings
    .map((h) => {
      const anchor = slugify(h.text);
      const indent = h.level === 3 ? ' style="margin-left: 1rem;"' : "";
      return `<li${indent}><a class="toc-link" href="#${anchor}">${escapeHtml(h.text)}</a></li>`;
    })
    .join("\n");

  return `<div class="toc-box">
  <div class="toc-title">📑 In This Article</div>
  <ul class="toc-list">${items}</ul>
</div>`;
}

export function blocksToHtml(blocks: ContentBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading":
          return headingToHtml(block);
        case "paragraph":
          return paragraphToHtml(block);
        case "question_card":
          return questionToHtml(block);
        case "code_box":
          return codeToHtml(block);
        case "formula_callout":
          return formulaToHtml(block);
        case "concept_callout":
          return conceptToHtml(block);
        case "table":
          return tableToHtml(block);
        case "toc":
          return tocToHtml(blocks);
      }
    })
    .join("\n\n");
}

// ─── Deserializer: HTML → Blocks (best-effort) ─────────
// Falls back to a single paragraph block wrapping the full HTML

export function htmlToBlocks(html: string): ContentBlock[] {
  if (!html || !html.trim()) return [];

  // Try to extract structured blocks from known class markers
  const blocks: ContentBlock[] = [];

  // Simple regex-based extraction for known patterns
  const remaining = html;

  // If the HTML is complex or doesn't match known patterns, wrap as single paragraph
  blocks.push({
    id: generateBlockId(),
    type: "paragraph",
    html: remaining,
  });

  return blocks;
}

// ─── Resource Type Templates ────────────────────────────

export function getTemplateBlocks(resourceType: string): ContentBlock[] {
  switch (resourceType) {
    case "question_bank":
      return [
        { ...createBlock("toc"), id: generateBlockId() },
        { ...createBlock("heading"), id: generateBlockId(), text: "Important Board Questions" } as HeadingBlock,
        {
          ...createBlock("question_card"),
          id: generateBlockId(),
          badge: "CBSE Board 2025 • 3 Marks",
          question: "State and explain the law with a diagram.",
          solution: "<p><strong>Step 1:</strong> Define the law.</p>\n<p><strong>Step 2:</strong> Draw the diagram showing the principle.</p>\n<p><strong>Step 3:</strong> Conclude with the mathematical expression.</p>",
        } as QuestionBlock,
        {
          ...createBlock("question_card"),
          id: generateBlockId(),
          badge: "CBSE Board 2024 • 5 Marks",
          question: "Derive the formula and solve the numerical.",
          solution: "<p><strong>Derivation:</strong></p>\n<p>Starting from the basic principle...</p>",
        } as QuestionBlock,
      ];

    case "program_tutorial":
      return [
        { ...createBlock("toc"), id: generateBlockId() },
        { ...createBlock("heading"), id: generateBlockId(), text: "Program Overview" } as HeadingBlock,
        { ...createBlock("paragraph"), id: generateBlockId(), html: "<p>This program demonstrates the concept using a step-by-step approach suitable for CBSE/ICSE Computer Applications.</p>" } as ParagraphBlock,
        {
          ...createBlock("code_box"),
          id: generateBlockId(),
          language: "Python",
          caption: "Python Implementation",
          code: '# Program: Example\n\ndef main():\n    print("Hello, SixBytes!")\n\nif __name__ == "__main__":\n    main()',
        } as CodeBlock,
        {
          ...createBlock("concept_callout"),
          id: generateBlockId(),
          title: "Exam Pro-Tip",
          content: "<p>Always include comments and proper variable names in your board exam programs. Examiners award marks for code readability.</p>",
        } as ConceptBlock,
      ];

    case "formula_sheet":
      return [
        { ...createBlock("toc"), id: generateBlockId() },
        { ...createBlock("heading"), id: generateBlockId(), text: "Essential Formulas" } as HeadingBlock,
        {
          ...createBlock("formula_callout"),
          id: generateBlockId(),
          title: "Key Formula",
          content: "<p><code>Formula = Expression</code></p><p>Where each variable represents...</p>",
        } as FormulaBlock,
        {
          ...createBlock("table"),
          id: generateBlockId(),
          caption: "Formula Quick Reference",
          headers: ["Formula", "Variables", "Units"],
          rows: [
            ["F = ma", "Force, mass, acceleration", "N, kg, m/s²"],
            ["v = u + at", "velocity, initial velocity, acceleration, time", "m/s"],
          ],
        } as TableBlock,
      ];

    case "topic_guide":
    default:
      return [
        { ...createBlock("toc"), id: generateBlockId() },
        { ...createBlock("heading"), id: generateBlockId(), text: "Introduction" } as HeadingBlock,
        { ...createBlock("paragraph"), id: generateBlockId(), html: "<p>This chapter covers the fundamental concepts...</p>" } as ParagraphBlock,
        { ...createBlock("heading"), id: generateBlockId(), text: "Key Concepts" } as HeadingBlock,
        {
          ...createBlock("concept_callout"),
          id: generateBlockId(),
          title: "Board Important",
          content: "<p>This concept is frequently asked in CBSE board exams (2020–2025).</p>",
        } as ConceptBlock,
      ];
  }
}

// ─── Schema.org FAQ Detection ───────────────────────────

export function extractFaqSchema(blocks: ContentBlock[]): object | null {
  const questions = blocks.filter((b): b is QuestionBlock => b.type === "question_card");
  if (questions.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question.replace(/<[^>]*>/g, "").trim(),
      acceptedAnswer: {
        "@type": "Answer",
        text: q.solution.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(),
      },
    })),
  };
}

export function extractFaqSchemaFromHtml(html: string): object | null {
  if (!html || !html.includes("qa-card")) return null;

  const faqItems: { question: string; answer: string }[] = [];
  const cardRegex = /<div class="qa-card">([\s\S]*?)<\/div>\s*<\/div>/g;
  let match: RegExpExecArray | null;

  // Split content by qa-card blocks
  const cards = html.split('<div class="qa-card">').slice(1);

  for (const card of cards) {
    const qStart = card.indexOf('<div class="qa-question">');
    const sStart = card.indexOf('<div class="qa-solution">');
    const sEnd = card.indexOf('</div>\n</div>');
    const altSEnd = card.indexOf('</div></div>');
    const end = sEnd !== -1 ? sEnd : altSEnd !== -1 ? altSEnd : card.length;

    if (qStart !== -1 && sStart !== -1 && sStart > qStart) {
      const qSection = card.substring(qStart + '<div class="qa-question">'.length, sStart);
      const sSection = card.substring(sStart + '<div class="qa-solution">'.length, end);

      const cleanQ = qSection
        .replace(/<div class="qa-badge-question">[\s\S]*?<\/div>/i, "")
        .replace(/<[^>]*>/g, "")
        .trim();

      const cleanAns = sSection
        .replace(/<div class="qa-badge-solution">[\s\S]*?<\/div>/i, "")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      if (cleanQ && cleanAns) {
        faqItems.push({ question: cleanQ, answer: cleanAns });
      }
    }
  }

  if (faqItems.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

