"use client"; // This tells Next.js this is a Client Component (interactive)

import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Stop page from refreshing
    setStatus("Submitting...");

    try {
      const res = await fetch("/api/society", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, address }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("Success! Society created.");
        setName("");
        setAddress("");
      } else {
        setStatus("Error: " + data.message);
      }
    } catch (error) {
      setStatus("Something went wrong.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Setup New Society
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Society Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. Green Valley Apartments"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. Sector 62, Noida"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Create Society
          </button>
        </form>

        {status && (
          <p className={`mt-4 text-center text-sm ${status.includes("Success") ? "text-green-600" : "text-red-600"}`}>
            {status}
          </p>
        )}
      </div>
    </div>
  );
}