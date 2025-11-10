/**
 * Free Bot backend - express server
 * - Serves frontend static build (if present) from ../frontend/dist
 * - /api/chat -> proxies to OpenAI Chat Completions (server-only key)
 *
 * IMPORTANT:
 * - Set OPENAI_API_KEY in Render environment variables.
 * - Do not expose your key in client.
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json({ limit: '200kb' })); // small requests

const PORT = process.env.PORT || 3000;
const OPENAI_KEY = process.env.OPENAI_API_KEY || '';
const RATE_LIMIT_PER_MIN = parseInt(process.env.RATE_LIMIT_PER_MINUTE || '120', 10);

// Basic rate limiter (global - for demo). For production use user-based rate limits.
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: RATE_LIMIT_PER_MIN,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, slow down.' }
});
app.use('/api/', limiter);

// Simple health
app.get('/api/ping', (req, res) => res.json({ ok: true, name: 'Free Bot backend' }));

// Chat proxy endpoint
app.post('/api/chat', async (req, res) => {
  if (!OPENAI_KEY) return res.status(500).json({ error: 'OpenAI key not configured on server.' });

  const { messages, model, max_tokens } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array required' });
  }

  // Basic safety: limit max_tokens
  const safeMax = Math.min(parseInt(max_tokens || '800', 10), 1600);

  try {
    // Use OpenAI Chat Completions endpoint
    const payload = {
      model: model || 'gpt-4o-mini', // change default model as desired
      messages,
      max_tokens: safeMax,
      temperature: 0.2
    };

    const resp = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000
    });

    return res.json(resp.data);
  } catch (err) {
    console.error('OpenAI error', err.response?.data || err.message);
    const status = err.response?.status || 500;
    const data = err.response?.data || { error: err.message };
    return res.status(status).json({ error: 'OpenAI request failed', detail: data });
  }
});

// Serve frontend (if built)
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDist));
app.get('*', (req, res) => {
  // fallback to index.html for SPA
  res.sendFile(path.join(frontendDist, 'index.html'), err => {
    if (err) res.status(404).send('Not found');
  });
});

app.listen(PORT, () => console.log(`Free Bot backend running on port ${PORT}`));
