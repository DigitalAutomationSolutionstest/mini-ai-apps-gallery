'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold gradient-text">
            Mini AI Hub
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link href="/#demo" className="text-gray-300 hover:text-white transition-colors">
              Demo
            </Link>
            <Link href="/#prezzi" className="text-gray-300 hover:text-white transition-colors">
              Prezzi
            </Link>
            <Link href="/#quote" className="text-gray-300 hover:text-white transition-colors">
              Preventivo
            </Link>
            <Link href="/login" className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 py-2 rounded transition-colors">
              Accedi
            </Link>
          </div>

          {/* Mobile Navigation Button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-black/95 backdrop-blur-md"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link href="/#demo" className="text-gray-300 hover:text-white transition-colors">
              Demo
            </Link>
            <Link href="/#prezzi" className="text-gray-300 hover:text-white transition-colors">
              Prezzi
            </Link>
            <Link href="/#quote" className="text-gray-300 hover:text-white transition-colors">
              Preventivo
            </Link>
            <Link href="/login" className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 py-2 rounded transition-colors text-center">
              Accedi
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  )
}