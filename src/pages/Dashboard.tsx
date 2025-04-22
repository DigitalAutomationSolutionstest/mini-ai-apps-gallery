import React from "react";
import UserSettings from "@/components/dashboard/UserSettings";

export default function DashboardPage(): React.ReactElement {
  return (
    <main className="px-6 py-12">
      {/* Altre sezioni: Hero, Crediti, Mini App... */}

      <UserSettings />
    </main>
  );
} 