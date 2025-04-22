import { z } from 'zod'

export type LogLevel = 'info' | 'warn' | 'error' | 'debug'

const ipMap = new Map<string, number>()
const RATE_LIMIT_WINDOW = 3000 // 3 secondi

export function logApiCall(
  level: LogLevel,
  message: string,
  data?: Record<string, any>
) {
  const timestamp = new Date().toISOString()
  const logData = {
    timestamp,
    level,
    message,
    ...data
  }

  switch (level) {
    case 'info':
      console.info('[API]', JSON.stringify(logData))
      break
    case 'warn':
      console.warn('[API]', JSON.stringify(logData))
      break
    case 'error':
      console.error('[API]', JSON.stringify(logData))
      break
    case 'debug':
      console.debug('[API]', JSON.stringify(logData))
      break
  }
}

export function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const last = ipMap.get(ip) || 0

  if (now - last < RATE_LIMIT_WINDOW) {
    logApiCall('warn', 'Rate limit superato', { ip })
    return false
  }

  ipMap.set(ip, now)
  return true
} 