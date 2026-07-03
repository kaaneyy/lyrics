// Vercel edge function — mirrors server.js /api/chat.
// Holds the provider keys server-side and pipes the SSE stream straight through.
export const config = { runtime: 'edge' };

function providerRequest(provider, model, system, user, maxTokens) {
  const KEYS = {
    claude:   process.env.ANTHROPIC_API_KEY || '',
    openai:   process.env.OPENAI_API_KEY   || '',
    deepseek: process.env.DEEPSEEK_API_KEY || '',
  };
  if (!KEYS[provider]) return null;
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
  return {
    url: provider === 'openai'
      ? 'https://api.openai.com/v1/chat/completions'
      : 'https://api.deepseek.com/chat/completions',
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

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'POST only' }), { status: 405, headers: { 'content-type': 'application/json' } });
  }
  let p;
  try { p = await request.json(); }
  catch { return new Response(JSON.stringify({ error: 'bad json' }), { status: 400, headers: { 'content-type': 'application/json' } }); }

  const req = providerRequest(
    p.provider, String(p.model || ''), String(p.system || ''), String(p.user || ''),
    Math.min(Number(p.maxTokens) || 2000, 8192),
  );
  if (!req) {
    return new Response(JSON.stringify({ error: `No server key for "${p.provider}" — set it in the Vercel project's environment variables` }),
      { status: 400, headers: { 'content-type': 'application/json' } });
  }
  const upstream = await fetch(req.url, { method: 'POST', headers: req.headers, body: JSON.stringify(req.body) });
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'content-type': upstream.headers.get('content-type') || 'application/json',
      'cache-control': 'no-store',
    },
  });
}
