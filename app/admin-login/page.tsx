"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLogin() {

const router = useRouter()
const [password, setPassword] = useState("")

const ADMIN_PASSWORD = "sixbytesadmin"

function handleLogin(){

if(password === ADMIN_PASSWORD){

localStorage.setItem("adminAuth","true")

router.push("/admin")

}else{

alert("Incorrect password")

}

}

return (

<div className="flex items-center justify-center h-screen bg-gray-100">

<div className="bg-white p-8 rounded-lg shadow-lg w-80">

<h2 className="text-2xl font-bold mb-6 text-center">
Admin Login
</h2>

<input
type="password"
placeholder="Enter Admin Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="border w-full p-2 rounded mb-4"
/>

<button
onClick={handleLogin}
className="bg-orange-500 text-white w-full py-2 rounded hover:bg-orange-600"
>
Login
</button>

</div>

</div>

)

}