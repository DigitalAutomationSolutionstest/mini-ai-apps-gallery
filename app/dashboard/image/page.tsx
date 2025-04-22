'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpTrayIcon, PhotoIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { ImageApp } from "@/components/apps/ImageApp";

export default function ImagePage() {
  const [isUploading, setIsUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFile(file)
      
      // Crea un'anteprima dell'immagine
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
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
        <PhotoIcon className="w-8 h-8 text-purple-500" />
        <h1 className="text-3xl font-bold">Generatore Immagini</h1>
      </div>
      <ImageApp />
    </div>
  )
} 