import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import contentRouter from './routes/content.js';
import uploadRouter from './routes/upload.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

/* ── Middleware ─────────────────────────────────────────────── */
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));

/* ── API Routes ─────────────────────────────────────────────── */
app.use('/api/content', contentRouter);
app.use('/api/upload', uploadRouter);

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

/* ── Serve React in production ──────────────────────────────── */
const distPath = join(__dirname, '..', 'dist');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(distPath));
  // SPA fallback — serve index.html for all non-API routes
  app.get(/^(?!\/api).*$/, (req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
}

/* ── Start ──────────────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`\n🚀 E-Mais API rodando em http://localhost:${PORT}`);
  console.log(`   Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Banco:    ${process.env.DB_NAME || 'emais_cms'} @ ${process.env.DB_HOST || 'localhost'}\n`);
});
