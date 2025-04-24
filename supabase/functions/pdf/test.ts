import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createTestUser, cleanupTestData, checkHealth, checkApiRoute } from '../_shared/test-setup.ts';

describe('PDF Function', () => {
  let testUser: any;

  beforeAll(async () => {
    testUser = await createTestUser();
  });

  afterAll(async () => {
    if (testUser?.id) {
      await cleanupTestData(testUser.id);
    }
  });

  describe('Health Check', () => {
    it('should return 200 OK for health endpoint', async () => {
      const { status, ok, data } = await checkHealth('pdf');
      expect(status).toBe(200);
      expect(ok).toBe(true);
      expect(data.status).toBe('healthy');
      expect(data.services).toHaveProperty('supabase');
      expect(data.services).toHaveProperty('openai');
    });
  });

  describe('API Routes', () => {
    it('should return 200 OK for main endpoint', async () => {
      const { status, ok } = await checkApiRoute('pdf');
      expect(status).toBe(200);
      expect(ok).toBe(true);
    });

    it('should handle CORS preflight requests', async () => {
      const response = await fetch(`${process.env.SUPABASE_URL}/functions/v1/pdf`, {
        method: 'OPTIONS',
        headers: {
          'Origin': 'https://www.miniaiapps.tech',
        },
      });
      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://www.miniaiapps.tech');
    });
  });

  describe('Function Logic', () => {
    it('should validate input schema', async () => {
      const response = await fetch(`${process.env.SUPABASE_URL}/functions/v1/pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${testUser.access_token}`,
        },
        body: JSON.stringify({
          userId: testUser.id,
          apiKey: 'test-key',
          fileUrl: 'https://example.com/test.pdf',
          prompt: 'Test prompt',
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('success');
    });

    it('should handle invalid input', async () => {
      const response = await fetch(`${process.env.SUPABASE_URL}/functions/v1/pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${testUser.access_token}`,
        },
        body: JSON.stringify({
          userId: 'invalid-uuid',
          apiKey: '',
          fileUrl: 'not-a-url',
          prompt: '',
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toHaveProperty('error');
    });

    it('should check user credits', async () => {
      const response = await fetch(`${process.env.SUPABASE_URL}/functions/v1/pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${testUser.access_token}`,
        },
        body: JSON.stringify({
          userId: testUser.id,
          apiKey: 'test-key',
          fileUrl: 'https://example.com/test.pdf',
          prompt: 'Test prompt',
        }),
      });

      expect(response.status).toBe(402);
      const data = await response.json();
      expect(data.error).toBe('Insufficient credits');
    });
  });
}); 