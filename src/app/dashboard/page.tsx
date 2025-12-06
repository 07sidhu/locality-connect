"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

// ✅ Define the shape of a Ticket
interface Ticket {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
}

export default function Dashboard() {
  const router = useRouter();
  
  // ✅ Types Applied
  const [tickets, setTickets] = useState<Ticket[]>([]); 
  const [showForm, setShowForm] = useState(false);
  
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    category: "PLUMBING",
    societyId: "6931a095e68baacfab9739f2", 
  });

  // ✅ Helper for Manual Refresh (Used by Submit Button)
  const refreshTickets = useCallback(async () => {
    try {
      const res = await fetch("/api/tickets");
      if (res.status === 401) return; 
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (error) {
      console.error("Failed to fetch tickets");
    }
  }, []);

  // ✅ Initial Load (Defined INSIDE to prevent render loops)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const res = await fetch("/api/tickets");
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setTickets(data.tickets || []);
      } catch (error) {
        console.error("Failed to fetch tickets");
      }
    };

    loadInitialData();
  }, []); // <--- Empty array ensures this runs ONLY once on mount.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTicket),
    });
    setShowForm(false);
    refreshTickets(); // <--- Call the helper here
    setNewTicket({ ...newTicket, title: "", description: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Dashboard</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {showForm ? "Cancel" : "+ New Complaint"}
          </button>
        </div>

        {/* TICKET FORM */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Raise a Complaint</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                placeholder="Issue Title (e.g. Leaking Tap)"
                className="w-full p-2 border rounded"
                value={newTicket.title}
                onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                required
              />
              <select
                className="w-full p-2 border rounded bg-white"
                value={newTicket.category}
                onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
              >
                <option value="PLUMBING">Plumbing</option>
                <option value="ELECTRICAL">Electrical</option>
                <option value="CLEANLINESS">Cleanliness</option>
                <option value="SECURITY">Security</option>
                <option value="OTHER">Other</option>
              </select>
              <textarea
                placeholder="Describe the issue..."
                className="w-full p-2 border rounded"
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                required
              />
              <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                Submit Complaint
              </button>
            </form>
          </div>
        )}

        {/* TICKET LIST */}
        <div className="grid gap-4">
          <h2 className="text-xl font-bold text-gray-700">My Recent Tickets</h2>
          {tickets.length === 0 ? (
            <p className="text-gray-500">No complaints yet. Everything is good!</p>
          ) : (
            tickets.map((ticket) => (
              <div key={ticket._id} className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{ticket.title}</h3>
                  <p className="text-gray-600 text-sm">{ticket.description}</p>
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded mt-2 inline-block">
                    {ticket.category}
                  </span>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    ticket.status === "OPEN" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                  }`}>
                    {ticket.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}