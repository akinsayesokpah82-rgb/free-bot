# Free Bot — Full project (Frontend + Backend)

Bot name: Free Bot
Creator: Akin S. Sokpah (showing credit in UI)

This repo contains a ready-to-deploy web app (frontend + backend) that proxies OpenAI Chat API calls from the server,
so the OpenAI API key is only set on the server (Render secret).

Features:
- Chat UI with history
- Server-side OpenAI proxy endpoint (`/api/chat`)
- Basic request validation and simple rate-limiting (per-connection)
- Single Render Web Service deploy (build frontend during deploy, serve via backend)

Security:
- Do NOT commit real API keys. Use Render environment variables.
- Monitor usage (OpenAI costs) and set quotas/limits in your OpenAI account.

See `.env.example` for environment variables and `render.yaml` & backend README for deploy steps.
