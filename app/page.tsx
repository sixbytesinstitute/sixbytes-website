"use client"

import { motion } from "framer-motion"
import CountUp from "react-countup"
export default function Home() {

return(

<div className="bg-gray-50">


{/* HERO SECTION */}


    <section
      className="relative h-screen flex items-center justify-center text-center text-white bg-cover bg-center"
      style={{ backgroundImage: "url('/hero.jpg')" }}
    >

      {/* 🔥 Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80"></div>

      {/* 🔥 Glow Effects */}
      <div className="absolute w-72 h-72 bg-orange-500/30 blur-3xl rounded-full top-20 left-20 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-blue-500/30 blur-3xl rounded-full bottom-20 right-20 animate-pulse"></div>

      {/* 🔥 Content */}
      <div className="relative z-10 flex flex-col items-center px-6">

        {/* Logo */}
        <img
          src="/logo.png"
          className="w-14 mb-6 animate-bounce drop-shadow-lg"
        />

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
          SixBytes Educational Institute
        </h1>

        {/* Subtitle */}
        <p className="text-gray-200 tracking-wider mb-10">
          Classes 9–12 | NDA | RMS | Sainik School
        </p>

        {/* 🔥 Stats Section */}
        <div className="flex gap-8 md:gap-16 text-center mb-16">

          <div className="hover:scale-110 transition duration-300">
            <h2 className="text-3xl md:text-4xl font-bold text-orange-400">
              <CountUp end={1200} duration={3} />+
            </h2>
            <p className="text-gray-300">Students</p>
          </div>

          <div className="hover:scale-110 transition duration-300">
            <h2 className="text-3xl md:text-4xl font-bold text-orange-400">
              <CountUp end={350} duration={3} />+
            </h2>
            <p className="text-gray-300">Results</p>
          </div>

          <div className="hover:scale-110 transition duration-300">
            <h2 className="text-3xl md:text-4xl font-bold text-orange-400">
              <CountUp end={8} duration={3} />+
            </h2>
            <p className="text-gray-300">Years</p>
          </div>

        </div>

        {/* 🔥 CTA Button */}
        <a
          href="/contact"
          className="px-10 py-4 text-lg font-semibold text-white 
          bg-gradient-to-r from-orange-500 to-orange-400 
          rounded-xl shadow-lg shadow-orange-500/40
          hover:scale-110 hover:shadow-orange-500/70
          transition duration-300 animate-pulse"
        >
          Book Free Demo
        </a>

      </div>
    </section>
{/* COURSES */}


<section className="py-20 px-6 max-w-6xl mx-auto">

<h2 className="text-4xl font-bold text-center mb-12">
  
Our Courses
</h2>

<div className="grid md:grid-cols-3 gap-10">

<motion.div
whileHover={{scale:1.08}}
className="bg-white p-8 rounded-xl shadow-lg text-center"
>
<h3 className="text-2xl font-bold mb-3">Class 9–10</h3>
<p className="text-gray-600">
Strong foundation in Maths & Science
</p>
</motion.div>


<motion.div
whileHover={{scale:1.08}}
className="bg-white p-8 rounded-xl shadow-lg text-center"
>
<h3 className="text-2xl font-bold mb-3">Class 11–12</h3>
<p className="text-gray-600">
Board exam preparation with weekly tests
</p>
</motion.div>


<motion.div
whileHover={{scale:1.08}}
className="bg-white p-8 rounded-xl shadow-lg text-center"
>
<h3 className="text-2xl font-bold mb-3">NDA</h3>
<p className="text-gray-600">
Complete defence exam preparation
</p>
</motion.div>

</div>

</section>
<div className="w-24 h-1 bg-orange-500 mx-auto my-16 rounded"></div>

{/* RESULTS */}

<section className="bg-white py-20">
  

<h2 className="text-4xl font-bold text-center mb-12">
Our Top Results
</h2>

<div className="backdrop-blur-md bg-white/70 border border-white/30 p-8 rounded-2xl shadow-xl hover:scale-105 transition">

<motion.div
whileHover={{scale:1.05}}
className="bg-gray-50 p-8 rounded-xl shadow text-center"
>

<img
src="/topper1.jpg"
className="w-24 h-24 rounded-full mx-auto mb-4"
/>

<h3 className="text-xl font-bold">Ishant Bisht</h3>

<p className="text-gray-600">Class 10</p>

<p className="text-orange-500 text-3xl font-bold">94%</p>

</motion.div>


<motion.div
whileHover={{scale:1.05}}
className="bg-gray-50 p-8 rounded-xl shadow text-center"
>

<img
src="/topper2.jpg"
className="w-24 h-24 rounded-full mx-auto mb-4"
/>

<h3 className="text-xl font-bold">Anshika Baluni</h3>

<p className="text-gray-600">Class 12</p>

<p className="text-orange-500 text-3xl font-bold">92%</p>

</motion.div>

</div>

</section>
<div className="backdrop-blur-md bg-white/70 border border-white/30 p-8 rounded-2xl shadow-xl hover:scale-105 transition"></div>

<section className="py-20 bg-gray-50">

  {/* Heading */}
  <h2 className="text-4xl font-bold text-center mb-4">
    What Parents Say
  </h2>

  <p className="text-center text-gray-500 mb-12">
    Real feedback from our students and parents
  </p>

  {/* Testimonials Grid */}
  <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">

    {/* Card 1 */}
    <div className="bg-white p-8 rounded-2xl shadow-xl hover:scale-105 transition duration-300">
      
      <p className="text-yellow-500 mb-3 text-lg">
        ★★★★★
      </p>

      <p className="text-gray-600 mb-4">
        "My son improved from 65% to 92%. Teachers are very supportive and tests helped a lot."
      </p>

      <h3 className="font-semibold text-gray-800">
        Mr Suresh Chauhan
      </h3>

    </div>

    {/* Card 2 */}
    <div className="bg-white p-8 rounded-2xl shadow-xl hover:scale-105 transition duration-300">
      
      <p className="text-yellow-500 mb-3 text-lg">
        ★★★★★
      </p>

      <p className="text-gray-600 mb-4">
        "Best coaching institute in the area. Weekly tests improved my daughter's confidence."
      </p>

      <h3 className="font-semibold text-gray-800">
        Mr Bisht
      </h3>

    </div>

    {/* Card 3 */}
    <div className="bg-white p-8 rounded-2xl shadow-xl hover:scale-105 transition duration-300">
      
      <p className="text-yellow-500 mb-3 text-lg">
        ★★★★★
      </p>

      <p className="text-gray-600 mb-4">
        "Excellent NDA preparation. Discipline and guidance are top level."
      </p>

      <h3 className="font-semibold text-gray-800">
        Mrs. Sharma
      </h3>

    </div>

  </div>

</section>

{/* CALL TO ACTION */}

<section className="py-20 text-center bg-orange-500 text-white">

<motion.div
initial={{opacity:0}}
whileInView={{opacity:1}}
transition={{duration:1}}
>

<h2 className="text-4xl font-bold mb-4">
Join SixBytes Today
</h2>

<p className="mb-6">
Limited seats available for new batch
</p>

<a
href="/contact"
className="bg-white text-orange-500 px-8 py-3 rounded-lg font-semibold hover:scale-110 transition"
>
Contact Us
</a>

</motion.div>

</section>

</div>

)

}