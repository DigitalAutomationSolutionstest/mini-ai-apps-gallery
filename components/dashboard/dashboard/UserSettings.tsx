import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { API_URL } from '@/lib/env'

export default function UserSettings() {
  const [portalUrl, setPortalUrl] = useState<string>("");

  const getCustomerPortal = async () => {
    const session = await supabase.auth.getSession();
    const res = await fetch(`${API_URL}/api/stripe/customer-portal`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.data.session?.access_token}`,
      },
    });
    const data = await res.json();
    setPortalUrl(data.url);
  };

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Impostazioni Account</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Gestione Abbonamento</h3>
        <button
          onClick={getCustomerPortal}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Gestisci Abbonamento
        </button>
        {portalUrl && (
          <div className="mt-4">
            <a
              href={portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Apri il portale clienti Stripe
            </a>
          </div>
        )}
      </div>
    </section>
  );
} 