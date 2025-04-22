"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type Quote = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { data, error } = await supabase
        .from("quote_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Errore Supabase:", error);
      } else {
        setQuotes(data);
      }
      setLoading(false);
    };

    fetchQuotes();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Richieste Preventivo</h1>
      {loading ? (
        <p>Caricamento...</p>
      ) : quotes.length === 0 ? (
        <p>Nessuna richiesta trovata.</p>
      ) : (
        <ul className="space-y-4">
          {quotes.map((q) => (
            <li
              key={q.id}
              className="border border-zinc-700 rounded-xl p-4 bg-zinc-900"
            >
              <p><strong>Nome:</strong> {q.name}</p>
              <p><strong>Email:</strong> {q.email}</p>
              <p><strong>Messaggio:</strong> {q.message}</p>
              <p className="text-sm text-gray-500 mt-2">
                Inviato il {new Date(q.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
} 