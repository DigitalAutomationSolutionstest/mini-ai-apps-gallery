'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpTrayIcon, DocumentTextIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { PDFApp } from "@/components/apps/PDFApp";

export default function PDFPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    // TODO: Implementare la logica di upload
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsUploading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <DocumentTextIcon className="w-8 h-8 text-purple-500" />
        <h1 className="text-3xl font-bold">Generatore Report PDF</h1>
      </div>
      <PDFApp />
    </div>
  )
} 