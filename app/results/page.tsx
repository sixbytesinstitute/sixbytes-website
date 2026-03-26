export default function Results() {
  return (

    <div className="min-h-screen bg-gray-50 py-16 px-6">

      <h1 className="text-4xl font-bold text-center mb-12">
        Our Top Performers
      </h1>

      <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">

        {/* Topper 1 */}
        <div className="bg-white shadow-lg rounded-xl p-6 text-center hover:scale-105 transition">

          <img
            src="/topper1.jpg"
            alt="Class 10 Topper"
            className="w-28 h-28 rounded-full mx-auto mb-4 object-cover border-4 border-orange-500"
          />

          <h2 className="text-xl font-bold">Ishant Bisht</h2>

          <p className="text-gray-500">Class 10 Board</p>

          <p className="text-orange-500 text-3xl font-bold mt-2">
            94%
          </p>

        </div>


        {/* Topper 2 */}
        <div className="bg-white shadow-lg rounded-xl p-6 text-center hover:scale-105 transition">

          <img
            src="/topper2.jpg"
            alt="Class 12 Topper"
            className="w-28 h-28 rounded-full mx-auto mb-4 object-cover border-4 border-orange-500"
          />

          <h2 className="text-xl font-bold">Anshika Baluni</h2>

          <p className="text-gray-500">Class 12 Science</p>

          <p className="text-orange-500 text-3xl font-bold mt-2">
            94%
          </p>

        </div>
        {/* Topper 3 */}
        <div className="bg-white shadow-lg rounded-xl p-6 text-center hover:scale-105 transition">

          <img
            src="/Student1.jpg"
            alt="Class 12 Topper"
            className="w-28 h-28 rounded-full mx-auto mb-4 object-cover border-4 border-orange-500"
          />

          <h2 className="text-xl font-bold">Shray Sundly</h2>

          <p className="text-gray-500">Class 12 Science</p>

          <p className="text-orange-500 text-3xl font-bold mt-2">
            87%
          </p>

        </div>
        {/* Topper 4 */}
        <div className="bg-white shadow-lg rounded-xl p-6 text-center hover:scale-105 transition">

          <img
            src="/Student2.jpg"
            alt="Class 12 Topper"
            className="w-28 h-28 rounded-full mx-auto mb-4 object-cover border-4 border-orange-500"
          />

          <h2 className="text-xl font-bold">Shubham Bisht</h2>

          <p className="text-gray-500">Class 12 Science</p>

          <p className="text-orange-500 text-3xl font-bold mt-2">
            94%
          </p>

        </div>

      </div>

    </div>
    

  )
}