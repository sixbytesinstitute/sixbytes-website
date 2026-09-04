/**
 * Seed Script: NCERT Class 10 Science — Missing Chapters
 * Covers: Carbon & Compounds, Control & Coordination, Reproduction,
 *         Human Eye, Our Environment
 * 
 * Run: node scripts/seed-ncert-science.mjs
 */
import mongoose from "mongoose";
import { readFileSync } from "fs";

// ─── Load MONGO_URI from .env.local ────────────────────────
const envFile = readFileSync(".env.local", "utf-8");
let MONGO_URI = "";
for (const line of envFile.split("\n")) {
  if (line.trim().startsWith("MONGO_URI=")) {
    MONGO_URI = line.trim().split("=").slice(1).join("=");
    break;
  }
}
if (!MONGO_URI) { console.error("MONGO_URI not found"); process.exit(1); }

// ─── Resource Schema ───────────────────────────────────────
const ResourceSchema = new mongoose.Schema({
  slug: { type: String, unique: true, lowercase: true, trim: true, index: true },
  title: { type: String, trim: true },
  metaDescription: { type: String, maxlength: 160 },
  subject: { type: String, index: true },
  targetClass: { type: String },
  board: { type: String, default: "CBSE & ICSE" },
  resourceType: { type: String, enum: ["topic_guide", "question_bank", "formula_sheet"], default: "topic_guide" },
  chapter: { type: String, default: null },
  content: { type: String },
  keywords: { type: [String], default: [] },
  published: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Resource = mongoose.model("Resource", ResourceSchema);

// ═══════════════════════════════════════════════════════════
//  RESOURCES DATA
// ═══════════════════════════════════════════════════════════

const resources = [

// ────────────────────────────────────────────────────────────
// 1. CHEMISTRY — Carbon and Its Compounds (Chapter 4)
// ────────────────────────────────────────────────────────────
{
  slug: "carbon-and-its-compounds-class-10-chemistry-ncert-notes",
  title: "Carbon and Its Compounds – Class 10 Chemistry Chapter 4 NCERT Notes",
  metaDescription: "Class 10 Carbon and Its Compounds notes covering covalent bonding, hydrocarbons, functional groups, soaps and detergents for CBSE & ICSE boards.",
  subject: "Chemistry",
  targetClass: "10",
  board: "CBSE & ICSE",
  resourceType: "topic_guide",
  chapter: "Carbon and Its Compounds",
  keywords: ["carbon compounds class 10", "covalent bonding", "hydrocarbons", "functional groups", "organic chemistry class 10", "NCERT chemistry", "CBSE", "ICSE", "soaps detergents", "ethanol ethanoic acid", "homologous series"],
  published: true,
  content: `
<h2>Chapter 4: Carbon and Its Compounds</h2>

<div class="concept-callout">
<strong>Why Carbon is Special:</strong> Carbon has a unique ability to form bonds with other carbon atoms (catenation) and with atoms of other elements. This results in the formation of a vast number of compounds — more than all other elements combined.
</div>

<h3>4.1 Bonding in Carbon — The Covalent Bond</h3>
<p>Carbon has 4 electrons in its outermost shell (electronic configuration: 2, 4). It needs 4 more electrons to complete its octet. Instead of gaining or losing electrons, carbon <strong>shares</strong> electrons with other atoms, forming <strong>covalent bonds</strong>.</p>

<h4>Types of Covalent Bonds</h4>
<ul>
  <li><strong>Single Bond (–):</strong> One pair of electrons shared. Example: CH₄ (methane). Each C–H bond is a single bond.</li>
  <li><strong>Double Bond (=):</strong> Two pairs of electrons shared. Example: O₂ (oxygen), C₂H₄ (ethene).</li>
  <li><strong>Triple Bond (≡):</strong> Three pairs of electrons shared. Example: N₂ (nitrogen), C₂H₂ (ethyne/acetylene).</li>
</ul>

<div class="formula-callout">
<strong>Key Property of Covalent Compounds:</strong><br/>
• Low melting and boiling points (weak intermolecular forces)<br/>
• Poor conductors of electricity (no free ions or electrons)<br/>
• Generally insoluble in water, soluble in organic solvents
</div>

<h3>4.2 Versatile Nature of Carbon</h3>
<p>Two unique properties make carbon special:</p>
<ol>
  <li><strong>Catenation:</strong> The ability of carbon to form bonds with other carbon atoms, creating long chains, branched chains, and rings.</li>
  <li><strong>Tetravalency:</strong> Carbon has a valency of 4, allowing it to bond with four other atoms simultaneously.</li>
</ol>

<h3>4.3 Hydrocarbons</h3>
<p>Compounds made up of only carbon and hydrogen are called <strong>hydrocarbons</strong>. They are classified as:</p>

<h4>Saturated Hydrocarbons (Alkanes)</h4>
<ul>
  <li>Contain only <strong>single bonds</strong> between carbon atoms.</li>
  <li>General formula: <strong>CₙH₂ₙ₊₂</strong></li>
  <li>Examples: Methane (CH₄), Ethane (C₂H₆), Propane (C₃H₈), Butane (C₄H₁₀)</li>
</ul>

<h4>Unsaturated Hydrocarbons</h4>
<ul>
  <li><strong>Alkenes:</strong> Contain at least one C=C double bond. General formula: <strong>CₙH₂ₙ</strong>. Example: Ethene (C₂H₄).</li>
  <li><strong>Alkynes:</strong> Contain at least one C≡C triple bond. General formula: <strong>CₙH₂ₙ₋₂</strong>. Example: Ethyne (C₂H₂).</li>
</ul>

<div class="concept-callout">
<strong>Homologous Series:</strong> A series of compounds in which each member differs from the next by a –CH₂– unit (14 atomic mass units). All members share the same general formula and similar chemical properties. Example: Methane → Ethane → Propane → Butane.
</div>

<h3>4.4 Functional Groups</h3>
<p>An atom or group of atoms that determines the chemical properties of an organic compound is called a <strong>functional group</strong>.</p>

<table style="width:100%;border-collapse:collapse;margin:1rem 0;">
<tr style="border-bottom:2px solid rgba(249,115,22,0.3);">
  <th style="text-align:left;padding:0.5rem;">Functional Group</th>
  <th style="text-align:left;padding:0.5rem;">Formula</th>
  <th style="text-align:left;padding:0.5rem;">Suffix</th>
  <th style="text-align:left;padding:0.5rem;">Example</th>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
  <td style="padding:0.5rem;">Alcohol (Hydroxyl)</td><td>–OH</td><td>-ol</td><td>Ethanol (C₂H₅OH)</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
  <td style="padding:0.5rem;">Aldehyde</td><td>–CHO</td><td>-al</td><td>Ethanal (CH₃CHO)</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
  <td style="padding:0.5rem;">Ketone</td><td>>C=O</td><td>-one</td><td>Propanone (CH₃COCH₃)</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
  <td style="padding:0.5rem;">Carboxylic Acid</td><td>–COOH</td><td>-oic acid</td><td>Ethanoic acid (CH₃COOH)</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
  <td style="padding:0.5rem;">Halogen (Halo)</td><td>–X (Cl, Br)</td><td>Chloro-, Bromo-</td><td>Chloromethane (CH₃Cl)</td>
</tr>
</table>

<h3>4.5 Chemical Properties of Carbon Compounds</h3>

<h4>1. Combustion</h4>
<p>Carbon compounds burn in oxygen (air) to produce CO₂, H₂O, heat, and light.</p>
<div class="reaction-box">
<div class="reaction-label">Complete Combustion of Methane</div>
CH₄ + 2O₂ → CO₂ + 2H₂O + Heat + Light
</div>
<p><strong>Saturated hydrocarbons</strong> burn with a <strong>clean blue flame</strong>. <strong>Unsaturated hydrocarbons</strong> burn with a <strong>yellow sooty flame</strong> (due to incomplete combustion).</p>

<h4>2. Oxidation</h4>
<p>Alcohols can be converted to carboxylic acids using oxidising agents like alkaline KMnO₄ or acidified K₂Cr₂O₇.</p>
<div class="reaction-box">
<div class="reaction-label">Oxidation of Ethanol</div>
CH₃CH₂OH  ——[Alk. KMnO₄ / Heat]——→  CH₃COOH
 (Ethanol)                                (Ethanoic Acid)
</div>

<h4>3. Addition Reaction</h4>
<p>Unsaturated hydrocarbons undergo addition reactions where atoms are added across the double or triple bond.</p>
<div class="reaction-box">
<div class="reaction-label">Hydrogenation of Vegetable Oil</div>
Vegetable Oil (unsaturated) + H₂ ——[Ni catalyst, 473K]——→ Vanaspati Ghee (saturated fat)
</div>
<p>This is how vegetable oils are converted to solid fats (vanaspati ghee).</p>

<h4>4. Substitution Reaction</h4>
<p>Saturated hydrocarbons undergo substitution reactions where one atom replaces another.</p>
<div class="reaction-box">
<div class="reaction-label">Chlorination of Methane</div>
CH₄ + Cl₂ ——[Sunlight]——→ CH₃Cl + HCl
(Methane)                  (Chloromethane)
</div>

<h3>4.6 Ethanol (C₂H₅OH) — Important Properties</h3>
<ul>
  <li>Colourless liquid with a pleasant smell</li>
  <li>Used in alcoholic beverages, as a solvent, and in medicines</li>
  <li>Reacts with sodium: 2Na + 2C₂H₅OH → 2C₂H₅ONa + H₂↑</li>
  <li>Dehydration: On heating with conc. H₂SO₄ at 443 K, ethanol gives ethene (C₂H₄)</li>
  <li><strong>Denatured alcohol:</strong> Ethanol made unfit for drinking by adding methanol and pyridine</li>
</ul>

<h3>4.7 Ethanoic Acid (CH₃COOH) — Important Properties</h3>
<ul>
  <li>Also known as <strong>acetic acid</strong>; 5-8% solution in water is called <strong>vinegar</strong></li>
  <li>Pure ethanoic acid has a melting point of 290 K — it freezes in cold weather, hence called <strong>glacial acetic acid</strong></li>
  <li>Reacts with NaHCO₃ to form CO₂ gas (used as a test for carboxylic acids)</li>
  <li><strong>Esterification:</strong> Reacts with alcohols in the presence of acid catalyst to form esters (sweet-smelling compounds used in perfumes and flavouring)</li>
</ul>
<div class="reaction-box">
<div class="reaction-label">Esterification Reaction</div>
CH₃COOH + C₂H₅OH ——[Conc. H₂SO₄]——→ CH₃COOC₂H₅ + H₂O
(Ethanoic Acid)  (Ethanol)             (Ethyl Ethanoate - Ester)
</div>

<h3>4.8 Soaps and Detergents</h3>
<h4>Soaps</h4>
<p>Soaps are sodium or potassium salts of long-chain carboxylic acids (fatty acids). Example: Sodium stearate (C₁₇H₃₅COONa).</p>

<h4>How Soap Cleans</h4>
<p>A soap molecule has two ends:</p>
<ul>
  <li><strong>Hydrophilic end</strong> (water-loving): The ionic –COO⁻Na⁺ part, which dissolves in water.</li>
  <li><strong>Hydrophobic end</strong> (water-repelling): The long hydrocarbon chain, which dissolves in oil/grease.</li>
</ul>
<p>When soap is added to dirty clothes, the hydrophobic tails attach to grease, while the hydrophilic heads remain in water. This forms <strong>micelles</strong> — spherical clusters that trap the dirt and can be washed away.</p>

<div class="concept-callout">
<strong>Why Soap Doesn't Work in Hard Water:</strong> Hard water contains Ca²⁺ and Mg²⁺ ions. These react with soap to form insoluble <strong>scum</strong> (calcium/magnesium stearate), reducing the cleaning action.<br/><br/>
<strong>Detergents</strong> work in both hard and soft water because their calcium and magnesium salts are soluble. However, detergents are less biodegradable than soaps.
</div>
`
},

// ────────────────────────────────────────────────────────────
// 2. CHEMISTRY — Carbon and Its Compounds Question Bank
// ────────────────────────────────────────────────────────────
{
  slug: "carbon-compounds-class-10-solved-board-questions",
  title: "Carbon and Its Compounds – Solved Board Questions & NCERT Exercises",
  metaDescription: "Solved CBSE board questions for Carbon and Its Compounds Class 10 Chemistry. Functional groups, reactions, soaps, and IUPAC naming practice.",
  subject: "Chemistry",
  targetClass: "10",
  board: "CBSE & ICSE",
  resourceType: "question_bank",
  chapter: "Carbon and Its Compounds",
  keywords: ["carbon compounds questions", "class 10 chemistry solved", "functional groups questions", "CBSE board questions", "ICSE chemistry", "organic chemistry MCQ", "NCERT solutions", "soaps detergents questions"],
  published: true,
  content: `
<h2>Carbon and Its Compounds — Solved Board Questions</h2>

<h3>Section A: Very Short Answer (1 Mark)</h3>

<h4>Q1. What is the general formula of alkenes?</h4>
<p><span class="answer-badge">Answer</span></p>
<p>The general formula of alkenes is <strong>CₙH₂ₙ</strong>, where n ≥ 2.</p>

<h4>Q2. Name the functional group present in ethanol.</h4>
<p><span class="answer-badge">Answer</span></p>
<p>The functional group present in ethanol is the <strong>hydroxyl group (–OH)</strong>.</p>

<h4>Q3. What is the valency of carbon?</h4>
<p><span class="answer-badge">Answer</span></p>
<p>The valency of carbon is <strong>4</strong> (tetravalent), as it has 4 electrons in its outermost shell that it shares to form covalent bonds.</p>

<h4>Q4. What are hydrocarbons?</h4>
<p><span class="answer-badge">Answer</span></p>
<p>Hydrocarbons are organic compounds composed of only <strong>carbon and hydrogen</strong> atoms. Examples: methane (CH₄), ethene (C₂H₄).</p>

<h3>Section B: Short Answer (2-3 Marks)</h3>

<h4>Q5. Differentiate between saturated and unsaturated hydrocarbons with examples.</h4>
<p><span class="answer-badge">Answer</span></p>
<table style="width:100%;border-collapse:collapse;margin:0.5rem 0;">
<tr style="border-bottom:2px solid rgba(249,115,22,0.3);">
  <th style="text-align:left;padding:0.5rem;">Saturated Hydrocarbons</th>
  <th style="text-align:left;padding:0.5rem;">Unsaturated Hydrocarbons</th>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
  <td style="padding:0.4rem;">Contain only single bonds (C–C)</td>
  <td style="padding:0.4rem;">Contain double (C=C) or triple (C≡C) bonds</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
  <td style="padding:0.4rem;">Undergo substitution reactions</td>
  <td style="padding:0.4rem;">Undergo addition reactions</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
  <td style="padding:0.4rem;">Burn with a clean blue flame</td>
  <td style="padding:0.4rem;">Burn with a yellow sooty flame</td>
</tr>
<tr>
  <td style="padding:0.4rem;">Example: Ethane (C₂H₆)</td>
  <td style="padding:0.4rem;">Example: Ethene (C₂H₄), Ethyne (C₂H₂)</td>
</tr>
</table>

<h4>Q6. What is a homologous series? State two characteristics.</h4>
<p><span class="answer-badge">Answer</span></p>
<p>A <strong>homologous series</strong> is a family of organic compounds having the same functional group and similar chemical properties, where successive members differ by a –CH₂– unit.</p>
<p><strong>Two characteristics:</strong></p>
<ol>
  <li>All members can be represented by the same general formula (e.g., CₙH₂ₙ₊₂ for alkanes).</li>
  <li>The difference in molecular mass between two successive members is always 14 u (one –CH₂– unit).</li>
</ol>

<h4>Q7. Write the chemical equation for the reaction of ethanoic acid with sodium bicarbonate. What is observed?</h4>
<p><span class="answer-badge">Answer</span></p>
<div class="reaction-box">
CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂↑
</div>
<p><strong>Observation:</strong> Brisk effervescence is observed due to the evolution of CO₂ gas. This is a standard test to detect carboxylic acids.</p>

<h4>Q8. Explain with a diagram how a soap micelle is formed and how it helps in cleaning.</h4>
<p><span class="answer-badge">Answer</span></p>
<p>A soap molecule has a hydrophobic (water-hating) hydrocarbon tail and a hydrophilic (water-loving) ionic head (–COO⁻Na⁺).</p>
<p>When soap is dissolved in water near a greasy surface:</p>
<ol>
  <li>The hydrophobic tails of soap molecules penetrate into the grease/oil.</li>
  <li>The hydrophilic heads remain in the water.</li>
  <li>This forms a spherical aggregate called a <strong>micelle</strong>, with grease trapped at the centre.</li>
  <li>The micelle is soluble in water and gets washed away, carrying the dirt with it.</li>
</ol>

<h3>Section C: Long Answer (5 Marks)</h3>

<h4>Q9. (a) What are the two properties of carbon that lead to a large number of compounds? (b) Name the following compounds: CH₃OH, CH₃COOH, HCHO (c) Write one use of each.</h4>
<p><span class="answer-badge">Answer</span></p>
<p><strong>(a)</strong> The two properties are:</p>
<ol>
  <li><strong>Catenation:</strong> The ability of carbon atoms to form bonds with other carbon atoms, creating chains, branches, and rings of varying lengths.</li>
  <li><strong>Tetravalency:</strong> Since carbon has a valency of 4, it can bond with four other atoms (including other carbon atoms) simultaneously, leading to diverse molecular structures.</li>
</ol>
<p><strong>(b) and (c):</strong></p>
<ul>
  <li><strong>CH₃OH</strong> — Methanol (Methyl alcohol). <em>Use:</em> As an industrial solvent and in the production of formaldehyde.</li>
  <li><strong>CH₃COOH</strong> — Ethanoic acid (Acetic acid). <em>Use:</em> In food preservation (vinegar) and as a laboratory reagent.</li>
  <li><strong>HCHO</strong> — Methanal (Formaldehyde). <em>Use:</em> As a preservative for biological specimens (formalin is a 40% aqueous solution).</li>
</ul>
`
},

// ────────────────────────────────────────────────────────────
// 3. BIOLOGY — Control and Coordination (Chapter 6)
// ────────────────────────────────────────────────────────────
{
  slug: "control-and-coordination-class-10-biology-ncert-notes",
  title: "Control and Coordination – Class 10 Biology Chapter 6 NCERT Notes",
  metaDescription: "Class 10 Biology Control and Coordination notes: nervous system, reflex arc, brain structure, hormones, and plant movements for CBSE & ICSE.",
  subject: "Biology",
  targetClass: "10",
  board: "CBSE & ICSE",
  resourceType: "topic_guide",
  chapter: "Control and Coordination",
  keywords: ["control coordination class 10", "nervous system", "reflex arc", "brain structure", "hormones", "endocrine glands", "plant hormones", "NCERT biology", "CBSE", "ICSE", "neuron structure"],
  published: true,
  content: `
<h2>Chapter 6: Control and Coordination</h2>

<div class="concept-callout">
<strong>Core Idea:</strong> Living organisms need to detect changes in their environment and respond to them. In animals, the <strong>nervous system</strong> and <strong>endocrine system</strong> work together for control and coordination. In plants, chemical substances called <strong>phytohormones</strong> coordinate growth and movement.
</div>

<h3>6.1 The Nervous System</h3>
<p>The nervous system provides rapid, precise control using electrical impulses transmitted through specialised cells called <strong>neurons</strong>.</p>

<h4>Structure of a Neuron</h4>
<p>A neuron consists of three main parts:</p>
<ol>
  <li><strong>Cell Body (Cyton):</strong> Contains the nucleus and most of the cytoplasm.</li>
  <li><strong>Dendrites:</strong> Short, branched projections that receive signals from other neurons or from the environment.</li>
  <li><strong>Axon:</strong> A long, slender projection that transmits impulses away from the cell body to other neurons, muscles, or glands. The axon ends in <strong>axon terminals</strong> that form synapses with the next neuron.</li>
</ol>

<div class="formula-callout">
<strong>How a Nerve Impulse Travels:</strong><br/>
Stimulus → Receptor (Dendrite tip) → Dendrite → Cell Body → Axon → Axon Terminal → Synapse → Next Neuron (or Effector organ: muscle/gland)
</div>

<h4>Synapse</h4>
<p>A synapse is the tiny gap between two neurons. When an electrical impulse reaches the axon terminal, it triggers the release of <strong>neurotransmitter chemicals</strong> into the synaptic cleft. These chemicals cross the gap and generate a new electrical impulse in the dendrite of the next neuron.</p>

<h3>6.2 Reflex Action and Reflex Arc</h3>
<p>A <strong>reflex action</strong> is an involuntary, rapid, and automatic response to a stimulus. Examples: pulling your hand away from a hot surface, blinking when something approaches your eye.</p>

<div class="concept-callout">
<strong>Reflex Arc — The Pathway:</strong><br/>
Receptor (in skin/sense organ) → Sensory (Afferent) Neuron → Relay Neuron (in spinal cord) → Motor (Efferent) Neuron → Effector (muscle/gland)<br/><br/>
The brain is <em>not</em> directly involved in reflex actions — the spinal cord processes the response. This makes reflex actions much faster than voluntary actions.
</div>

<h3>6.3 Human Brain</h3>
<p>The brain is the main coordinating centre of the body. It is protected by a bony structure called the <strong>cranium (skull)</strong> and is surrounded by three membranes called <strong>meninges</strong>. A fluid called <strong>cerebrospinal fluid (CSF)</strong> cushions the brain against mechanical shocks.</p>

<h4>Parts of the Brain and Their Functions</h4>
<table style="width:100%;border-collapse:collapse;margin:1rem 0;">
<tr style="border-bottom:2px solid rgba(249,115,22,0.3);">
  <th style="text-align:left;padding:0.5rem;">Part</th>
  <th style="text-align:left;padding:0.5rem;">Location</th>
  <th style="text-align:left;padding:0.5rem;">Functions</th>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
  <td style="padding:0.5rem;font-weight:600;">Cerebrum (Forebrain)</td>
  <td>Largest part, upper region</td>
  <td>Thinking, memory, intelligence, voluntary actions, sensations (sight, hearing, smell, taste, touch)</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
  <td style="padding:0.5rem;font-weight:600;">Cerebellum (Hindbrain)</td>
  <td>Below cerebrum, at the back</td>
  <td>Balance, posture, coordination of voluntary movements (e.g., walking, riding a bicycle)</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
  <td style="padding:0.5rem;font-weight:600;">Medulla Oblongata (Hindbrain)</td>
  <td>Lowest part, connects to spinal cord</td>
  <td>Controls involuntary actions: breathing, heartbeat, blood pressure, vomiting, sneezing</td>
</tr>
<tr>
  <td style="padding:0.5rem;font-weight:600;">Hypothalamus (Forebrain)</td>
  <td>Below cerebrum</td>
  <td>Body temperature regulation, hunger, thirst, sleep; links nervous system to endocrine system</td>
</tr>
</table>

<h3>6.4 Coordination in Plants</h3>
<p>Plants do not have a nervous system. They coordinate their behaviour using <strong>plant hormones (phytohormones)</strong>.</p>

<h4>Types of Plant Movements</h4>

<h4>A. Tropic Movements (Directional — Growth-dependent)</h4>
<ul>
  <li><strong>Phototropism:</strong> Growth towards or away from light. Shoots are positively phototropic (grow towards light); roots are negatively phototropic.</li>
  <li><strong>Geotropism (Gravitropism):</strong> Growth in response to gravity. Roots are positively geotropic (grow downward); shoots are negatively geotropic.</li>
  <li><strong>Hydrotropism:</strong> Growth towards water. Roots are positively hydrotropic.</li>
  <li><strong>Chemotropism:</strong> Growth towards or away from a chemical. Example: pollen tube growing towards the ovule.</li>
  <li><strong>Thigmotropism:</strong> Growth in response to touch. Example: tendrils of climbers coiling around a support.</li>
</ul>

<h4>B. Nastic Movements (Non-directional)</h4>
<p>These movements are independent of the direction of the stimulus. Example: the leaves of the <em>Mimosa pudica</em> (touch-me-not) plant fold when touched. This is due to changes in water pressure in the cells at the base of the leaf (pulvinus).</p>

<h4>Plant Hormones</h4>
<table style="width:100%;border-collapse:collapse;margin:1rem 0;">
<tr style="border-bottom:2px solid rgba(249,115,22,0.3);">
  <th style="text-align:left;padding:0.5rem;">Hormone</th>
  <th style="text-align:left;padding:0.5rem;">Function</th>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
  <td style="padding:0.5rem;font-weight:600;">Auxin</td>
  <td>Promotes cell elongation; involved in phototropism (produced at shoot tip, moves to shaded side causing differential growth)</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
  <td style="padding:0.5rem;font-weight:600;">Gibberellin</td>
  <td>Promotes stem elongation, seed germination, and flowering</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
  <td style="padding:0.5rem;font-weight:600;">Cytokinin</td>
  <td>Promotes cell division; found mainly in areas of rapid cell division (roots, fruits, seeds)</td>
</tr>
<tr>
  <td style="padding:0.5rem;font-weight:600;">Abscisic Acid (ABA)</td>
  <td>Inhibits growth; promotes wilting of leaves, dormancy; known as the "stress hormone"</td>
</tr>
</table>

<h3>6.5 Hormones in Animals — The Endocrine System</h3>
<p>The endocrine system uses chemical messengers called <strong>hormones</strong> that are secreted directly into the blood by <strong>endocrine glands</strong> (ductless glands).</p>

<table style="width:100%;border-collapse:collapse;margin:1rem 0;">
<tr style="border-bottom:2px solid rgba(249,115,22,0.3);">
  <th style="text-align:left;padding:0.5rem;">Gland</th>
  <th style="text-align:left;padding:0.5rem;">Hormone</th>
  <th style="text-align:left;padding:0.5rem;">Function</th>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
  <td style="padding:0.5rem;">Pituitary</td><td>Growth hormone</td><td>Regulates growth of the body; controls other endocrine glands (master gland)</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
  <td style="padding:0.5rem;">Thyroid</td><td>Thyroxine</td><td>Regulates metabolism of carbohydrates, fats, and proteins. Iodine is needed for its synthesis. Deficiency causes goitre.</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
  <td style="padding:0.5rem;">Pancreas</td><td>Insulin</td><td>Lowers blood sugar by converting excess glucose to glycogen. Deficiency causes diabetes mellitus.</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
  <td style="padding:0.5rem;">Adrenal</td><td>Adrenaline</td><td>Prepares the body for emergency ("fight or flight") — increases heart rate, blood pressure, breathing rate</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
  <td style="padding:0.5rem;">Testes (Male)</td><td>Testosterone</td><td>Development of male secondary sexual characteristics during puberty</td>
</tr>
<tr>
  <td style="padding:0.5rem;">Ovaries (Female)</td><td>Estrogen</td><td>Development of female secondary sexual characteristics; regulation of menstrual cycle</td>
</tr>
</table>

<div class="concept-callout">
<strong>Nervous vs Endocrine System:</strong><br/>
• Nervous system: fast, precise, short-lived responses via electrical impulses<br/>
• Endocrine system: slow, widespread, long-lasting responses via chemical hormones in blood<br/>
• Both work together — e.g., adrenaline release during fear is triggered by the nervous system acting on the adrenal gland.
</div>
`
},

// ────────────────────────────────────────────────────────────
// 4. BIOLOGY — How do Organisms Reproduce (Chapter 7)
// ────────────────────────────────────────────────────────────
{
  slug: "how-do-organisms-reproduce-class-10-biology-ncert-notes",
  title: "How do Organisms Reproduce – Class 10 Biology Chapter 7 NCERT Notes",
  metaDescription: "Class 10 Biology reproduction notes covering asexual & sexual reproduction, human reproductive system, pollination, and seed formation for CBSE & ICSE.",
  subject: "Biology",
  targetClass: "10",
  board: "CBSE & ICSE",
  resourceType: "topic_guide",
  chapter: "How do Organisms Reproduce",
  keywords: ["reproduction class 10", "asexual reproduction", "sexual reproduction", "human reproductive system", "pollination", "seed formation", "NCERT biology", "CBSE", "ICSE", "budding fission", "menstrual cycle"],
  published: true,
  content: `
<h2>Chapter 7: How do Organisms Reproduce</h2>

<div class="concept-callout">
<strong>Why Reproduction Matters:</strong> Reproduction is the biological process by which organisms produce new individuals of the same species. It is essential for the continuation of a species, not for the survival of an individual organism. Reproduction involves DNA copying, which allows transmission of genetic information with variations that drive evolution.
</div>

<h3>7.1 DNA Copying and Variation</h3>
<p>The process of reproduction begins with DNA replication in the cell. While the copying is mostly accurate, small variations (errors) occur. These variations are important because they provide the raw material for evolution and adaptation.</p>

<h3>7.2 Asexual Reproduction</h3>
<p>In asexual reproduction, <strong>a single parent</strong> produces offspring without the fusion of gametes. The offspring are genetically identical to the parent (clones).</p>

<h4>Types of Asexual Reproduction</h4>
<ul>
  <li><strong>Fission:</strong>
    <ul>
      <li><em>Binary fission:</em> The parent cell divides into two equal halves. Example: Amoeba, bacteria.</li>
      <li><em>Multiple fission:</em> The parent cell divides into many daughter cells simultaneously. Example: Plasmodium (malaria parasite).</li>
    </ul>
  </li>
  <li><strong>Budding:</strong> A small outgrowth (bud) develops on the parent body, grows, and eventually detaches as a new organism. Example: Hydra, yeast.</li>
  <li><strong>Spore Formation:</strong> Organisms produce spore-bearing structures. Spores are released, and each can germinate into a new individual under favourable conditions. Example: Rhizopus (bread mould), ferns.</li>
  <li><strong>Regeneration:</strong> The ability to regrow a complete organism from a body fragment. Example: Planaria, Hydra. (Note: Regeneration is not the same as reproduction — it is a repair mechanism that can result in new organisms.)</li>
  <li><strong>Fragmentation:</strong> The parent body breaks into two or more fragments, each growing into a new organism. Example: Spirogyra (filamentous algae).</li>
  <li><strong>Vegetative Propagation:</strong> New plants grow from vegetative parts (roots, stems, leaves) without seeds. Examples: potato (tuber), bryophyllum (leaf buds), rose (stem cutting), jasmine (layering).</li>
</ul>

<div class="formula-callout">
<strong>Advantages of Vegetative Propagation:</strong><br/>
• Plants bear flowers and fruits earlier than those grown from seeds<br/>
• Offspring are genetically identical to parent — useful traits are preserved<br/>
• Allows propagation of plants that don't produce viable seeds (e.g., banana, orange, rose)
</div>

<h3>7.3 Sexual Reproduction</h3>
<p>In sexual reproduction, <strong>two parents</strong> contribute specialised cells called <strong>gametes</strong>. The male gamete (sperm) fuses with the female gamete (ovum/egg) in a process called <strong>fertilisation</strong>, producing a <strong>zygote</strong> that develops into a new organism.</p>
<p>Sexual reproduction introduces greater genetic variation because the offspring receives DNA from two different parents.</p>

<h3>7.4 Sexual Reproduction in Flowering Plants</h3>
<p>The flower is the reproductive organ of a plant. A typical flower has four whorls:</p>
<ul>
  <li><strong>Sepals (Calyx):</strong> Green, outermost; protect the flower bud.</li>
  <li><strong>Petals (Corolla):</strong> Colourful; attract pollinators.</li>
  <li><strong>Stamens (Androecium):</strong> Male reproductive part. Each stamen has an <strong>anther</strong> (produces pollen grains) and a <strong>filament</strong>.</li>
  <li><strong>Pistil/Carpel (Gynoecium):</strong> Female reproductive part. Consists of <strong>stigma</strong> (receives pollen), <strong>style</strong> (connects stigma to ovary), and <strong>ovary</strong> (contains ovules).</li>
</ul>

<h4>Pollination</h4>
<ul>
  <li><strong>Self-pollination:</strong> Pollen from the anther of a flower reaches the stigma of the same flower or another flower on the same plant.</li>
  <li><strong>Cross-pollination:</strong> Pollen from one plant reaches the stigma of a flower on a different plant of the same species. Agents: wind, water, insects, birds.</li>
</ul>

<h4>Fertilisation and Seed Formation</h4>
<ol>
  <li>Pollen grain lands on the stigma and germinates, forming a <strong>pollen tube</strong> that grows down through the style.</li>
  <li>The male gamete travels through the pollen tube and fuses with the egg cell in the ovule — this is <strong>fertilisation</strong>.</li>
  <li>The fertilised egg (zygote) develops into an <strong>embryo</strong>.</li>
  <li>The ovule develops into a <strong>seed</strong> (containing the embryo).</li>
  <li>The ovary develops into a <strong>fruit</strong> (enclosing the seeds).</li>
</ol>

<h3>7.5 Human Reproductive System</h3>

<h4>Male Reproductive System</h4>
<ul>
  <li><strong>Testes:</strong> Primary reproductive organs; produce sperm and the hormone testosterone. Located outside the body in the <strong>scrotum</strong> (sperm production requires a temperature 2-3°C lower than body temperature).</li>
  <li><strong>Vas deferens:</strong> Tube that carries sperm from testes to the urethra.</li>
  <li><strong>Seminal vesicles and Prostate gland:</strong> Secrete fluids that nourish sperm and form semen.</li>
  <li><strong>Urethra:</strong> Common passage for urine and semen (not simultaneously).</li>
</ul>

<h4>Female Reproductive System</h4>
<ul>
  <li><strong>Ovaries:</strong> Primary reproductive organs; produce eggs (ova) and hormones estrogen and progesterone. One egg is released every month (ovulation).</li>
  <li><strong>Fallopian tubes (Oviducts):</strong> Carry the egg from the ovary to the uterus. Fertilisation usually occurs here.</li>
  <li><strong>Uterus (Womb):</strong> The fertilised egg implants here and develops during pregnancy. Has a thick, blood vessel-rich lining.</li>
</ul>

<h4>Menstrual Cycle</h4>
<p>If the egg is not fertilised, the thickened uterine lining breaks down and is expelled along with blood through the vagina. This is called <strong>menstruation</strong> and occurs roughly every 28 days.</p>
`
},

// ────────────────────────────────────────────────────────────
// 5. PHYSICS — The Human Eye and the Colourful World (Ch 10)
// ────────────────────────────────────────────────────────────
{
  slug: "human-eye-and-colourful-world-class-10-physics-ncert-notes",
  title: "The Human Eye and the Colourful World – Class 10 Physics Chapter 10 NCERT Notes",
  metaDescription: "Class 10 Physics Human Eye notes: eye structure, defects of vision, refraction through prism, dispersion, scattering of light for CBSE & ICSE boards.",
  subject: "Physics",
  targetClass: "10",
  board: "CBSE & ICSE",
  resourceType: "topic_guide",
  chapter: "The Human Eye and the Colourful World",
  keywords: ["human eye class 10", "defects of vision", "myopia hypermetropia", "prism dispersion", "scattering of light", "tyndall effect", "NCERT physics", "CBSE", "ICSE", "rainbow formation", "power of accommodation"],
  published: true,
  content: `
<h2>Chapter 10: The Human Eye and the Colourful World</h2>

<h3>10.1 The Human Eye</h3>
<p>The human eye is a natural optical instrument that uses a <strong>convex lens</strong> (the eye lens) to form a real, inverted, and diminished image of objects on the <strong>retina</strong>.</p>

<h4>Structure of the Eye</h4>
<ul>
  <li><strong>Cornea:</strong> Transparent front surface that refracts most of the light entering the eye.</li>
  <li><strong>Iris:</strong> Coloured diaphragm behind the cornea; controls the size of the pupil.</li>
  <li><strong>Pupil:</strong> Central opening in the iris; regulates the amount of light entering the eye (dilates in dim light, constricts in bright light).</li>
  <li><strong>Eye Lens:</strong> A transparent, flexible, biconvex lens that fine-focuses the light on the retina. Its curvature can be adjusted by the ciliary muscles.</li>
  <li><strong>Ciliary Muscles:</strong> Hold the eye lens and change its shape (curvature) to focus on objects at different distances.</li>
  <li><strong>Retina:</strong> Light-sensitive screen at the back of the eye. Contains rod cells (detect light intensity) and cone cells (detect colour). The image is formed here.</li>
  <li><strong>Optic Nerve:</strong> Carries electrical signals from the retina to the brain for interpretation.</li>
  <li><strong>Blind Spot:</strong> The point on the retina where the optic nerve exits — no photoreceptor cells are present here, so no image is formed at this point.</li>
</ul>

<div class="formula-callout">
<strong>Power of Accommodation:</strong> The ability of the eye lens to change its focal length (by adjusting its curvature) to focus on objects at different distances. When looking at distant objects, the lens becomes thin (longer focal length). When looking at nearby objects, the lens becomes thick (shorter focal length).
</div>

<h4>Near Point and Far Point</h4>
<ul>
  <li><strong>Near Point (Least Distance of Distinct Vision):</strong> The closest distance at which the eye can see an object clearly = <strong>25 cm</strong> for a normal eye (denoted by D).</li>
  <li><strong>Far Point:</strong> The farthest distance at which the eye can see clearly = <strong>infinity (∞)</strong> for a normal eye.</li>
</ul>

<h3>10.2 Defects of Vision and Their Correction</h3>

<h4>1. Myopia (Short-sightedness / Near-sightedness)</h4>
<ul>
  <li><strong>Problem:</strong> Distant objects appear blurry; near objects are seen clearly.</li>
  <li><strong>Cause:</strong> Eyeball is too long OR the eye lens is too curved (too converging), so the image forms in front of the retina.</li>
  <li><strong>Correction:</strong> A <strong>concave lens</strong> (diverging lens) of appropriate power is used. It diverges the incoming rays before they enter the eye, so the image forms exactly on the retina.</li>
</ul>

<h4>2. Hypermetropia (Long-sightedness / Far-sightedness)</h4>
<ul>
  <li><strong>Problem:</strong> Near objects appear blurry; distant objects are seen clearly.</li>
  <li><strong>Cause:</strong> Eyeball is too short OR the eye lens is too flat (low converging power), so the image forms behind the retina.</li>
  <li><strong>Correction:</strong> A <strong>convex lens</strong> (converging lens) of appropriate power is used.</li>
</ul>

<h4>3. Presbyopia</h4>
<ul>
  <li><strong>Problem:</strong> Difficulty seeing both near and distant objects clearly (common in old age).</li>
  <li><strong>Cause:</strong> Gradual weakening of ciliary muscles and decreased flexibility of the eye lens.</li>
  <li><strong>Correction:</strong> <strong>Bifocal lenses</strong> — upper portion is concave (for distant vision), lower portion is convex (for near vision).</li>
</ul>

<h3>10.3 Refraction Through a Glass Prism</h3>
<p>When white light enters a glass prism, it bends (refracts) at both surfaces and gets separated into its component colours. This splitting of white light into its spectrum of colours is called <strong>dispersion</strong>.</p>

<div class="concept-callout">
<strong>Spectrum of White Light (VIBGYOR):</strong><br/>
Violet – Indigo – Blue – Green – Yellow – Orange – Red<br/><br/>
<strong>Violet</strong> bends the most (highest deviation, shortest wavelength).<br/>
<strong>Red</strong> bends the least (lowest deviation, longest wavelength).<br/><br/>
Newton showed that a second inverted prism can recombine the spectrum back into white light, proving white light is a mixture of seven colours.
</div>

<h3>10.4 Atmospheric Refraction</h3>
<p>Earth's atmosphere has layers of air with varying densities and temperatures. Light bends as it passes through these layers.</p>
<h4>Examples:</h4>
<ul>
  <li><strong>Twinkling of Stars:</strong> Starlight passes through changing atmospheric layers, causing fluctuations in the apparent position and brightness of stars. Planets don't twinkle because they are much closer and appear as extended sources (not point sources).</li>
  <li><strong>Advance Sunrise and Delayed Sunset:</strong> The Sun is visible about 2 minutes before actual sunrise and 2 minutes after actual sunset because atmospheric refraction bends sunlight upward when the Sun is below the horizon.</li>
</ul>

<h3>10.5 Scattering of Light</h3>
<p>When light encounters particles much smaller than its wavelength, it gets scattered. The amount of scattering depends on the size of the particles and the wavelength of light.</p>

<div class="formula-callout">
<strong>Rayleigh's Law of Scattering:</strong> The intensity of scattered light is inversely proportional to the fourth power of its wavelength.<br/>
I ∝ 1/λ⁴<br/><br/>
This means shorter wavelengths (blue, violet) are scattered much more than longer wavelengths (red, orange).
</div>

<h4>Phenomena Explained by Scattering</h4>
<ul>
  <li><strong>Blue Colour of the Sky:</strong> Blue light (short wavelength) is scattered much more by atmospheric molecules. This scattered blue light reaches our eyes from all directions, making the sky appear blue.</li>
  <li><strong>White Colour of Clouds:</strong> Water droplets in clouds are much larger than air molecules. They scatter all wavelengths of light equally, so clouds appear white.</li>
  <li><strong>Red Colour of Sun at Sunrise/Sunset:</strong> At sunrise/sunset, sunlight travels through a much thicker layer of atmosphere. Most of the blue light gets scattered away, and only red/orange light (long wavelengths) reaches our eyes.</li>
  <li><strong>Tyndall Effect:</strong> Scattering of light by colloidal particles. Example: a beam of sunlight entering a dark room through a small gap appears visible because dust particles scatter the light.</li>
</ul>

<h3>10.6 Rainbow Formation</h3>
<p>A rainbow is formed by the <strong>dispersion</strong>, <strong>internal reflection</strong>, and <strong>refraction</strong> of sunlight by tiny water droplets in the atmosphere after rain. The observer must stand with the Sun behind them and the rain/water droplets in front to see a rainbow.</p>
`
},

// ────────────────────────────────────────────────────────────
// 6. BIOLOGY/ENVIRONMENT — Our Environment (Chapter 13)
// ────────────────────────────────────────────────────────────
{
  slug: "our-environment-class-10-science-ncert-notes",
  title: "Our Environment – Class 10 Science Chapter 13 NCERT Notes",
  metaDescription: "Class 10 Our Environment notes covering ecosystems, food chains, food webs, ozone depletion, and waste management for CBSE & ICSE boards.",
  subject: "Biology",
  targetClass: "10",
  board: "CBSE & ICSE",
  resourceType: "topic_guide",
  chapter: "Our Environment",
  keywords: ["our environment class 10", "ecosystem", "food chain", "food web", "ozone depletion", "biodegradable", "10 percent law", "NCERT science", "CBSE", "ICSE", "trophic levels", "waste management"],
  published: true,
  content: `
<h2>Chapter 13: Our Environment</h2>

<h3>13.1 Ecosystem</h3>
<p>An <strong>ecosystem</strong> is a self-sustaining system where living organisms (biotic components) interact with each other and with non-living components (abiotic components) in a particular area.</p>

<h4>Components of an Ecosystem</h4>
<ul>
  <li><strong>Abiotic (Non-living):</strong> Temperature, rainfall, wind, soil, sunlight, water, minerals.</li>
  <li><strong>Biotic (Living):</strong>
    <ul>
      <li><strong>Producers (Autotrophs):</strong> Green plants and algae that make food by photosynthesis.</li>
      <li><strong>Consumers (Heterotrophs):</strong> Organisms that depend on producers directly or indirectly for food.
        <ul>
          <li>Primary consumers (Herbivores): eat producers. E.g., deer, grasshopper.</li>
          <li>Secondary consumers (Small carnivores): eat herbivores. E.g., frog, snake.</li>
          <li>Tertiary consumers (Top carnivores): eat secondary consumers. E.g., hawk, lion.</li>
        </ul>
      </li>
      <li><strong>Decomposers:</strong> Bacteria and fungi that break down dead organic matter, releasing nutrients back into the soil.</li>
    </ul>
  </li>
</ul>

<h3>13.2 Food Chain and Food Web</h3>
<p>A <strong>food chain</strong> is a series of organisms where each is eaten by the next member. Energy flows from one trophic level to the next.</p>

<div class="concept-callout">
<strong>Example Food Chain:</strong><br/>
Grass → Grasshopper → Frog → Snake → Hawk<br/>
(Producer → Primary Consumer → Secondary Consumer → Tertiary Consumer → Top Consumer)
</div>

<p>A <strong>food web</strong> is an interconnected network of multiple food chains in an ecosystem. Food webs are more realistic than single food chains because most organisms eat and are eaten by multiple species.</p>

<h4>Trophic Levels</h4>
<p>Each step in a food chain is called a <strong>trophic level</strong>:</p>
<ul>
  <li>T1: Producers (plants)</li>
  <li>T2: Primary consumers (herbivores)</li>
  <li>T3: Secondary consumers (small carnivores)</li>
  <li>T4: Tertiary consumers (top carnivores)</li>
</ul>

<div class="formula-callout">
<strong>10 Percent Law (Lindeman's Law):</strong><br/>
Only about <strong>10%</strong> of the energy at each trophic level is transferred to the next level. The remaining 90% is used for life processes (respiration, digestion, movement) and lost as heat.<br/><br/>
This is why food chains rarely have more than 3-4 trophic levels — there isn't enough energy to sustain more levels.
</div>

<h3>13.3 Biological Magnification</h3>
<p>When harmful non-biodegradable chemicals (like pesticides — DDT, mercury) enter a food chain, their concentration increases at each successive trophic level. This phenomenon is called <strong>biological magnification</strong> or <strong>biomagnification</strong>.</p>
<p>Example: If DDT is sprayed on crops, producers absorb a small amount. Herbivores eating many plants accumulate more DDT. Carnivores eating many herbivores accumulate even higher concentrations. Top predators (like hawks) end up with the highest concentration, which can cause reproductive failure and death.</p>

<h3>13.4 Ozone Layer and Its Depletion</h3>
<p><strong>Ozone (O₃)</strong> is a molecule consisting of three oxygen atoms. The ozone layer exists in the upper atmosphere (stratosphere) and shields life on Earth from harmful <strong>ultraviolet (UV) radiation</strong> from the Sun.</p>

<h4>How Ozone is Formed and Destroyed</h4>
<div class="reaction-box">
<div class="reaction-label">Ozone Formation</div>
O₂ ——[UV radiation]——→ O + O       (UV splits oxygen molecule)
O + O₂ → O₃                          (Atomic oxygen combines with O₂ to form ozone)
</div>
<p>This is a dynamic equilibrium — ozone is constantly formed and broken down.</p>

<h4>Cause of Ozone Depletion</h4>
<p>Synthetic chemicals called <strong>chlorofluorocarbons (CFCs)</strong>, used in refrigerators, air conditioners, and aerosol sprays, are the main cause. CFCs release chlorine atoms in the stratosphere, which catalytically destroy ozone molecules.</p>

<div class="concept-callout">
<strong>UNEP (United Nations Environment Programme):</strong> In 1987, the <strong>Montreal Protocol</strong> was signed by many countries to limit and phase out the production and use of CFCs and other ozone-depleting substances.
</div>

<h3>13.5 Waste Management</h3>
<h4>Biodegradable vs Non-biodegradable Waste</h4>
<table style="width:100%;border-collapse:collapse;margin:1rem 0;">
<tr style="border-bottom:2px solid rgba(249,115,22,0.3);">
  <th style="text-align:left;padding:0.5rem;">Biodegradable</th>
  <th style="text-align:left;padding:0.5rem;">Non-biodegradable</th>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
  <td style="padding:0.5rem;">Can be broken down by microorganisms</td>
  <td style="padding:0.5rem;">Cannot be broken down by biological processes</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
  <td style="padding:0.5rem;">Examples: food waste, paper, cotton, cow dung</td>
  <td style="padding:0.5rem;">Examples: plastics, glass, metals, DDT, radioactive waste</td>
</tr>
<tr>
  <td style="padding:0.5rem;">Eco-friendly; returns nutrients to nature</td>
  <td style="padding:0.5rem;">Cause pollution; accumulate in the environment</td>
</tr>
</table>

<p><strong>The 3 R's:</strong> <strong>Reduce</strong> (use less), <strong>Reuse</strong> (use again without reprocessing), <strong>Recycle</strong> (reprocess waste into new products). These help minimise the volume of waste entering our environment.</p>
`
},

]; // end of resources array

// ═══════════════════════════════════════════════════════════
//  SEEDING LOGIC
// ═══════════════════════════════════════════════════════════
async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  let created = 0, skipped = 0;
  for (const res of resources) {
    const exists = await Resource.findOne({ slug: res.slug });
    if (exists) {
      console.log(`  SKIP (exists): ${res.slug}`);
      skipped++;
      continue;
    }
    await Resource.create(res);
    console.log(`  ✅ CREATED: ${res.title}`);
    created++;
  }

  console.log(`\nDone! Created: ${created}, Skipped: ${skipped}`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
