"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export const metadata = {
  robots: "noindex, nofollow",
};
export default function Dashboard() {
  const router = useRouter();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.push("/admin");
    } else {
      fetchStudents();
    }
  }, []);

  const fetchStudents = async () => {
    const res = await fetch("/api/students");
    const data = await res.json();
    setStudents(data.students);
  };

  const deleteStudent = async (id) => {
    await fetch(`/api/students/${id}`, {
      method: "DELETE",
    });

    fetchStudents();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>

      {students.map((s) => (
        <div key={s._id} style={{ border: "1px solid", margin: 10 }}>
          <p>Name: {s.name}</p>
          <p>Email: {s.email}</p>
          <p>Class: {s.class}</p>

          <button onClick={() => deleteStudent(s._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}