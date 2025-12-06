"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [isAnnouncement, setIsAnnouncement] = useState(false);
  const [loading, setLoading] = useState(false);

  // Hardcoded Society ID for now
  const societyId = "6931a095e68baacfab9739f2"; 

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await fetch("/api/feed");
    const data = await res.json();
    setPosts(data.posts || []);
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);

    await fetch("/api/feed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        type: isAnnouncement ? "ANNOUNCEMENT" : "GENERAL",
        societyId,
      }),
    });

    setContent("");
    setIsAnnouncement(false);
    setLoading(false);
    fetchPosts(); // Refresh feed
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
           <Link href="/dashboard" className="text-blue-600 font-medium">← Back to Dashboard</Link>
           <h1 className="text-2xl font-bold text-gray-800">Community Feed</h1>
        </div>

        {/* INPUT BOX */}
        <div className="bg-white p-4 rounded-xl shadow-md mb-8">
          <textarea
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="What's happening in the society?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-between items-center mt-3">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
              <input 
                type="checkbox" 
                checked={isAnnouncement} 
                onChange={(e) => setIsAnnouncement(e.target.checked)}
                className="w-4 h-4"
              />
              Mark as Announcement 📢
            </label>
            <button 
              onClick={handlePost}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>

        {/* POST LIST */}
        <div className="space-y-4">
          {posts.map((post: any) => (
            <div 
              key={post._id} 
              className={`p-5 rounded-xl shadow-sm border ${
                post.type === "ANNOUNCEMENT" 
                  ? "bg-blue-50 border-blue-200" 
                  : "bg-white border-gray-100"
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
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    📢 Announcement
                  </span>
                )}
              </div>
              <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}