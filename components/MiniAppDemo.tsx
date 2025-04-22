'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DocumentTextIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

interface MiniAppDemoProps {
  title: string
  description: string
  apiEndpoint: string
}

export default function MiniAppDemo({ title, description, apiEndpoint }: MiniAppDemoProps) {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim()) {
      setError('Inserisci un testo per generare il report')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Errore durante la generazione del report')
      }
      
      setResult(data.result)
    } catch (err) {
      console.error('Errore:', err)
      setError(err instanceof Error ? err.message : 'Si è verificato un errore')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (!result) return
    
    // Crea un blob con il contenuto del report
    const blob = new Blob([result], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    // Crea un link temporaneo per il download
    const a = document.createElement('a')
    a.href = url
    a.download = `report-${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(a)
    a.click()
    
    // Pulisci
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-zinc-900/50 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-zinc-800/50">
      <div className="flex items-center gap-3 mb-4">
        <DocumentTextIcon className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      
      <p className="text-gray-300 mb-6">{description}</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="input" className="block text-sm font-medium text-gray-300 mb-2">
            Inserisci il testo
          </label>
          <textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-32 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Inserisci qui il testo da cui generare il report..."
          />
        </div>
        
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
        
        <div className="flex justify-end">
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                <span>Generazione in corso...</span>
              </>
            ) : (
              <span>Genera Report</span>
            )}
          </motion.button>
        </div>
      </form>
      
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6 p-4 bg-zinc-800 rounded-lg"
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-lg font-medium text-white">Report generato</h4>
            <button
              onClick={handleDownload}
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              Scarica
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto text-gray-300 text-sm whitespace-pre-wrap">
            {result}
          </div>
        </motion.div>
      )}
    </div>
  )
} 