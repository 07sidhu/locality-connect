"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

// --- TYPES ---
interface AdminTicket {
  _id: string;
  title: string;
  category: string;
  description: string;
  status: string;
  assignedTo?: string;
  userId: { name: string } | null;
}

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  flatNumber: string;
  isVerified: boolean;
}

interface AdminPost {
  _id: string;
  content: string;
  authorName: string;
  type: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("TICKETS");
  
  // Data
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [posts, setPosts] = useState<AdminPost[]>([]); 
  const [announcement, setAnnouncement] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<{[key:string]: string}>({});

  // Helper for MANUAL refresh
  const refreshData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/dashboard"); 
      if (res.status === 401) return;
      const data = await res.json();
      setTickets(data.tickets || []);
      setUsers(data.users || []);

      const feedRes = await fetch("/api/feed");
      const feedData = await feedRes.json();
      setPosts(feedData.posts || []);
    } catch (e) { console.error(e); }
  }, []);

  // Initial Load
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const res = await fetch("/api/admin/dashboard"); 
        if (res.status === 401) { router.push("/login"); return; }
        const data = await res.json();
        setTickets(data.tickets || []);
        setUsers(data.users || []);

        const feedRes = await fetch("/api/feed");
        const feedData = await feedRes.json();
        setPosts(feedData.posts || []);
      } catch (e) { console.error(e); }
    };
    loadInitialData();
  }, []); 

  // --- ACTIONS ---

  const handleTicketAction = async (ticketId: string, action: "RESOLVE" | "ASSIGN") => {
    const staffName = selectedStaff[ticketId];
    if (action === "ASSIGN" && !staffName) return alert("Please select a staff member");

    await fetch("/api/admin/tickets", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketId, action, staffName }),
    });
    refreshData();
  };

  const handleApproveUser = async (userId: string) => {
    await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action: "APPROVE" }),
    });
    refreshData(); 
  };

  // ✅ UPDATED: Ask for Reason
  const handleDeletePost = async (postId: string) => {
    // 1. Ask Admin for reason
    const reason = prompt("Why are you removing this post? (e.g., Spam, Hate Speech)");
    
    // 2. If they hit Cancel or leave it empty, stop.
    if (!reason) return; 

    await fetch("/api/admin/feed", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, reason }), // Send reason to backend
    });
    refreshData();
  };

  const handlePostAnnouncement = async () => {
    await fetch("/api/feed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: announcement, type: "ANNOUNCEMENT", societyId: "6931a095e68baacfab9739f2" }),
    });
    setAnnouncement("");
    alert("Announcement Posted!");
    refreshData();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Control Center</h1>

        {/* TABS */}
        <div className="flex space-x-2 mb-8 overflow-x-auto">
          {["TICKETS", "USERS", "ANNOUNCE", "FEED"].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-bold text-sm ${activeTab === tab ? "bg-blue-600 text-white" : "bg-white text-gray-600"}`}
            >
              {tab === "ANNOUNCE" ? "BROADCAST" : tab === "FEED" ? "MODERATION" : tab}
            </button>
          ))}
        </div>

        {/* --- TAB 1: TICKETS --- */}
        {activeTab === "TICKETS" && (
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-xl font-bold mb-4">Complaint Board</h2>
            {tickets.map((t) => (
              <div key={t._id} className={`border p-4 rounded flex flex-col md:flex-row justify-between items-start md:items-center ${t.status === 'RESOLVED' ? 'bg-green-50' : 'bg-white'}`}>
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{t.title}</span>
                    <span className={`text-xs px-2 py-1 rounded font-bold ${
                      t.status === "OPEN" ? "bg-red-100 text-red-700" : 
                      t.status === "IN_PROGRESS" ? "bg-yellow-100 text-yellow-700" : 
                      "bg-green-100 text-green-700"
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{t.description}</p>
                  <p className="text-xs text-blue-600 mt-1">Raised by: {t.userId?.name || "Unknown"}</p>
                  {t.assignedTo && <p className="text-xs text-purple-600 font-bold">👷 Assigned to: {t.assignedTo}</p>}
                </div>
                
                {t.status !== "RESOLVED" && (
                  <div className="flex gap-2 w-full md:w-auto">
                    <select 
                      className="border p-2 rounded text-sm flex-1"
                      onChange={(e) => setSelectedStaff({...selectedStaff, [t._id]: e.target.value})}
                      value={selectedStaff[t._id] || ""}
                    >
                      <option value="">Select Staff</option>
                      <option value="Ramesh (Plumber)">Ramesh (Plumber)</option>
                      <option value="Suresh (Electrician)">Suresh (Electrician)</option>
                      <option value="Security Guard">Security Guard</option>
                    </select>
                    <button 
                      onClick={() => handleTicketAction(t._id, "ASSIGN")}
                      className="bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm font-bold hover:bg-blue-200"
                    >
                      Assign
                    </button>
                    <button 
                      onClick={() => handleTicketAction(t._id, "RESOLVE")}
                      className="bg-green-100 text-green-700 px-3 py-2 rounded text-sm font-bold hover:bg-green-200"
                    >
                      Resolve
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* --- TAB 2: USERS --- */}
        {activeTab === "USERS" && (
          <div className="bg-white p-6 rounded-xl shadow">
             <h2 className="text-xl font-bold mb-4">Pending Approvals</h2>
             {users.filter(u => !u.isVerified).length === 0 ? <p className="text-gray-500">All caught up!</p> : (
               users.filter(u => !u.isVerified).map(u => (
                 <div key={u._id} className="border p-4 rounded flex justify-between items-center bg-yellow-50 mb-3">
                   <div>
                     <p className="font-bold">{u.name}</p>
                     <p className="text-sm">Flat: {u.flatNumber}</p>
                   </div>
                   <button onClick={() => handleApproveUser(u._id)} className="bg-green-600 text-white px-4 py-2 rounded font-bold">Approve</button>
                 </div>
               ))
             )}
          </div>
        )}

        {/* --- TAB 3: BROADCAST --- */}
        {activeTab === "ANNOUNCE" && (
          <div className="bg-white p-6 rounded-xl shadow max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Broadcast Announcement</h2>
            <textarea
              className="w-full border p-4 rounded-lg mb-4" rows={4}
              placeholder="Message..."
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
            />
            <button onClick={handlePostAnnouncement} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold w-full">Post</button>
          </div>
        )}

        {/* --- TAB 4: MODERATION --- */}
        {activeTab === "FEED" && (
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-xl font-bold mb-4">Feed Moderation</h2>
            {posts.map(p => (
              <div key={p._id} className="border p-4 rounded flex justify-between items-start">
                <div>
                   <div className="flex items-center gap-2 mb-1">
                     <span className="font-bold">{p.authorName}</span>
                     {p.type === "ANNOUNCEMENT" && <span className="bg-blue-100 text-blue-800 text-xs px-2 rounded">Official</span>}
                   </div>
                   <p className="text-gray-700">{p.content}</p>
                </div>
                <button 
                  onClick={() => handleDeletePost(p._id)}
                  className="bg-red-50 text-red-600 px-3 py-1 rounded text-xs font-bold border border-red-200 hover:bg-red-100"
                >
                  Remove Post
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}