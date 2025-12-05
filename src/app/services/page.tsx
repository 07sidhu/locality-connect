"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    role: "Maid",
    phoneNumber: "",
    societyId: "6931a095e68baacfab9739f2", // PASTE YOUR ID HERE
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const res = await fetch("/api/services");
    const data = await res.json();
    setServices(data.services || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowForm(false);
    fetchServices();
    setForm({ ...form, name: "", phoneNumber: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-blue-600 hover:underline">← Back</Link>
            <h1 className="text-3xl font-bold text-gray-800">Local Services</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            {showForm ? "Close" : "+ Add Helper"}
          </button>
        </div>

        {/* ADD FORM */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <form onSubmit={handleSubmit} className="flex gap-4 flex-wrap">
              <input
                placeholder="Name"
                className="p-2 border rounded flex-1"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <select
                className="p-2 border rounded bg-white"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option>Maid</option>
                <option>Driver</option>
                <option>Plumber</option>
                <option>Electrician</option>
                <option>Cook</option>
              </select>
              <input
                placeholder="Phone Number"
                className="p-2 border rounded flex-1"
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                required
              />
              <button className="bg-green-600 text-white px-6 py-2 rounded">Save</button>
            </form>
          </div>
        )}

        {/* SERVICE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service: any) => (
            <div key={service._id} className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xl">{service.name}</h3>
                <span className="text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded text-sm">
                  {service.role}
                </span>
              </div>
              
              <a 
                href={`tel:${service.phoneNumber}`}
                className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold hover:bg-green-200 transition"
              >
                📞 Call
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}