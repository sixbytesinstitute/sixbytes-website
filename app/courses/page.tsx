export const metadata = {
  title: "Courses | SixBytes Educational Institute",
  description:
    "Explore coaching courses at SixBytes Educational Institute including Class 9–12, NDA, RIMC, RMS and Sainik School preparation.",
}
export default function Courses() {

return (

<div className="bg-gray-50 min-h-screen py-16 px-6">

<h1 className="text-4xl font-bold text-center mb-12">
Our Courses
</h1>

<div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

{/* Course 1 */}
<div className="bg-white shadow-lg rounded-xl p-6 hover:scale-105 transition">

<h2 className="text-2xl font-bold mb-3 text-orange-500">
Class 9–10 Foundation
</h2>

<p className="text-gray-600 mb-4">
Strong foundation in Maths and Science for board exams.
</p>

<ul className="text-gray-600 mb-6 space-y-1">
<li>✔ Concept based learning</li>
<li>✔ Weekly tests</li>
<li>✔ Doubt sessions</li>
</ul>

<a
href="https://wa.me/917536839760"
className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
>
Book Demo
</a>

</div>


{/* Course 2 */}
<div className="bg-white shadow-lg rounded-xl p-6 hover:scale-105 transition">

<h2 className="text-2xl font-bold mb-3 text-orange-500">
Class 11–12 Board
</h2>

<p className="text-gray-600 mb-4">
Complete board exam preparation with test series.
</p>

<ul className="text-gray-600 mb-6 space-y-1">
<li>✔ Physics</li>
<li>✔ Chemistry</li>
<li>✔ Maths</li>
<li>✔ Weekly mock tests</li>
</ul>

<a
href="https://wa.me/91YOURNUMBER"
className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
>
Book Demo
</a>

</div>


{/* Course 3 */}
<div className="bg-white shadow-lg rounded-xl p-6 hover:scale-105 transition">

<h2 className="text-2xl font-bold mb-3 text-orange-500">
NDA / CDS Preparation
</h2>

<p className="text-gray-600 mb-4">
Complete defence exam preparation with strategy.
</p>

<ul className="text-gray-600 mb-6 space-y-1">
<li>✔ Maths</li>
<li>✔ General Ability</li>
<li>✔ Mock tests</li>
<li>✔ Interview guidance</li>
</ul>

<a
href="https://wa.me/91YOURNUMBER"
className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
>
Book Demo
</a>

</div>

</div>

</div>

)

}