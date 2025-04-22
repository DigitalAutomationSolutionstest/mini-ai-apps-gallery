'use client'
import React, { useState } from 'react'
import { askChatGPT } from '@/utils/openai'

export default function MiniAppChat() {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAsk = async () => {
    if (!input) return
    setLoading(true)
    const answer = await askChatGPT(input)
    setResponse(answer)
    setLoading(false)
  }

  return (
    <div className="p-6 rounded-xl bg-zinc-900 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Chatbot AI GPT-4</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Scrivi una domanda..."
        className="w-full px-4 py-2 mb-4 rounded-md bg-zinc-800 text-white border border-zinc-700 focus:border-fuchsia-500 focus:outline-none"
      />
      <button
        onClick={handleAsk}
        className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 py-2 rounded-md transition"
        disabled={loading}
      >
        {loading ? 'Caricamento...' : 'Invia'}
      </button>
      {response && (
        <div className="mt-4 p-4 rounded bg-zinc-800 text-white">
          <p>{response}</p>
        </div>
      )}
    </div>
  )
} 