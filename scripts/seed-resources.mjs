/**
 * Comprehensive Seed Script: Educational Resources for Class 10 & 12
 * Formatting: BYJU'S (Table of Contents, Chemical Reaction Flow Boxes, Theory) +
 *             SHAALAA (QUESTION and SOLUTION Callouts, Board Questions, Exam Tips)
 * Boards: CBSE & ICSE
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

/* ─── BYJU'S + SHAALAA STRUCTURED RESOURCES ─────────────── */
const resources = [
  // ══════════════════════════════════════════════════════════
  // CHEMISTRY (Class 10 & 12): Aldehydes, Ketones, Carboxylic Acids (From User Screenshot!)
  // ══════════════════════════════════════════════════════════
  {
    title: "Aldehydes, Ketones, and Carboxylic Acids – Structure, Preparation & Reactions",
    subject: "Chemistry",
    targetClass: "10",
    board: "CBSE & ICSE",
    chapter: "Carbon & Carbonyl Compounds",
    metaDescription: "Detailed study notes on aldehydes, ketones, and carboxylic acids with Rosenmund reduction, IUPAC nomenclature, Board Q&A, and reaction mechanisms.",
    keywords: ["CBSE Class 10", "ICSE Class 10", "CBSE Class 12", "Aldehydes and Ketones", "Carboxylic Acids", "Rosenmund Reduction", "Carbonyl Compounds", "NCERT Chemistry", "Board Exam 2026", "Shaalaa Solutions", "BYJUS Chemistry"],
    content: `<h2>What are Aldehydes, Ketones, and Carboxylic Acids?</h2>
<p>Aldehydes, Ketones, and Carboxylic Acids are <em><strong>carbonyl compounds which contain a carbon-oxygen double bond (&gt;C=O)</strong></em>. These organic compounds are central to organic chemistry and find extensive industrial, biological, and pharmaceutical applications.</p>

<div class="concept-callout">
<strong>Key Concept:</strong> The carbonyl carbon is <em>sp² hybridized</em> and forms three sigma (σ) bonds with a planar trigonal geometry. The carbon-oxygen double bond is strongly polarized due to the high electronegativity of oxygen (δ⁺ on Carbon, δ⁻ on Oxygen), making carbonyl carbon electrophilic.
</div>

<div class="toc-box">
<div class="toc-title">Table of Contents</div>
<ul class="toc-list">
<li><a class="toc-link" href="#what-are-aldehydes">What are Aldehydes?</a></li>
<li><a class="toc-link" href="#preparation-of-aldehydes">Preparation of Aldehydes (Rosenmund Reduction &amp; Ozonolysis)</a></li>
<li><a class="toc-link" href="#what-are-ketones">What are Ketones?</a></li>
<li><a class="toc-link" href="#preparation-of-ketones">Preparation of Ketones</a></li>
<li><a class="toc-link" href="#carboxylic-acids">Carboxylic Acids &amp; Functional Groups</a></li>
<li><a class="toc-link" href="#solved-questions">Solved Board Examination Questions (Shaalaa Pattern)</a></li>
<li><a class="toc-link" href="#faqs">Frequently Asked Questions – FAQs</a></li>
</ul>
</div>

<h3 id="what-are-aldehydes">What are Aldehydes?</h3>
<p>Aldehydes are organic compounds in which the carbonyl group is bonded to at least one hydrogen atom. The general formula is <strong>R-CHO</strong>, where R can be hydrogen (H) or an alkyl/aryl group.</p>
<ul>
<li><strong>Methanal (Formaldehyde):</strong> H-CHO (used as a biological preservative)</li>
<li><strong>Ethanal (Acetaldehyde):</strong> CH₃-CHO (precursor in chemical synthesis)</li>
<li><strong>Benzaldehyde:</strong> C₆H₅-CHO (almond fragrance, aromatic aldehyde)</li>
</ul>

<h3 id="preparation-of-aldehydes">Preparation of Aldehydes</h3>
<p><strong>1. Rosenmund Reduction:</strong> Acid chlorides (acyl chlorides) are selectively reduced to aldehydes by catalytic hydrogenation using palladium on barium sulfate (Pd/BaSO₄) poisoned with sulfur or quinoline.</p>

<div class="reaction-box">
<div class="reaction-label">Rosenmund Reduction (Name Reaction)</div>
R-CO-Cl + H₂ ──[ Pd / BaSO₄ , Quinoline (Poison) ]──&gt; R-CHO + HCl
<br><br>
C₆H₅-CO-Cl (Benzoyl chloride) + H₂ ──[ Pd/BaSO₄ ]──&gt; C₆H₅-CHO (Benzaldehyde) + HCl
</div>

<p><em>Note: Formaldehyde cannot be prepared by this method because formyl chloride (H-CO-Cl) is unstable at room temperature.</em></p>

<p><strong>2. Oxidation of Primary Alcohols:</strong> Primary alcohols (1°) undergo mild oxidation with Pyridinium Chlorochromate (PCC) or Copper at 573 K to yield aldehydes:</p>
<div class="reaction-box">
<div class="reaction-label">Dehydrogenation of Primary Alcohol</div>
R-CH₂-OH ──[ Cu / 573 K or PCC ]──&gt; R-CHO + H₂
</div>

<h3 id="what-are-ketones">What are Ketones?</h3>
<p>Ketones are organic compounds in which the carbonyl group (&gt;C=O) is attached to two alkyl groups, two aryl groups, or one alkyl and one aryl group. The general formula is <strong>R-CO-R'</strong>.</p>
<ul>
<li><strong>Propanone (Acetone):</strong> CH₃-CO-CH₃ (common laboratory and nail polish solvent)</li>
<li><strong>Acetophenone:</strong> C₆H₅-CO-CH₃ (aromatic ketone)</li>
<li><strong>Benzophenone:</strong> C₆H₅-CO-C₆H₅ (diaryl ketone)</li>
</ul>

<div class="reaction-box">
<div class="reaction-label">General Formula &amp; Structure of Ketone</div>
      O
      ║
R ─── C ─── R'   (R, R' may be alkyl or aryl groups)
</div>

<h3 id="preparation-of-ketones">Preparation of Ketones</h3>
<p><strong>1. Oxidation of Secondary Alcohols:</strong> Secondary alcohols (2°) on oxidation with potassium dichromate (K₂Cr₂O₇) or Chromic anhydride (CrO₃) yield ketones:</p>
<div class="reaction-box">
<div class="reaction-label">Oxidation of Secondary Alcohol</div>
CH₃-CH(OH)-CH₃ (Propan-2-ol) ──[ CrO₃ / H₂SO₄ ]──&gt; CH₃-CO-CH₃ (Acetone) + H₂O
</div>

<p><strong>2. Friedel-Crafts Acylation:</strong> Reaction of benzene with an acyl chloride in the presence of anhydrous AlCl₃ produces aromatic ketones:</p>
<div class="reaction-box">
<div class="reaction-label">Friedel-Crafts Acylation</div>
C₆H₆ (Benzene) + CH₃-CO-Cl ──[ Anhydrous AlCl₃ ]──&gt; C₆H₅-CO-CH₃ (Acetophenone) + HCl
</div>

<h3 id="carboxylic-acids">Carboxylic Acids &amp; Functional Groups</h3>
<p>Carboxylic acids contain a carboxyl group <strong>(-COOH)</strong> consisting of a carbonyl group bonded to a hydroxyl group. General formula: <strong>R-COOH</strong>.</p>
<ul>
<li><strong>Methanoic Acid (Formic acid):</strong> H-COOH (present in ant stings)</li>
<li><strong>Ethanoic Acid (Acetic acid):</strong> CH₃-COOH (5-8% solution is vinegar)</li>
<li><strong>Benzoic Acid:</strong> C₆H₅-COOH (food preservative sodium benzoate)</li>
</ul>

<div class="qa-card" id="solved-questions">
<div class="qa-question">
<span class="qa-badge-question">QUESTION • CBSE &amp; ICSE Board Exam</span>
<p><strong>(a) What are ketones? Give their general formula and IUPAC name of the simplest ketone.</strong><br><strong>(b) How will you convert Ethanal to Propan-2-ol using Grignard reagent?</strong></p>
</div>
<div class="qa-solution">
<span class="qa-badge-solution">SOLUTION • SixBytes Verified Answer</span>
<p><strong>(a) Definition:</strong> Ketones are organic compounds in which the carbonyl carbon (&gt;C=O) is linked to two alkyl or aryl hydrocarbon groups.</p>
<ul>
<li><strong>General Formula:</strong> C<sub>n</sub>H<sub>2n</sub>O or R-CO-R'</li>
<li><strong>Simplest Ketone:</strong> Propanone (CH₃COCH₃), commonly called Acetone.</li>
</ul>
<p><strong>(b) Conversion using Grignard Reagent:</strong></p>
<ol>
<li>Ethanal reacts with Methyl magnesium bromide (CH₃MgBr) in dry ether to form an addition adduct.</li>
<li>Hydrolysis of this adduct with dilute acid produces Propan-2-ol (secondary alcohol).</li>
</ol>
<div class="reaction-box">
CH₃-CHO + CH₃MgBr ──[ Dry Ether ]──&gt; CH₃-CH(OMgBr)-CH₃ ──[ H₃O⁺ ]──&gt; CH₃-CH(OH)-CH₃ + Mg(OH)Br
</div>
</div>
</div>

<div class="qa-card">
<div class="qa-question">
<span class="qa-badge-question">QUESTION • Shaalaa Practice Question Bank</span>
<p><strong>Distinguish between Aldehydes and Ketones using chemical tests (Tollens' reagent and Fehling's solution).</strong></p>
</div>
<div class="qa-solution">
<span class="qa-badge-solution">SOLUTION</span>
<table>
<tr><th>Test</th><th>Aldehydes (R-CHO)</th><th>Ketones (R-CO-R')</th></tr>
<tr><td><strong>Tollens' Test (Silver Mirror)</strong></td><td>Gives shining silver mirror of Ag with ammoniacal AgNO₃</td><td>No reaction (Ketones do not reduce Tollens' reagent)</td></tr>
<tr><td><strong>Fehling's Solution Test</strong></td><td>Gives red precipitate of Cu₂O on heating</td><td>No reaction with aliphatic/aromatic ketones</td></tr>
<tr><td><strong>Oxidation Ease</strong></td><td>Easily oxidised to carboxylic acids with mild agents</td><td>Resistant to mild oxidation; requires vigorous cleavage</td></tr>
</table>
</div>
</div>

<h3 id="faqs">Frequently Asked Questions – FAQs</h3>
<div class="concept-callout">
<strong>Q1: Why are aldehydes more reactive than ketones towards nucleophilic addition?</strong><br>
<em>Answer:</em> Due to two reasons: (1) <strong>Electronic effect:</strong> Ketones have two electron-releasing (+I) alkyl groups which reduce the electrophilicity of carbonyl carbon more than in aldehydes. (2) <strong>Steric hindrance:</strong> Two bulky alkyl groups in ketones hinder the approach of nucleophiles to the carbonyl carbon.
<br><br>
<strong>Q2: What is Rosenmund reduction catalyst poison?</strong><br>
<em>Answer:</em> BaSO₄ poisoned with sulfur or quinoline acts as a catalyst poison to prevent further reduction of the aldehyde into a primary alcohol.
</div>`
  },

  // ══════════════════════════════════════════════════════════
  // CHEMISTRY: Chemical Reactions and Equations (Class 10 CBSE / ICSE)
  // ══════════════════════════════════════════════════════════
  {
    title: "Chemical Reactions and Equations – Class 10 NCERT Solutions & Revision Notes",
    subject: "Chemistry",
    targetClass: "10",
    board: "CBSE & ICSE",
    chapter: "Chapter 1",
    metaDescription: "Comprehensive notes and NCERT solutions for Class 10 Chemistry Chapter 1. Balancing chemical equations, redox reactions, precipitation, and board questions.",
    keywords: ["CBSE Class 10", "ICSE Class 10", "NCERT Solutions", "Chemical Reactions and Equations", "Balancing Equations", "Combination Reaction", "Displacement Reaction", "Board Exam 2026", "Lakhmir Singh Chemistry", "Shaalaa Solutions"],
    content: `<h2>Chemical Reactions and Equations – Complete Study Guide</h2>
<p>A <strong>chemical reaction</strong> is a process in which one or more substances (reactants) transform into new chemical substances (products) with completely different physical and chemical properties. During a chemical reaction, bonds between atoms in reactants break and new bonds form to create products.</p>

<div class="concept-callout">
<strong>Indicators of a Chemical Reaction:</strong> Change in state, change in colour, evolution of a gas, change in temperature, or formation of a precipitate (insoluble solid).
</div>

<div class="toc-box">
<div class="toc-title">Table of Contents</div>
<ul class="toc-list">
<li><a class="toc-link" href="#balancing-equations">How to Balance Chemical Equations (Step-by-Step)</a></li>
<li><a class="toc-link" href="#types-of-reactions">5 Major Types of Chemical Reactions</a></li>
<li><a class="toc-link" href="#redox-reactions">Oxidation, Reduction and Redox Reactions</a></li>
<li><a class="toc-link" href="#corrosion-rancidity">Corrosion and Rancidity in Daily Life</a></li>
<li><a class="toc-link" href="#solved-board-questions">Solved Board Examination Questions (Shaalaa Pattern)</a></li>
<li><a class="toc-link" href="#faqs">Frequently Asked Questions – FAQs</a></li>
</ul>
</div>

<h3 id="balancing-equations">How to Balance Chemical Equations</h3>
<p>A balanced chemical equation has an equal number of atoms of each element on both reactant and product sides. This satisfies the <strong>Law of Conservation of Mass</strong> (mass can neither be created nor destroyed in a chemical reaction).</p>

<div class="reaction-box">
<div class="reaction-label">Example: Iron reacting with Steam</div>
Unbalanced: Fe (s) + H₂O (g) ──&gt; Fe₃O₄ (s) + H₂ (g)
<br><br>
Balanced: 3Fe (s) + 4H₂O (g) ──&gt; Fe₃O₄ (s) + 4H₂ (g)
</div>

<h3 id="types-of-reactions">5 Major Types of Chemical Reactions</h3>
<table>
<tr><th>Type</th><th>Definition</th><th>Chemical Equation Example</th></tr>
<tr><td><strong>Combination Reaction</strong></td><td>Two or more reactants combine to form a single product.</td><td>CaO (Quicklime) + H₂O → Ca(OH)₂ (Slaked lime) + Heat</td></tr>
<tr><td><strong>Decomposition Reaction</strong></td><td>A single compound breaks down into two or more simpler substances.</td><td>2Pb(NO₃)₂ ──[Heat]──&gt; 2PbO + 4NO₂ (Brown gas) + O₂</td></tr>
<tr><td><strong>Displacement Reaction</strong></td><td>A more reactive element displaces a less reactive element from its solution.</td><td>Fe (s) + CuSO₄ (aq, Blue) → FeSO₄ (aq, Green) + Cu (s)</td></tr>
<tr><td><strong>Double Displacement</strong></td><td>Exchange of ions between two reactant compounds.</td><td>Na₂SO₄ (aq) + BaCl₂ (aq) → BaSO₄ (White ppt) + 2NaCl</td></tr>
<tr><td><strong>Redox Reaction</strong></td><td>Simultaneous oxidation (loss of e⁻ / gain of O) and reduction (gain of e⁻ / loss of O).</td><td>CuO + H₂ ──[Heat]──&gt; Cu + H₂O</td></tr>
</table>

<div class="qa-card" id="solved-board-questions">
<div class="qa-question">
<span class="qa-badge-question">QUESTION • CBSE Class 10 Board Exam (3 Marks)</span>
<p><strong>Why is respiration considered an exothermic reaction? Write the balanced chemical equation representing cellular respiration.</strong></p>
</div>
<div class="qa-solution">
<span class="qa-badge-solution">SOLUTION • Step-by-Step Scoring Points</span>
<p><strong>Reason:</strong> During digestion, food containing carbohydrates is broken down into glucose. This glucose combines with oxygen in the cells of our body and burns to release a large amount of energy in the form of ATP to power body functions. Because energy is released during this process, respiration is classified as an <strong>exothermic reaction</strong>.</p>
<div class="reaction-box">
<div class="reaction-label">Chemical Equation of Respiration</div>
C₆H₁₂O₆ (aq) + 6O₂ (aq) ──&gt; 6CO₂ (aq) + 6H₂O (l) + Energy (38 ATP)
</div>
</div>
</div>

<div class="qa-card">
<div class="qa-question">
<span class="qa-badge-question">QUESTION • ICSE Class 10 Important Problem</span>
<p><strong>Identify the substance oxidised, substance reduced, oxidising agent, and reducing agent in:</strong><br>
<code>MnO₂ + 4HCl → MnCl₂ + 2H₂O + Cl₂</code></p>
</div>
<div class="qa-solution">
<span class="qa-badge-solution">SOLUTION</span>
<ul>
<li><strong>Substance Oxidised:</strong> HCl (hydrogen is removed and converted to Cl₂)</li>
<li><strong>Substance Reduced:</strong> MnO₂ (oxygen is removed and converted to MnCl₂)</li>
<li><strong>Oxidising Agent:</strong> MnO₂ (provides oxygen / causes oxidation of HCl)</li>
<li><strong>Reducing Agent:</strong> HCl (causes reduction of MnO₂)</li>
</ul>
</div>
</div>

<h3 id="faqs">Frequently Asked Questions – FAQs</h3>
<div class="concept-callout">
<strong>Q: What is the difference between displacement and double displacement reaction?</strong><br>
<em>Answer:</em> In a displacement reaction, a single free element replaces another ion from a compound (e.g. Zn + CuSO₄ → ZnSO₄ + Cu). In double displacement, two ionic compounds exchange their positive and negative ions simultaneously to produce two new compounds (e.g. AgNO₃ + NaCl → AgCl + NaNO₃).
</div>`
  },

  // ══════════════════════════════════════════════════════════
  // PHYSICS: Light – Reflection and Refraction (Class 10 CBSE / ICSE)
  // ══════════════════════════════════════════════════════════
  {
    title: "Light – Reflection and Refraction Class 10: Formulas, Ray Diagrams & NCERT Solutions",
    subject: "Physics",
    targetClass: "10",
    board: "CBSE & ICSE",
    chapter: "Chapter 9",
    metaDescription: "Master Class 10 Physics Light Reflection and Refraction: Mirror formula, Lens formula, Snell's law, sign conventions, solved numericals, and board questions.",
    keywords: ["CBSE Class 10 Physics", "ICSE Class 10 Physics", "Mirror Formula", "Lens Formula", "Snells Law", "Refractive Index", "Ray Diagrams", "NCERT Solutions", "Board Exam 2026", "HC Verma Physics", "Shaalaa Solutions"],
    content: `<h2>Light – Reflection and Refraction Study Guide</h2>
<p>Light is a form of energy that produces the sensation of vision in our eyes. Light propagates along straight lines in a homogeneous medium at a speed of <strong>c ≈ 3 × 10⁸ m/s</strong> in vacuum.</p>

<div class="toc-box">
<div class="toc-title">Table of Contents</div>
<ul class="toc-list">
<li><a class="toc-link" href="#laws-of-reflection">Laws of Reflection &amp; Spherical Mirrors</a></li>
<li><a class="toc-link" href="#mirror-formula">Mirror Formula &amp; Sign Convention</a></li>
<li><a class="toc-link" href="#refraction-snell">Refraction of Light &amp; Snell's Law</a></li>
<li><a class="toc-link" href="#lens-formula">Lenses, Lens Formula &amp; Power</a></li>
<li><a class="toc-link" href="#solved-numericals">Solved Board Exam Numericals (Shaalaa Pattern)</a></li>
<li><a class="toc-link" href="#faqs">Frequently Asked Questions – FAQs</a></li>
</ul>
</div>

<h3 id="laws-of-reflection">Laws of Reflection &amp; Spherical Mirrors</h3>
<ol>
<li>The angle of incidence is equal to the angle of reflection: <strong>∠i = ∠r</strong></li>
<li>The incident ray, reflected ray, and the normal to the reflecting surface at the point of incidence all lie in the same plane.</li>
</ol>

<h3 id="mirror-formula">Mirror Formula &amp; Sign Convention</h3>
<div class="formula-callout">
<strong>Mirror Formula:</strong><br>
<code>1/v + 1/u = 1/f</code><br><br>
<strong>Linear Magnification (m):</strong><br>
<code>m = (Height of image, h') / (Height of object, h) = -v / u</code>
</div>
<p><em>New Cartesian Sign Convention:</em> Object is always placed on the left (u is always negative). Concave mirror has negative focal length (f &lt; 0); Convex mirror has positive focal length (f &gt; 0).</p>

<h3 id="refraction-snell">Refraction of Light &amp; Snell's Law</h3>
<p>When a ray of light travels obliquely from one optical medium to another, it bends at the interface due to a difference in speed. According to <strong>Snell's Law of Refraction</strong>:</p>
<div class="formula-callout">
<code>sin i / sin r = n₂₁ = n₂ / n₁ = v₁ / v₂</code><br>
Where n₂₁ is the refractive index of medium 2 with respect to medium 1.
</div>

<h3 id="lens-formula">Lenses, Lens Formula &amp; Power</h3>
<div class="formula-callout">
<strong>Lens Formula:</strong><br>
<code>1/v - 1/u = 1/f</code><br><br>
<strong>Lens Magnification:</strong> <code>m = h'/h = +v/u</code><br><br>
<strong>Power of a Lens (P):</strong> <code>P = 1 / f (in metres)</code>. Unit: <strong>Dioptre (D)</strong>.
</div>

<div class="qa-card" id="solved-numericals">
<div class="qa-question">
<span class="qa-badge-question">QUESTION • CBSE Board Standard Numerical (3 Marks)</span>
<p><strong>A convex lens of focal length 15 cm forms an image 10 cm from the lens. How far is the object placed from the lens? Draw the ray diagram.</strong></p>
</div>
<div class="qa-solution">
<span class="qa-badge-solution">SOLUTION • Step-by-Step Scoring Guide</span>
<p><strong>Given:</strong><br>
• Focal length of concave lens (diverging), f = -15 cm<br>
• Image distance, v = -10 cm (concave lens always forms a virtual image on the same side)<br>
• Object distance, u = ?</p>

<p><strong>Applying Lens Formula:</strong><br>
<code>1/v - 1/u = 1/f</code><br>
<code>1/u = 1/v - 1/f</code><br>
<code>1/u = 1/(-10) - 1/(-15) = -1/10 + 1/15</code><br>
<code>1/u = (-3 + 2) / 30 = -1 / 30</code><br>
<code>u = -30 cm</code></p>

<p><strong>Final Answer:</strong> The object is placed at a distance of <strong>30 cm in front of the lens</strong>.</p>
</div>
</div>`
  },

  // ══════════════════════════════════════════════════════════
  // PHYSICS: Electricity & Circuits (Class 10 CBSE / ICSE)
  // ══════════════════════════════════════════════════════════
  {
    title: "Electricity Class 10 – Ohm's Law, Resistors & Joule's Heating NCERT Solutions",
    subject: "Physics",
    targetClass: "10",
    board: "CBSE & ICSE",
    chapter: "Chapter 11",
    metaDescription: "Master Class 10 Physics Electricity: Ohm's law, series and parallel circuits, resistivity, electrical power, Joule's law of heating, and solved numericals.",
    keywords: ["CBSE Class 10 Physics", "ICSE Class 10 Physics", "Electricity Class 10", "Ohms Law", "Series and Parallel", "Resistivity", "Joules Heating", "Electric Power", "NCERT Solutions", "Board Exam 2026", "SL Arora Physics"],
    content: `<h2>Electricity – Complete Chapter Revision &amp; Solutions</h2>
<p>Electricity is a controllable and convenient form of energy. Electric current (I) is defined as the rate of flow of electric charges across any cross-section of a conductor.</p>

<div class="toc-box">
<div class="toc-title">Table of Contents</div>
<ul class="toc-list">
<li><a class="toc-link" href="#ohms-law">Ohm's Law &amp; Resistance</a></li>
<li><a class="toc-link" href="#factors-resistance">Factors Affecting Resistance &amp; Resistivity</a></li>
<li><a class="toc-link" href="#series-parallel">Combination of Resistors (Series vs Parallel)</a></li>
<li><a class="toc-link" href="#heating-effect">Joule's Law of Heating &amp; Electric Power</a></li>
<li><a class="toc-link" href="#solved-numericals">Board Examination Solved Numericals</a></li>
</ul>
</div>

<h3 id="ohms-law">Ohm's Law &amp; Resistance</h3>
<div class="formula-callout">
<strong>Ohm's Law Statement:</strong> The potential difference (V) across the ends of a metallic wire is directly proportional to the current (I) flowing through it, provided its temperature remains constant.<br>
<code>V = I × R</code> (where R is the electrical resistance, in Ohms, Ω)
</div>

<h3 id="factors-resistance">Factors Affecting Resistance &amp; Resistivity</h3>
<div class="formula-callout">
<code>R = ρ × (l / A)</code><br>
Where: <strong>l</strong> = length of conductor (m), <strong>A</strong> = cross-sectional area (m²), <strong>ρ</strong> = specific electrical resistivity of material (Ω·m).
</div>

<h3 id="series-parallel">Combination of Resistors</h3>
<table>
<tr><th>Feature</th><th>Series Combination</th><th>Parallel Combination</th></tr>
<tr><td><strong>Equivalent Formula</strong></td><td><code>R_eq = R₁ + R₂ + R₃</code></td><td><code>1/R_eq = 1/R₁ + 1/R₂ + 1/R₃</code></td></tr>
<tr><td><strong>Current (I)</strong></td><td>Same through every resistor</td><td>Divides among branches: <code>I = I₁ + I₂ + I₃</code></td></tr>
<tr><td><strong>Voltage (V)</strong></td><td>Divides across resistors: <code>V = V₁ + V₂ + V₃</code></td><td>Same voltage across all parallel branches</td></tr>
<tr><td><strong>Overall Resistance</strong></td><td>Greater than the largest resistor</td><td>Smaller than the smallest individual resistor</td></tr>
</table>

<h3 id="heating-effect">Joule's Law of Heating &amp; Electric Power</h3>
<div class="formula-callout">
<strong>Heat Generated:</strong> <code>H = I²Rt = VIt = (V² / R) × t</code> (Joules)<br>
<strong>Electric Power:</strong> <code>P = V × I = I²R = V² / R</code> (Watts)<br>
<strong>Commercial Unit:</strong> 1 kilowatt-hour (1 kWh) = 3.6 × 10⁶ Joules = 1 Unit of electricity.
</div>

<div class="qa-card" id="solved-numericals">
<div class="qa-question">
<span class="qa-badge-question">QUESTION • CBSE Class 10 Board Exam Problem (3 Marks)</span>
<p><strong>An electric lamp of resistance 20 Ω and a conductor of 4 Ω resistance are connected in series to a 6 V battery. Calculate:<br>(a) The total resistance of the circuit,<br>(b) The current flowing through the circuit,<br>(c) The potential difference across the lamp and the conductor.</strong></p>
</div>
<div class="qa-solution">
<span class="qa-badge-solution">SOLUTION • Step-by-Step Calculation</span>
<p><strong>(a) Total Resistance in Series:</strong><br>
<code>R_total = R_lamp + R_conductor = 20 Ω + 4 Ω = 24 Ω</code></p>

<p><strong>(b) Current in Circuit (Ohm's Law):</strong><br>
<code>I = V / R_total = 6 V / 24 Ω = 0.25 A</code></p>

<p><strong>(c) Potential Difference Across Each:</strong><br>
• Across Lamp: <code>V₁ = I × R_lamp = 0.25 A × 20 Ω = 5.0 V</code><br>
• Across Conductor: <code>V₂ = I × R_conductor = 0.25 A × 4 Ω = 1.0 V</code><br>
<em>Check: V₁ + V₂ = 5.0 V + 1.0 V = 6.0 V (Matches battery voltage!)</em></p>
</div>
</div>`
  },

  // ══════════════════════════════════════════════════════════
  // BIOLOGY: Life Processes (Class 10 CBSE / ICSE)
  // ══════════════════════════════════════════════════════════
  {
    title: "Life Processes Class 10 Biology – NCERT Notes, Diagrams & Board Solutions",
    subject: "Biology",
    targetClass: "10",
    board: "CBSE & ICSE",
    chapter: "Chapter 5",
    metaDescription: "Comprehensive Class 10 Biology Life Processes guide: Photosynthesis equations, Human digestive system, Heart double circulation, Nephron excretion, and Board Q&A.",
    keywords: ["CBSE Class 10 Biology", "ICSE Class 10 Biology", "Life Processes", "Photosynthesis", "Double Circulation", "Nephron Diagram", "NCERT Solutions", "Board Exam 2026", "Truemans Biology"],
    content: `<h2>Life Processes – Complete Revision &amp; Board Solutions</h2>
<p>All living organisms perform vital physiological maintenance functions called <strong>life processes</strong>. These include Nutrition, Respiration, Transportation, and Excretion.</p>

<div class="toc-box">
<div class="toc-title">Table of Contents</div>
<ul class="toc-list">
<li><a class="toc-link" href="#autotrophic-nutrition">Autotrophic Nutrition &amp; Photosynthesis Equation</a></li>
<li><a class="toc-link" href="#human-digestion">Human Alimentary Canal &amp; Enzyme Action</a></li>
<li><a class="toc-link" href="#aerobic-anaerobic">Aerobic vs Anaerobic Respiration</a></li>
<li><a class="toc-link" href="#double-circulation">Human Heart &amp; Double Circulation</a></li>
<li><a class="toc-link" href="#nephron-excretion">Excretory System &amp; Nephron Function</a></li>
<li><a class="toc-link" href="#solved-questions">Solved Board Examination Questions</a></li>
</ul>
</div>

<h3 id="autotrophic-nutrition">Autotrophic Nutrition &amp; Photosynthesis</h3>
<div class="reaction-box">
<div class="reaction-label">Overall Photosynthesis Reaction Equation</div>
6CO₂ (From Air) + 12H₂O (From Soil) ──[ Sunlight / Chlorophyll ]──&gt; C₆H₁₂O₆ (Glucose) + 6O₂ (Byproduct) + 6H₂O
</div>

<h3 id="aerobic-anaerobic">Aerobic vs Anaerobic Respiration</h3>
<table>
<tr><th>Parameter</th><th>Aerobic Respiration</th><th>Anaerobic Respiration</th></tr>
<tr><td><strong>Oxygen Requirement</strong></td><td>Occurs in the presence of O₂</td><td>Occurs in the absence of O₂</td></tr>
<tr><td><strong>Site of Occurrence</strong></td><td>Cytoplasm and Mitochondria</td><td>Cytoplasm only</td></tr>
<tr><td><strong>End Products</strong></td><td>CO₂ + H₂O + Energy</td><td>Ethanol + CO₂ (in Yeast) OR Lactic acid (in Muscle cells)</td></tr>
<tr><td><strong>Energy Output</strong></td><td>High: 38 ATP per glucose</td><td>Low: 2 ATP per glucose</td></tr>
</table>

<div class="qa-card" id="solved-questions">
<div class="qa-question">
<span class="qa-badge-question">QUESTION • CBSE Class 10 Board Exam (3 Marks)</span>
<p><strong>What is double circulation? Why is it necessary in human beings?</strong></p>
</div>
<div class="qa-solution">
<span class="qa-badge-solution">SOLUTION • Scoring Answer</span>
<p><strong>Definition:</strong> Double circulation is a circulatory mechanism in which blood passes through the heart twice during each complete circuit of the body:</p>
<ol>
<li><strong>Pulmonary Circulation:</strong> Deoxygenated blood is pumped from the right ventricle to the lungs for oxygenation and returns oxygenated to the left atrium.</li>
<li><strong>Systemic Circulation:</strong> Oxygenated blood is pumped from the left ventricle to all body tissues and organs, and returns deoxygenated to the right atrium.</li>
</ol>
<p><strong>Necessity:</strong> Humans are warm-blooded (endothermic) organisms requiring high amounts of continuous energy to maintain constant body temperature. Separation of oxygenated and deoxygenated blood ensures highly efficient oxygen supply to cells and prevents mixing.</p>
</div>
</div>`
  },

  // ══════════════════════════════════════════════════════════
  // COMPUTER SCIENCE: Python Programming & Networks (Class 10 CBSE / ICSE)
  // ══════════════════════════════════════════════════════════
  {
    title: "Python Programming & Cyber Safety – Class 10 Computer Science Board Notes",
    subject: "Computer",
    targetClass: "10",
    board: "CBSE & ICSE",
    chapter: "Coding & Networks",
    metaDescription: "Master Class 10 Computer Science: Python control flow, lists, strings, computer networking (LAN, WAN, DNS, HTTP), cyber security, and solved coding questions.",
    keywords: ["CBSE Class 10 Computer Science", "ICSE Class 10 Computer Applications", "Python Programming", "Loops and Conditionals", "Networking LAN WAN", "Cyber Safety", "Sumita Arora", "Board Exam 2026"],
    content: `<h2>Python Programming &amp; Computer Networks Study Guide</h2>
<p>Computer Science in CBSE Class 10 covers fundamental computational thinking in Python and foundational understanding of Internet networking protocols and cyber ethics.</p>

<div class="toc-box">
<div class="toc-title">Table of Contents</div>
<ul class="toc-list">
<li><a class="toc-link" href="#python-basics">Python Data Types &amp; Operators</a></li>
<li><a class="toc-link" href="#control-flow">Conditional Statements &amp; Loops</a></li>
<li><a class="toc-link" href="#networking">Computer Networks &amp; Topologies (LAN, MAN, WAN)</a></li>
<li><a class="toc-link" href="#cyber-safety">Cyber Safety &amp; Ethics</a></li>
<li><a class="toc-link" href="#solved-coding">Solved Python Board Coding Problems</a></li>
</ul>
</div>

<h3 id="python-basics">Python Data Types &amp; Operators</h3>
<div class="reaction-box">
<div class="reaction-label">Python Variable Declarations</div>
name = "SixBytes Academy"      # String (str)
batch_strength = 25            # Integer (int)
score_percent = 98.4           # Floating point (float)
is_enrolled = True             # Boolean (bool)
subjects = ["Math", "Physics", "Chemistry", "Coding"]  # List
</div>

<div class="qa-card" id="solved-coding">
<div class="qa-question">
<span class="qa-badge-question">QUESTION • CBSE Board Practical Exam (3 Marks)</span>
<p><strong>Write a Python program that accepts a list of student marks and prints the highest mark, average score, and number of students scoring 90% or above.</strong></p>
</div>
<div class="qa-solution">
<span class="qa-badge-solution">SOLUTION • Clean Python Code</span>
<div class="reaction-box">
# SixBytes Python Program for Student Marks Analysis
marks = [88, 92, 79, 95, 91, 84, 98, 76]

highest = max(marks)
average = sum(marks) / len(marks)
above_90 = sum(1 for m in marks if m &gt;= 90)

print(f"Highest Score : {highest}")
print(f"Average Score : {average:.2f}")
print(f"Students &gt;= 90%: {above_90}")
</div>
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

    let updated = 0;
    let created = 0;

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

      console.log(`✅ Upserted [${res.board}] (${res.subject}): ${res.title}`);
      if (res.wasNew) created++; else updated++;
    }

    console.log(`\n🎉 Seed completed successfully! Total resources in database: ${resources.length}`);
  } catch (error) {
    console.error("❌ Seed error:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedResources();
