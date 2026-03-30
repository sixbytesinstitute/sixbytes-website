"use client";

import { useState } from "react";
export const metadata = {
  robots: "noindex, nofollow",
};
export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [className, setClassName] = useState("");
  const [loading, setLoading] = useState(false);
  const [successUrl, setSuccessUrl] = useState("");

  const handleUpload = async () => {
    if (!file || !title || !className) {
      return alert("Please fill all fields ⚠️");
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // ✅ STEP 1: Upload to Cloudinary
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        alert("Upload failed ❌");
        setLoading(false);
        return;
      }

      // ✅ STEP 2: Save to MongoDB
      await fetch("/api/material", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          fileUrl: data.url,
          class: className,
        }),
      });

      setSuccessUrl(data.url);
      alert("Uploaded & Saved Successfully ✅");

      // reset
      setFile(null);
      setTitle("");
      setClassName("");

    } catch (error) {
      console.error(error);
      alert("Something went wrong ❌");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600 p-4">
      
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">

        <h2 className="text-2xl font-bold text-center mb-6">
          📤 Upload Study Material
        </h2>

        {/* Title */}
        <input
          type="text"
          placeholder="Enter Title (e.g. Physics Notes)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
        />

        {/* Class */}
        <input
          type="text"
          placeholder="Enter Class (e.g. 10)"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
        />

        {/* File */}
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full mb-4"
        />

        {/* Button */}
        <button
          onClick={handleUpload}
          className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition duration-300"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        {/* Success */}
        {successUrl && (
          <div className="mt-4 text-center">
            <p className="text-green-600 font-medium">
              Uploaded Successfully 🎉
            </p>
            <a
              href={successUrl}
              target="_blank"
              className="text-blue-500 underline"
            >
              View File
            </a>
          </div>
        )}

      </div>
    </div>
  );
}