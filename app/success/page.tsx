'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function SuccessPage() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  
  useEffect(() => {
    // Recupera il session_id dall'URL
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('session_id')
    setSessionId(id)
    
    // Qui potresti fare una chiamata API per verificare lo stato del pagamento
    // usando il session_id
  }, [])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="mb-8 flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircleIcon className="w-24 h-24 text-green-500" />
          </motion.div>
        </div>
        
        <motion.h1 
          className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Pagamento riuscito!
        </motion.h1>
        
        <motion.p 
          className="text-lg text-gray-300 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Grazie per aver scelto Mini AI Hub.
        </motion.p>
        
        <motion.p 
          className="text-sm text-gray-500 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Riceverai una conferma via email. Puoi ora accedere alla tua dashboard.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link href="/">
            <button className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-lg transition-colors">
              <ArrowLeftIcon className="w-5 h-5" />
              Torna alla home
            </button>
          </Link>
        </motion.div>
        
        {sessionId && (
          <motion.p 
            className="mt-8 text-xs text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            ID Sessione: {sessionId}
          </motion.p>
        )}
      </motion.div>
    </div>
  )
} 