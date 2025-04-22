"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { PhotoIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { supabase } from "@/lib/supabase";

const MODELS = [
  { label: "Stable Diffusion (HuggingFace)", value: "huggingface" },
  { label: "DALL·E (OpenAI)", value: "dalle" },
];

export function ImageApp() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [credits, setCredits] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [model, setModel] = useState("huggingface");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setImageUrl("");
    setCredits(null);
    setError("");
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log("Sessione attiva:", session);
      if (sessionError || !session) {
        setError("Utente non autenticato.");
        setLoading(false);
        return;
      }
      if (!session.access_token) {
        setError("Utente non autenticato.");
        setLoading(false);
        return;
      }
      const token = session.access_token;
      const apiRoute = model === "huggingface" ? "/api/ai/image" : "/api/ai/image-dalle";
      console.log("[ImageApp] Chiamo API:", apiRoute);
      const res = await fetch(apiRoute, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      });
      console.log("[ImageApp] Risposta HTTP:", res.status, res.statusText);
      let data;
      try {
        data = await res.json();
        console.log("[ImageApp] JSON restituito:", data);
      } catch (jsonErr) {
        console.error("[ImageApp] Errore parsing JSON:", jsonErr);
        setError("Errore parsing risposta server");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError(data.error || "Errore generazione immagine");
      } else {
        setImageUrl(data.image);
        if (typeof data.credits === "number") setCredits(data.credits);
      }
    } catch (err) {
      setError("Errore di rete o server");
      console.error("[ImageApp] Errore generale:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-zinc-900 rounded-xl p-6 space-y-6"
    >
      <div>
        <h2 className="text-xl font-semibold mb-2">Genera un'immagine</h2>
        <p className="text-zinc-400 text-sm">
          Descrivi l'immagine che vuoi generare e scegli il modello AI
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <button
            type="button"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-left text-white flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-purple-500"
            onClick={() => setDropdownOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
          >
            <span>{MODELS.find((m) => m.value === model)?.label}</span>
            <ChevronDownIcon className="w-5 h-5 text-zinc-400" />
          </button>
          {dropdownOpen && (
            <ul
              className="absolute z-10 mt-2 w-full bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg"
              role="listbox"
            >
              {MODELS.map((m) => (
                <li
                  key={m.value}
                  className={`px-4 py-2 cursor-pointer hover:bg-zinc-700 text-white ${model === m.value ? "bg-zinc-700" : ""}`}
                  onClick={() => {
                    setModel(m.value);
                    setDropdownOpen(false);
                  }}
                  role="option"
                  aria-selected={model === m.value}
                >
                  {m.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Esempio: Un robot seduto su una panchina futuristica..."
        />

        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PhotoIcon className="w-5 h-5" />
          {loading ? "Generazione in corso..." : "Genera Immagine"}
        </button>
      </div>

      {error && (
        <div className="mt-4 text-red-400 text-sm">{error}</div>
      )}

      {imageUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6"
        >
          <img src={imageUrl} alt="Immagine generata" className="w-full rounded-lg shadow-lg" />
        </motion.div>
      )}

      {typeof credits === "number" && (
        <div className="mt-4 text-right text-zinc-400 text-sm">
          Crediti residui: <span className="font-bold text-white">{credits}</span>
        </div>
      )}
    </motion.div>
  );
} 