/**
 * Seed Script: Educational Resources for Class 10
 * Subjects: Chemistry, Physics, Computer Science, Biology
 * Based on NCERT / CBSE standard curriculum and famous reference books
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

/* ─── Resource Schema (inline for ESM script) ─────────── */
const ResourceSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  title: { type: String, required: true, trim: true },
  metaDescription: { type: String, required: true, maxlength: 160 },
  subject: { type: String, required: true, index: true },
  targetClass: { type: String, required: true },
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

/* ─── Content Helpers ─────────────────────────────────── */
function slugify(str) {
  return str.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

/* ─── RESOURCES DATA ──────────────────────────────────── */
const resources = [
  // ═══════════════════════════════════════════
  // CHEMISTRY — Class 10 (NCERT Based)
  // ═══════════════════════════════════════════
  {
    title: "Chemical Reactions and Equations – Class 10 Chemistry Chapter 1",
    subject: "Chemistry",
    targetClass: "10",
    chapter: "Chapter 1",
    metaDescription: "Complete guide to chemical reactions, balancing equations, types of reactions, and oxidation-reduction for Class 10 CBSE Chemistry.",
    keywords: ["chemical reactions", "balancing equations", "oxidation reduction", "class 10 chemistry", "NCERT chemistry", "combination reaction", "decomposition"],
    content: `<h2>Chemical Reactions and Equations</h2>
<p>A <strong>chemical reaction</strong> is a process in which one or more substances (reactants) are converted into one or more different substances (products). Chemical reactions are accompanied by changes in energy, colour, state, or the evolution of gas.</p>

<h3>Writing Chemical Equations</h3>
<p>A chemical equation represents a chemical reaction using symbols and formulae. For example:</p>
<pre>Mg + O₂ → MgO</pre>
<p>The substances on the left are <strong>reactants</strong>, and those on the right are <strong>products</strong>.</p>

<h3>Balancing Chemical Equations</h3>
<p>According to the <strong>Law of Conservation of Mass</strong>, mass can neither be created nor destroyed. Therefore, the number of atoms of each element must be equal on both sides of the equation.</p>
<p><strong>Steps to balance:</strong></p>
<ol>
<li>Write the unbalanced equation with correct formulae.</li>
<li>List the number of atoms of each element on both sides.</li>
<li>Start balancing with the compound that has the maximum number of atoms.</li>
<li>Use coefficients (not subscripts) to balance.</li>
<li>Verify that all elements are balanced.</li>
</ol>
<p><strong>Example:</strong> Fe + H₂O → Fe₃O₄ + H₂</p>
<p>Balanced: 3Fe + 4H₂O → Fe₃O₄ + 4H₂</p>

<h3>Types of Chemical Reactions</h3>
<table>
<tr><th>Type</th><th>Description</th><th>Example</th></tr>
<tr><td>Combination</td><td>Two or more reactants form a single product</td><td>CaO + H₂O → Ca(OH)₂</td></tr>
<tr><td>Decomposition</td><td>Single reactant breaks into multiple products</td><td>2FeSO₄ → Fe₂O₃ + SO₂ + SO₃</td></tr>
<tr><td>Displacement</td><td>More reactive element displaces a less reactive one</td><td>Fe + CuSO₄ → FeSO₄ + Cu</td></tr>
<tr><td>Double Displacement</td><td>Exchange of ions between two compounds</td><td>Na₂SO₄ + BaCl₂ → BaSO₄ + 2NaCl</td></tr>
<tr><td>Redox</td><td>Simultaneous oxidation and reduction</td><td>CuO + H₂ → Cu + H₂O</td></tr>
</table>

<h3>Oxidation and Reduction</h3>
<ul>
<li><strong>Oxidation</strong>: Gain of oxygen or loss of hydrogen.</li>
<li><strong>Reduction</strong>: Loss of oxygen or gain of hydrogen.</li>
</ul>
<p>A reaction where both oxidation and reduction occur simultaneously is called a <strong>redox reaction</strong>.</p>

<h3>Effects of Oxidation in Everyday Life</h3>
<ul>
<li><strong>Corrosion</strong>: Iron reacts with oxygen and moisture to form rust (Fe₂O₃·xH₂O). Silver turns black due to formation of Ag₂S. Copper develops a green coating of CuCO₃.</li>
<li><strong>Rancidity</strong>: Fats and oils oxidise over time, making food smell and taste bad. Prevented by adding antioxidants, storing in airtight containers, or flushing with nitrogen gas.</li>
</ul>

<h3>Key Formulas to Remember</h3>
<p>Balanced equations of all types should be practised extensively. Focus on identifying the type of reaction and the oxidising/reducing agents.</p>

<p><em>Reference: NCERT Science Textbook for Class 10 – Chapter 1; Lakhmir Singh & Manjit Kaur Chemistry for Class 10.</em></p>`
  },

  {
    title: "Acids, Bases and Salts – Class 10 Chemistry Chapter 2",
    subject: "Chemistry",
    targetClass: "10",
    chapter: "Chapter 2",
    metaDescription: "Learn about acids, bases, salts, pH scale, neutralisation reactions, and the properties of common chemical compounds for Class 10 CBSE.",
    keywords: ["acids bases salts", "pH scale", "neutralisation", "class 10 chemistry", "NCERT", "hydrochloric acid", "sodium hydroxide", "indicators"],
    content: `<h2>Acids, Bases and Salts</h2>
<p>Acids, bases, and salts are important categories of chemical compounds that we encounter daily. Understanding their properties, reactions, and applications is fundamental to chemistry.</p>

<h3>What are Acids?</h3>
<p>Acids are substances that produce <strong>H⁺ (hydrogen) ions</strong> when dissolved in water. Common acids include:</p>
<ul>
<li>Hydrochloric acid (HCl) — found in stomach</li>
<li>Sulphuric acid (H₂SO₄) — king of chemicals</li>
<li>Acetic acid (CH₃COOH) — found in vinegar</li>
<li>Citric acid — found in citrus fruits</li>
</ul>

<h3>What are Bases?</h3>
<p>Bases are substances that produce <strong>OH⁻ (hydroxide) ions</strong> in water. Common bases:</p>
<ul>
<li>Sodium hydroxide (NaOH) — caustic soda</li>
<li>Calcium hydroxide (Ca(OH)₂) — slaked lime</li>
<li>Magnesium hydroxide (Mg(OH)₂) — milk of magnesia (antacid)</li>
</ul>

<h3>Indicators</h3>
<table>
<tr><th>Indicator</th><th>Colour in Acid</th><th>Colour in Base</th></tr>
<tr><td>Litmus</td><td>Red</td><td>Blue</td></tr>
<tr><td>Methyl Orange</td><td>Red</td><td>Yellow</td></tr>
<tr><td>Phenolphthalein</td><td>Colourless</td><td>Pink</td></tr>
</table>

<h3>The pH Scale</h3>
<p>pH stands for "potential of Hydrogen" and measures the concentration of H⁺ ions in a solution on a scale of <strong>0 to 14</strong>.</p>
<ul>
<li>pH &lt; 7: Acidic (stomach acid ≈ 1.5)</li>
<li>pH = 7: Neutral (pure water)</li>
<li>pH &gt; 7: Basic (soap ≈ 9-10)</li>
</ul>
<p><strong>pH is crucial in daily life:</strong> our blood pH must remain 7.35–7.45, soil pH affects agriculture, acid rain (pH &lt; 5.6) damages monuments like the Taj Mahal.</p>

<h3>Neutralisation Reaction</h3>
<p>When an acid reacts with a base, they form a <strong>salt and water</strong>:</p>
<pre>Acid + Base → Salt + Water</pre>
<pre>HCl + NaOH → NaCl + H₂O</pre>

<h3>Important Salts</h3>
<ul>
<li><strong>Common Salt (NaCl)</strong>: Used in food, de-icing, and as a raw material for making NaOH, baking soda, and washing soda.</li>
<li><strong>Baking Soda (NaHCO₃)</strong>: Used in fire extinguishers, cooking, and as an antacid.</li>
<li><strong>Washing Soda (Na₂CO₃·10H₂O)</strong>: Used in glass, soap, paper industries, and water softening.</li>
<li><strong>Plaster of Paris (CaSO₄·½H₂O)</strong>: Used for casts, moulds, and in hospitals for fractured bones.</li>
<li><strong>Bleaching Powder (CaOCl₂)</strong>: Used for water purification and bleaching.</li>
</ul>

<p><em>Reference: NCERT Science Textbook for Class 10 – Chapter 2; S. Chand Chemistry by Lakhmir Singh.</em></p>`
  },

  {
    title: "Metals and Non-Metals – Class 10 Chemistry Chapter 3",
    subject: "Chemistry",
    targetClass: "10",
    chapter: "Chapter 3",
    metaDescription: "Comprehensive notes on metals, non-metals, reactivity series, extraction of metals, and corrosion for CBSE Class 10 Chemistry.",
    keywords: ["metals non-metals", "reactivity series", "extraction of metals", "class 10", "ionic bond", "corrosion", "NCERT"],
    content: `<h2>Metals and Non-Metals</h2>
<p>Elements are broadly classified into <strong>metals</strong> and <strong>non-metals</strong> based on their physical and chemical properties.</p>

<h3>Physical Properties of Metals</h3>
<ul>
<li><strong>Lustrous</strong> (shiny surface when freshly cut)</li>
<li><strong>Malleable</strong> (can be beaten into thin sheets — gold, aluminium)</li>
<li><strong>Ductile</strong> (can be drawn into wires — copper, aluminium)</li>
<li><strong>Good conductors</strong> of heat and electricity (silver is the best conductor)</li>
<li>Generally <strong>hard</strong> (exception: sodium and potassium are soft)</li>
<li>High <strong>melting and boiling points</strong> (exception: gallium and caesium melt at body temperature)</li>
<li>Produce a <strong>sonorous</strong> (ringing) sound when struck</li>
</ul>

<h3>Physical Properties of Non-Metals</h3>
<ul>
<li>Non-lustrous, dull appearance (exception: iodine is lustrous, diamond has exceptional lustre)</li>
<li>Brittle — cannot be drawn into wires or sheets</li>
<li>Poor conductors of heat and electricity (exception: graphite conducts electricity)</li>
<li>Generally low density, melting, and boiling points</li>
</ul>

<h3>Reactivity Series of Metals</h3>
<p>The reactivity series arranges metals in decreasing order of reactivity:</p>
<pre>K &gt; Na &gt; Ca &gt; Mg &gt; Al &gt; Zn &gt; Fe &gt; Ni &gt; Sn &gt; Pb &gt; H &gt; Cu &gt; Hg &gt; Ag &gt; Au &gt; Pt</pre>
<p>A more reactive metal can displace a less reactive metal from its compound in solution.</p>

<h3>Ionic Bonding</h3>
<p>Metals transfer electrons to non-metals, forming <strong>ionic compounds</strong> (e.g., NaCl). Ionic compounds have high melting points, are soluble in water, and conduct electricity when dissolved or melted.</p>

<h3>Extraction of Metals</h3>
<p>The method of extraction depends on reactivity:</p>
<table>
<tr><th>Reactivity</th><th>Method</th><th>Examples</th></tr>
<tr><td>High (K, Na, Ca, Mg, Al)</td><td>Electrolytic reduction</td><td>Aluminium from bauxite</td></tr>
<tr><td>Medium (Zn, Fe, Ni, Sn, Pb)</td><td>Reduction with carbon (coke)</td><td>Iron from haematite</td></tr>
<tr><td>Low (Cu, Hg, Ag, Au)</td><td>Self-reduction / Roasting</td><td>Copper from Cu₂S</td></tr>
</table>

<h3>Corrosion</h3>
<p>When metals are exposed to moisture, acids, or gases, they corrode. Rusting of iron (forming Fe₂O₃·xH₂O) is the most common example. Prevention methods include painting, oiling, galvanisation (zinc coating), electroplating, and alloying.</p>

<p><em>Reference: NCERT Science Textbook for Class 10 – Chapter 3; Pradeep's Chemistry.</em></p>`
  },

  // ═══════════════════════════════════════════
  // PHYSICS — Class 10 (NCERT Based)
  // ═══════════════════════════════════════════
  {
    title: "Light – Reflection and Refraction – Class 10 Physics Chapter 9",
    subject: "Physics",
    targetClass: "10",
    chapter: "Chapter 9",
    metaDescription: "Master light, reflection, refraction, mirror and lens formulas, sign conventions, and ray diagrams for CBSE Class 10 Physics.",
    keywords: ["light reflection refraction", "mirror formula", "lens formula", "class 10 physics", "concave mirror", "convex lens", "NCERT"],
    content: `<h2>Light – Reflection and Refraction</h2>
<p>Light is a form of electromagnetic radiation that enables us to see. It travels in straight lines (rectilinear propagation) and has a speed of approximately <strong>3 × 10⁸ m/s</strong> in vacuum.</p>

<h3>Reflection of Light</h3>
<p><strong>Laws of Reflection:</strong></p>
<ol>
<li>The angle of incidence (i) equals the angle of reflection (r): <strong>∠i = ∠r</strong></li>
<li>The incident ray, reflected ray, and normal all lie in the same plane.</li>
</ol>

<h3>Spherical Mirrors</h3>
<table>
<tr><th>Property</th><th>Concave Mirror</th><th>Convex Mirror</th></tr>
<tr><td>Reflecting surface</td><td>Inner (cave) side</td><td>Outer (bulging) side</td></tr>
<tr><td>Focal length</td><td>Negative (real focus)</td><td>Positive (virtual focus)</td></tr>
<tr><td>Image formed</td><td>Real or virtual (depends on position)</td><td>Always virtual, erect, diminished</td></tr>
<tr><td>Uses</td><td>Torches, headlights, shaving mirrors, dentist mirrors</td><td>Rear-view mirrors in vehicles</td></tr>
</table>

<h3>Mirror Formula</h3>
<pre>1/v + 1/u = 1/f</pre>
<p>Where: v = image distance, u = object distance, f = focal length</p>
<p><strong>Magnification:</strong> m = -v/u = h'/h</p>

<h3>Refraction of Light</h3>
<p>Refraction is the bending of light when it passes from one transparent medium to another. It occurs due to a change in the speed of light.</p>
<p><strong>Snell's Law:</strong></p>
<pre>n₁ sin i = n₂ sin r</pre>
<p>or equivalently: <strong>n = sin i / sin r</strong> (refractive index of medium 2 w.r.t. medium 1)</p>

<h3>Lenses</h3>
<table>
<tr><th>Property</th><th>Convex (Converging)</th><th>Concave (Diverging)</th></tr>
<tr><td>Shape</td><td>Thicker at centre</td><td>Thinner at centre</td></tr>
<tr><td>Focal length</td><td>Positive</td><td>Negative</td></tr>
<tr><td>Image</td><td>Real or virtual (depends on position)</td><td>Always virtual, erect, diminished</td></tr>
<tr><td>Uses</td><td>Magnifying glass, camera, spectacles (hypermetropia)</td><td>Spectacles (myopia), peepholes</td></tr>
</table>

<h3>Lens Formula</h3>
<pre>1/v - 1/u = 1/f</pre>
<p><strong>Magnification:</strong> m = v/u = h'/h</p>
<p><strong>Power of a lens:</strong> P = 1/f (in metres). Unit: dioptre (D).</p>

<p><em>Reference: NCERT Science Textbook for Class 10 – Chapter 9; HC Verma Concepts of Physics; Lakhmir Singh Physics.</em></p>`
  },

  {
    title: "Electricity – Class 10 Physics Chapter 11",
    subject: "Physics",
    targetClass: "10",
    chapter: "Chapter 11",
    metaDescription: "Complete notes on electric current, Ohm's law, resistance, series and parallel circuits, and electrical power for CBSE Class 10 Physics.",
    keywords: ["electricity", "ohm's law", "resistance", "series parallel", "class 10 physics", "electric current", "NCERT", "power"],
    content: `<h2>Electricity</h2>
<p>Electricity is the flow of <strong>electric charge</strong> (usually electrons) through a conductor. It is one of the most important forms of energy in modern life.</p>

<h3>Electric Current</h3>
<p>Electric current is the rate of flow of charge:</p>
<pre>I = Q / t</pre>
<p>Where: I = current (Ampere, A), Q = charge (Coulomb, C), t = time (seconds)</p>
<p>1 Ampere = 1 Coulomb of charge flowing per second.</p>

<h3>Electric Potential and Potential Difference</h3>
<p>The work done in moving a unit positive charge from one point to another is called <strong>potential difference</strong>:</p>
<pre>V = W / Q</pre>
<p>Unit: Volt (V). 1V = 1 Joule / 1 Coulomb.</p>

<h3>Ohm's Law</h3>
<p>At constant temperature, the current flowing through a conductor is directly proportional to the potential difference across its ends:</p>
<pre>V = IR</pre>
<p>Where R = resistance (in Ohms, Ω).</p>

<h3>Factors Affecting Resistance</h3>
<pre>R = ρ × l / A</pre>
<ul>
<li><strong>ρ (rho)</strong>: Resistivity of the material (Ω·m)</li>
<li><strong>l</strong>: Length of the conductor (R ∝ l)</li>
<li><strong>A</strong>: Cross-sectional area (R ∝ 1/A)</li>
</ul>
<p>Metals have low resistivity (good conductors); rubber and glass have very high resistivity (insulators).</p>

<h3>Resistors in Series</h3>
<pre>R_total = R₁ + R₂ + R₃ + ...</pre>
<p>Current is the <strong>same</strong> through all resistors; voltage divides.</p>

<h3>Resistors in Parallel</h3>
<pre>1/R_total = 1/R₁ + 1/R₂ + 1/R₃ + ...</pre>
<p>Voltage is the <strong>same</strong> across all resistors; current divides.</p>

<h3>Electrical Energy and Power</h3>
<pre>P = V × I = I²R = V²/R</pre>
<pre>Energy = P × t</pre>
<p>Unit of power: Watt (W). 1 kWh (kilowatt-hour) = 3.6 × 10⁶ Joules = 1 "unit" of electricity.</p>

<h3>Heating Effect of Current</h3>
<p>When current flows through a resistance, electrical energy is converted to heat:</p>
<pre>H = I²Rt (Joule's Law of Heating)</pre>
<p>Applications: electric heater, iron, fuse wire, electric bulb.</p>

<p><em>Reference: NCERT Science Textbook for Class 10 – Chapter 11; SL Arora Physics; Lakhmir Singh Physics.</em></p>`
  },

  {
    title: "Magnetic Effects of Electric Current – Class 10 Physics Chapter 12",
    subject: "Physics",
    targetClass: "10",
    chapter: "Chapter 12",
    metaDescription: "Understand magnetic fields, electromagnetic induction, Fleming's rules, electric motors and generators for CBSE Class 10 Physics.",
    keywords: ["magnetic effects", "electromagnetism", "Fleming's rule", "electric motor", "generator", "class 10 physics", "NCERT"],
    content: `<h2>Magnetic Effects of Electric Current</h2>
<p>Hans Christian Oersted discovered in 1820 that a compass needle deflects when placed near a current-carrying conductor, proving the connection between electricity and magnetism.</p>

<h3>Magnetic Field and Field Lines</h3>
<ul>
<li>A magnetic field is a region around a magnet where its influence can be felt.</li>
<li>Field lines emerge from the <strong>North pole</strong> and enter the <strong>South pole</strong>.</li>
<li>They never intersect and are closer together where the field is stronger.</li>
</ul>

<h3>Magnetic Field Due to a Current-Carrying Conductor</h3>
<p><strong>Straight conductor:</strong> Concentric circles around the wire. Direction found using the <strong>Right-Hand Thumb Rule</strong>: thumb points in the direction of current, curled fingers show the direction of the magnetic field.</p>
<p><strong>Circular loop (coil):</strong> The field at the centre is straight and perpendicular to the plane of the loop. Increases with more turns and more current.</p>
<p><strong>Solenoid:</strong> A coil of many turns behaves like a bar magnet. The field inside is uniform and strong. An electromagnet is a solenoid with a soft iron core.</p>

<h3>Force on a Current-Carrying Conductor in a Magnetic Field</h3>
<pre>F = BIl (when conductor is perpendicular to field)</pre>
<p>Direction of force: <strong>Fleming's Left-Hand Rule</strong> (Motor Rule)</p>
<ul>
<li>Forefinger → Magnetic Field (B)</li>
<li>Middle finger → Current (I)</li>
<li>Thumb → Force/Motion (F)</li>
</ul>

<h3>Electric Motor</h3>
<p>Converts electrical energy into mechanical energy. Works on Fleming's Left-Hand Rule. Key parts: armature coil, magnets, split-ring commutator, brushes. Used in fans, mixers, washing machines.</p>

<h3>Electromagnetic Induction</h3>
<p>Michael Faraday discovered that a changing magnetic field in a coil induces an electric current (EMF). This is the principle behind generators.</p>
<p><strong>Fleming's Right-Hand Rule</strong> (Generator Rule): Forefinger → Field, Thumb → Motion, Middle finger → Induced current.</p>

<h3>Electric Generator</h3>
<p>Converts mechanical energy into electrical energy using electromagnetic induction.</p>
<ul>
<li><strong>AC Generator</strong>: Uses slip rings → produces alternating current (used in power plants)</li>
<li><strong>DC Generator</strong>: Uses split-ring commutator → produces direct current</li>
</ul>

<h3>Domestic Electric Circuits</h3>
<p>In India, household supply is <strong>220V AC at 50 Hz</strong>. The three wires are: Live (red), Neutral (black), and Earth (green). Fuse and MCB are safety devices that break the circuit during overloading or short-circuiting.</p>

<p><em>Reference: NCERT Science Textbook for Class 10 – Chapter 12; Concepts of Physics by HC Verma.</em></p>`
  },

  // ═══════════════════════════════════════════
  // BIOLOGY — Class 10 (NCERT Based)
  // ═══════════════════════════════════════════
  {
    title: "Life Processes – Class 10 Biology Chapter 5",
    subject: "Biology",
    targetClass: "10",
    chapter: "Chapter 5",
    metaDescription: "Complete notes on nutrition, respiration, transportation, and excretion in plants and humans for CBSE Class 10 Biology.",
    keywords: ["life processes", "nutrition", "respiration", "transportation", "excretion", "class 10 biology", "NCERT", "photosynthesis"],
    content: `<h2>Life Processes</h2>
<p>Life processes are the basic functions performed by living organisms to maintain life. The key life processes are <strong>nutrition, respiration, transportation, and excretion</strong>.</p>

<h3>Nutrition</h3>
<p>Nutrition is the process of intake and utilisation of food for energy, growth, and repair.</p>

<h4>Autotrophic Nutrition (Plants)</h4>
<p>Green plants make their own food through <strong>photosynthesis</strong>:</p>
<pre>6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂</pre>
<p>Requirements: sunlight, chlorophyll (in chloroplasts), CO₂ (from stomata), and water (from roots). The process occurs mainly in leaves.</p>

<h4>Heterotrophic Nutrition (Animals)</h4>
<p>Organisms that depend on other organisms for food. In humans, digestion occurs in the <strong>alimentary canal</strong>:</p>
<ol>
<li><strong>Mouth</strong>: Teeth crush food; salivary amylase converts starch → maltose.</li>
<li><strong>Stomach</strong>: HCl activates pepsin which digests proteins → peptones.</li>
<li><strong>Small Intestine</strong>: Bile (from liver) emulsifies fats; pancreatic enzymes (trypsin, lipase, amylase) complete digestion. Villi absorb nutrients into blood.</li>
<li><strong>Large Intestine</strong>: Absorbs water; undigested waste is expelled via anus.</li>
</ol>

<h3>Respiration</h3>
<p>Respiration is the breakdown of glucose to release energy (ATP).</p>
<p><strong>Aerobic (with O₂):</strong></p>
<pre>C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + Energy (ATP)</pre>
<p><strong>Anaerobic (without O₂):</strong></p>
<pre>C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂ + Energy (in yeast — fermentation)</pre>
<pre>C₆H₁₂O₆ → 2C₃H₆O₃ + Energy (in muscles — lactic acid)</pre>

<h3>Transportation</h3>
<h4>In Humans</h4>
<ul>
<li><strong>Heart</strong>: 4-chambered (2 atria + 2 ventricles). Double circulation: pulmonary (lungs) + systemic (body).</li>
<li><strong>Blood</strong>: Plasma (55%) + RBCs + WBCs + Platelets. Haemoglobin in RBCs carries O₂.</li>
<li><strong>Arteries</strong> carry oxygenated blood (except pulmonary artery); <strong>Veins</strong> carry deoxygenated blood (except pulmonary vein). <strong>Capillaries</strong> enable exchange.</li>
</ul>
<h4>In Plants</h4>
<ul>
<li><strong>Xylem</strong>: Transports water and minerals upward (from roots to leaves) via transpiration pull.</li>
<li><strong>Phloem</strong>: Transports food (sucrose) from leaves to all parts (translocation).</li>
</ul>

<h3>Excretion</h3>
<p>Removal of metabolic waste products from the body.</p>
<ul>
<li><strong>Kidneys</strong> filter blood to form urine. Each kidney contains ~1 million nephrons (the functional unit). Filtration → reabsorption → secretion → urine formation.</li>
<li><strong>Plants</strong>: Store waste in vacuoles, old leaves, bark; remove O₂ and CO₂ through stomata.</li>
</ul>

<p><em>Reference: NCERT Science Textbook for Class 10 – Chapter 5; Trueman's Biology; Pradeep's Biology.</em></p>`
  },

  {
    title: "Heredity and Evolution – Class 10 Biology Chapter 8",
    subject: "Biology",
    targetClass: "10",
    chapter: "Chapter 8",
    metaDescription: "Learn about heredity, Mendel's laws, genetics, DNA, evolution, speciation, and natural selection for CBSE Class 10 Biology.",
    keywords: ["heredity evolution", "Mendel's laws", "genetics", "DNA", "natural selection", "class 10 biology", "NCERT", "speciation"],
    content: `<h2>Heredity and Evolution</h2>
<p>Heredity is the transmission of characters (traits) from parents to offspring. Evolution is the gradual change in inherited traits over successive generations.</p>

<h3>Mendel's Contribution</h3>
<p>Gregor Johann Mendel (Father of Genetics) studied inheritance using garden pea plants (<em>Pisum sativum</em>). He chose 7 contrasting pairs of characters (e.g., tall vs dwarf, round vs wrinkled seeds).</p>

<h3>Key Terms</h3>
<ul>
<li><strong>Gene</strong>: Unit of inheritance; a segment of DNA on a chromosome.</li>
<li><strong>Allele</strong>: Alternative forms of a gene (e.g., T for tall, t for dwarf).</li>
<li><strong>Dominant</strong>: The trait that expresses itself even in heterozygous condition (Tt → Tall).</li>
<li><strong>Recessive</strong>: The trait that is masked by the dominant allele (only expressed in tt → Dwarf).</li>
<li><strong>Genotype</strong>: Genetic makeup (TT, Tt, tt).</li>
<li><strong>Phenotype</strong>: Physical appearance (Tall or Dwarf).</li>
</ul>

<h3>Mendel's Laws</h3>
<ol>
<li><strong>Law of Dominance</strong>: In a cross between two pure organisms differing in a pair of characters, only one character appears in F₁ (dominant).</li>
<li><strong>Law of Segregation</strong>: The two alleles of a gene separate during gamete formation so each gamete receives only one allele.</li>
<li><strong>Law of Independent Assortment</strong>: Genes for different traits are inherited independently of each other (applies to dihybrid crosses).</li>
</ol>

<h3>Monohybrid Cross</h3>
<pre>Parents: TT (Tall) × tt (Dwarf)</pre>
<pre>F₁: All Tt (Tall)</pre>
<pre>F₂: TT : Tt : Tt : tt → 3 Tall : 1 Dwarf</pre>
<p>Genotypic ratio = 1:2:1 | Phenotypic ratio = 3:1</p>

<h3>Sex Determination in Humans</h3>
<p>Humans have 23 pairs of chromosomes (22 autosomes + 1 pair of sex chromosomes).</p>
<ul>
<li>Females: XX</li>
<li>Males: XY</li>
</ul>
<p>The sex of the child is determined by the father's gamete: X sperm → girl, Y sperm → boy.</p>

<h3>Evolution</h3>
<ul>
<li><strong>Homologous organs</strong>: Same origin, different functions (e.g., forelimbs of whale, bat, human) — evidence of <strong>divergent evolution</strong>.</li>
<li><strong>Analogous organs</strong>: Different origin, same function (e.g., wings of butterfly and bird) — evidence of <strong>convergent evolution</strong>.</li>
<li><strong>Fossils</strong>: Preserved remains of ancient organisms that provide evidence of evolution.</li>
</ul>

<h3>Natural Selection (Darwin)</h3>
<p>Organisms with favourable variations survive and reproduce more successfully in a given environment ("survival of the fittest"). Over generations, this leads to evolution and speciation.</p>

<p><em>Reference: NCERT Science Textbook for Class 10 – Chapter 8; Lakhmir Singh Biology; Pradeep's Biology.</em></p>`
  },

  // ═══════════════════════════════════════════
  // COMPUTER SCIENCE — Class 10
  // ═══════════════════════════════════════════
  {
    title: "Introduction to Python Programming – Class 10 Computer Science",
    subject: "Computer",
    targetClass: "10",
    chapter: "Python Basics",
    metaDescription: "Learn Python programming basics: variables, data types, operators, input/output, and control flow for CBSE Class 10 Computer Science.",
    keywords: ["python programming", "class 10 computer science", "variables", "data types", "operators", "if else", "loops", "CBSE"],
    content: `<h2>Introduction to Python Programming</h2>
<p>Python is a high-level, interpreted, general-purpose programming language created by <strong>Guido van Rossum</strong> in 1991. It is known for its simple syntax, readability, and versatility. Python is the recommended language for CBSE Class 10 Computer Science.</p>

<h3>Why Python?</h3>
<ul>
<li>Easy to learn and read (close to English)</li>
<li>Free and open-source</li>
<li>Used in web development, AI, data science, automation, and more</li>
<li>Extensive library support</li>
</ul>

<h3>Variables and Data Types</h3>
<p>A <strong>variable</strong> is a name that refers to a value stored in memory. Python is dynamically typed — you don't need to declare the type.</p>
<pre>name = "SixBytes"        # str (string)
age = 15                  # int (integer)
marks = 95.5              # float (decimal)
is_passed = True          # bool (boolean)</pre>

<h3>Operators</h3>
<table>
<tr><th>Type</th><th>Operators</th><th>Example</th></tr>
<tr><td>Arithmetic</td><td>+, -, *, /, //, %, **</td><td>5 ** 2 = 25, 7 // 2 = 3</td></tr>
<tr><td>Comparison</td><td>==, !=, &gt;, &lt;, &gt;=, &lt;=</td><td>5 &gt; 3 → True</td></tr>
<tr><td>Logical</td><td>and, or, not</td><td>True and False → False</td></tr>
<tr><td>Assignment</td><td>=, +=, -=, *=, /=</td><td>x += 5 means x = x + 5</td></tr>
</table>

<h3>Input and Output</h3>
<pre># Output
print("Hello, SixBytes!")

# Input (always returns a string)
name = input("Enter your name: ")
age = int(input("Enter your age: "))    # Convert to int
print(f"Hello {name}, you are {age} years old!")</pre>

<h3>Conditional Statements</h3>
<pre>marks = int(input("Enter marks: "))

if marks >= 90:
    print("Grade: A+")
elif marks >= 75:
    print("Grade: A")
elif marks >= 60:
    print("Grade: B")
else:
    print("Grade: C")</pre>

<h3>Loops</h3>
<p><strong>for loop</strong> — iterates over a sequence:</p>
<pre>for i in range(1, 11):
    print(i, end=" ")
# Output: 1 2 3 4 5 6 7 8 9 10</pre>

<p><strong>while loop</strong> — repeats while a condition is True:</p>
<pre>count = 1
while count <= 5:
    print("SixBytes", count)
    count += 1</pre>

<h3>Strings</h3>
<pre>s = "SixBytes Institute"
print(len(s))          # 19
print(s[0])            # S
print(s[-1])           # e
print(s[0:3])          # Six (slicing)
print(s.upper())       # SIXBYTES INSTITUTE
print(s.lower())       # sixbytes institute
print(s.replace("Institute", "Academy"))  # SixBytes Academy</pre>

<h3>Lists</h3>
<pre>subjects = ["Maths", "Science", "English"]
subjects.append("Hindi")
subjects.remove("English")
print(subjects)        # ['Maths', 'Science', 'Hindi']
print(len(subjects))   # 3</pre>

<p><em>Reference: NCERT Computer Science Textbook for Class 10; Sumita Arora Python for Class 10; Let Us Python by Yashavant Kanetkar.</em></p>`
  },

  {
    title: "Computer Networks and Internet Basics – Class 10 Computer Science",
    subject: "Computer",
    targetClass: "10",
    chapter: "Networking",
    metaDescription: "Understand computer networks, types of networks (LAN, MAN, WAN), internet protocols, web technologies, and cyber safety for CBSE Class 10.",
    keywords: ["computer networks", "internet", "LAN WAN", "protocols", "cyber safety", "class 10 computer science", "CBSE", "networking"],
    content: `<h2>Computer Networks and Internet Basics</h2>
<p>A <strong>computer network</strong> is a group of interconnected computers and devices that can share data, resources, and information with each other.</p>

<h3>Types of Networks</h3>
<table>
<tr><th>Type</th><th>Full Form</th><th>Coverage</th><th>Example</th></tr>
<tr><td>PAN</td><td>Personal Area Network</td><td>~10 metres</td><td>Bluetooth headphones connected to phone</td></tr>
<tr><td>LAN</td><td>Local Area Network</td><td>Building / campus</td><td>School computer lab, office network</td></tr>
<tr><td>MAN</td><td>Metropolitan Area Network</td><td>City</td><td>Cable TV network, city-wide Wi-Fi</td></tr>
<tr><td>WAN</td><td>Wide Area Network</td><td>Countries / global</td><td>The Internet itself</td></tr>
</table>

<h3>Network Devices</h3>
<ul>
<li><strong>Modem</strong>: Converts digital signals to analogue (modulation) and vice versa (demodulation) for transmission over telephone lines.</li>
<li><strong>Hub</strong>: Broadcasts data to all connected devices (no intelligence).</li>
<li><strong>Switch</strong>: Sends data only to the intended device (smarter than hub).</li>
<li><strong>Router</strong>: Connects different networks and routes data packets using IP addresses. Your home Wi-Fi router connects your LAN to the WAN (Internet).</li>
<li><strong>Gateway</strong>: Connects two networks with different protocols.</li>
</ul>

<h3>The Internet</h3>
<p>The Internet is a global WAN — a "network of networks." Key concepts:</p>
<ul>
<li><strong>IP Address</strong>: A unique numerical label assigned to every device (e.g., 192.168.1.1). IPv4 uses 32 bits; IPv6 uses 128 bits.</li>
<li><strong>URL</strong>: Uniform Resource Locator — the address of a webpage (e.g., https://sixbytes.in).</li>
<li><strong>DNS</strong>: Domain Name System — converts domain names (sixbytes.in) to IP addresses.</li>
<li><strong>HTTP/HTTPS</strong>: Protocols for transferring web pages. HTTPS adds encryption (SSL/TLS) for security.</li>
</ul>

<h3>Web Technologies</h3>
<ul>
<li><strong>HTML</strong>: HyperText Markup Language — structures web page content.</li>
<li><strong>CSS</strong>: Cascading Style Sheets — styles the appearance of web pages.</li>
<li><strong>JavaScript</strong>: Adds interactivity to web pages.</li>
<li><strong>Web Browser</strong>: Software that renders web pages (Chrome, Firefox, Edge).</li>
<li><strong>Web Server</strong>: A computer that stores and serves web pages to browsers.</li>
</ul>

<h3>Cyber Safety and Ethics</h3>
<ul>
<li><strong>Cyber Crime</strong>: Illegal activities using computers — hacking, phishing, identity theft, cyberbullying.</li>
<li><strong>Phishing</strong>: Fake emails or websites designed to steal personal information.</li>
<li><strong>Strong Passwords</strong>: Use 8+ characters with uppercase, lowercase, numbers, and symbols. Never share passwords.</li>
<li><strong>Malware</strong>: Malicious software — viruses, worms, trojans, ransomware. Use antivirus software and keep systems updated.</li>
<li><strong>Digital Footprint</strong>: The trail of data you leave online. Be mindful of what you share on social media.</li>
<li><strong>Intellectual Property</strong>: Respect copyright, use Creative Commons content, and cite sources properly.</li>
</ul>

<p><em>Reference: NCERT Computer Science Textbook for Class 10; Sumita Arora's Informatics Practices; CBSE Study Material.</em></p>`
  },
];

/* ─── SEED FUNCTION ───────────────────────────────────── */
async function seedResources() {
  try {
    console.log("🔌 Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB.\n");

    // Get admin user ID for createdBy field
    const UserModel = mongoose.models.User || mongoose.model("User", new mongoose.Schema({ email: String }));
    const admin = await UserModel.findOne({ email: "ishant.off@gmail.com" });
    const adminId = admin?._id || null;

    let created = 0;
    let skipped = 0;

    for (const r of resources) {
      const slug = slugify(r.title);
      const existing = await Resource.findOne({ slug });

      if (existing) {
        console.log(`⏭️  Skipped (exists): ${r.title}`);
        skipped++;
        continue;
      }

      await Resource.create({
        ...r,
        slug,
        published: true,
        createdBy: adminId,
      });

      console.log(`✅ Created: ${r.title}`);
      created++;
    }

    console.log(`\n🎉 Seeding complete! Created: ${created}, Skipped: ${skipped}`);
  } catch (error) {
    console.error("❌ Seed error:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedResources();
