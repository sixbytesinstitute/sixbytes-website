export default function ContactPage() {
  return (
    <section className="py-20 px-6 bg-gray-50 min-h-screen">

      {/* Heading */}
      <h1 className="text-3xl md:text-5xl font-bold text-center mb-12">
        Contact Us
      </h1>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

        {/* LEFT SIDE - DETAILS */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">

          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Get in Touch 
          </h2>

          {/* Address */}
          <p className="mb-4 text-gray-700">
            <strong>Address:</strong><br />
            SixBytes Educational Institute<br />
            Opp Lane no. 3 Sai Vihar Shyampur,<br />
            Premnagar, Dehradun
          </p>

          {/* Phone */}
          <p className="mb-4 text-gray-700">
             <strong>Phone:</strong><br />
            <a href="tel:+917536839760" className="text-orange-500">
              +91 7536839760
            </a>
          </p>

          {/* WhatsApp */}
          <p className="mb-6 text-gray-700">
            💬 <strong>WhatsApp:</strong>
          </p>

          <a
            href="https://wa.me/917536839760"
            target="_blank"
            className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg mb-6 transition"
          >
            Chat on WhatsApp
          </a>

          {/* Instagram */}
          <p className="mb-2 text-gray-700">
            📸 <strong>Instagram:</strong>
          </p>

          <a
            href="https://instagram.com/sixbytes"
            target="_blank"
            className="inline-block bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-2 rounded-lg transition hover:scale-105"
          >
            Follow on Instagram
          </a>

        </div>

        {/* RIGHT SIDE - MAP */}
        <div className="rounded-2xl overflow-hidden shadow-lg border">

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3443.8540051474743!2d77.9320947754021!3d30.326670274782657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39092b56ccad2f27%3A0x2b0ae3d4359a4853!2sSixBytes%20Educational%20Institute!5e0!3m2!1sen!2sin!4v1774718605519!5m2!1sen!2sin"
            width="100%"
            height="100%"
            className="min-h-[400px]"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>

        </div>

      </div>

    </section>
  );
}