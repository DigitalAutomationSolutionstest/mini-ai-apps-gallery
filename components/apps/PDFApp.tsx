'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { DocumentTextIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { API_URL } from '@/src/lib/env'
import { supabase } from '@/src/lib/supabase'

export function PDFApp() {
  const [text, setText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [report, setReport] = useState('')
  const [credits, setCredits] = useState<number|null>(null)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    setIsGenerating(true)
    setReport('')
    setCredits(null)
    setError('')
    try {
      const token = (await (window as any).supabase.auth.getSession()).data.session?.access_token
      if (!token) {
        setError('Utente non autenticato.');
        setIsGenerating(false)
        return
      }
      const res = await fetch(`${API_URL}/api/ai/pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ input: text }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Errore generazione report')
      } else {
        setReport(data.result)
        if (typeof data.credits === 'number') setCredits(data.credits)
      }
    } catch (err) {
      setError('Errore di rete o server')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (report) {
      const a = document.createElement('a')
      a.href = report
      a.download = 'report.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-zinc-900 rounded-xl p-6"
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Inserisci il testo</h2>
          <p className="text-zinc-400 text-sm">
            Incolla o scrivi il testo da cui generare il report PDF
          </p>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Inserisci il testo da analizzare..."
          className="w-full h-48 bg-zinc-800 text-white rounded-lg p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        />

        <div className="flex justify-end space-x-4">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !text.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              "Generazione in corso..."
            ) : (
              <>
                <DocumentTextIcon className="w-5 h-5" />
                Genera Report
              </>
            )}
          </button>

          {report && (
            <button
              onClick={handleDownload}
              className="bg-zinc-700 hover:bg-zinc-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              Scarica PDF
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 text-red-400 text-sm">{error}</div>
        )}

        {report && (
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-2">Report generato</h3>
            <pre className="bg-zinc-800 text-white p-4 rounded whitespace-pre-wrap text-sm max-h-96 overflow-auto">{report}</pre>
          </div>
        )}

        {typeof credits === 'number' && (
          <div className="mt-4 text-right text-zinc-400 text-sm">
            Crediti residui: <span className="font-bold text-white">{credits}</span>
          </div>
        )}
      </motion.div>
    </div>
  )
} 