export default function AboutPage() {
  return (
    <main>

      {/* ================= HERO SECTION ================= */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20 px-6 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          About SixBytes Educational Institute
        </h1>
        <p className="text-white/80 text-sm md:text-lg">
          Shaping Future Leaders through Quality Education
        </p>
      </section>


      {/* ================= WHO WE ARE ================= */}
      <section className="py-20 px-6 bg-gray-50">

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT CONTENT */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Who We Are
            </h2>

            <p className="text-gray-600 mb-4 leading-relaxed">
              SixBytes Educational Institute is one of the best coaching institutes in Premnagar, Dehradun, providing high-quality education for students from Class 9 to 12.
            </p>

            <p className="text-gray-600 mb-4 leading-relaxed">
              We specialize in building strong concepts in Maths, Science, and competitive exam preparation including NDA, RMS, RIMC, and Sainik School.
            </p>

            <p className="text-gray-600 leading-relaxed">
              Our goal is to provide personalized attention through small batch sizes, experienced faculty, and regular performance tracking.
            </p>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">

              <div className="bg-white shadow rounded-lg p-4 text-center">
                <h4 className="text-orange-500 font-bold text-xl">1200+</h4>
                <p className="text-sm text-gray-600">Students</p>
              </div>

              <div className="bg-white shadow rounded-lg p-4 text-center">
                <h4 className="text-orange-500 font-bold text-xl">8+ Years</h4>
                <p className="text-sm text-gray-600">Experience</p>
              </div>

            </div>
          </div>


          {/* RIGHT SIDE CARD */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-2xl p-8 shadow-xl">

            <h3 className="text-2xl font-semibold mb-4">
              Why Choose Us 🎯
            </h3>

            <ul className="space-y-3 text-sm md:text-base">
              <li>✅ Expert Faculty with experience</li>
              <li>✅ Small batch size for personal attention</li>
              <li>✅ Weekly tests & performance tracking</li>
              <li>✅ NDA, RMS & Sainik School preparation</li>
            </ul>

            <button className="mt-6 bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold transition">
              Book Free Demo
            </button>

          </div>

        </div>

      </section>


      {/* ================= SEO SECTION ================= */}
      <section className="py-16 px-6 bg-white text-center">

        <div className="max-w-4xl mx-auto">

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Best Coaching Institute in Premnagar, Dehradun
          </h2>

          <p className="text-gray-600 leading-relaxed">
            If you are searching for the best coaching institute in Premnagar Dehradun for Class 9–12, NDA, RMS, or Sainik School preparation, SixBytes Educational Institute is your trusted destination. 
            We focus on concept clarity, regular testing, and personalized mentorship to ensure excellent results.
          </p>

        </div>

      </section>


      {/* ================= CTA ================= */}
      <section className="py-16 px-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center">

        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Join SixBytes Today 🚀
        </h2>

        <p className="mb-6">
          Start your journey towards academic excellence with expert guidance.
        </p>

        <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
          Book Free Demo
        </button>

      </section>

    </main>
  );
}