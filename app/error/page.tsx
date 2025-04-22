'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { XCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function ErrorPage() {
  const [errorMessage, setErrorMessage] = useState<string>('Si è verificato un errore durante il pagamento.')
  
  useEffect(() => {
    // Recupera il messaggio di errore dall'URL
    const urlParams = new URLSearchParams(window.location.search)
    const error = urlParams.get('error')
    if (error) {
      setErrorMessage(decodeURIComponent(error))
    }
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
            <XCircleIcon className="w-24 h-24 text-red-500" />
          </motion.div>
        </div>
        
        <motion.h1 
          className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Pagamento fallito
        </motion.h1>
        
        <motion.p 
          className="text-lg text-gray-300 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {errorMessage}
        </motion.p>
        
        <motion.p 
          className="text-sm text-gray-500 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Se il problema persiste, contattaci per assistenza.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/prezzi">
            <button className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-lg transition-colors">
              <ArrowLeftIcon className="w-5 h-5" />
              Torna ai prezzi
            </button>
          </Link>
          
          <Link href="/">
            <button className="inline-flex items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-6 py-3 rounded-lg transition-colors">
              Torna alla home
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
} 