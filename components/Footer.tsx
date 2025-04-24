import React from 'react'
import { ShieldCheckIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-gray-400 py-8 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm gap-4">
        <p>© {new Date().getFullYear()} Mini AI Hub – All rights reserved</p>
        <div className="flex gap-6">
          <a href="#privacy" className="hover:text-white flex items-center gap-1">
            <ShieldCheckIcon className="w-4 h-4" />
            Privacy
          </a>
          <a href="#contatti" className="hover:text-white flex items-center gap-1">
            <EnvelopeIcon className="w-4 h-4" />
            Contatti
          </a>
        </div>
      </div>
    </footer>
  )
} 