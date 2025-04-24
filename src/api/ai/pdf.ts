import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL

interface PdfAnalysisPayload {
  content: string // base64 encoded PDF content
  prompt?: string // optional custom prompt
}

interface PdfAnalysisResponse {
  result: string
  error?: string
}

export async function analyzePdf(payload: PdfAnalysisPayload): Promise<PdfAnalysisResponse> {
  try {
    const response = await axios.post<PdfAnalysisResponse>(`${API_BASE}/api/ai/pdf`, payload)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        result: '',
        error: error.response?.data?.error || 'Errore durante l\'analisi del PDF'
      }
    }
    return {
      result: '',
      error: 'Errore imprevisto durante l\'analisi del PDF'
    }
  }
} 