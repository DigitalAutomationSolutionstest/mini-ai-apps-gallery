'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline'

export default function SectionServizi() {
  return (
    <motion.section
      id="servizi"
      className="py-24 px-6 md:px-10"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <WrenchScrewdriverIcon className="w-6 h-6 text-primary" />
          <h2 className="text-3xl font-bold">I Nostri Servizi</h2>
        </div>
        <p className="text-gray-400 mb-4">
          Realizziamo app AI, siti web reattivi, automazioni intelligenti e strumenti di nuova generazione.
        </p>
      </div>
    </motion.section>
  )
} 