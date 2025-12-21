"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        // The API now returns { user: { role: "..." } }
        if (data.user) {
          setRole(data.user.role);
        }
      } catch (e) {
        console.error("Failed to fetch user");
      }
    };
    checkUser();
  }, []);

  if (pathname === "/login" || pathname === "/register" || pathname === "/" || pathname === "/admin-signup") {
    return null;
  }

  // 1. Resident Menu (Has Help)
  const residentNav = [
    { name: "Home", path: "/dashboard", icon: "🏠" },
    { name: "Community", path: "/community", icon: "💬" },
    { name: "Access", path: "/access", icon: "🛡️" },
    { name: "Help", path: "/services", icon: "🛠️" },
    { name: "Profile", path: "/profile", icon: "👤" },
  ];

  // 2. Admin Menu (NO Help)
  const adminNav = [
    { name: "Admin Home", path: "/admin", icon: "⚡" },
    { name: "Community", path: "/community", icon: "💬" },
    { name: "Access", path: "/access", icon: "🛡️" },
    // "Help" removed here!
    { name: "Profile", path: "/profile", icon: "👤" },
  ];

  const navItems = role === "ADMIN" ? adminNav : residentNav;

  return (
    <>
      {/* DESKTOP */}
      <nav className="hidden md:flex fixed top-0 w-full bg-white shadow-sm z-50 px-8 py-4 justify-between items-center border-b">
        <h1 className="text-xl font-bold text-blue-600">LocalityConnect</h1>
        <div className="flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`font-medium hover:text-blue-600 transition ${
                pathname === item.path ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"
              }`}
            >
              {item.name}
            </Link>
          ))}
          <button onClick={() => {
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            window.location.href = "/login";
          }} className="text-red-500 font-medium ml-4">
            Logout
          </button>
        </div>
      </nav>

      {/* MOBILE */}
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
      
      <div className="hidden md:block h-16"></div>
    </>
  );
}