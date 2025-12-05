"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    flatNumber: "",
    role: "RESIDENT",
    // 👇 PASTE THE ID YOU COPIED FROM COMPASS HERE 👇
    societyId: "6931a095e68baacfab9739f2", 
  });
  
  const [status, setStatus] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Registering...");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("Success! Redirecting...");
        setTimeout(() => router.push("/"), 2000); // Go to home after 2 seconds
      } else {
        setStatus("Error: " + data.message);
      }
    } catch (error) {
      setStatus("Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Join Your Society
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <div className="flex gap-2">
             <input
              name="flatNumber"
              placeholder="Flat No (e.g. A-101)"
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <select
              name="role"
              onChange={handleChange}
              className="p-2 border rounded bg-white"
            >
              <option value="RESIDENT">Resident</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Register
          </button>
        </form>

        {status && <p className="mt-4 text-center text-sm">{status}</p>}
      </div>
    </div>
  );
}