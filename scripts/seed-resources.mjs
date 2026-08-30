/**
 * Comprehensive Educational Resources Seed Script
 * - Full Chapter Topic Guides (Comprehensive Theory, Table of Contents, Reaction Schemes, Derivations)
 * - Topic-wise Solved Question & Answer Banks (Specific Board Questions, Marking Scheme, Step-by-Step Scoring Points)
 * - Boards: CBSE & ICSE
 * - Purely SixBytes Branded (No 3rd party site mentions)
 *
 * Run: node scripts/seed-resources.mjs
 */

import mongoose from "mongoose";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env.local");
let MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("MONGO_URI=") || trimmed.startsWith("MONGODB_URI=")) {
      MONGO_URI = trimmed.split("=").slice(1).join("=").replace(/^["']|["']$/g, "").trim();
      break;
    }
  }
}

if (!MONGO_URI) {
  console.error("❌ MONGO_URI / MONGODB_URI not found in .env.local");
  process.exit(1);
}

const ResourceSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  title: { type: String, required: true, trim: true },
  metaDescription: { type: String, required: true, maxlength: 160 },
  subject: { type: String, required: true, index: true },
  targetClass: { type: String, required: true },
  board: { type: String, default: "CBSE & ICSE", index: true },
  resourceType: { type: String, enum: ["topic_guide", "question_bank", "formula_sheet"], default: "topic_guide", index: true },
  chapter: { type: String, default: null },
  content: { type: String, required: true },
  keywords: { type: [String], default: [] },
  published: { type: Boolean, default: false, index: true },
  viewCount: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Resource = mongoose.models.Resource || mongoose.model("Resource", ResourceSchema);

