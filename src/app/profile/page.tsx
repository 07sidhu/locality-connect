"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ✅ 1. Define the User Type (No more 'any')
interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: "ADMIN" | "RESIDENT" | "GUARD";
  flatNumber: string;
  isVerified: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  
  // ✅ 2. Use the Type here
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        
        if (data.user) {
          setUser(data.user);
        } else {
          router.push("/login"); // Not logged in
        }
      } catch (e) {
        console.error("Error fetching profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Profile...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 max-w-md mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
            {user.role === "ADMIN" ? "⚡" : "👤"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
            <span className={`text-xs px-2 py-1 rounded font-bold ${
              user.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
            }`}>
              {user.role}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border-b pb-2">
            <label className="text-xs text-gray-500 uppercase font-bold">Email</label>
            <p className="text-gray-700">{user.email}</p>
          </div>
          
          <div className="border-b pb-2">
            <label className="text-xs text-gray-500 uppercase font-bold">Location</label>
            <p className="text-gray-700">
              {user.role === "ADMIN" ? "Management Office" : `Flat ${user.flatNumber}`}
            </p>
          </div>

          <div className="border-b pb-2">
            <label className="text-xs text-gray-500 uppercase font-bold">Account Status</label>
            <p className="text-green-600 font-medium">
              {user.isVerified ? "✅ Verified" : "⏳ Pending"}
            </p>
          </div>
        </div>
      </div>
      
      <div className="max-w-md mx-auto">
        <button 
          onClick={() => {
              document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
              window.location.href = "/login";
          }}
          className="w-full bg-red-50 text-red-600 py-3 rounded-lg font-bold border border-red-200 hover:bg-red-100 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}