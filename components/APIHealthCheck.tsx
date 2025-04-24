'use client'

import { useState, useEffect } from 'react'
import { API_URL } from '@/src/lib/env'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { api } from '@/src/lib/api'

interface APIStatus {
  name: string
  status: 'loading' | 'success' | 'error'
  responseTime?: number
  error?: string
}

const API_ENDPOINTS = [
  { name: 'PDF Analysis', path: '/api/ai/pdf' },
  { name: 'Quote Submission', path: '/api/quote' },
  { name: 'Image Generation', path: '/api/ai/image' },
  { name: 'Audio Transcription', path: '/api/ai/audio' },
  { name: 'Code Generation', path: '/api/ai/code' },
  { name: 'Stripe Checkout', path: '/api/stripe/checkout' }
]

export default function APIHealthCheck() {
  const [apiStatuses, setApiStatuses] = useState<APIStatus[]>(
    API_ENDPOINTS.map(endpoint => ({
      name: endpoint.name,
      status: 'loading'
    }))
  )

  useEffect(() => {
    const checkAPI = async (index: number, endpoint: string) => {
      const startTime = performance.now()
      
      try {
        const response = await api.head(endpoint)
        const endTime = performance.now()
        const responseTime = Math.round(endTime - startTime)
        
        setApiStatuses(prev => {
          const newStatuses = [...prev]
          newStatuses[index] = {
            name: prev[index].name,
            status: 'success',
            responseTime
          }
          return newStatuses
        })
      } catch (error) {
        setApiStatuses(prev => {
          const newStatuses = [...prev]
          newStatuses[index] = {
            name: prev[index].name,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
          }
          return newStatuses
        })
      }
    }

    // Check all APIs
    API_ENDPOINTS.forEach((endpoint, index) => {
      checkAPI(index, endpoint.path)
    })
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">API Health Check</h2>
      
      <div className="bg-zinc-900 rounded-xl p-6">
        <div className="space-y-4">
          {apiStatuses.map((api, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
              <div className="flex items-center gap-3">
                {api.status === 'loading' && (
                  <div className="w-5 h-5 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                )}
                {api.status === 'success' && (
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                )}
                {api.status === 'error' && (
                  <XCircleIcon className="w-5 h-5 text-red-500" />
                )}
                <span className="font-medium">{api.name}</span>
              </div>
              
              <div className="flex items-center gap-4">
                {api.responseTime && (
                  <span className="text-sm text-zinc-400">
                    {api.responseTime}ms
                  </span>
                )}
                {api.error && (
                  <span className="text-sm text-red-400">
                    {api.error}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center text-zinc-400 text-sm">
          API URL: {API_URL}
        </div>
      </div>
    </div>
  )
} 