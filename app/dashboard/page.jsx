"use client";
import { useEffect, useState } from "react";
export const metadata = {
  robots: "noindex, nofollow",
};
export default function Dashboard() {
  const [materials, setMaterials] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");

  useEffect(() => {
    fetch("/api/material")
      .then(res => res.json())
      .then(data => setMaterials(data.materials));
  }, []);

  const filteredMaterials = selectedClass
    ? materials.filter(m => m.class === selectedClass)
    : materials;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-orange-100 to-orange-300">
      
      <h1 className="text-2xl font-bold mb-4">📚 Student Dashboard</h1>

      {/* 🔽 Class Filter */}
      <select
        className="mb-6 p-2 rounded border"
        onChange={(e) => setSelectedClass(e.target.value)}
      >
        <option value="">All Classes</option>
        <option value="10">Class 10</option>
        <option value="11">Class 11</option>
        <option value="12">Class 12</option>
      </select>

      {/* 📄 Materials */}
      <div className="space-y-4">
        {filteredMaterials.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-semibold">{item.title}</h2>

            <a
              href={item.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Open PDF
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}