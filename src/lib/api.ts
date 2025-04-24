import axios from 'axios'
import { API_URL } from './env'

// Client HTTP configurato
export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor per logging errori
api.interceptors.response.use(
  response => response,
  error => {
    console.error('[API Error]:', error)
    return Promise.reject(error)
  }
)

// Tipi
interface PDFAnalysisRequest {
  file: string // base64
}

interface QuoteRequest {
  name: string
  email: string
  message: string
  budget: string
}

interface ImageGenerationRequest {
  prompt: string
  model?: 'huggingface' | 'dalle'
}

interface AudioTranscriptionRequest {
  audio: File
}

interface CodeGenerationRequest {
  query: string
}

interface StripePrice {
  id: string;
  product: string;
  active: boolean;
  description: string | null;
  unit_amount: number | null;
  currency: string;
  type: 'one_time' | 'recurring';
  interval?: 'day' | 'week' | 'month' | 'year';
}

interface StripeCheckoutSession {
  url: string;
}

interface StripeCustomerPortal {
  url: string;
}

// Endpoints
export const analyzePDF = (data: PDFAnalysisRequest) =>
  api.post('/api/ai/pdf', data)

export const generateImage = (data: ImageGenerationRequest) =>
  api.post(`/api/ai/image${data.model === 'dalle' ? '-dalle' : ''}`, data)

export const transcribeAudio = (data: AudioTranscriptionRequest) => {
  const formData = new FormData()
  formData.append('audio', data.audio)
  return api.post('/api/ai/audio', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const generateCode = (data: CodeGenerationRequest) =>
  api.post('/api/ai/code', data)

export const sendQuote = (data: QuoteRequest) =>
  api.post('/api/quote', data)

export const getStripeProducts = () =>
  api.get<StripePrice[]>('/api/stripe/prices')

export const createCheckoutSession = (priceId: string) =>
  api.post<StripeCheckoutSession>('/api/stripe/checkout', { priceId })

export const createSubscriptionSession = (priceId: string) =>
  api.post<StripeCheckoutSession>('/api/stripe/checkout-subscription', { priceId })

export const getCustomerPortal = () =>
  api.post<StripeCustomerPortal>('/api/stripe/customer-portal') 