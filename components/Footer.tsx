import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-gray-500 py-8 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center text-sm">
        <p>© {new Date().getFullYear()} Mini AI Hub – All rights reserved</p>
        <div className="flex gap-4">
          <a href="#privacy" className="hover:text-white">Privacy</a>
          <a href="#contatti" className="hover:text-white">Contatti</a>
        </div>
      </div>
    </footer>
  )
} 