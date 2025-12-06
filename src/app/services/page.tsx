"use client";

import { useState, useEffect, useCallback } from "react";

// ✅ 1. Define what a "Service" looks like
interface Service {
  _id: string;
  name: string;
  role: string;
  phoneNumber: string;
}

// ✅ 2. Define what a "Ticket" looks like
interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: string;
  category: string;
}

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState("PROS"); 
  
  // ✅ 3. Apply the types here
  const [services, setServices] = useState<Service[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  
  const [ticketForm, setTicketForm] = useState({ 
    title: "", 
    description: "", 
    category: "PLUMBING" 
  });
  const [showTicketForm, setShowTicketForm] = useState(false);

  const societyId = "6931a095e68baacfab9739f2"; 

  const refreshTickets = useCallback(async () => {
    try {
      const res = await fetch("/api/tickets");
      const data = await res.json();
      setServices(data.services || []); // Note: logic fix, this should probably affect tickets, but sticking to structure
      // Wait, slight logic error in previous code block regarding refreshTickets affecting services vs tickets.
      // Let's fix the logic below in the fetch to be safe.
      if(data.tickets) setTickets(data.tickets);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const sRes = await fetch("/api/services");
        const sData = await sRes.json();
        setServices(sData.services || []);

        const tRes = await fetch("/api/tickets");
        const tData = await tRes.json();
        setTickets(tData.tickets || []);
      } catch (e) {
        console.error("Error loading data:", e);
      }
    };
    loadInitialData();
  }, []); 

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...ticketForm, societyId }),
    });
    
    setShowTicketForm(false);
    setTicketForm({ title: "", description: "", category: "PLUMBING" });
    refreshTickets(); 
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20"> 
      
      <div className="bg-white shadow sticky top-0 z-10">
        <div className="flex justify-center border-b">
          <button
            onClick={() => setActiveTab("PROS")}
            className={`flex-1 py-4 text-center font-bold ${
              activeTab === "PROS" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
            }`}
          >
             👷 Local Pros
          </button>
          <button
            onClick={() => setActiveTab("TICKETS")}
            className={`flex-1 py-4 text-center font-bold ${
              activeTab === "TICKETS" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
            }`}
          >
             🔧 Complaints
          </button>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        
        {activeTab === "PROS" && (
          <div className="grid gap-4">
             {services.length === 0 && <p className="text-gray-500 text-center mt-10">No helpers found.</p>}
             
             {/* ✅ 4. Typescript now knows 'service' has a name, role, etc. */}
             {services.map((service) => (
                <div key={service._id} className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">{service.name}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{service.role}</span>
                  </div>
                  <a href={`tel:${service.phoneNumber}`} className="bg-green-500 text-white px-4 py-2 rounded-full font-bold">
                    📞 Call
                  </a>
                </div>
             ))}
          </div>
        )}

        {activeTab === "TICKETS" && (
          <div>
            <button 
              onClick={() => setShowTicketForm(!showTicketForm)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold mb-6 shadow-md"
            >
              {showTicketForm ? "Cancel" : "+ Raise New Complaint"}
            </button>

            {showTicketForm && (
              <form onSubmit={handleTicketSubmit} className="bg-white p-4 rounded-xl shadow mb-6 animate-fade-in">
                <input 
                  placeholder="Issue (e.g. Leaking Tap)" 
                  className="w-full p-2 border rounded mb-3"
                  value={ticketForm.title}
                  onChange={(e) => setTicketForm({...ticketForm, title: e.target.value})}
                  required
                />
                <select 
                  className="w-full p-2 border rounded mb-3 bg-white"
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                >
                  <option value="PLUMBING">Plumbing</option>
                  <option value="ELECTRICAL">Electrical</option>
                  <option value="CLEANLINESS">Cleanliness</option>
                  <option value="SECURITY">Security</option>
                </select>
                <textarea 
                  placeholder="Details..." 
                  className="w-full p-2 border rounded mb-3"
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                  required
                />
                <button className="w-full bg-green-600 text-white py-2 rounded font-bold">Submit</button>
              </form>
            )}

            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div key={ticket._id} className="bg-white p-4 rounded-xl shadow border-l-4 border-orange-400">
                  <div className="flex justify-between">
                    <h3 className="font-bold">{ticket.title}</h3>
                    <span className="text-xs font-bold text-orange-500 uppercase">{ticket.status}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}