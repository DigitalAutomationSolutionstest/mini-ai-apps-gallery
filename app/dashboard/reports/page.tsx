'use client'

import { motion } from 'framer-motion'
import { DocumentTextIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">I tuoi report</h1>
        <p className="text-gray-400 mt-2">Visualizza e scarica i report generati</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-zinc-800 rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <DocumentTextIcon className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-bold">Report generati</h2>
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors">
              Nuovo report
            </button>
          </div>

          <div className="text-gray-400 text-center py-8">
            <p>Non hai ancora generato nessun report</p>
            <p className="text-sm mt-2">Clicca su "Nuovo report" per iniziare</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 