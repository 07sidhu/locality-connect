import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      
      {/* 1. HERO SECTION (The Main Entry) */}
      <header className="bg-gradient-to-b from-blue-50 to-white pt-6 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Internal Nav for Landing Page */}
          <nav className="flex justify-between items-center mb-16">
            <h1 className="text-2xl font-bold text-blue-700 tracking-tight">
              LocalityConnect
            </h1>
            <div className="flex gap-4">
              <Link 
                href="/login" 
                className="px-4 py-2 text-gray-600 font-medium hover:text-blue-600 transition"
              >
                Log In
              </Link>
              <Link 
                href="/register" 
                className="px-5 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 shadow-md transition"
              >
                Get Started
              </Link>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
              🚀 Version 1.0 is Live
            </span>
            <h2 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
              The Operating System for <span className="text-blue-600">Your Society</span>
            </h2>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Replace chaotic WhatsApp groups with a unified platform. Manage complaints, find trusted help, and stay safe—all in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/register" 
                className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-700 shadow-xl hover:-translate-y-1 transition"
              >
                Join Your Neighborhood
              </Link>
              <Link 
                href="/login" 
                className="bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-50 transition"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 2. VALUE PROPOSITION (Why use this?) */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900">Everything you need to live better</h3>
            <p className="text-gray-500 mt-2">Designed for Residents, Built for RWAs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-gray-50 rounded-2xl hover:shadow-lg transition border border-gray-100">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center text-3xl mb-6">
                🔧
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Complaints</h3>
              <p className="text-gray-600">
                Raise tickets for plumbing or electrical issues. Track status from Open to &quot;Resolved&quot; in real-time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-gray-50 rounded-2xl hover:shadow-lg transition border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-3xl mb-6">
                📢
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No-Noise Feed</h3>
              <p className="text-gray-600">
                Official announcements are highlighted Blue. No more Good Morning spam hiding important notices.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-gray-50 rounded-2xl hover:shadow-lg transition border border-gray-100">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-3xl mb-6">
                🛡️
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Trusted Services</h3>
              <p className="text-gray-600">
                Find verified maids, drivers, and cooks in your society. Call them directly with one tap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOOTER */}
      <footer className="mt-auto py-10 border-t border-gray-100 bg-gray-50 text-center">
        <p className="text-gray-500 text-sm">
          © 2025 LocalityConnect. Built by Sidhuji under the aegis of data developer.
        </p>
      </footer>

    </div>
  );
}