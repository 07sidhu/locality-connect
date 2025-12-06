"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminSignup() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    adminKey: "", // <--- New Field
    societyId: "6931a095e68baacfab9739f2", // Hardcoded for now
  });
  
  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Verifying Secret Key...");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          role: "ADMIN", // Force Role
          flatNumber: "Management Office"
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("Success! Redirecting to Login...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setStatus("Error: " + data.message);
      }
    } catch (error) {
      setStatus("Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl border-t-4 border-blue-600">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Society Admin Registration
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Secure access for Management only.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            onChange={handleChange}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          
          <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
            <label className="block text-xs font-bold text-yellow-800 mb-1 uppercase tracking-wide">
              Security Clearance
            </label>
            <input
              name="adminKey"
              type="password"
              placeholder="Enter Secret Key"
              onChange={handleChange}
              className="w-full p-2 border rounded bg-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition"
          >
            Create Admin Account
          </button>
        </form>

        {status && (
          <p className={`mt-4 text-center text-sm ${status.includes("Success") ? "text-green-600" : "text-red-600"}`}>
            {status}
          </p>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          Not an admin? <Link href="/register" className="text-blue-600 underline">Register as Resident</Link>
        </div>
      </div>
    </div>
  );
}