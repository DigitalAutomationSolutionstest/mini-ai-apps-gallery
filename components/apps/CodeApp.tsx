"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CodeBracketIcon, ClipboardDocumentIcon } from "@heroicons/react/24/outline";

export function CodeApp() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [credits, setCredits] = useState<number|null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setCode("");
    setCredits(null);
    setError("");
    try {
      const token = (await (window as any).supabase.auth.getSession()).data.session?.access_token;
      if (!token) {
        setError("Utente non autenticato.");
        setLoading(false);
        return;
      }
      const res = await fetch("/api/ai/code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Errore generazione codice");
      } else {
        setCode(data.result);
        if (typeof data.credits === 'number') setCredits(data.credits);
      }
    } catch (err) {
      setError("Errore di rete o server");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-zinc-900 rounded-xl p-6 space-y-6"
    >
      <div>
        <h2 className="text-xl font-semibold mb-2">Genera codice</h2>
        <p className="text-zinc-400 text-sm">
          Descrivi cosa vuoi che il codice faccia
        </p>
      </div>

      <div className="space-y-4">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={4}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
          placeholder="Esempio: Scrivi una funzione che inverte una stringa..."
        />

        <button
          onClick={handleGenerate}
          disabled={loading || !query.trim()}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CodeBracketIcon className="w-5 h-5" />
          {loading ? "Generazione in corso..." : "Genera Codice"}
        </button>
      </div>

      {error && (
        <div className="mt-4 text-red-400 text-sm">{error}</div>
      )}

      {code && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-400">Risultato</span>
            <button
              onClick={handleCopy}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <ClipboardDocumentIcon className="w-5 h-5" />
            </button>
          </div>
          <pre className="bg-zinc-800 text-green-400 p-4 rounded-lg overflow-auto text-sm font-mono whitespace-pre-wrap">
            {code}
          </pre>
        </motion.div>
      )}

      {typeof credits === 'number' && (
        <div className="mt-4 text-right text-zinc-400 text-sm">
          Crediti residui: <span className="font-bold text-white">{credits}</span>
        </div>
      )}
    </motion.div>
  );
} 