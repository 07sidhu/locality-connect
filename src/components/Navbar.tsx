"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // We don't want the navbar on Login or Register pages
  if (pathname === "/login" || pathname === "/register" || pathname === "/") {
    return null;
  }

  const navItems = [
    { name: "Home", path: "/dashboard", icon: "🏠" },
    { name: "Feed", path: "/feed", icon: "📰" },
    { name: "Services", path: "/services", icon: "🛠️" },
  ];

  return (
    <>
      {/* 1. DESKTOP TOP BAR (Hidden on Mobile) */}
      <nav className="hidden md:flex fixed top-0 w-full bg-white shadow-sm z-50 px-8 py-4 justify-between items-center border-b">
        <h1 className="text-xl font-bold text-blue-600">LocalityConnect</h1>
        <div className="flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`font-medium hover:text-blue-600 transition ${
                pathname === item.path ? "text-blue-600" : "text-gray-600"
              }`}
            >
              {item.name}
            </Link>
          ))}
          <button onClick={() => {
            document.cookie = "token=; path=/;"; // Clear cookie
            window.location.href = "/login";
          }} className="text-red-500 font-medium">
            Logout
          </button>
        </div>
      </nav>

      {/* 2. MOBILE BOTTOM BAR (Hidden on Desktop) */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-50 flex justify-around py-3 pb-5 shadow-inner">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex flex-col items-center text-xs ${
              pathname === item.path ? "text-blue-600 font-bold" : "text-gray-500"
            }`}
          >
            <span className="text-xl mb-1">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
      
      {/* Spacer to prevent content from hiding behind bars */}
      <div className="hidden md:block h-16"></div>
    </>
  );
}