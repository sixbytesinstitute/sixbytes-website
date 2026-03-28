export const metadata = {
title: "Contact | SixBytes Educational Institute",
description:
"Contact SixBytes Educational Institute for admissions, demo classes and course information.",
}

export default function Contact() {

return (

<div className="min-h-screen bg-gray-50 py-16 px-6">

<h1 className="text-4xl font-bold text-center mb-12">
Contact Us
</h1>

<div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">

<p className="mb-4 text-lg">
📍 Address:
<br/>
SixBytes Educational Institute
<br/>
opp Lane no. 3 Sai Vihar Shyampur Premnagar Dehradun
</p>

<p className="mb-4 text-lg">
📞 Phone:
<br/>
+91 7536839760
</p>

<p className="mb-6 text-lg">
💬 WhatsApp:
</p>

<a
href="https://wa.me/917536839760"
className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600"
>
Chat on WhatsApp
</a>

</div>

</div>



)

}

