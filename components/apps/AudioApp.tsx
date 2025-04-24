"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MicrophoneIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { API_URL } from '@/src/lib/env'
import { supabase } from '@/src/lib/supabase'

export function AudioApp() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [credits, setCredits] = useState<number|null>(null);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setTranscript("");
    setCredits(null);
    setError("");

    const formData = new FormData();
    formData.append("audio", file);

    try {
      const token = (await (window as any).supabase.auth.getSession()).data.session?.access_token;
      if (!token) {
        setError("Utente non autenticato.");
        setLoading(false);
        return;
      }
      const res = await fetch(`${API_URL}/api/ai/audio`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Errore trascrizione audio");
      } else {
        setTranscript(data.text);
        if (typeof data.credits === 'number') setCredits(data.credits);
      }
    } catch (err) {
      setError("Errore di rete o server");
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
        <h2 className="text-xl font-semibold mb-2">Trascrizione Audio</h2>
        <p className="text-zinc-400 text-sm">
          Carica un file audio per ricevere la trascrizione automatica
        </p>
      </div>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center">
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
            id="audio-upload"
          />
          <label
            htmlFor="audio-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <ArrowUpTrayIcon className="w-12 h-12 text-zinc-400 mb-4" />
            <p className="text-lg font-medium mb-2">
              {file ? file.name : "Trascina qui il tuo file audio o clicca per selezionarlo"}
            </p>
            <p className="text-sm text-zinc-400">
              Supporta MP3, WAV e M4A fino a 10MB
            </p>
          </label>
        </div>

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MicrophoneIcon className="w-5 h-5" />
          {loading ? "Trascrizione in corso..." : "Trascrivi Audio"}
        </button>
      </div>

      {error && (
        <div className="mt-4 text-red-400 text-sm">{error}</div>
      )}

      {transcript && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-800 rounded-lg p-4"
        >
          <h3 className="text-sm font-medium text-zinc-400 mb-2">Trascrizione</h3>
          <p className="text-white whitespace-pre-wrap text-sm">
            {transcript}
          </p>
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