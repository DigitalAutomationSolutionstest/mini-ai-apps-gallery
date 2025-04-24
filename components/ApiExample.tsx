'use client'

import { useState } from 'react'
import { getPDFReport, sendQuote } from '@/lib/api'
import { DocumentTextIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'

export default function ApiExample() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfResult, setPdfResult] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form per il preventivo
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    email: '',
    message: '',
    budget: ''
  })
  const [quoteSent, setQuoteSent] = useState(false)

  // Gestione upload PDF
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0])
    }
  }

  // Analisi PDF
  const handleAnalyzePDF = async () => {
    if (!pdfFile) return

    try {
      setLoading(true)
      setError('')
      
      // Converti il file in base64
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64 = e.target?.result as string
        
        // Utilizziamo il fileUrl come parametro (base64 URL)
        const result = await getPDFReport(base64)
        setPdfResult(result.analysis || result.data || 'Nessun risultato')
      }
      reader.readAsDataURL(pdfFile)
      
    } catch (err) {
      setError('Errore durante l\'analisi del PDF')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Invio preventivo
  const handleSendQuote = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError('')
      
      await sendQuote(quoteForm)
      setQuoteSent(true)
      
    } catch (err) {
      setError('Errore durante l\'invio del preventivo')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      {/* Sezione Analisi PDF */}
      <div className="bg-zinc-900 rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <DocumentTextIcon className="w-6 h-6" />
          Analisi PDF
        </h2>
        
        <div className="space-y-4">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-zinc-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-purple-600 file:text-white
              hover:file:bg-purple-700"
          />
          
          <button
            onClick={handleAnalyzePDF}
            disabled={!pdfFile || loading}
            className="w-full bg-purple-600 hover:bg-purple-700 
              text-white py-2 px-4 rounded-lg transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Analisi in corso...' : 'Analizza PDF'}
          </button>
          
          {pdfResult && (
            <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">
                {pdfResult}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Sezione Preventivo */}
      <div className="bg-zinc-900 rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <PaperAirplaneIcon className="w-6 h-6" />
          Richiedi Preventivo
        </h2>
        
        {quoteSent ? (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-green-400 mb-2">
              Preventivo inviato con successo!
            </h3>
            <p className="text-zinc-400">
              Ti risponderemo il prima possibile.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendQuote} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">
                Nome
              </label>
              <input
                type="text"
                value={quoteForm.name}
                onChange={(e) => setQuoteForm({...quoteForm, name: e.target.value})}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2
                  focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">
                Email
              </label>
              <input
                type="email"
                value={quoteForm.email}
                onChange={(e) => setQuoteForm({...quoteForm, email: e.target.value})}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2
                  focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">
                Messaggio
              </label>
              <textarea
                value={quoteForm.message}
                onChange={(e) => setQuoteForm({...quoteForm, message: e.target.value})}
                rows={4}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2
                  focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">
                Budget
              </label>
              <input
                type="text"
                value={quoteForm.budget}
                onChange={(e) => setQuoteForm({...quoteForm, budget: e.target.value})}
                placeholder="es. 1000-2000"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2
                  focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 
                text-white py-2 px-4 rounded-lg transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Invio in corso...' : 'Invia Preventivo'}
            </button>
          </form>
        )}
      </div>

      {error && (
        <div className="text-red-400 text-center">
          {error}
        </div>
      )}
    </div>
  )
} 