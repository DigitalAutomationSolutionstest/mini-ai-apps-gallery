import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { NextRequest } from 'next/server';

// Mock delle dipendenze
vi.mock('@upstash/redis', () => ({
  Redis: vi.fn(() => ({
    get: vi.fn(() => Promise.resolve(null)),
    set: vi.fn(() => Promise.resolve()),
    del: vi.fn(() => Promise.resolve()),
  }))
}));

vi.mock('@upstash/ratelimit', () => ({
  Ratelimit: vi.fn(() => ({
    limit: vi.fn(() => Promise.resolve({ success: true }))
  }))
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({
            data: { credits: 10 },
            error: null
          }))
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve())
      }))
    }))
  }))
}));

vi.mock('openai', () => ({
  default: vi.fn(() => ({
    chat: {
      completions: {
        create: vi.fn(() => Promise.resolve({
          choices: [{ message: { content: 'Analisi del PDF completata' } }]
        }))
      }
    }
  }))
}));

describe('PDF API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('dovrebbe analizzare un PDF con successo', async () => {
    const req = new NextRequest('http://localhost:3000/api/pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fileUrl: 'https://example.com/test.pdf',
        userId: '123e4567-e89b-12d3-a456-426614174000',
        apiKey: 'test-key',
        prompt: 'Analizza questo documento'
      })
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.analysis).toBe('Analisi del PDF completata');
    expect(data.creditsRemaining).toBe(9);
  });

  it('dovrebbe restituire un errore se i crediti sono insufficienti', async () => {
    vi.mocked(createClient).mockImplementationOnce(() => ({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => ({
              data: { credits: 0 },
              error: null
            }))
          }))
        }))
      }))
    }));

    const req = new NextRequest('http://localhost:3000/api/pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fileUrl: 'https://example.com/test.pdf',
        userId: '123e4567-e89b-12d3-a456-426614174000',
        apiKey: 'test-key',
        prompt: 'Analizza questo documento'
      })
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(402);
    expect(data.error).toBe('Crediti insufficienti');
  });
}); 