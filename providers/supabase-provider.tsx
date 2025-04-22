"use client";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import supabase from "@/lib/supabaseClient";
import AuthListener from "@/providers/AuthListener";

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <AuthListener />
      {children}
    </SessionContextProvider>
  );
} 