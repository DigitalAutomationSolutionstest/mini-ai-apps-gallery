'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { MicrophoneIcon, ArrowPathIcon, PlayIcon, PauseIcon, TrashIcon } from '@heroicons/react/24/outline'
import { AudioApp } from "@/components/apps/AudioApp";

export default function AudioPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Errore durante l\'accesso al microfono:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleProcess = async () => {
    if (!audioUrl) return

    setIsProcessing(true)
    // TODO: Implementare la logica di processamento
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsProcessing(false)
  }

  const togglePlayback = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleDelete = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
      setIsPlaying(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MicrophoneIcon className="w-8 h-8 text-purple-500" />
        <h1 className="text-3xl font-bold">Trascrizione Audio</h1>
      </div>
      <AudioApp />
    </div>
  )
} 