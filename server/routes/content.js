import express from 'express';
import pool from '../db.js';
import {
  DEFAULT_EVENTS,
  DEFAULT_PACKAGES,
  DEFAULT_TESTIMONIALS,
  DEFAULT_HERO_IMAGES,
} from '../defaults.js';

const router = express.Router();

/* ── SSE: connected clients ───────────────────────────────────── */
const sseClients = new Set();

function broadcastUpdate() {
  for (const client of sseClients) {
    try {
      client.write('data: update\n\n');
    } catch { sseClients.delete(client); }
  }
}

/* ── Parse JSON fields returned as strings by MySQL ───────────── */
function parseField(value, fallback) {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') {
    try { return JSON.parse(value); } catch { return fallback; }
  }
  return value;
}

/* ── Auth middleware ──────────────────────────────────────────── */
function requireAuth(req, res, next) {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

/* ── GET /api/content/events  (SSE stream) ────────────────────── */
router.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // disable nginx buffering if any
  res.flushHeaders();

  // Send a heartbeat immediately so the browser knows the connection is open
  res.write(': connected\n\n');

  sseClients.add(res);

  // Heartbeat every 25 s to prevent proxy timeouts
  const heartbeat = setInterval(() => {
    try { res.write(': heartbeat\n\n'); }
    catch { clearInterval(heartbeat); sseClients.delete(res); }
  }, 25000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
  });
});

/* ── GET /api/content ─────────────────────────────────────────── */
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM site_content WHERE id = 1');
    if (!rows.length) {
      return res.json({
        events: DEFAULT_EVENTS,
        packages: DEFAULT_PACKAGES,
        testimonials: DEFAULT_TESTIMONIALS,
        heroImages: DEFAULT_HERO_IMAGES,
      });
    }
    const row = rows[0];
    res.json({
      updated_at:   row.updated_at,
      events:       parseField(row.events,       DEFAULT_EVENTS),
      packages:     parseField(row.packages,     DEFAULT_PACKAGES),
      testimonials: parseField(row.testimonials, DEFAULT_TESTIMONIALS),
      heroImages:   parseField(row.hero_images,  DEFAULT_HERO_IMAGES),
    });
  } catch (err) {
    console.error('[GET /api/content]', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

/* ── PUT /api/content ─────────────────────────────────────────── */
router.put('/', requireAuth, async (req, res) => {
  const { events, packages, testimonials, heroImages } = req.body;
  try {
    await pool.query(
      `INSERT INTO site_content (id, events, packages, testimonials, hero_images)
       VALUES (1, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         events       = VALUES(events),
         packages     = VALUES(packages),
         testimonials = VALUES(testimonials),
         hero_images  = VALUES(hero_images)`,
      [
        JSON.stringify(events       ?? DEFAULT_EVENTS),
        JSON.stringify(packages     ?? DEFAULT_PACKAGES),
        JSON.stringify(testimonials ?? DEFAULT_TESTIMONIALS),
        JSON.stringify(heroImages   ?? DEFAULT_HERO_IMAGES),
      ]
    );
    // Notify all connected browsers that content changed
    broadcastUpdate();
    res.json({ ok: true });
  } catch (err) {
    console.error('[PUT /api/content]', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