function slugify(str) {
  return str.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

/* ─── EDUCATIONAL RESOURCES DATASET ─────────────────────── */
const resources = [
  // ══════════════════════════════════════════════════════════
  // 1. CHEMISTRY (Topic Guide): Aldehydes, Ketones & Carboxylic Acids
  // ══════════════════════════════════════════════════════════
  {
    title: "Aldehydes, Ketones, and Carboxylic Acids – Structure, Preparation & Reactions",
    subject: "Chemistry",
    targetClass: "10",
    board: "CBSE & ICSE",
    resourceType: "topic_guide",
    chapter: "Carbonyl Compounds",
    metaDescription: "Comprehensive guide to aldehydes, ketones, and carboxylic acids: carbonyl structure, Rosenmund reduction, nucleophilic addition, and oxidation reactions.",
    keywords: ["CBSE Class 10", "ICSE Class 10", "CBSE Class 12", "Aldehydes and Ketones", "Carboxylic Acids", "Rosenmund Reduction", "Carbonyl Group", "NCERT Chemistry", "Board Exam 2026", "Organic Chemistry"],
    content: `<h2>What are Aldehydes, Ketones, and Carboxylic Acids?</h2>
<p>Aldehydes, Ketones, and Carboxylic Acids are <em><strong>carbonyl compounds which contain a carbon-oxygen double bond (&gt;C=O)</strong></em>. These organic compounds play a central role in biochemical metabolism and industrial chemical manufacturing.</p>

<div class="concept-callout">
<strong>Key Concept:</strong> The carbonyl carbon is <em>sp² hybridized</em> with a planar trigonal structure. Due to the high electronegativity of oxygen relative to carbon, the &gt;C=O bond is strongly polarized (δ⁺ on Carbon, δ⁻ on Oxygen), making the carbonyl carbon an active electrophilic center for nucleophilic attacks.
</div>

<div class="toc-box">
<div class="toc-title">Table of Contents</div>
<ul class="toc-list">
<li><a class="toc-link" href="#what-are-aldehydes">What are Aldehydes?</a></li>
<li><a class="toc-link" href="#preparation-aldehydes">Preparation of Aldehydes (Rosenmund Reduction &amp; Ozonolysis)</a></li>
<li><a class="toc-link" href="#what-are-ketones">What are Ketones?</a></li>
<li><a class="toc-link" href="#preparation-ketones">Preparation of Ketones</a></li>
<li><a class="toc-link" href="#carboxylic-acids">Carboxylic Acids &amp; Functional Properties</a></li>
<li><a class="toc-link" href="#chemical-tests">Distinction Tests (Tollens' and Fehling's Reagents)</a></li>
<li><a class="toc-link" href="#summary-table">Summary Comparison Table</a></li>
</ul>
</div>

<h3 id="what-are-aldehydes">What are Aldehydes?</h3>
<p>Aldehydes are carbonyl compounds in which the carbonyl carbon is bonded to at least one hydrogen atom and an alkyl or aryl group. The general molecular formula is <strong>R-CHO</strong>.</p>
<ul>
<li><strong>Methanal (Formaldehyde):</strong> H-CHO (used as formalin solution for preserving biological specimens)</li>
<li><strong>Ethanal (Acetaldehyde):</strong> CH₃-CHO (raw material in vinegar and polymer production)</li>
<li><strong>Benzaldehyde:</strong> C₆H₅-CHO (oil of bitter almonds, used in perfumes and flavoring)</li>
</ul>

<h3 id="preparation-aldehydes">Preparation of Aldehydes</h3>
<p><strong>1. Rosenmund Reduction (Acid Chlorides):</strong> Catalytic hydrogenation of acyl chloride over palladium supported on barium sulfate (Pd/BaSO₄) partially deactivated (poisoned) with sulfur or quinoline yields aldehydes selectively.</p>

<pre class="reaction-box">
<div class="reaction-label">Rosenmund Reduction Scheme</div>
R-CO-Cl + H₂ ──[ Pd / BaSO₄ , Quinoline (Poison) ]──&gt; R-CHO + HCl

C₆H₅-CO-Cl (Benzoyl chloride) + H₂ ──[ Pd/BaSO₄ ]──&gt; C₆H₅-CHO (Benzaldehyde) + HCl
</pre>

<p><strong>2. Controlled Oxidation of Primary Alcohols:</strong> Primary alcohols (1°) undergo mild oxidation with Pyridinium Chlorochromate (PCC) in CH₂Cl₂ to stop cleanly at the aldehyde stage without over-oxidizing to carboxylic acid.</p>
<pre class="reaction-box">
<div class="reaction-label">PCC Oxidation of 1° Alcohol</div>
R-CH₂-OH ──[ PCC / CH₂Cl₂ ]──&gt; R-CHO
CH₃-CH₂-OH (Ethanol) ──[ PCC ]──&gt; CH₃-CHO (Ethanal)
</pre>

<h3 id="what-are-ketones">What are Ketones?</h3>
<p>Ketones are carbonyl compounds in which the carbonyl carbon is attached to two carbon-containing hydrocarbon groups (alkyl or aryl). The general formula is <strong>R-CO-R'</strong>.</p>
<ul>
<li><strong>Propanone (Acetone):</strong> CH₃-CO-CH₃ (simplest symmetrical ketone, used as laboratory solvent)</li>
<li><strong>Acetophenone:</strong> C₆H₅-CO-CH₃ (mixed aromatic-aliphatic ketone)</li>
<li><strong>Benzophenone:</strong> C₆H₅-CO-C₆H₅ (diaryl symmetrical ketone)</li>
</ul>

<pre class="reaction-box">
<div class="reaction-label">Ketone Carbonyl Structure</div>
      O
      ║
R ─── C ─── R'   (R, R' may be identical or different alkyl/aryl groups)
</pre>

<h3 id="preparation-ketones">Preparation of Ketones</h3>
<p><strong>1. Oxidation of Secondary Alcohols (2°):</strong> Secondary alcohols on treatment with chromic anhydride (CrO₃) or acidified potassium dichromate (K₂Cr₂O₇) give corresponding ketones:</p>
<pre class="reaction-box">
<div class="reaction-label">2° Alcohol Oxidation</div>
CH₃-CH(OH)-CH₃ (Propan-2-ol) ──[ CrO₃ / H₂SO₄ ]──&gt; CH₃-CO-CH₃ (Propanone) + H₂O
</pre>

<p><strong>2. Friedel-Crafts Acylation of Aromatic Rings:</strong></p>
<pre class="reaction-box">
<div class="reaction-label">Friedel-Crafts Acylation</div>
C₆H₆ (Benzene) + CH₃-CO-Cl ──[ Anhydrous AlCl₃ ]──&gt; C₆H₅-CO-CH₃ (Acetophenone) + HCl
</pre>

<h3 id="carboxylic-acids">Carboxylic Acids &amp; Functional Properties</h3>
<p>Carboxylic acids contain a carboxyl group <strong>(-COOH)</strong> consisting of a carbonyl group attached directly to a hydroxyl group. Because of hydrogen bonding between molecules, carboxylic acids have higher boiling points than aldehydes and ketones of comparable molecular weight.</p>

<h3 id="chemical-tests">Distinction Tests (Aldehydes vs Ketones)</h3>
<table>
<tr><th>Test</th><th>Aldehydes (R-CHO)</th><th>Ketones (R-CO-R')</th></tr>
<tr><td><strong>Tollens' Test (AgNO₃ + NH₄OH)</strong></td><td>Forms bright silver mirror on test tube walls (Ag⁺ reduced to Ag)</td><td>No silver mirror formed (Ketones do not react)</td></tr>
<tr><td><strong>Fehling's Solution (A + B)</strong></td><td>Gives red-brown precipitate of Cuprous oxide (Cu₂O)</td><td>No red precipitate with aliphatic/aromatic ketones</td></tr>
<tr><td><strong>Schiff's Reagent</strong></td><td>Restores pink/magenta color</td><td>No color change with ketones</td></tr>
</table>

<h3 id="summary-table">Summary of Functional Groups</h3>
<table>
<tr><th>Compound Class</th><th>General Formula</th><th>Functional Group</th><th>IUPAC Suffix</th><th>Example</th></tr>
<tr><td>Aldehydes</td><td>R-CHO</td><td>-CHO</td><td>-al</td><td>Ethanal (CH₃CHO)</td></tr>
<tr><td>Ketones</td><td>R-CO-R'</td><td>&gt;C=O</td><td>-one</td><td>Propanone (CH₃COCH₃)</td></tr>
<tr><td>Carboxylic Acids</td><td>R-COOH</td><td>-COOH</td><td>-oic acid</td><td>Ethanoic Acid (CH₃COOH)</td></tr>
</table>`
  },

  // ══════════════════════════════════════════════════════════
  // 2. CHEMISTRY (Question Bank): Aldehydes & Ketones Solved Q&A
  // ══════════════════════════════════════════════════════════
  {
    title: "Aldehydes, Ketones & Carboxylic Acids – Solved Board Questions & Numericals",
    subject: "Chemistry",
    targetClass: "10",
    board: "CBSE & ICSE",
    resourceType: "question_bank",
    chapter: "Carbonyl Compounds",
    metaDescription: "Topic-wise solved board examination questions on aldehydes, ketones, and carboxylic acids with step-by-step scoring solutions and reaction mechanisms.",
    keywords: ["CBSE Board Exam 2026", "ICSE Board Questions", "Aldehydes Ketones Solved Questions", "Important Board Numericals", "Rosenmund Reduction Q&A", "NCERT Solved Problems", "Class 10 Chemistry"],
    content: `<h2>Topic-Wise Solved Board Examination Questions &amp; Solutions</h2>
<p>Curated board examination questions with step-by-step marking schemes for CBSE &amp; ICSE board aspirants.</p>

<div class="qa-card">
<div class="qa-question">
<span class="qa-badge-question">QUESTION 1 • CBSE Board Exam (3 Marks)</span>
<p><strong>(a) What are ketones? State their general formula and write the IUPAC name of the simplest ketone.</strong><br>
<strong>(b) Explain why propanone does not give a silver mirror test with Tollens' reagent while propanal does.</strong></p>
</div>
<div class="qa-solution">
<span class="qa-badge-solution">SOLUTION • Step-by-Step Scoring Guide</span>
<p><strong>(a) Definition &amp; Formula:</strong></p>
<ul>
<li><strong>Ketones</strong> are organic compounds possessing a carbonyl group (&gt;C=O) bonded to two hydrocarbon alkyl or aryl groups.</li>
<li><strong>General Formula:</strong> C<sub>n</sub>H<sub>2n</sub>O or R-CO-R'</li>
<li><strong>Simplest Ketone:</strong> Propanone (CH₃-CO-CH₃), commonly known as Acetone (3 Carbon atoms). <em>[1 Mark]</em></li>
</ul>
<p><strong>(b) Explanation of Tollens' Test:</strong></p>
<ul>
<li>Propanal (CH₃CH₂CHO) contains a hydrogen atom attached directly to the carbonyl group (C-H bond), which makes it readily oxidizable to propanoic acid by mild oxidizing agents like Tollens' reagent [Ag(NH₃)₂]⁺, forming metallic silver.</li>
<li>Propanone (CH₃COCH₃) contains no hydrogen on the carbonyl carbon (it is bonded to two methyl carbon groups). Breaking carbon-carbon bonds requires strong oxidizing agents, so propanone cannot reduce Tollens' reagent and gives no silver mirror. <em>[2 Marks]</em></li>
</ul>
</div>
</div>

<div class="qa-card">
<div class="qa-question">
<span class="qa-badge-question">QUESTION 2 • ICSE &amp; CBSE Board Exam (3 Marks)</span>
<p><strong>Write the chemical equations for the following named conversions:</strong><br>
(i) Benzoyl chloride to Benzaldehyde (Rosenmund Reduction)<br>
(ii) Ethanal to Propan-2-ol using Methyl magnesium bromide (Grignard Reagent)</p>
</div>
<div class="qa-solution">
<span class="qa-badge-solution">SOLUTION</span>
<p><strong>(i) Rosenmund Reduction:</strong></p>
<pre class="reaction-box">
C₆H₅-CO-Cl + H₂ ──[ Pd / BaSO₄ , Quinoline ]──&gt; C₆H₅-CHO + HCl
Benzoyl chloride                               Benzaldehyde
</pre>
<p><strong>(ii) Conversion of Ethanal to Propan-2-ol via Grignard Reagent:</strong></p>
<pre class="reaction-box">
CH₃-CHO + CH₃MgBr ──[ Dry Ether ]──&gt; CH₃-CH(OMgBr)-CH₃
                                              │ (Acid Hydrolysis, H₃O⁺)
                                              ▼
                                     CH₃-CH(OH)-CH₃ + Mg(OH)Br
                                     (Propan-2-ol, 2° Alcohol)
</pre>
</div>
</div>

<div class="qa-card">
<div class="qa-question">
<span class="qa-badge-question">QUESTION 3 • Short Answer (2 Marks)</span>
<p><strong>Arrange the following in increasing order of their boiling points with reasoning:</strong><br>
<code>Ethane (C₂H₆), Methoxy methane (CH₃OCH₃), Ethanal (CH₃CHO), Ethanol (CH₃CH₂OH)</code></p>
</div>
<div class="qa-solution">
<span class="qa-badge-solution">SOLUTION</span>
<p><strong>Order:</strong> <code>Ethane &lt; Methoxy methane &lt; Ethanal &lt; Ethanol</code></p>
<p><strong>Reasoning:</strong></p>
<ol>
<li><strong>Ethane:</strong> Non-polar with weak London dispersion forces (Lowest boiling point).</li>
<li><strong>Methoxy methane:</strong> Weak dipole-dipole interactions.</li>
<li><strong>Ethanal:</strong> Stronger dipole-dipole attractions due to polar carbonyl group (&gt;C=O).</li>
<li><strong>Ethanol:</strong> Intermolecular Hydrogen bonding between -OH groups (Highest boiling point).</li>
</ol>
</div>
</div>`
  },

  // ══════════════════════════════════════════════════════════
  // 3. CHEMISTRY (Topic Guide): Chemical Reactions & Equations
  // ══════════════════════════════════════════════════════════
  {
    title: "Chemical Reactions and Equations – Class 10 NCERT Solutions & Revision Notes",
    subject: "Chemistry",
    targetClass: "10",
    board: "CBSE & ICSE",
    resourceType: "topic_guide",
    chapter: "Chapter 1",
    metaDescription: "Comprehensive notes for Class 10 Chemistry Chapter 1. Balancing chemical equations, redox reactions, combination, displacement, and board examination notes.",
    keywords: ["CBSE Class 10", "ICSE Class 10", "NCERT Solutions", "Chemical Reactions and Equations", "Balancing Equations", "Combination Reaction", "Displacement Reaction", "Board Exam 2026", "Lakhmir Singh Chemistry"],
    content: `<h2>Chemical Reactions and Equations – Complete Study Guide</h2>
<p>A <strong>chemical reaction</strong> is a process in which one or more substances (reactants) transform into new chemical substances (products) with distinct physical and chemical properties. During a chemical reaction, existing chemical bonds break and new chemical bonds are created.</p>

<div class="concept-callout">
<strong>Observational Indicators of a Chemical Reaction:</strong> Change in state, change in colour, evolution of a gas, change in temperature (exothermic/endothermic), or formation of an insoluble precipitate.
</div>

<div class="toc-box">
<div class="toc-title">Table of Contents</div>
<ul class="toc-list">
<li><a class="toc-link" href="#balancing-equations">How to Balance Chemical Equations</a></li>
<li><a class="toc-link" href="#types-of-reactions">5 Major Types of Chemical Reactions</a></li>
<li><a class="toc-link" href="#redox-reactions">Oxidation, Reduction and Redox Reactions</a></li>
<li><a class="toc-link" href="#corrosion-rancidity">Corrosion and Rancidity in Daily Life</a></li>
<li><a class="toc-link" href="#key-equations">Master Chemical Equation Cheat Sheet</a></li>
</ul>
</div>

<h3 id="balancing-equations">How to Balance Chemical Equations</h3>
<p>A balanced chemical equation contains equal numbers of atoms of each element on both the reactant and product sides, adhering to the <strong>Law of Conservation of Mass</strong>.</p>

<pre class="reaction-box">
<div class="reaction-label">Balancing Iron with Steam</div>
Unbalanced: Fe (s) + H₂O (g) ──&gt; Fe₃O₄ (s) + H₂ (g)

Balanced:   3Fe (s) + 4H₂O (g) ──&gt; Fe₃O₄ (s) + 4H₂ (g)
</pre>

<h3 id="types-of-reactions">5 Major Types of Chemical Reactions</h3>
<table>
<tr><th>Type of Reaction</th><th>Definition</th><th>Chemical Equation Example</th></tr>
<tr><td><strong>Combination</strong></td><td>Two or more reactants unite into a single product.</td><td>CaO (Quicklime) + H₂O → Ca(OH)₂ (Slaked lime) + Heat</td></tr>
<tr><td><strong>Decomposition</strong></td><td>A single compound breaks down into simpler products on applying heat, light, or electricity.</td><td>2FeSO₄ (Green) ──[Heat]──&gt; Fe₂O₃ (Red-brown) + SO₂ (g) + SO₃ (g)</td></tr>
<tr><td><strong>Displacement</strong></td><td>A more reactive element replaces a less reactive metal from its aqueous salt solution.</td><td>Zn (s) + CuSO₄ (aq, Blue) → ZnSO₄ (aq, Colourless) + Cu (s)</td></tr>
<tr><td><strong>Double Displacement</strong></td><td>Mutual exchange of ions between two ionic compounds to form a precipitate.</td><td>Na₂SO₄ (aq) + BaCl₂ (aq) → BaSO₄ (White ppt) + 2NaCl (aq)</td></tr>
<tr><td><strong>Redox Reaction</strong></td><td>Simultaneous oxidation and reduction processes.</td><td>CuO + H₂ ──[Heat]──&gt; Cu + H₂O</td></tr>
</table>

<h3 id="redox-reactions">Oxidation and Reduction (Redox)</h3>
<ul>
<li><strong>Oxidation:</strong> Gain of oxygen or loss of hydrogen / loss of electrons.</li>
<li><strong>Reduction:</strong> Loss of oxygen or gain of hydrogen / gain of electrons.</li>
<li><strong>Oxidizing Agent:</strong> Substance that supplies oxygen or accepts electrons.</li>
<li><strong>Reducing Agent:</strong> Substance that removes oxygen or loses electrons.</li>
</ul>

<h3 id="corrosion-rancidity">Corrosion and Rancidity</h3>
<div class="concept-callout">
<strong>Corrosion:</strong> Degradation of metals due to atmospheric moisture and gases.<br>
• Iron Rusting: <code>4Fe + 3O₂ + 2xH₂O → 2Fe₂O₃·xH₂O (Hydrated ferric oxide)</code><br>
• Silver Tarnishing: <code>2Ag + H₂S → Ag₂S (Black coating) + H₂</code><br>
• Copper Corrosion: Forms green basic copper carbonate <code>CuCO₃·Cu(OH)₂</code>.<br><br>
<strong>Rancidity:</strong> Aerial oxidation of fats and oils causing unpleasant smell and taste. Prevented by nitrogen flushing, antioxidants (BHA/BHT), and vacuum sealing.
</div>`
  },

  // ══════════════════════════════════════════════════════════
  // 4. CHEMISTRY (Question Bank): Chemical Reactions Solved Q&A
  // ══════════════════════════════════════════════════════════
  {
    title: "Chemical Reactions and Equations – Solved Board Questions & Equation Balancing",
    subject: "Chemistry",
    targetClass: "10",
    board: "CBSE & ICSE",
    resourceType: "question_bank",
    chapter: "Chapter 1",
    metaDescription: "Solved CBSE & ICSE board examination questions on chemical reactions, equation balancing, precipitation, thermal decomposition, and redox reactions.",
    keywords: ["CBSE Board Exam 2026", "ICSE Class 10 Chemistry", "Chemical Reactions Solved Questions", "Balancing Equations Practice", "Exothermic Reactions Q&A", "Class 10 Board Questions"],
    content: `<h2>Chemical Reactions – Solved Board Questions &amp; Marking Scheme</h2>

<div class="qa-card">
<div class="qa-question">
<span class="qa-badge-question">QUESTION 1 • CBSE Class 10 Board Exam (3 Marks)</span>
<p><strong>A shiny brown-coloured element 'X' on heating in air becomes black in colour.<br>
(a) Name the element 'X' and the black-coloured compound formed.<br>
(b) Write the balanced chemical equation for the reaction.<br>
(c) How can the black coating be turned back into the shiny brown metal?</strong></p>
</div>
<div class="qa-solution">
<span class="qa-badge-solution">SOLUTION • Model Answer</span>
<p><strong>(a) Identification:</strong></p>
<ul>
<li>Element 'X' is <strong>Copper (Cu)</strong>. <em>[0.5 Mark]</em></li>
<li>The black compound is <strong>Copper(II) oxide (CuO)</strong>. <em>[0.5 Mark]</em></li>
</ul>
<p><strong>(b) Balanced Chemical Equation:</strong></p>
<pre class="reaction-box">
2Cu (s) [Brown] + O₂ (g) ──[Heat]──&gt; 2CuO (s) [Black]
</pre>
<p><strong>(c) Reversal of Reaction:</strong><br>
Passing hydrogen gas (H₂) over the heated black Copper(II) oxide causes reduction, converting it back to brown copper metal: <em>[1 Mark]</em></p>
<pre class="reaction-box">
CuO (s) [Black] + H₂ (g) ──[Heat]──&gt; Cu (s) [Brown] + H₂O (g)
</pre>
</div>
</div>

<div class="qa-card">
<div class="qa-question">
<span class="qa-badge-question">QUESTION 2 • ICSE &amp; CBSE Exam (2 Marks)</span>
<p><strong>Why do we apply paint on iron articles? Explain the chemical principle involved in prevention of rusting.</strong></p>
</div>
<div class="qa-solution">
<span class="qa-badge-solution">SOLUTION</span>
<p><strong>Answer:</strong> Paint forms an impermeable protective physical barrier between the iron surface and environmental moisture (H₂O) and atmospheric oxygen (O₂). In the absence of both moisture and oxygen simultaneously, the oxidation reaction <code>4Fe + 3O₂ + 2xH₂O → 2Fe₂O₃·xH₂O</code> cannot proceed, preventing rust formation and structural weakening.</p>
</div>
</div>`
  },

  // ══════════════════════════════════════════════════════════
  // 5. PHYSICS (Topic Guide): Light – Reflection and Refraction
  // ══════════════════════════════════════════════════════════
  {
    title: "Light – Reflection and Refraction Class 10: Formulas, Ray Diagrams & NCERT Solutions",
    subject: "Physics",
    targetClass: "10",
    board: "CBSE & ICSE",
    resourceType: "topic_guide",
    chapter: "Chapter 9",
    metaDescription: "Master Class 10 Physics Light Reflection and Refraction: Mirror formula, Lens formula, Snell's law, sign conventions, solved numericals, and board questions.",
    keywords: ["CBSE Class 10 Physics", "ICSE Class 10 Physics", "Mirror Formula", "Lens Formula", "Snells Law", "Refractive Index", "Ray Diagrams", "NCERT Solutions", "Board Exam 2026", "HC Verma Physics"],
    content: `<h2>Light – Reflection and Refraction Study Guide</h2>
<p>Light is a form of electromagnetic radiation that travels in straight lines in vacuum at a speed of <strong>c ≈ 3 × 10⁸ m/s</strong> and gives us visual perception of our surroundings.</p>

<div class="toc-box">
<div class="toc-title">Table of Contents</div>
<ul class="toc-list">
<li><a class="toc-link" href="#reflection-laws">Laws of Reflection &amp; Spherical Mirrors</a></li>
<li><a class="toc-link" href="#mirror-formula">Mirror Formula &amp; Cartesian Sign Convention</a></li>
<li><a class="toc-link" href="#refraction-snell">Refraction of Light &amp; Snell's Law</a></li>
<li><a class="toc-link" href="#lens-formula">Lenses, Lens Formula &amp; Optical Power</a></li>
<li><a class="toc-link" href="#ray-summary">Summary Formula Cheat Sheet</a></li>
</ul>
</div>

<h3 id="reflection-laws">Laws of Reflection</h3>
<ol>
<li>The angle of incidence equals the angle of reflection: <strong>∠i = ∠r</strong></li>
<li>The incident ray, reflected ray, and the normal to the surface at the point of incidence all lie in the same geometric plane.</li>
</ol>

<h3 id="mirror-formula">Mirror Formula &amp; Sign Convention</h3>
<div class="formula-callout">
<strong>Mirror Formula:</strong><br>
<code>1/v + 1/u = 1/f</code><br><br>
<strong>Linear Magnification (m):</strong><br>
<code>m = h' / h = -v / u</code>
</div>
<p><em>New Cartesian Sign Convention:</em> The object distance (u) is always negative. Concave mirrors have real focus (f &lt; 0); Convex mirrors have virtual focus (f &gt; 0).</p>

<h3 id="refraction-snell">Refraction of Light &amp; Snell's Law</h3>
<p>Refraction occurs because light travels with different speeds in different optical media. According to <strong>Snell's Law of Refraction</strong>:</p>
<div class="formula-callout">
<code>sin i / sin r = n₂₁ = n₂ / n₁ = v₁ / v₂</code><br>
<strong>Absolute Refractive Index:</strong> <code>n = c / v</code> (where c is speed in vacuum, v is speed in medium).
</div>

<h3 id="lens-formula">Lenses &amp; Lens Formula</h3>
<div class="formula-callout">
<strong>Lens Formula:</strong><br>
<code>1/v - 1/u = 1/f</code><br><br>
<strong>Lens Magnification:</strong> <code>m = h'/h = +v/u</code><br><br>
<strong>Power of Lens (P):</strong> <code>P = 1 / f (in metres)</code>. SI Unit: <strong>Dioptre (D)</strong>.
</div>`
  },

  // ══════════════════════════════════════════════════════════
  // 6. PHYSICS (Question Bank): Light Solved Numericals Q&A
  // ══════════════════════════════════════════════════════════
  {
    title: "Light – Reflection & Refraction: Solved Board Numericals & Ray Diagram Q&A",
    subject: "Physics",
    targetClass: "10",
    board: "CBSE & ICSE",
    resourceType: "question_bank",
    chapter: "Chapter 9",
    metaDescription: "Step-by-step solved numericals on mirror formula, lens formula, power of lenses, and refractive index for CBSE & ICSE Class 10 Physics.",
    keywords: ["CBSE Class 10 Physics", "ICSE Physics Numericals", "Lens Formula Solved Numericals", "Mirror Formula Practice", "Board Exam Numericals 2026", "Class 10 Physics Q&A"],
    content: `<h2>Light Reflection &amp; Refraction – Solved Board Numericals</h2>

<div class="qa-card">
<div class="qa-question">
<span class="qa-badge-question">QUESTION 1 • CBSE Board Exam (3 Marks)</span>
<p><strong>A concave lens has a focal length of 15 cm. At what distance should the object from the lens be placed so that it forms an image at 10 cm from the lens? Also, find the magnification produced by the lens.</strong></p>
</div>
<div class="qa-solution">
<span class="qa-badge-solution">SOLUTION • Step-by-Step Numerical Calculation</span>
<p><strong>1. Given values with Cartesian sign convention:</strong><br>
• Focal length of concave lens, <code>f = -15 cm</code><br>
• Image distance (virtual image on object side), <code>v = -10 cm</code><br>
• Object distance, <code>u = ?</code></p>

<p><strong>2. Using the Lens Formula:</strong><br>
<code>1/v - 1/u = 1/f</code><br>
<code>1/u = 1/v - 1/f</code><br>
<code>1/u = 1/(-10) - 1/(-15)</code><br>
<code>1/u = -1/10 + 1/15 = (-3 + 2) / 30 = -1/30</code><br>
<code>u = -30 cm</code></p>

<p><strong>3. Magnification calculation:</strong><br>
<code>m = v / u = (-10 cm) / (-30 cm) = +1/3 = +0.33</code></p>

<p><strong>Final Answer:</strong> The object must be placed at a distance of <strong>30 cm in front of the concave lens</strong>. The positive sign of magnification indicates a <strong>virtual, erect, and diminished image</strong> (one-third the size of the object).</p>
</div>
</div>

<div class="qa-card">
<div class="qa-question">
<span class="qa-badge-question">QUESTION 2 • Power of Lens (2 Marks)</span>
<p><strong>A doctor prescribes a corrective lens of power +2.5 D. Find the focal length of the lens. Is the prescribed lens diverging or converging? What defect of vision does it correct?</strong></p>
</div>
<div class="qa-solution">
<span class="qa-badge-solution">SOLUTION</span>
<p><strong>Focal length calculation:</strong><br>
<code>P = 1 / f (in metres)</code><br>
<code>f = 1 / P = 1 / (+2.5 D) = +0.4 m = +40 cm</code></p>
<p><strong>Inferences:</strong><br>
• Since focal length and power are <strong>positive</strong>, it is a <strong>Convex (Converging) lens</strong>.<br>
• A convex lens corrects <strong>Hypermetropia (Farsightedness)</strong>.</p>
</div>
</div>`
  },

  // ══════════════════════════════════════════════════════════
  // 7. COMPUTER SCIENCE (Topic Guide): Python Fundamentals
  // ══════════════════════════════════════════════════════════
  {
    title: "Python Programming Fundamentals – Class 10 Computer Science Comprehensive Guide",
    subject: "Computer",
    targetClass: "10",
    board: "CBSE & ICSE",
    resourceType: "topic_guide",
    chapter: "Programming with Python",
    metaDescription: "Master Class 10 Computer Science Python: Data types, operators, conditional statements, for/while loops, string slicing, and lists with clean code snippets.",
    keywords: ["CBSE Class 10 Computer", "ICSE Computer Applications", "Python Programming", "Python Loops", "String Slicing", "Python Lists", "Sumita Arora", "Board Exam 2026"],
    content: `<h2>Python Programming Fundamentals – Complete Study Guide</h2>
<p>Python is a high-level, interpreted programming language known for its clean syntax and readability, making it the premier language for CBSE Class 10 Computer Science curriculum.</p>

<div class="toc-box">
<div class="toc-title">Table of Contents</div>
<ul class="toc-list">
<li><a class="toc-link" href="#data-types">Data Types and Variables in Python</a></li>
<li><a class="toc-link" href="#operators">Operators (Arithmetic, Relational, Logical)</a></li>
<li><a class="toc-link" href="#conditionals">Conditional Decision Making (if-elif-else)</a></li>
<li><a class="toc-link" href="#loops">Iterative Loops (for &amp; while)</a></li>
<li><a class="toc-link" href="#string-list">Strings and List Manipulations</a></li>
</ul>
</div>

<h3 id="data-types">Data Types and Variables in Python</h3>
<p>Python is dynamically typed; variable types are inferred automatically at runtime.</p>

<pre class="program-box"><code># Python Data Types Example
institute_name = "SixBytes Academy"   # String (str)
total_students = 120                  # Integer (int)
average_percent = 96.5                # Floating point (float)
is_active_batch = True                # Boolean (bool)
enrolled_courses = ["Python", "CBSE Science", "Maths"] # List</code></pre>

<h3 id="conditionals">Conditional Decision Making (if-elif-else)</h3>
<pre class="program-box"><code># Grading program based on student percentage
marks = float(input("Enter marks percentage: "))

if marks &gt;= 90:
    grade = "A+ (Distinction)"
elif marks &gt;= 75:
    grade = "A (First Class)"
elif marks &gt;= 60:
    grade = "B (Second Class)"
elif marks &gt;= 33:
    grade = "C (Pass)"
else:
    grade = "F (Needs Improvement)"

print(f"Result: {grade}")</code></pre>

<h3 id="loops">Iterative Loops (for &amp; while)</h3>
<pre class="program-box"><code># Generating Multiplication Table of a Number
number = 7
print(f"--- Multiplication Table of {number} ---")
for i in range(1, 11):
    product = number * i
    print(f"{number} x {i} = {product}")</code></pre>

<h3 id="string-list">Strings and List Manipulations</h3>
<pre class="program-box"><code># String Slicing and Methods
sample = "SixBytes Learning"
print(sample[0:8])         # Output: 'SixBytes'
print(sample[::-1])        # Reversed string: 'gninraeL setyBxiS'
print(sample.upper())      # 'SIXBYTES LEARNING'

# List Operations
scores = [85, 92, 78, 96, 89]
scores.append(99)          # Appends 99 to list
scores.sort(reverse=True)  # Sort descending: [99, 96, 92, 89, 85, 78]
print(f"Top 3 Scores: {scores[:3]}")</code></pre>`
  },

  // ══════════════════════════════════════════════════════════
  // 8. COMPUTER SCIENCE (Question Bank): Python Board Practical Q&A
  // ══════════════════════════════════════════════════════════
  {
    title: "Python Programming – Solved Practical Board Examination Programs & Output Q&A",
    subject: "Computer",
    targetClass: "10",
    board: "CBSE & ICSE",
    resourceType: "question_bank",
    chapter: "Programming with Python",
    metaDescription: "Solved Python board practical exam questions: list analysis, prime number check, palindrome string, Fibonacci series, and output finding questions.",
    keywords: ["CBSE Computer Science Practicals", "Python Solved Programs", "Output Finding Questions", "Python Board Exam 2026", "Class 10 Coding Questions"],
    content: `<h2>Python Programming – Solved Practical Board Questions</h2>

<div class="qa-card">
<div class="qa-question">
<span class="qa-badge-question">QUESTION 1 • CBSE Practical Board Exam (3 Marks)</span>
<p><strong>Write a Python program to accept a number from the user and check whether it is a Prime Number or Composite Number.</strong></p>
</div>
<div class="qa-solution">
<span class="qa-badge-solution">SOLUTION • Clean Code &amp; Logic</span>
<pre class="program-box"><code># Prime Number Verification Program
num = int(input("Enter an integer: "))

if num &lt;= 1:
    print(f"{num} is neither prime nor composite.")
else:
    is_prime = True
    for i in range(2, int(num ** 0.5) + 1):
        if num % i == 0:
            is_prime = False
            break
            
    if is_prime:
        print(f"{num} is a PRIME number.")
    else:
        print(f"{num} is a COMPOSITE number.")</code></pre>
</div>
</div>

<div class="qa-card">
<div class="qa-question">
<span class="qa-badge-question">QUESTION 2 • String Palindrome (3 Marks)</span>
<p><strong>Write a Python program to check whether a given string is a Palindrome without using built-in reverse function.</strong></p>
</div>
<div class="qa-solution">
<span class="qa-badge-solution">SOLUTION</span>
<pre class="program-box"><code># Palindrome String Check
text = input("Enter a string: ").strip().lower()

reversed_text = ""
for char in text:
    reversed_text = char + reversed_text

if text == reversed_text:
    print(f"'{text}' is a PALINDROME.")
else:
    print(f"'{text}' is NOT a palindrome.")</code></pre>
</div>
</div>`
  },

  // ══════════════════════════════════════════════════════════
  // 9. MATHEMATICS (Topic Guide): Quadratic Equations
  // ══════════════════════════════════════════════════════════
  {
    title: "Quadratic Equations Class 10 – Discriminant, Roots & NCERT Formulas",
    subject: "Mathematics",
    targetClass: "10",
    board: "CBSE & ICSE",
    resourceType: "topic_guide",
    chapter: "Chapter 4",
    metaDescription: "Master Class 10 Mathematics Quadratic Equations: Quadratic formula (Sridharacharya), nature of roots, factorization method, and board exam word problems.",
    keywords: ["CBSE Class 10 Maths", "ICSE Class 10 Maths", "Quadratic Equations", "Nature of Roots", "Discriminant Formula", "NCERT Solutions", "Board Exam 2026", "RD Sharma Maths"],
    content: `<h2>Quadratic Equations – Complete Concept Guide &amp; Formulas</h2>
<p>A quadratic equation in variable <em>x</em> is an algebraic equation of the second degree of the standard form: <strong>ax² + bx + c = 0</strong>, where <em>a, b, c</em> are real numbers and <strong>a ≠ 0</strong>.</p>

<div class="toc-box">
<div class="toc-title">Table of Contents</div>
<ul class="toc-list">
<li><a class="toc-link" href="#standard-form">Standard Form &amp; Methods of Solving</a></li>
<li><a class="toc-link" href="#quadratic-formula">The Quadratic Formula (Sridharacharya Rule)</a></li>
<li><a class="toc-link" href="#discriminant">The Discriminant &amp; Nature of Roots</a></li>
<li><a class="toc-link" href="#word-problems">Techniques for Solving Word Problems</a></li>
</ul>
</div>

<h3 id="standard-form">Standard Form &amp; Methods of Solving</h3>
<ol>
<li><strong>Factorization (Splitting the Middle Term):</strong> Express <code>ax² + bx + c = 0</code> as <code>(x - α)(x - β) = 0</code>.</li>
<li><strong>Quadratic Formula:</strong> Direct mathematical calculation for real/irrational roots.</li>
</ol>

<h3 id="quadratic-formula">The Quadratic Formula</h3>
<div class="formula-callout">
<code>x = [ -b ± √(b² - 4ac) ] / (2a)</code><br>
Where the quantity <strong>D = b² - 4ac</strong> is termed the <strong>Discriminant</strong>.
</div>

<h3 id="discriminant">The Discriminant &amp; Nature of Roots</h3>
<table>
<tr><th>Discriminant Value (D = b² - 4ac)</th><th>Nature of Roots</th><th>Graphical Representation</th></tr>
<tr><td><strong>D &gt; 0</strong></td><td>Two distinct real roots: <code>α ≠ β</code></td><td>Parabola intersects x-axis at 2 distinct points</td></tr>
<tr><td><strong>D = 0</strong></td><td>Two equal real roots: <code>α = β = -b / (2a)</code></td><td>Parabola touches x-axis at exactly 1 point (tangent)</td></tr>
<tr><td><strong>D &lt; 0</strong></td><td>No real roots (Imaginary / Complex conjugate roots)</td><td>Parabola does not intersect or touch x-axis</td></tr>
</table>`
  },

  // ══════════════════════════════════════════════════════════
  // 10. MATHEMATICS (Question Bank): Quadratic Equations Solved Q&A
  // ══════════════════════════════════════════════════════════
  {
    title: "Quadratic Equations – Solved Board Questions & Speed-Time Word Problems",
    subject: "Mathematics",
    targetClass: "10",
    board: "CBSE & ICSE",
    resourceType: "question_bank",
    chapter: "Chapter 4",
    metaDescription: "Solved CBSE & ICSE board examination questions on quadratic equations: discriminant conditions, upstream-downstream word problems, and train speed problems.",
    keywords: ["CBSE Board Exam 2026", "ICSE Class 10 Maths", "Quadratic Equations Solved Questions", "Train Speed Word Problems", "Upstream Downstream Problems", "NCERT Solved Maths"],
    content: `<h2>Quadratic Equations – Solved Board Examination Problems</h2>

<div class="qa-card">
<div class="qa-question">
<span class="qa-badge-question">QUESTION 1 • CBSE Board Exam Word Problem (4 Marks)</span>
<p><strong>A motor boat whose speed is 18 km/h in still water takes 1 hour more to go 24 km upstream than to return downstream to the same spot. Find the speed of the stream.</strong></p>
</div>
<div class="qa-solution">
<span class="qa-badge-solution">SOLUTION • Step-by-Step Scoring Points</span>
<p><strong>1. Variables &amp; Speed Equations:</strong><br>
Let the speed of the stream = <code>x km/h</code> (where <code>x &lt; 18</code>).<br>
• Speed of boat upstream = <code>(18 - x) km/h</code><br>
• Speed of boat downstream = <code>(18 + x) km/h</code> <em>[1 Mark]</em></p>

<p><strong>2. Time Calculations:</strong><br>
Distance = 24 km<br>
• Time taken upstream, <code>t₁ = 24 / (18 - x)</code> hours<br>
• Time taken downstream, <code>t₂ = 24 / (18 + x)</code> hours</p>

<p><strong>3. Setting up Quadratic Equation (t₁ - t₂ = 1 hour):</strong><br>
<code>24 / (18 - x) - 24 / (18 + x) = 1</code><br>
<code>24 [ (18 + x) - (18 - x) ] / [ (18 - x)(18 + x) ] = 1</code><br>
<code>24 [ 2x ] / [ 324 - x² ] = 1</code><br>
<code>48x = 324 - x²</code><br>
<code>x² + 48x - 324 = 0</code> <em>[2 Marks]</em></p>

<p><strong>4. Solving by Factorization:</strong><br>
<code>x² + 54x - 6x - 324 = 0</code><br>
<code>x(x + 54) - 6(x + 54) = 0</code><br>
<code>(x - 6)(x + 54) = 0</code><br>
<code>x = 6</code> or <code>x = -54</code></p>
<p>Since speed cannot be negative, <code>x = -54</code> is rejected.</p>

<p><strong>Final Answer:</strong> The speed of the stream is <strong>6 km/h</strong>. <em>[1 Mark]</em></p>
</div>
</div>`
  }
];

async function seedResources() {
  try {
    console.log("🔌 Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB.\n");

    const UserModel = mongoose.models.User || mongoose.model("User", new mongoose.Schema({ email: String }));
    const admin = await UserModel.findOne({ email: "ishant.off@gmail.com" });
    const adminId = admin?._id || null;

    let total = 0;

    for (const r of resources) {
      const slug = slugify(r.title);
      const res = await Resource.findOneAndUpdate(
        { slug },
        {
          ...r,
          slug,
          published: true,
          createdBy: adminId,
          updatedAt: new Date(),
        },
        { upsert: true, new: true }
      );

      console.log(`✅ [${res.resourceType.toUpperCase()}] [${res.board}] (${res.subject}): ${res.title}`);
      total++;
    }

    console.log(`\n🎉 Seed completed! Total resources in database: ${total}`);
  } catch (error) {
    console.error("❌ Seed error:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedResources();
