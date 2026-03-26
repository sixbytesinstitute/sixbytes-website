"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Dashboard(){

const router = useRouter()

useEffect(()=>{

const auth = localStorage.getItem("studentAuth")

if(auth !== "true"){

router.push("/login")

}

},[])

return(

<div className="min-h-screen p-10">

<h1 className="text-3xl font-bold mb-6">
Student Dashboard
</h1>

<p>Welcome to your dashboard.</p>

<button
onClick={()=>{
localStorage.removeItem("studentAuth")
window.location.href="/login"
}}
className="bg-red-500 text-white px-4 py-2 rounded mt-6"
>
Logout
</button>

</div>

)

}