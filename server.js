#!/usr/bin/env node
/* LyricLab backend — holds the API keys so the browser never sees them.
 *
 *   1. Put your keys in a `.env` file next to this script (see .env.example)
 *   2. Run:  node server.js
 *   3. Open: http://localhost:8765
 *
 * Zero dependencies. Node 18+ (needs global fetch).
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

/* ---- load .env (simple KEY=value parser; real env vars win) ---- */
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const KEYS = {
  claude:   process.env.ANTHROPIC_API_KEY || '',
  openai:   process.env.OPENAI_API_KEY   || '',
  deepseek: process.env.DEEPSEEK_API_KEY || '',
};
const PORT = Number(process.env.PORT) || 8765;

function providerRequest(provider, model, system, user, maxTokens) {
  if (provider === 'claude') {
    return {
      url: 'https://api.anthropic.com/v1/messages',
      headers: {
        'content-type': 'application/json',
        'x-api-key': KEYS.claude,
        'anthropic-version': '2023-06-01',
      },
      body: {
        model, max_tokens: maxTokens, stream: true, system,
        messages: [{ role: 'user', content: user }],
      },
    };
  }
  const url = provider === 'openai'
    ? 'https://api.openai.com/v1/chat/completions'
    : 'https://api.deepseek.com/chat/completions';
  return {
    url,
    headers: {
      'content-type': 'application/json',
      'authorization': 'Bearer ' + KEYS[provider],
    },
    body: {
      model, max_tokens: maxTokens, stream: true,
      stream_options: { include_usage: true },
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    },
  };
}

async function handleChat(req, res) {
  let raw = '';
  req.on('data', c => { raw += c; if (raw.length > 2_000_000) req.destroy(); });
  req.on('end', async () => {
    let p;
    try { p = JSON.parse(raw); } catch { return json(res, 400, { error: 'bad json' }); }
    const provider = p.provider;
    if (!KEYS[provider]) return json(res, 400, { error: `No server key for "${provider}" — add it to .env` });
    const { url, headers, body } = providerRequest(
      provider, String(p.model || ''), String(p.system || ''), String(p.user || ''),
      Math.min(Number(p.maxTokens) || 2000, 8192),
    );
    try {
      const upstream = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
      res.writeHead(upstream.status, {
        'content-type': upstream.headers.get('content-type') || 'application/json',
        'cache-control': 'no-store',
      });
      for await (const chunk of upstream.body) res.write(chunk);   // pipe SSE straight through
      res.end();
    } catch (e) {
      json(res, 502, { error: 'Upstream request failed: ' + e.message });
    }
  });
}

function json(res, code, obj) {
  res.writeHead(code, { 'content-type': 'application/json' });
  res.end(JSON.stringify(obj));
}

const server = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname === '/api/health') {
    return json(res, 200, { ok: true, providers: Object.keys(KEYS).filter(k => KEYS[k]) });
  }
  if (u.pathname === '/api/chat' && req.method === 'POST') return handleChat(req, res);
  if (u.pathname === '/' || u.pathname === '/index.html') {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    return fs.createReadStream(path.join(__dirname, 'index.html')).pipe(res);
  }
  json(res, 404, { error: 'not found' });
});

server.listen(PORT, () => {
  const active = Object.keys(KEYS).filter(k => KEYS[k]);
  console.log(`\n🎼 LyricLab server →  http://localhost:${PORT}\n`);
  console.log(active.length
    ? `   Keys loaded for: ${active.join(', ')}`
    : '   ⚠ No API keys found — create a .env file (see .env.example)');
});
