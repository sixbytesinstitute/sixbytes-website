/**
 * Seed Script: NCERT Class 10 Mathematics — Missing Chapters
 * Covers: Real Numbers, Polynomials, Linear Equations, AP, Triangles,
 *         Coordinate Geometry, Trigonometry, Circles, Surface Areas,
 *         Statistics, Probability
 * 
 * Run: node scripts/seed-ncert-maths.mjs
 */
import mongoose from "mongoose";
import { readFileSync } from "fs";

const envFile = readFileSync(".env.local", "utf-8");
let MONGO_URI = "";
for (const line of envFile.split("\n")) {
  if (line.trim().startsWith("MONGO_URI=")) {
    MONGO_URI = line.trim().split("=").slice(1).join("=");
    break;
  }
}
if (!MONGO_URI) { console.error("MONGO_URI not found"); process.exit(1); }

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

const resources = [

// ════════════════════════════════════════════════════════════
// 1. REAL NUMBERS (Chapter 1)
// ════════════════════════════════════════════════════════════
{
  slug: "real-numbers-class-10-maths-ncert-notes",
  title: "Real Numbers – Class 10 Maths Chapter 1 NCERT Notes & Formulas",
  metaDescription: "Class 10 Real Numbers notes: Euclid's division lemma, HCF, LCM, Fundamental Theorem of Arithmetic, irrational proofs for CBSE & ICSE boards.",
  subject: "Mathematics",
  targetClass: "10",
  board: "CBSE & ICSE",
  resourceType: "topic_guide",
  chapter: "Real Numbers",
  keywords: ["real numbers class 10", "euclid division lemma", "HCF LCM", "fundamental theorem arithmetic", "irrational numbers proof", "NCERT maths", "CBSE", "ICSE", "prime factorisation"],
  published: true,
  content: `
<h2>Chapter 1: Real Numbers</h2>

<div class="concept-callout">
<strong>Number System Hierarchy:</strong> Natural Numbers ⊂ Whole Numbers ⊂ Integers ⊂ Rational Numbers ⊂ Real Numbers. Real numbers include both rational (expressible as p/q) and irrational numbers (non-terminating, non-repeating decimals like √2, π).
</div>

<h3>1.1 Euclid's Division Lemma</h3>
<p>For any two positive integers <strong>a</strong> and <strong>b</strong>, there exist unique integers <strong>q</strong> (quotient) and <strong>r</strong> (remainder) such that:</p>
<div class="formula-callout">
<strong>a = b × q + r</strong>, where 0 ≤ r < b
</div>

<h4>Euclid's Division Algorithm (to find HCF)</h4>
<p>To find the HCF of two positive integers, say 455 and 42:</p>
<ol>
  <li>Divide the larger number by the smaller: 455 = 42 × 10 + 35</li>
  <li>Now divide the divisor (42) by the remainder (35): 42 = 35 × 1 + 7</li>
  <li>Continue: 35 = 7 × 5 + 0</li>
  <li>When remainder = 0, the divisor at that step is the HCF. <strong>HCF(455, 42) = 7</strong></li>
</ol>

<h3>1.2 The Fundamental Theorem of Arithmetic</h3>
<div class="concept-callout">
<strong>Statement:</strong> Every composite number can be expressed as a product of prime numbers, and this factorisation is unique (apart from the order of the primes).<br/><br/>
Example: 1260 = 2² × 3² × 5 × 7 — This is the only way to express 1260 as a product of primes.
</div>

<h4>Using Prime Factorisation to Find HCF and LCM</h4>
<p><strong>Example:</strong> Find HCF and LCM of 12, 15, and 21.</p>
<ul>
  <li>12 = 2² × 3</li>
  <li>15 = 3 × 5</li>
  <li>21 = 3 × 7</li>
</ul>
<p><strong>HCF</strong> = Product of the <em>smallest</em> power of each <em>common</em> prime factor = 3</p>
<p><strong>LCM</strong> = Product of the <em>greatest</em> power of each prime factor = 2² × 3 × 5 × 7 = <strong>420</strong></p>

<div class="formula-callout">
<strong>Key Relationship:</strong> For any two positive integers a and b:<br/>
HCF(a, b) × LCM(a, b) = a × b
</div>

<h3>1.3 Revisiting Irrational Numbers</h3>
<h4>Proving √2 is Irrational (Proof by Contradiction)</h4>
<ol>
  <li>Assume √2 is rational, i.e., √2 = p/q where p, q are co-prime integers (HCF = 1).</li>
  <li>Squaring: 2 = p²/q², so p² = 2q².</li>
  <li>This means p² is even, so p must be even. Let p = 2m.</li>
  <li>Then (2m)² = 2q² → 4m² = 2q² → q² = 2m².</li>
  <li>So q² is also even, meaning q is even.</li>
  <li>But if both p and q are even, they have a common factor 2 — contradicting our assumption that they are co-prime.</li>
  <li>Therefore, √2 is <strong>irrational</strong>. ∎</li>
</ol>

<h3>1.4 Revisiting Rational Numbers and Their Decimal Expansions</h3>
<div class="concept-callout">
<strong>Theorem:</strong> Let x = p/q be a rational number where p and q are co-prime.<br/>
• If q = 2ⁿ × 5ᵐ (only factors 2 and 5), then x has a <strong>terminating</strong> decimal expansion.<br/>
• If q has prime factors other than 2 or 5, then x has a <strong>non-terminating repeating</strong> decimal expansion.<br/><br/>
Examples: 7/8 = 7/(2³) = 0.875 (terminating); 1/3 = 0.333... (non-terminating repeating)
</div>
`
},

// ════════════════════════════════════════════════════════════
// 2. POLYNOMIALS (Chapter 2)
// ════════════════════════════════════════════════════════════
{
  slug: "polynomials-class-10-maths-ncert-notes",
  title: "Polynomials – Class 10 Maths Chapter 2 NCERT Notes & Zeroes",
  metaDescription: "Class 10 Polynomials notes: zeroes of polynomial, relationship between zeroes and coefficients, division algorithm for CBSE & ICSE.",
  subject: "Mathematics",
  targetClass: "10",
  board: "CBSE & ICSE",
  resourceType: "topic_guide",
  chapter: "Polynomials",
  keywords: ["polynomials class 10", "zeroes of polynomial", "sum product of zeroes", "quadratic polynomial", "division algorithm", "NCERT maths", "CBSE", "ICSE"],
  published: true,
  content: `
<h2>Chapter 2: Polynomials</h2>

<h3>2.1 Geometrical Meaning of Zeroes</h3>
<p>The <strong>zeroes</strong> of a polynomial p(x) are the values of x for which p(x) = 0. Geometrically, they are the x-coordinates of the points where the graph of y = p(x) intersects the x-axis.</p>
<ul>
  <li><strong>Linear polynomial</strong> (degree 1): ax + b → has exactly <strong>1 zero</strong> at x = −b/a</li>
  <li><strong>Quadratic polynomial</strong> (degree 2): ax² + bx + c → has at most <strong>2 zeroes</strong></li>
  <li><strong>Cubic polynomial</strong> (degree 3): ax³ + bx² + cx + d → has at most <strong>3 zeroes</strong></li>
</ul>
<p>In general, a polynomial of degree n has at most n zeroes.</p>

<h3>2.2 Relationship Between Zeroes and Coefficients</h3>

<h4>For a Quadratic Polynomial ax² + bx + c (with zeroes α and β)</h4>
<div class="formula-callout">
<strong>Sum of zeroes:</strong> α + β = −b/a<br/>
<strong>Product of zeroes:</strong> α × β = c/a<br/><br/>
The polynomial can be written as: <strong>a[x² − (α + β)x + αβ]</strong>
</div>

<p><strong>Example:</strong> Find the zeroes of x² − 5x + 6 and verify the relationship.</p>
<p>x² − 5x + 6 = (x − 2)(x − 3) = 0 → zeroes are α = 2, β = 3</p>
<ul>
  <li>Sum: α + β = 2 + 3 = 5 = −(−5)/1 = −b/a ✓</li>
  <li>Product: α × β = 2 × 3 = 6 = 6/1 = c/a ✓</li>
</ul>

<h4>For a Cubic Polynomial ax³ + bx² + cx + d (with zeroes α, β, γ)</h4>
<div class="formula-callout">
<strong>α + β + γ = −b/a</strong><br/>
<strong>αβ + βγ + γα = c/a</strong><br/>
<strong>αβγ = −d/a</strong>
</div>

<h3>2.3 Division Algorithm for Polynomials</h3>
<p>If p(x) and g(x) are any two polynomials with g(x) ≠ 0, then we can find polynomials q(x) and r(x) such that:</p>
<div class="formula-callout">
<strong>p(x) = g(x) × q(x) + r(x)</strong><br/>
where degree of r(x) < degree of g(x), or r(x) = 0.
</div>
<p>This is used to find the remaining zeroes of a polynomial when some zeroes are already known.</p>
`
},

// ════════════════════════════════════════════════════════════
// 3. PAIR OF LINEAR EQUATIONS (Chapter 3)
// ════════════════════════════════════════════════════════════
{
  slug: "pair-of-linear-equations-class-10-maths-ncert-notes",
  title: "Pair of Linear Equations in Two Variables – Class 10 Maths Chapter 3",
  metaDescription: "Class 10 Linear Equations notes: graphical and algebraic methods, substitution, elimination, cross-multiplication for CBSE & ICSE boards.",
  subject: "Mathematics",
  targetClass: "10",
  board: "CBSE & ICSE",
  resourceType: "topic_guide",
  chapter: "Pair of Linear Equations in Two Variables",
  keywords: ["linear equations class 10", "substitution method", "elimination method", "cross multiplication", "consistent inconsistent", "NCERT maths", "CBSE", "ICSE", "simultaneous equations"],
  published: true,
  content: `
<h2>Chapter 3: Pair of Linear Equations in Two Variables</h2>

<h3>3.1 General Form</h3>
<p>A pair of linear equations in two variables x and y:</p>
<div class="formula-callout">
a₁x + b₁y + c₁ = 0<br/>
a₂x + b₂y + c₂ = 0
</div>

<h3>3.2 Conditions for Consistency</h3>
<table style="width:100%;border-collapse:collapse;margin:1rem 0;">
<tr style="border-bottom:2px solid rgba(249,115,22,0.3);">
  <th style="text-align:left;padding:0.5rem;">Condition</th>
  <th style="text-align:left;padding:0.5rem;">Type</th>
  <th style="text-align:left;padding:0.5rem;">Graphical Meaning</th>
  <th style="text-align:left;padding:0.5rem;">Solutions</th>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
  <td style="padding:0.5rem;">a₁/a₂ ≠ b₁/b₂</td><td>Consistent</td><td>Intersecting lines</td><td>Unique solution</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
  <td style="padding:0.5rem;">a₁/a₂ = b₁/b₂ = c₁/c₂</td><td>Dependent (Consistent)</td><td>Coincident lines</td><td>Infinitely many</td>
</tr>
<tr>
  <td style="padding:0.5rem;">a₁/a₂ = b₁/b₂ ≠ c₁/c₂</td><td>Inconsistent</td><td>Parallel lines</td><td>No solution</td>
</tr>
</table>

<h3>3.3 Algebraic Methods of Solving</h3>

<h4>Method 1: Substitution</h4>
<ol>
  <li>Express one variable in terms of the other from one equation.</li>
  <li>Substitute this into the second equation to get a single-variable equation.</li>
  <li>Solve and back-substitute.</li>
</ol>
<p><strong>Example:</strong> Solve x + y = 14 and x − y = 4</p>
<p>From equation 1: x = 14 − y. Substituting into equation 2: (14 − y) − y = 4 → 14 − 2y = 4 → y = 5, x = 9.</p>

<h4>Method 2: Elimination</h4>
<ol>
  <li>Multiply equations to make coefficients of one variable equal.</li>
  <li>Add or subtract the equations to eliminate that variable.</li>
  <li>Solve the resulting single-variable equation.</li>
</ol>

<h4>Method 3: Cross-Multiplication</h4>
<div class="formula-callout">
For a₁x + b₁y + c₁ = 0 and a₂x + b₂y + c₂ = 0:<br/><br/>
<strong>x / (b₁c₂ − b₂c₁) = y / (c₁a₂ − c₂a₁) = 1 / (a₁b₂ − a₂b₁)</strong>
</div>

<h3>3.4 Word Problems — Strategy</h3>
<div class="concept-callout">
<strong>Steps for solving word problems:</strong><br/>
1. Read the problem carefully and identify the unknowns — assign variables (x, y).<br/>
2. Translate the given conditions into two linear equations.<br/>
3. Solve using any algebraic method.<br/>
4. Verify the solution makes sense in the context of the problem.
</div>
`
},

// ════════════════════════════════════════════════════════════
// 4. ARITHMETIC PROGRESSIONS (Chapter 5)
// ════════════════════════════════════════════════════════════
{
  slug: "arithmetic-progressions-class-10-maths-ncert-notes",
  title: "Arithmetic Progressions (AP) – Class 10 Maths Chapter 5 Formulas & Notes",
  metaDescription: "Class 10 AP notes: nth term formula, sum of n terms, common difference, solved examples for arithmetic progressions CBSE & ICSE.",
  subject: "Mathematics",
  targetClass: "10",
  board: "CBSE & ICSE",
  resourceType: "topic_guide",
  chapter: "Arithmetic Progressions",
  keywords: ["arithmetic progression class 10", "AP formula", "nth term", "sum of n terms", "common difference", "NCERT maths", "CBSE", "ICSE", "AP problems"],
  published: true,
  content: `
<h2>Chapter 5: Arithmetic Progressions (AP)</h2>

<div class="concept-callout">
<strong>Definition:</strong> An Arithmetic Progression is a sequence of numbers in which each term after the first is obtained by adding a fixed number called the <strong>common difference (d)</strong> to the preceding term.<br/><br/>
General form: <strong>a, a+d, a+2d, a+3d, ...</strong> where a = first term, d = common difference.
</div>

<h3>5.1 Common Difference</h3>
<p>d = a₂ − a₁ = a₃ − a₂ = aₙ − aₙ₋₁ (constant for all consecutive terms)</p>
<ul>
  <li>If d > 0: AP is <strong>increasing</strong> (e.g., 2, 5, 8, 11, ...)</li>
  <li>If d < 0: AP is <strong>decreasing</strong> (e.g., 10, 7, 4, 1, ...)</li>
  <li>If d = 0: All terms are equal (e.g., 5, 5, 5, 5, ...)</li>
</ul>

<h3>5.2 nth Term of an AP</h3>
<div class="formula-callout">
<strong>aₙ = a + (n − 1)d</strong><br/><br/>
Where: aₙ = nth term, a = first term, n = term number, d = common difference
</div>

<p><strong>Example:</strong> Find the 20th term of the AP: 3, 7, 11, 15, ...</p>
<p>Here a = 3, d = 7 − 3 = 4, n = 20</p>
<p>a₂₀ = 3 + (20 − 1) × 4 = 3 + 76 = <strong>79</strong></p>

<h3>5.3 Sum of First n Terms</h3>
<div class="formula-callout">
<strong>Sₙ = n/2 × [2a + (n − 1)d]</strong><br/><br/>
<strong>OR (if last term l is known):</strong><br/>
<strong>Sₙ = n/2 × (a + l)</strong><br/><br/>
Where: Sₙ = sum of first n terms, a = first term, l = last term, d = common difference
</div>

<p><strong>Example:</strong> Find the sum of the first 15 terms of the AP: 2, 7, 12, 17, ...</p>
<p>a = 2, d = 5, n = 15</p>
<p>S₁₅ = 15/2 × [2(2) + (15 − 1)(5)] = 15/2 × [4 + 70] = 15/2 × 74 = <strong>555</strong></p>

<h3>5.4 Important Properties</h3>
<ul>
  <li>The nth term can also be found using: <strong>aₙ = Sₙ − Sₙ₋₁</strong></li>
  <li>If three numbers a, b, c are in AP, then <strong>2b = a + c</strong> (i.e., the middle term is the arithmetic mean of the other two)</li>
  <li>Sum of first n natural numbers: <strong>Sₙ = n(n+1)/2</strong></li>
</ul>

<div class="concept-callout">
<strong>Board Exam Tip:</strong> Many AP problems can be simplified by choosing terms wisely:<br/>
• Three terms in AP: take as <strong>(a−d), a, (a+d)</strong><br/>
• Four terms in AP: take as <strong>(a−3d), (a−d), (a+d), (a+3d)</strong> (common difference = 2d)<br/>
This eliminates one variable and simplifies the algebra significantly.
</div>
`
},

// ════════════════════════════════════════════════════════════
// 5. TRIANGLES (Chapter 6)
// ════════════════════════════════════════════════════════════
{
  slug: "triangles-class-10-maths-ncert-notes",
  title: "Triangles – Class 10 Maths Chapter 6: Similarity, BPT & Pythagoras Theorem",
  metaDescription: "Class 10 Triangles notes: similar triangles, BPT, AAA-SAS-SSS similarity criteria, Pythagoras theorem with proofs for CBSE & ICSE boards.",
  subject: "Mathematics",
  targetClass: "10",
  board: "CBSE & ICSE",
  resourceType: "topic_guide",
  chapter: "Triangles",
  keywords: ["triangles class 10", "similar triangles", "BPT", "basic proportionality theorem", "Pythagoras theorem", "AAA similarity", "NCERT maths", "CBSE", "ICSE", "thales theorem"],
  published: true,
  content: `
<h2>Chapter 6: Triangles</h2>

<h3>6.1 Similar Figures</h3>
<p>Two figures are <strong>similar</strong> if they have the same shape (but not necessarily the same size). For polygons, this means corresponding angles are equal and corresponding sides are proportional.</p>

<h3>6.2 Basic Proportionality Theorem (BPT / Thales' Theorem)</h3>
<div class="concept-callout">
<strong>Statement:</strong> If a line is drawn parallel to one side of a triangle, it divides the other two sides in the same ratio.<br/><br/>
If DE ∥ BC in △ABC, then: <strong>AD/DB = AE/EC</strong>
</div>

<h4>Converse of BPT</h4>
<p>If a line divides two sides of a triangle in the same ratio, then the line is parallel to the third side.</p>

<h3>6.3 Criteria for Similarity of Triangles</h3>

<h4>1. AA (Angle-Angle) Similarity</h4>
<p>If two angles of one triangle are equal to two angles of another triangle, the triangles are similar.</p>

<h4>2. SSS (Side-Side-Side) Similarity</h4>
<p>If the corresponding sides of two triangles are in the same ratio (proportional), the triangles are similar.</p>

<h4>3. SAS (Side-Angle-Side) Similarity</h4>
<p>If one angle of a triangle is equal to one angle of another triangle and the sides including these angles are proportional, the triangles are similar.</p>

<div class="formula-callout">
<strong>Properties of Similar Triangles (△ABC ~ △DEF):</strong><br/>
• Corresponding angles are equal: ∠A = ∠D, ∠B = ∠E, ∠C = ∠F<br/>
• Corresponding sides are proportional: AB/DE = BC/EF = CA/FD<br/>
• Ratio of areas = (ratio of corresponding sides)² = (AB/DE)²<br/>
• Ratio of perimeters = ratio of corresponding sides
</div>

<h3>6.4 Pythagoras Theorem</h3>
<div class="formula-callout">
<strong>Statement:</strong> In a right-angled triangle, the square of the hypotenuse equals the sum of the squares of the other two sides.<br/><br/>
<strong>AC² = AB² + BC²</strong> (where AC is the hypotenuse)
</div>

<h4>Converse of Pythagoras Theorem</h4>
<p>If in a triangle, the square of one side equals the sum of the squares of the other two sides, then the angle opposite to the first side is a right angle.</p>

<p><strong>Example:</strong> A ladder 10 m long reaches a window 8 m above the ground. Find the distance of the foot of the ladder from the wall.</p>
<p>Let the distance = x. By Pythagoras: 10² = 8² + x² → 100 = 64 + x² → x² = 36 → x = <strong>6 m</strong></p>
`
},

// ════════════════════════════════════════════════════════════
// 6. COORDINATE GEOMETRY (Chapter 7)
// ════════════════════════════════════════════════════════════
{
  slug: "coordinate-geometry-class-10-maths-ncert-notes",
  title: "Coordinate Geometry – Class 10 Maths Chapter 7: Distance & Section Formula",
  metaDescription: "Class 10 Coordinate Geometry notes: distance formula, section formula, midpoint, area of triangle, collinearity for CBSE & ICSE boards.",
  subject: "Mathematics",
  targetClass: "10",
  board: "CBSE & ICSE",
  resourceType: "topic_guide",
  chapter: "Coordinate Geometry",
  keywords: ["coordinate geometry class 10", "distance formula", "section formula", "midpoint formula", "area of triangle", "collinearity", "NCERT maths", "CBSE", "ICSE"],
  published: true,
  content: `
<h2>Chapter 7: Coordinate Geometry</h2>

<h3>7.1 Distance Formula</h3>
<p>The distance between two points P(x₁, y₁) and Q(x₂, y₂) is:</p>
<div class="formula-callout">
<strong>PQ = √[(x₂ − x₁)² + (y₂ − y₁)²]</strong>
</div>
<p><strong>Example:</strong> Distance between A(3, 4) and B(7, 1):</p>
<p>AB = √[(7−3)² + (1−4)²] = √[16 + 9] = √25 = <strong>5 units</strong></p>

<p><strong>Distance from origin:</strong> For point P(x, y): OP = √(x² + y²)</p>

<h3>7.2 Section Formula</h3>
<p>If a point P(x, y) divides the line segment joining A(x₁, y₁) and B(x₂, y₂) <strong>internally</strong> in the ratio m : n, then:</p>
<div class="formula-callout">
<strong>x = (mx₂ + nx₁) / (m + n)</strong><br/>
<strong>y = (my₂ + ny₁) / (m + n)</strong>
</div>

<h3>7.3 Midpoint Formula</h3>
<p>The midpoint of the line segment joining A(x₁, y₁) and B(x₂, y₂) is a special case of the section formula with m:n = 1:1:</p>
<div class="formula-callout">
<strong>Midpoint = ((x₁ + x₂)/2, (y₁ + y₂)/2)</strong>
</div>

<h3>7.4 Area of a Triangle</h3>
<p>The area of a triangle with vertices A(x₁, y₁), B(x₂, y₂), and C(x₃, y₃) is:</p>
<div class="formula-callout">
<strong>Area = ½ |x₁(y₂ − y₃) + x₂(y₃ − y₁) + x₃(y₁ − y₂)|</strong>
</div>
<p>If the area = 0, then the three points are <strong>collinear</strong> (lie on the same straight line).</p>

<p><strong>Example:</strong> Find the area of triangle with vertices (1, 2), (4, 6), (7, 2).</p>
<p>Area = ½ |1(6−2) + 4(2−2) + 7(2−6)| = ½ |4 + 0 − 28| = ½ × 24 = <strong>12 sq. units</strong></p>
`
},

// ════════════════════════════════════════════════════════════
// 7. INTRODUCTION TO TRIGONOMETRY (Chapter 8)
// ════════════════════════════════════════════════════════════
{
  slug: "introduction-to-trigonometry-class-10-maths-ncert-notes",
  title: "Introduction to Trigonometry – Class 10 Maths Chapter 8: Ratios & Identities",
  metaDescription: "Class 10 Trigonometry notes: sin cos tan ratios, standard angle values, trigonometric identities, complementary angles for CBSE & ICSE.",
  subject: "Mathematics",
  targetClass: "10",
  board: "CBSE & ICSE",
  resourceType: "topic_guide",
  chapter: "Introduction to Trigonometry",
  keywords: ["trigonometry class 10", "sin cos tan", "trigonometric ratios", "trigonometric identities", "complementary angles", "NCERT maths", "CBSE", "ICSE", "standard angles"],
  published: true,
  content: `
<h2>Chapter 8: Introduction to Trigonometry</h2>

<h3>8.1 Trigonometric Ratios</h3>
<p>In a right-angled triangle with an acute angle θ:</p>
<div class="formula-callout">
<strong>sin θ = Opposite / Hypotenuse (P/H)</strong><br/>
<strong>cos θ = Adjacent / Hypotenuse (B/H)</strong><br/>
<strong>tan θ = Opposite / Adjacent (P/B)</strong><br/><br/>
<strong>cosec θ = 1/sin θ = H/P</strong><br/>
<strong>sec θ = 1/cos θ = H/B</strong><br/>
<strong>cot θ = 1/tan θ = B/P</strong><br/><br/>
Also: <strong>tan θ = sin θ / cos θ</strong> and <strong>cot θ = cos θ / sin θ</strong>
</div>

<h3>8.2 Values of Trigonometric Ratios for Standard Angles</h3>
<table style="width:100%;border-collapse:collapse;margin:1rem 0;text-align:center;">
<tr style="border-bottom:2px solid rgba(249,115,22,0.3);">
  <th style="padding:0.5rem;">θ</th><th>0°</th><th>30°</th><th>45°</th><th>60°</th><th>90°</th>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
  <td style="padding:0.5rem;font-weight:600;">sin θ</td><td>0</td><td>1/2</td><td>1/√2</td><td>√3/2</td><td>1</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
  <td style="padding:0.5rem;font-weight:600;">cos θ</td><td>1</td><td>√3/2</td><td>1/√2</td><td>1/2</td><td>0</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
  <td style="padding:0.5rem;font-weight:600;">tan θ</td><td>0</td><td>1/√3</td><td>1</td><td>√3</td><td>∞</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
  <td style="padding:0.5rem;font-weight:600;">cosec θ</td><td>∞</td><td>2</td><td>√2</td><td>2/√3</td><td>1</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
  <td style="padding:0.5rem;font-weight:600;">sec θ</td><td>1</td><td>2/√3</td><td>√2</td><td>2</td><td>∞</td>
</tr>
<tr>
  <td style="padding:0.5rem;font-weight:600;">cot θ</td><td>∞</td><td>√3</td><td>1</td><td>1/√3</td><td>0</td>
</tr>
</table>

<div class="concept-callout">
<strong>Memory Trick for sin values:</strong> Write 0, 1, 2, 3, 4 under 0°, 30°, 45°, 60°, 90°. Divide each by 4 and take the square root:<br/>
sin 0° = √(0/4) = 0, sin 30° = √(1/4) = 1/2, sin 45° = √(2/4) = 1/√2, sin 60° = √(3/4) = √3/2, sin 90° = √(4/4) = 1<br/><br/>
For cos, reverse the order: cos 0° = 1, cos 30° = √3/2, etc.
</div>

<h3>8.3 Complementary Angles</h3>
<p>Two angles are complementary if their sum is 90°. The trigonometric ratios of complementary angles are related:</p>
<div class="formula-callout">
<strong>sin(90° − θ) = cos θ</strong> &nbsp;&nbsp;&nbsp; <strong>cos(90° − θ) = sin θ</strong><br/>
<strong>tan(90° − θ) = cot θ</strong> &nbsp;&nbsp;&nbsp; <strong>cot(90° − θ) = tan θ</strong><br/>
<strong>sec(90° − θ) = cosec θ</strong> &nbsp; <strong>cosec(90° − θ) = sec θ</strong>
</div>

<h3>8.4 Trigonometric Identities</h3>
<div class="formula-callout">
<strong>Identity 1:</strong> sin²θ + cos²θ = 1<br/>
<strong>Identity 2:</strong> 1 + tan²θ = sec²θ<br/>
<strong>Identity 3:</strong> 1 + cot²θ = cosec²θ
</div>
<p>These identities hold for all values of θ where the ratios are defined, and are extremely useful for simplifying and proving trigonometric expressions in board exams.</p>
`
},

// ════════════════════════════════════════════════════════════
// 8. SOME APPLICATIONS OF TRIGONOMETRY (Chapter 9)
// ════════════════════════════════════════════════════════════
{
  slug: "applications-of-trigonometry-class-10-maths-ncert-notes",
  title: "Some Applications of Trigonometry – Class 10 Maths Chapter 9: Heights & Distances",
  metaDescription: "Class 10 Heights and Distances: angle of elevation, angle of depression, tower and building problems with solved examples for CBSE & ICSE.",
  subject: "Mathematics",
  targetClass: "10",
  board: "CBSE & ICSE",
  resourceType: "topic_guide",
  chapter: "Some Applications of Trigonometry",
  keywords: ["heights and distances class 10", "angle of elevation", "angle of depression", "trigonometry applications", "NCERT maths", "CBSE", "ICSE", "tower problems"],
  published: true,
  content: `
<h2>Chapter 9: Some Applications of Trigonometry</h2>

<h3>9.1 Key Definitions</h3>
<ul>
  <li><strong>Line of Sight:</strong> The line drawn from the eye of the observer to the point being observed.</li>
  <li><strong>Angle of Elevation:</strong> The angle between the horizontal and the line of sight when looking <em>upward</em> at an object.</li>
  <li><strong>Angle of Depression:</strong> The angle between the horizontal and the line of sight when looking <em>downward</em> at an object.</li>
</ul>

<div class="concept-callout">
<strong>Key Insight:</strong> The angle of elevation from point A to point B equals the angle of depression from point B to point A (alternate interior angles when a horizontal line is drawn at each point).
</div>

<h3>9.2 Problem-Solving Strategy</h3>
<ol>
  <li>Draw a clear diagram showing all given information.</li>
  <li>Identify the right triangle(s) in the figure.</li>
  <li>Label the known and unknown sides/angles.</li>
  <li>Choose the appropriate trigonometric ratio (sin, cos, or tan) based on which sides are involved.</li>
  <li>Solve the equation and find the required quantity.</li>
</ol>

<h3>9.3 Solved Examples</h3>

<h4>Example 1: Finding the height of a tower</h4>
<p>A person standing 30 m away from the base of a tower observes the top at an angle of elevation of 60°. Find the height of the tower.</p>
<p><span class="answer-badge">Solution</span></p>
<p>Let the height of the tower = h. In the right triangle formed:</p>
<p>tan 60° = h/30</p>
<p>√3 = h/30</p>
<p>h = 30√3 = 30 × 1.732 = <strong>51.96 m</strong></p>

<h4>Example 2: Finding the distance</h4>
<p>From the top of a 45 m high lighthouse, the angle of depression of a ship is 30°. Find the distance of the ship from the base of the lighthouse.</p>
<p><span class="answer-badge">Solution</span></p>
<p>Let the distance of the ship from the base = d.</p>
<p>Angle of depression = 30° = angle of elevation from ship to top (alternate angles)</p>
<p>tan 30° = 45/d → 1/√3 = 45/d → d = 45√3 = <strong>77.94 m</strong></p>

<div class="formula-callout">
<strong>Common Values Used in Problems:</strong><br/>
√2 ≈ 1.414 &nbsp;&nbsp; √3 ≈ 1.732 &nbsp;&nbsp; 1/√3 ≈ 0.577<br/>
tan 30° = 1/√3 &nbsp;&nbsp; tan 45° = 1 &nbsp;&nbsp; tan 60° = √3
</div>
`
},

// ════════════════════════════════════════════════════════════
// 9. CIRCLES (Chapter 10)
// ════════════════════════════════════════════════════════════
{
  slug: "circles-class-10-maths-ncert-notes",
  title: "Circles – Class 10 Maths Chapter 10: Tangent Properties & Theorems",
  metaDescription: "Class 10 Circles notes: tangent from external point, number of tangents, length of tangent theorem, solved problems for CBSE & ICSE.",
  subject: "Mathematics",
  targetClass: "10",
  board: "CBSE & ICSE",
  resourceType: "topic_guide",
  chapter: "Circles",
  keywords: ["circles class 10", "tangent to circle", "tangent properties", "number of tangents", "length of tangent", "NCERT maths", "CBSE", "ICSE"],
  published: true,
  content: `
<h2>Chapter 10: Circles</h2>

<h3>10.1 Tangent to a Circle</h3>
<p>A <strong>tangent</strong> to a circle is a line that touches the circle at exactly one point, called the <strong>point of tangency</strong> (or point of contact).</p>

<h4>Number of Tangents from a Point</h4>
<ul>
  <li>From a point <strong>inside</strong> the circle: <strong>0 tangents</strong></li>
  <li>From a point <strong>on</strong> the circle: <strong>1 tangent</strong> (exactly one)</li>
  <li>From a point <strong>outside</strong> the circle: <strong>2 tangents</strong></li>
</ul>

<h3>10.2 Important Theorems</h3>

<h4>Theorem 1: Tangent is Perpendicular to Radius</h4>
<div class="concept-callout">
<strong>Statement:</strong> The tangent at any point of a circle is <strong>perpendicular</strong> to the radius through the point of contact.<br/><br/>
If OA is the radius and PA is the tangent at point A, then <strong>OA ⊥ PA</strong> (∠OAP = 90°).
</div>

<h4>Theorem 2: Equal Tangent Lengths from External Point</h4>
<div class="formula-callout">
<strong>Statement:</strong> The lengths of tangents drawn from an external point to a circle are <strong>equal</strong>.<br/><br/>
If PA and PB are tangents from external point P to a circle with centre O, then <strong>PA = PB</strong>.<br/>
Also: ∠OPA = ∠OPB (OP bisects the angle between the tangents).
</div>

<h3>10.3 Solved Examples</h3>

<h4>Example: Two tangents from an external point form an angle of 60°. Find the length of each tangent if the radius is 5 cm.</h4>
<p><span class="answer-badge">Solution</span></p>
<p>Let PA and PB be tangents from point P, and O be the centre. ∠APB = 60°.</p>
<p>Since OP bisects ∠APB: ∠OPA = 30°. Also ∠OAP = 90° (radius ⊥ tangent).</p>
<p>In right △OAP: tan 30° = OA/PA → 1/√3 = 5/PA → PA = 5√3 ≈ <strong>8.66 cm</strong></p>
`
},

// ════════════════════════════════════════════════════════════
// 10. SURFACE AREAS AND VOLUMES (Chapter 12)
// ════════════════════════════════════════════════════════════
{
  slug: "surface-areas-and-volumes-class-10-maths-ncert-notes",
  title: "Surface Areas and Volumes – Class 10 Maths Chapter 12: Formulas & Combinations",
  metaDescription: "Class 10 Surface Areas & Volumes: combined solids, conversion of solids, frustum of cone formulas for CBSE & ICSE boards.",
  subject: "Mathematics",
  targetClass: "10",
  board: "CBSE & ICSE",
  resourceType: "topic_guide",
  chapter: "Surface Areas and Volumes",
  keywords: ["surface area volume class 10", "combination of solids", "frustum of cone", "conversion of solids", "NCERT maths", "CBSE", "ICSE", "cylinder cone sphere"],
  published: true,
  content: `
<h2>Chapter 12: Surface Areas and Volumes</h2>

<h3>12.1 Formula Reference Table</h3>
<table style="width:100%;border-collapse:collapse;margin:1rem 0;">
<tr style="border-bottom:2px solid rgba(249,115,22,0.3);">
  <th style="text-align:left;padding:0.5rem;">Solid</th>
  <th style="text-align:left;padding:0.5rem;">CSA / LSA</th>
  <th style="text-align:left;padding:0.5rem;">TSA</th>
  <th style="text-align:left;padding:0.5rem;">Volume</th>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
  <td style="padding:0.5rem;font-weight:600;">Cuboid</td><td>2h(l+b)</td><td>2(lb+bh+hl)</td><td>l×b×h</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
  <td style="padding:0.5rem;font-weight:600;">Cube (side a)</td><td>4a²</td><td>6a²</td><td>a³</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
  <td style="padding:0.5rem;font-weight:600;">Cylinder</td><td>2πrh</td><td>2πr(r+h)</td><td>πr²h</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
  <td style="padding:0.5rem;font-weight:600;">Cone</td><td>πrl</td><td>πr(r+l)</td><td>⅓πr²h</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
  <td style="padding:0.5rem;font-weight:600;">Sphere</td><td colspan="2" style="text-align:center;">4πr²</td><td>⁴⁄₃πr³</td>
</tr>
<tr>
  <td style="padding:0.5rem;font-weight:600;">Hemisphere</td><td>2πr²</td><td>3πr²</td><td>⅔πr³</td>
</tr>
</table>
<p><em>Where l = slant height of cone = √(r² + h²)</em></p>

<h3>12.2 Combination of Solids</h3>
<p>Many real-world objects are combinations of basic solids. For example, a tent is a cylinder topped by a cone.</p>
<div class="concept-callout">
<strong>Strategy:</strong><br/>
• <strong>Surface area</strong> of combined solid = Sum of visible curved surface areas (don't count the surfaces where solids are joined).<br/>
• <strong>Volume</strong> of combined solid = Sum of individual volumes.
</div>

<h3>12.3 Conversion of Solids</h3>
<p>When a solid is melted and recast into another shape, the <strong>volume remains the same</strong>.</p>
<p><strong>Example:</strong> A metallic sphere of radius 4.2 cm is melted and recast into a cylinder of radius 6 cm. Find the height of the cylinder.</p>
<p>Volume of sphere = Volume of cylinder</p>
<p>⁴⁄₃ × π × (4.2)³ = π × (6)² × h</p>
<p>⁴⁄₃ × 74.088 = 36h → h = 98.784/36 = <strong>2.744 cm</strong></p>

<h3>12.4 Frustum of a Cone</h3>
<p>When a cone is cut by a plane parallel to its base, the portion between the base and the cut is called a <strong>frustum</strong>.</p>
<div class="formula-callout">
<strong>For a frustum with radii R (larger) and r (smaller) and height h:</strong><br/>
Slant height: <strong>l = √[h² + (R − r)²]</strong><br/>
CSA: <strong>π(R + r)l</strong><br/>
TSA: <strong>π(R + r)l + πR² + πr²</strong><br/>
Volume: <strong>⅓πh(R² + r² + Rr)</strong>
</div>
`
},

// ════════════════════════════════════════════════════════════
// 11. STATISTICS (Chapter 13)
// ════════════════════════════════════════════════════════════
{
  slug: "statistics-class-10-maths-ncert-notes",
  title: "Statistics – Class 10 Maths Chapter 13: Mean, Median, Mode & Ogive",
  metaDescription: "Class 10 Statistics notes: mean of grouped data (direct, assumed mean, step deviation), median, mode formulas, and ogive for CBSE & ICSE.",
  subject: "Mathematics",
  targetClass: "10",
  board: "CBSE & ICSE",
  resourceType: "topic_guide",
  chapter: "Statistics",
  keywords: ["statistics class 10", "mean median mode", "grouped data", "assumed mean method", "step deviation", "ogive", "NCERT maths", "CBSE", "ICSE", "cumulative frequency"],
  published: true,
  content: `
<h2>Chapter 13: Statistics</h2>

<h3>13.1 Mean of Grouped Data</h3>

<h4>Method 1: Direct Method</h4>
<div class="formula-callout">
<strong>Mean (x̄) = Σfᵢxᵢ / Σfᵢ</strong><br/>
Where xᵢ = class mark (midpoint) of each class = (upper limit + lower limit)/2, fᵢ = frequency
</div>

<h4>Method 2: Assumed Mean Method</h4>
<div class="formula-callout">
<strong>Mean = a + (Σfᵢdᵢ / Σfᵢ)</strong><br/>
Where a = assumed mean (typically the class mark of the middle class), dᵢ = xᵢ − a
</div>

<h4>Method 3: Step-Deviation Method (Most efficient)</h4>
<div class="formula-callout">
<strong>Mean = a + (Σfᵢuᵢ / Σfᵢ) × h</strong><br/>
Where uᵢ = (xᵢ − a)/h, h = class size, a = assumed mean
</div>

<h3>13.2 Mode of Grouped Data</h3>
<p>The <strong>mode</strong> is the value that occurs most frequently. The <strong>modal class</strong> is the class with the highest frequency.</p>
<div class="formula-callout">
<strong>Mode = l + [(f₁ − f₀) / (2f₁ − f₀ − f₂)] × h</strong><br/><br/>
Where: l = lower limit of modal class, f₁ = frequency of modal class, f₀ = frequency of class before modal class, f₂ = frequency of class after modal class, h = class size
</div>

<h3>13.3 Median of Grouped Data</h3>
<div class="formula-callout">
<strong>Median = l + [(n/2 − cf) / f] × h</strong><br/><br/>
Where: l = lower limit of median class, n = total frequency (Σfᵢ), cf = cumulative frequency of the class <em>before</em> the median class, f = frequency of the median class, h = class size
</div>
<p><strong>Finding the median class:</strong> Calculate n/2. The class whose cumulative frequency is just greater than or equal to n/2 is the median class.</p>

<h3>13.4 Empirical Relationship</h3>
<div class="concept-callout">
<strong>3 Median = Mode + 2 Mean</strong><br/><br/>
This approximate relationship helps verify your calculations and is useful when one of the three measures is difficult to compute directly.
</div>

<h3>13.5 Ogive (Cumulative Frequency Curve)</h3>
<p>An ogive is a graph of cumulative frequency against upper class boundaries.</p>
<ul>
  <li><strong>Less-than ogive:</strong> Plot cumulative frequencies against upper class limits — curve rises from left to right.</li>
  <li><strong>More-than ogive:</strong> Plot cumulative frequencies against lower class limits — curve falls from left to right.</li>
  <li>The <strong>median</strong> can be found from the point where the two ogives intersect, or by drawing a horizontal line from n/2 on the y-axis to the less-than ogive and reading the x-coordinate.</li>
</ul>
`
},

// ════════════════════════════════════════════════════════════
// 12. PROBABILITY (Chapter 14)
// ════════════════════════════════════════════════════════════
{
  slug: "probability-class-10-maths-ncert-notes",
  title: "Probability – Class 10 Maths Chapter 14: Theoretical Probability & Solved Examples",
  metaDescription: "Class 10 Probability notes: theoretical probability, sample space, events, dice and card problems, complementary events for CBSE & ICSE.",
  subject: "Mathematics",
  targetClass: "10",
  board: "CBSE & ICSE",
  resourceType: "topic_guide",
  chapter: "Probability",
  keywords: ["probability class 10", "theoretical probability", "sample space", "dice problems", "playing cards probability", "complementary events", "NCERT maths", "CBSE", "ICSE"],
  published: true,
  content: `
<h2>Chapter 14: Probability</h2>

<h3>14.1 Theoretical (Classical) Probability</h3>
<div class="formula-callout">
<strong>P(E) = Number of outcomes favourable to event E / Total number of equally likely outcomes</strong><br/><br/>
<strong>0 ≤ P(E) ≤ 1</strong> for any event E<br/>
P(sure event) = 1 &nbsp;&nbsp;&nbsp; P(impossible event) = 0
</div>

<h3>14.2 Key Terms</h3>
<ul>
  <li><strong>Experiment:</strong> An action that produces well-defined outcomes (e.g., tossing a coin, rolling a die).</li>
  <li><strong>Sample Space:</strong> The set of all possible outcomes. For a die: S = {1, 2, 3, 4, 5, 6}.</li>
  <li><strong>Event:</strong> A subset of the sample space. E.g., "getting an even number" = {2, 4, 6}.</li>
  <li><strong>Complementary Event:</strong> If E is an event, then Ē (not E) is the complementary event.</li>
</ul>

<div class="formula-callout">
<strong>P(E) + P(Ē) = 1</strong><br/>
Therefore: <strong>P(Ē) = 1 − P(E)</strong><br/><br/>
This is very useful when it's easier to calculate the probability of the event NOT happening.
</div>

<h3>14.3 Common Probability Problems</h3>

<h4>Tossing Coins</h4>
<ul>
  <li>1 coin: Sample space = {H, T}, total outcomes = 2</li>
  <li>2 coins: Sample space = {HH, HT, TH, TT}, total outcomes = 4</li>
  <li>3 coins: Total outcomes = 8</li>
  <li>n coins: Total outcomes = 2ⁿ</li>
</ul>

<h4>Rolling Dice</h4>
<ul>
  <li>1 die: Total outcomes = 6</li>
  <li>2 dice: Total outcomes = 36</li>
  <li>P(sum = 7 on two dice) = 6/36 = 1/6 (the most likely sum)</li>
</ul>

<h4>Playing Cards (Standard Deck of 52)</h4>
<ul>
  <li>4 suits: Spades ♠ (13), Hearts ♥ (13), Diamonds ♦ (13), Clubs ♣ (13)</li>
  <li>Red cards: Hearts + Diamonds = 26; Black cards: Spades + Clubs = 26</li>
  <li>Face cards: Jack, Queen, King = 4 × 3 = 12 total</li>
  <li>Aces: 4 total (one per suit)</li>
</ul>

<h3>14.4 Solved Examples</h3>

<h4>Example 1: A bag contains 3 red, 5 blue, and 2 green balls. A ball is drawn at random. Find P(not green).</h4>
<p><span class="answer-badge">Solution</span></p>
<p>Total balls = 3 + 5 + 2 = 10</p>
<p>P(green) = 2/10 = 1/5</p>
<p>P(not green) = 1 − 1/5 = <strong>4/5</strong></p>

<h4>Example 2: Two dice are thrown simultaneously. Find the probability that the sum is greater than 10.</h4>
<p><span class="answer-badge">Solution</span></p>
<p>Total outcomes = 36</p>
<p>Favourable outcomes (sum > 10): (5,6), (6,5), (6,6) → sum=11 or 12</p>
<p>Number of favourable outcomes = 3</p>
<p>P(sum > 10) = 3/36 = <strong>1/12</strong></p>

<h4>Example 3: A card is drawn from a well-shuffled deck. Find P(face card).</h4>
<p><span class="answer-badge">Solution</span></p>
<p>Total cards = 52, Face cards = 12 (4 Jacks + 4 Queens + 4 Kings)</p>
<p>P(face card) = 12/52 = <strong>3/13</strong></p>
`
},

// ════════════════════════════════════════════════════════════
// 13. AREAS RELATED TO CIRCLES (Chapter 11)
// ════════════════════════════════════════════════════════════
{
  slug: "areas-related-to-circles-class-10-maths-ncert-notes",
  title: "Areas Related to Circles – Class 10 Maths Chapter 11: Sector, Segment & Formulas",
  metaDescription: "Class 10 Areas Related to Circles: circumference, area, sector, segment, combined figure problems with formulas for CBSE & ICSE boards.",
  subject: "Mathematics",
  targetClass: "10",
  board: "CBSE & ICSE",
  resourceType: "topic_guide",
  chapter: "Areas Related to Circles",
  keywords: ["areas related to circles class 10", "sector area", "segment area", "arc length", "circumference", "NCERT maths", "CBSE", "ICSE", "shaded region"],
  published: true,
  content: `
<h2>Chapter 11: Areas Related to Circles</h2>

<h3>11.1 Basic Formulas</h3>
<div class="formula-callout">
<strong>Circumference of circle = 2πr</strong><br/>
<strong>Area of circle = πr²</strong><br/><br/>
Where r = radius. Use π = 22/7 or 3.14 as specified.
</div>

<h3>11.2 Sector of a Circle</h3>
<p>A <strong>sector</strong> is the region enclosed between two radii and the corresponding arc.</p>
<div class="formula-callout">
<strong>Length of arc = (θ/360°) × 2πr</strong><br/>
<strong>Area of sector = (θ/360°) × πr²</strong><br/><br/>
Where θ is the angle of the sector at the centre.
</div>

<h3>11.3 Segment of a Circle</h3>
<p>A <strong>segment</strong> is the region between a chord and the corresponding arc.</p>
<div class="formula-callout">
<strong>Area of minor segment = Area of sector − Area of triangle</strong><br/>
<strong>Area of major segment = Area of circle − Area of minor segment</strong>
</div>

<h3>11.4 Solved Examples</h3>

<h4>Example 1: Find the area of a sector of a circle with radius 6 cm if the angle of the sector is 60°.</h4>
<p><span class="answer-badge">Solution</span></p>
<p>Area = (60/360) × π × 6² = (1/6) × 22/7 × 36 = 132/7 = <strong>18.86 cm²</strong></p>

<h4>Example 2: A chord subtends an angle of 90° at the centre of a circle of radius 14 cm. Find the area of the minor segment.</h4>
<p><span class="answer-badge">Solution</span></p>
<p>Area of sector = (90/360) × (22/7) × 14² = (1/4) × (22/7) × 196 = 154 cm²</p>
<p>Area of triangle = (1/2) × 14 × 14 = 98 cm²</p>
<p>Area of minor segment = 154 − 98 = <strong>56 cm²</strong></p>

<div class="concept-callout">
<strong>Board Exam Tip — Shaded Region Problems:</strong><br/>
Many exam questions ask for the area of a "shaded region" formed by combinations of circles, semicircles, and quadrants.<br/><br/>
<strong>Strategy:</strong> Area of shaded region = Area of larger figure − Area of unshaded parts (or sum of simpler areas that make up the shaded region).
</div>
`
},

]; // end of resources array

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
