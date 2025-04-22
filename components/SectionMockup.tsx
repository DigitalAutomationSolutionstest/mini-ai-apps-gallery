'use client'
import { motion } from 'framer-motion'

export default function SectionMockup() {
  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Come funziona</h2>
          <p className="text-lg text-gray-400">Un'interfaccia semplice e intuitiva per le tue app AI</p>
        </div>
        
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-zinc-900 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="aspect-video bg-gradient-to-br from-fuchsia-600/20 to-blue-600/20 p-8">
              <div className="h-full w-full bg-zinc-800 rounded-lg shadow-inner flex items-center justify-center">
                <p className="text-gray-400">Mockup dell'interfaccia</p>
              </div>
            </div>
          </motion.div>
          
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-fuchsia-600 rounded-full blur-3xl opacity-20" />
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-600 rounded-full blur-3xl opacity-20" />
        </div>
      </div>
    </section>
  )
} 