"use client";

import { useState, useEffect, useCallback } from "react";

// Types
interface Post {
  _id: string;
  content: string;
  type: "GENERAL" | "ANNOUNCEMENT";
  authorName: string;
  createdAt: string;
  imageUrl?: string; // <--- Image for Feed
}

interface MarketItem {
  _id: string;
  title: string;
  price: number;
  description: string;
  sellerName: string;
  sellerPhone: string;
  imageUrl?: string; // <--- Image for Market
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("FEED"); // FEED | MARKET
  const [posts, setPosts] = useState<Post[]>([]);
  const [marketItems, setMarketItems] = useState<MarketItem[]>([]);
  
  // Image Upload State
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Forms
  const [content, setContent] = useState("");
  const [marketForm, setMarketForm] = useState({ title: "", price: "", description: "", contactPhone: "" });
  const [showSellForm, setShowSellForm] = useState(false);

  const societyId = "6931a095e68baacfab9739f2"; 

  // ☁️ Helper: Upload to Cloudinary
  const uploadImage = async () => {
    if (!image) return null;
    const formData = new FormData();
    formData.append("file", image);
    
    // 👇 REPLACE THESE
    formData.append("upload_preset", "locality_connect"); 
    const cloudName = "dzk2wltpk"; 

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      return data.secure_url; 
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const refreshData = useCallback(async () => {
    try {
      const feedRes = await fetch("/api/feed");
      const feedData = await feedRes.json();
      setPosts(feedData.posts || []);

      const marketRes = await fetch("/api/marketplace");
      const marketData = await marketRes.json();
      setMarketItems(marketData.items || []);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // --- SUBMIT FEED POST ---
  const handlePostSubmit = async () => {
    if (!content.trim()) return;
    setUploading(true);

    const uploadedUrl = await uploadImage();

    await fetch("/api/feed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        content, 
        type: "GENERAL", 
        societyId,
        imageUrl: uploadedUrl // Send Image
      }),
    });
    
    setContent("");
    setImage(null);
    setUploading(false);
    refreshData();
  };

  // --- SUBMIT MARKET LISTING ---
  const handleSellSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    const uploadedUrl = await uploadImage();

    await fetch("/api/marketplace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        ...marketForm, 
        societyId,
        imageUrl: uploadedUrl // Send Image
      }),
    });

    setShowSellForm(false);
    setMarketForm({ title: "", price: "", description: "", contactPhone: "" });
    setImage(null);
    setUploading(false);
    refreshData();
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      
      {/* HEADER TABS */}
      <div className="bg-white shadow sticky top-0 z-10">
        <div className="flex justify-center border-b">
          <button
            onClick={() => setActiveTab("FEED")}
            className={`flex-1 py-4 font-bold ${activeTab === "FEED" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
          >
             💬 Discussion
          </button>
          <button
            onClick={() => setActiveTab("MARKET")}
            className={`flex-1 py-4 font-bold ${activeTab === "MARKET" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
          >
             🛒 Marketplace
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">

        {/* --- TAB 1: FEED --- */}
        {activeTab === "FEED" && (
          <div>
            {/* Input Box */}
            <div className="bg-white p-4 rounded-xl shadow mb-6">
              <textarea
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                placeholder="What's on your mind?"
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              
              {/* Image Input for Feed */}
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-2"
              />

              <div className="flex justify-end">
                <button 
                  onClick={handlePostSubmit}
                  disabled={uploading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Post"}
                </button>
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {posts.map((post) => (
                <div 
                  key={post._id} 
                  className={`p-5 rounded-xl shadow-sm border ${
                    post.type === "ANNOUNCEMENT" ? "bg-blue-50 border-blue-200" : "bg-white border-gray-100"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{post.authorName}</h3>
                      <span className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {post.type === "ANNOUNCEMENT" && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">📢 Official</span>
                    )}
                  </div>
                  <p className="text-gray-800 whitespace-pre-wrap mb-2">{post.content}</p>
                  
                  {/* Display Feed Image */}
                  {post.imageUrl && (
                    <img 
                      src={post.imageUrl} 
                      alt="Post attachment" 
                      className="w-full h-64 object-cover rounded-lg border"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 2: MARKETPLACE --- */}
        {activeTab === "MARKET" && (
          <div>
            <button 
              onClick={() => setShowSellForm(!showSellForm)}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold mb-6 shadow-md"
            >
              {showSellForm ? "Cancel" : "+ Sell Item"}
            </button>

            {showSellForm && (
              <form onSubmit={handleSellSubmit} className="bg-white p-4 rounded-xl shadow mb-6">
                <input 
                  placeholder="Title (e.g. Sofa Set)" 
                  className="w-full p-2 border rounded mb-3"
                  value={marketForm.title}
                  onChange={(e) => setMarketForm({...marketForm, title: e.target.value})}
                  required
                />
                <input 
                  placeholder="Price (₹)" 
                  type="number"
                  className="w-full p-2 border rounded mb-3"
                  value={marketForm.price}
                  onChange={(e) => setMarketForm({...marketForm, price: e.target.value})}
                  required
                />
                <input 
                  placeholder="Your Phone Number" 
                  className="w-full p-2 border rounded mb-3"
                  value={marketForm.contactPhone}
                  onChange={(e) => setMarketForm({...marketForm, contactPhone: e.target.value})}
                  required
                />
                <textarea 
                  placeholder="Description..." 
                  className="w-full p-2 border rounded mb-3"
                  value={marketForm.description}
                  onChange={(e) => setMarketForm({...marketForm, description: e.target.value})}
                  required
                />
                
                {/* Image Input for Market */}
                <label className="block text-xs text-gray-500 mb-1">Item Photo</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4"
                />

                <button 
                  disabled={uploading}
                  className="w-full bg-blue-600 text-white py-2 rounded font-bold disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "List Item"}
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {marketItems.map((item) => (
                <div key={item._id} className="bg-white rounded-xl shadow overflow-hidden border">
                  {/* Image Display */}
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="h-48 bg-gray-200 flex items-center justify-center text-4xl">
                      🛋️
                    </div>
                  )}
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg truncate">{item.title}</h3>
                      <span className="font-bold text-green-600">₹{item.price}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">Seller: {item.sellerName}</p>
                    <p className="text-sm text-gray-700 line-clamp-2 mb-4">{item.description}</p>
                    <a 
                      href={`tel:${item.sellerPhone}`}
                      className="block text-center bg-gray-900 text-white py-2 rounded-lg font-bold hover:bg-black"
                    >
                      Contact Seller
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}