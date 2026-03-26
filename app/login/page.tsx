"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Login(){

const router = useRouter()
const [username,setUsername] = useState("")
const [password,setPassword] = useState("")

function handleLogin(){

if(username === "student" && password === "1234"){

localStorage.setItem("studentAuth","true")

window.location.href="/dashboard"

}else{

alert("Invalid credentials")

}

}

return(

<div className="min-h-screen flex items-center justify-center bg-gray-100">

<div className="bg-white p-8 rounded-xl shadow-md w-80">

<h1 className="text-2xl font-bold mb-6 text-center">
Student Login
</h1>

<input
type="text"
placeholder="Username"
className="w-full border p-2 mb-4 rounded"
onChange={(e)=>setUsername(e.target.value)}
/>

<input
type="password"
placeholder="Password"
className="w-full border p-2 mb-4 rounded"
onChange={(e)=>setPassword(e.target.value)}
/>

<button
onClick={handleLogin}
className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
>
Login
</button>

</div>

</div>

)

}