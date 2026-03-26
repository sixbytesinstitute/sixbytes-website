"use client"

import { useState, useEffect } from "react"

import { useRouter } from "next/navigation"
export default function AdminPage() {
const router = useRouter()

useEffect(()=>{

const auth = localStorage.getItem("adminAuth")

if(auth !== "true"){

router.push("/admin-login")

}

},[])



  const [students, setStudents] = useState<any[]>([])
  const [name, setName] = useState("")
  const [studentId, setStudentId] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    const storedStudents = JSON.parse(localStorage.getItem("students") || "[]")
    setStudents(storedStudents)
  }, [])

  const addStudent = () => {

    if (!name || !studentId || !password) {
      alert("Please fill all fields")
      return
    }

    const newStudent = { name, studentId, password }

    const storedStudents = JSON.parse(localStorage.getItem("students") || "[]")

    storedStudents.push(newStudent)

    localStorage.setItem("students", JSON.stringify(storedStudents))

    setStudents(storedStudents)

    setName("")
    setStudentId("")
    setPassword("")
  }

  return (

    <main className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        Admin Panel
      </h1>

      <div className="border p-6 rounded w-96 mb-8">

        <h2 className="text-xl font-semibold mb-4">
          Add Student
        </h2>

        <input
          type="text"
          placeholder="Student Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          className="border p-2 w-full mb-3"
        />

        <input
          type="text"
          placeholder="Student ID"
          value={studentId}
          onChange={(e)=>setStudentId(e.target.value)}
          className="border p-2 w-full mb-3"
        />

        <input
          type="text"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="border p-2 w-full mb-3"
        />

        <button
          onClick={addStudent}
          className="glow-button inline-block mt-10 px-10 py-4 text-lg font-semibold rounded-xl bg-orange-500 hover:bg-orange-600 transition"
        >
          Add Student
        </button>

      </div>

      <h2 className="text-xl font-semibold mb-4">
        Students
      </h2>

      <div className="space-y-3">

        {students.map((s, index) => (

          <div key={index} className="border p-3 rounded">

            <p><b>Name:</b> {s.name}</p>
            <p><b>ID:</b> {s.studentId}</p>
            <p><b>Password:</b> {s.password}</p>

          </div>

        ))}

      </div>

    </main>
  )
}