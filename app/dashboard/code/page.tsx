'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CodeBracketIcon, ArrowPathIcon, ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline'
import { CodeApp } from "@/components/apps/CodeApp"

export default function CodePage() {
  const [code, setCode] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState('')
  const [copied, setCopied] = useState(false)

  const handleAnalyze = async () => {
    if (!code.trim()) return

    setIsAnalyzing(true)
    // TODO: Implementare la logica di analisi
    await new Promise(resolve => setTimeout(resolve, 2000))
    setResult('// Codice analizzato e ottimizzato\n' + code)
    setIsAnalyzing(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <CodeBracketIcon className="w-8 h-8 text-purple-500" />
        <h1 className="text-3xl font-bold">Assistente Codice</h1>
      </div>
      <CodeApp />
    </div>
  )
} 