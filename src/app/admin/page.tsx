"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

// ✅ 1. Define Types
interface AdminTicket {
  _id: string;
  title: string;
  category: string;
  description: string;
  userId: {
    name: string;
  } | null;
}

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  flatNumber: string;
  isVerified: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("TICKETS");
  
  // ✅ 2. Types Applied
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [announcement, setAnnouncement] = useState("");

  // ✅ 3. Helper for MANUAL refresh (Used by Buttons)
  const refreshData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      if (res.status === 401) return;
      const data = await res.json();
      setTickets(data.tickets || []);
      setUsers(data.users || []);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // ✅ 4. Initial Load (Defined INSIDE to prevent errors)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const res = await fetch("/api/admin/dashboard"); 
        
        if (res.status === 401) {
          router.push("/login");
          return;
        }

        const data = await res.json();
        setTickets(data.tickets || []);
        setUsers(data.users || []);
      } catch (e) {
        console.error(e);
      }
    };

    loadInitialData();
  }, []); // <--- Empty dependency array = Runs ONCE.

  // ACTIONS
  const handleApproveUser = async (userId: string) => {
    await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action: "APPROVE" }),
    });
    refreshData(); // <--- Call helper
  };

  const handlePostAnnouncement = async () => {
    await fetch("/api/feed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        content: announcement, 
        type: "ANNOUNCEMENT",
        societyId: "6931a095e68baacfab9739f2" 
      }),
    });
    setAnnouncement("");
    alert("Announcement Posted!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Control Center</h1>
          <button 
            onClick={() => router.push("/dashboard")}
            className="text-blue-600 font-medium hover:underline"
          >
            ← Back to App
          </button>
        </div>

        {/* ADMIN TABS */}
        <div className="flex space-x-4 mb-8">
          <button 
            onClick={() => setActiveTab("TICKETS")}
            className={`px-6 py-2 rounded-lg font-bold ${activeTab === "TICKETS" ? "bg-blue-600 text-white" : "bg-white text-gray-600"}`}
          >
            Manage Tickets
          </button>
          <button 
            onClick={() => setActiveTab("USERS")}
            className={`px-6 py-2 rounded-lg font-bold ${activeTab === "USERS" ? "bg-blue-600 text-white" : "bg-white text-gray-600"}`}
          >
            Resident Approvals
          </button>
          <button 
            onClick={() => setActiveTab("ANNOUNCE")}
            className={`px-6 py-2 rounded-lg font-bold ${activeTab === "ANNOUNCE" ? "bg-blue-600 text-white" : "bg-white text-gray-600"}`}
          >
            Broadcast
          </button>
        </div>

        {/* --- TAB 1: TICKETS --- */}
        {activeTab === "TICKETS" && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">All Society Complaints</h2>
            <div className="space-y-4">
              {tickets.length === 0 && <p className="text-gray-500">No tickets found.</p>}
              
              {tickets.map((t) => (
                <div key={t._id} className="border p-4 rounded flex justify-between items-center hover:bg-gray-50">
                  <div>
                    <span className="font-bold text-lg">{t.title}</span>
                    <span className="text-sm text-gray-500 ml-2">({t.category})</span>
                    <p className="text-sm text-gray-600">{t.description}</p>
                    <p className="text-xs text-blue-600 mt-1">
                      Raised by: {t.userId?.name || "Unknown Resident"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <select className="border p-1 rounded text-sm bg-white">
                      <option>Assign Staff</option>
                      <option>Ramesh (Plumber)</option>
                      <option>Suresh (Electrician)</option>
                    </select>
                    <button className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-bold hover:bg-green-200">
                      Mark Resolved
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 2: USERS --- */}
        {activeTab === "USERS" && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">Pending Approvals</h2>
            <div className="space-y-4">
              {users.filter((u) => !u.isVerified).length === 0 && <p className="text-gray-500">No pending approvals.</p>}
              
              {users.filter((u) => !u.isVerified).map((u) => (
                <div key={u._id} className="border p-4 rounded flex justify-between items-center bg-yellow-50 border-yellow-200">
                  <div>
                    <p className="font-bold">{u.name}</p>
                    <p className="text-sm">Flat: {u.flatNumber}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleApproveUser(u._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button className="bg-red-100 text-red-600 px-4 py-2 rounded font-bold hover:bg-red-200">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 3: BROADCAST --- */}
        {activeTab === "ANNOUNCE" && (
          <div className="bg-white p-6 rounded-xl shadow max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Make an Announcement</h2>
            <p className="text-sm text-gray-500 mb-4">This will send a notification to all residents and appear Blue in the feed.</p>
            <textarea
              className="w-full border p-4 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              rows={5}
              placeholder="e.g. Water supply will be cut tomorrow from 10 AM to 2 PM..."
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
            />
            <button 
              onClick={handlePostAnnouncement}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold w-full hover:bg-blue-700 transition"
            >
              Post Announcement 📢
            </button>
          </div>
        )}

      </div>
    </div>
  );
}