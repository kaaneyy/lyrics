// Vercel edge function — mirrors server.js /api/health
export const config = { runtime: 'edge' };

export default function handler() {
  const keys = {
    claude:   process.env.ANTHROPIC_API_KEY || '',
    openai:   process.env.OPENAI_API_KEY   || '',
    deepseek: process.env.DEEPSEEK_API_KEY || '',
  };
  return new Response(
    JSON.stringify({ ok: true, providers: Object.keys(keys).filter(k => keys[k]) }),
    { headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } },
  );
}
