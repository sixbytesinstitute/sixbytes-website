export default function About() {
  return (
    <main>

      {/* PAGE HEADER */}

      <section className="bg-[#0f172a] text-white text-center py-16">

        <h1 className="text-4xl font-bold">
          About SixBytes Educational Institute
        </h1>

        <p className="mt-4 text-gray-300">
          Shaping Future Leaders through Quality Education
        </p>

      </section>


      {/* ABOUT SECTION */}

      <section className="max-w-5xl mx-auto py-16 px-6">

        <h2 className="text-3xl font-bold mb-6 text-[#0f172a]">
          Who We Are
        </h2>

        <p className="text-gray-600 leading-relaxed mb-6">
          SixBytes Educational Institute is dedicated to providing high-quality
          education for students from Class 9 to 12 and defence aspirants
          preparing for NDA, RIMC, RMS, and Sainik School examinations.
        </p>

        <p className="text-gray-600 leading-relaxed">
          Our mission is to build strong academic foundations through
          concept-based learning, experienced teachers, and regular testing.
          We focus on small batch sizes so every student gets personal
          attention and guidance.
        </p>

      </section>


      {/* WHY CHOOSE US */}

      <section className="bg-gray-50 py-16 px-6">

        <h2 className="text-3xl font-bold text-center mb-12 text-[#0f172a]">
          Why Choose Us
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">

          <div className="p-6 bg-white rounded-xl shadow">
            <h3 className="font-bold text-lg mb-2">
              Expert Teachers
            </h3>
            <p className="text-gray-500">
              Experienced faculty focused on conceptual clarity.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow">
            <h3 className="font-bold text-lg mb-2">
              Small Batches
            </h3>
            <p className="text-gray-500">
              Personal attention for every student.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow">
            <h3 className="font-bold text-lg mb-2">
              Weekly Tests
            </h3>
            <p className="text-gray-500">
              Regular assessment to track student progress.
            </p>
          </div>

        </div>

      </section>



      {/* CALL TO ACTION */}

      <section className="text-center py-20">

        <h2 className="text-3xl font-bold text-[#0f172a]">
          Start Your Journey With Us
        </h2>

        <p className="text-gray-500 mt-4">
          Book a free demo class today and experience the difference.
        </p>

        <a
          href="https://wa.me/917536839760"
          className="inline-block mt-6 bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600"
        >
          Book Free Demo
        </a>

      </section>

    </main>
  )
}