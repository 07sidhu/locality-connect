"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("");

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Checking credentials...");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus("Success! Entering Society...");
      
      // ✅ SMART REDIRECT LOGIC
      if (data.role === "ADMIN") {
        setTimeout(() => router.push("/admin"), 1500); // Admins go to Admin Panel
      } else {
        setTimeout(() => router.push("/dashboard"), 1500); // Residents go to Dashboard
      }
      
    } else {
      setStatus("Error: " + data.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Resident Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm">{status}</p>
        <div className="mt-4 text-center text-sm">
          <Link href="/register" className="text-blue-500 hover:underline">
            New here? Register
          </Link>
        </div>
      </div>
    </div>
  );
}