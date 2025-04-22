'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function DemoModal({ title }: { title: string }) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = () => {
    if (!input) return
    setLoading(true)
    setResponse('')
    setTimeout(() => {
      setResponse(`🤖 Risposta simulata a: "${input}"`)
      setLoading(false)
    }, 1000)
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="hover:underline text-sm text-fuchsia-400">
        Prova demo
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-zinc-900 w-full max-w-md p-6 rounded-xl text-white shadow-xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl"
              >
                ×
              </button>

              <h3 className="text-xl font-semibold mb-4">{title}</h3>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-28 p-3 rounded bg-zinc-800 border border-zinc-700 text-sm resize-none"
                placeholder="Scrivi qualcosa..."
              />

              <button
                onClick={handleSend}
                disabled={loading}
                className="mt-4 w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white py-2 rounded transition"
              >
                {loading ? 'Caricamento...' : 'Invia'}
              </button>

              {response && (
                <div className="mt-4 text-sm text-green-300 border-t pt-4 border-zinc-700">
                  {response}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 