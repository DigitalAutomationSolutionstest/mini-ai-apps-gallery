
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

export function Navbar() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all",
        scrolled ? "bg-[#0d0f11]/90 backdrop-blur border-b border-[#1a1c1f]" : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/">
          <div className="flex items-center gap-3">
            <img
              src="/lovable-uploads/18e84809-4fcb-47d4-ba47-904265c5dea2.png"
              alt="Mini AI Hub"
              className="w-8 h-8"
            />
            <span className="text-white font-semibold text-lg">Mini AI Hub</span>
          </div>
        </Link>
        <div className="flex items-center gap-6">
          {!session ? (
            <Link
              to="/login"
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
            >
              Login
            </Link>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="text-white hover:underline"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
