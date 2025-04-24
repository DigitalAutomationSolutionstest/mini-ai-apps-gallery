// Logger strutturato per Edge Functions
export interface LogEntry {
  function: string;
  status: 'called' | 'success' | 'error';
  user?: string;
  input_summary?: Record<string, unknown>;
  error?: string;
  timestamp: string;
  duration_ms?: number;
}

export function logFunctionCall(
  functionName: string,
  userId?: string,
  inputSummary?: Record<string, unknown>
): LogEntry {
  const logEntry: LogEntry = {
    function: functionName,
    status: 'called',
    timestamp: new Date().toISOString(),
  };

  if (userId) logEntry.user = userId;
  if (inputSummary) logEntry.input_summary = inputSummary;

  console.log(JSON.stringify(logEntry));
  return logEntry;
}

export function logSuccess(
  logEntry: LogEntry,
  durationMs?: number
): LogEntry {
  const updatedLog: LogEntry = {
    ...logEntry,
    status: 'success',
    timestamp: new Date().toISOString(),
  };

  if (durationMs) updatedLog.duration_ms = durationMs;

  console.log(JSON.stringify(updatedLog));
  return updatedLog;
}

export function logError(
  logEntry: LogEntry,
  error: unknown
): LogEntry {
  const errorMessage = error instanceof Error 
    ? error.message 
    : typeof error === 'string' 
      ? error 
      : 'Unknown error';

  const updatedLog: LogEntry = {
    ...logEntry,
    status: 'error',
    error: errorMessage,
    timestamp: new Date().toISOString(),
  };

  console.error(JSON.stringify(updatedLog));
  return updatedLog;
} 