import express, { Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
import cors from 'cors';

// Importa le API
import imageHandler from './api/ai/image';
import codeHandler from './api/ai/code';
import audioHandler from './api/ai/audio';
import cliHandler from './api/ai/cli';
import testImageHandler from './api/ai/test-image';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(json());

// Middleware di logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Wrapper per convertire handler Next.js in handler Express
const adaptHandler = (handler: any) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(`Processing ${req.url} with body:`, req.body);
    await handler(req, res);
  } catch (error) {
    console.error(`Error in ${req.url}:`, error);
    next(error);
  }
};

// Routes
app.post('/api/ai/image', adaptHandler(imageHandler));
app.post('/api/ai/code', adaptHandler(codeHandler));
app.post('/api/ai/audio', adaptHandler(audioHandler));
app.post('/api/ai/cli', adaptHandler(cliHandler));
app.post('/api/ai/test-image', adaptHandler(testImageHandler));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Detailed error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    headers: req.headers
  });
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 