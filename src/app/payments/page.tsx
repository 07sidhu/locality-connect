"use client"; // <--- THIS IS THE MISSING MAGIC LINE

import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="font-bold">Resident Details</h2>
        <p className="text-gray-600">Resident (Flat 101)</p>
      </div>
      
      <button 
        onClick={() => {
            // Delete the cookie
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            router.push("/login");
        }}
        className="w-full bg-red-100 text-red-600 py-3 rounded-lg font-bold"
      >
        Logout
      </button>
    </div>
  );
}