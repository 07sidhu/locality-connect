"use client";
export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="font-bold">Resident Details</h2>
        <p className="text-gray-600">Raghav (Flat 101)</p>
        <p className="text-gray-600">raghav@example.com</p>
      </div>
      <button 
        onClick={() => {
            document.cookie = "token=; path=/;";
            window.location.href = "/login";
        }}
        className="w-full bg-red-100 text-red-600 py-3 rounded-lg font-bold"
      >
        Logout
      </button>
    </div>
  );
}