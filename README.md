# 🎼 LyricLab — AI Lyric Writer & Editor

A self-contained, single-file songwriting studio. Paste raw lyrics, auto-structure
them into sections, then sharpen them with focused AI tools — all with the goal of a
**better song using the smallest possible changes to your original words.**

No build step, no server, no dependencies. Just open `index.html` in a browser.

## Quick start

1. Open `index.html` in any modern browser.
2. On first launch it asks for an **API key** from one of:
   - **Claude** (Anthropic) — `console.anthropic.com`
   - **ChatGPT** (OpenAI) — `platform.openai.com`
   - **DeepSeek** — `platform.deepseek.com`
3. Paste your raw song into the left panel.
4. Hit **✨ Initial Analysis** — the AI restructures the song into `[Verse]`,
   `[Chorus]`, `[Bridge]` sections (keeping your words) and opens it in a pop-up.
   Apply it to the editor with one click.
5. Use the right-hand tool rail to analyze and improve.

Your API key lives only in this browser's `localStorage` and is sent **only** to the
provider you chose — nothing else leaves your machine.

## Layout (one screen, no page scroll)

| Panel | Width | What it does |
|-------|-------|--------------|
| **Lyrics** | 44% | Editor with a live per-line syllable gutter, word/line/syllable counts, and detected rhyme scheme |
| **AI Suggestions** | 40% | Tool output, rendered as clean Markdown — pop out (⛶) for a full-screen read |
| **Controls** | 16% | Tool rail + session actions |

## Tools

**Rhymes · Syllables · Clichés · Improve Next Lines · Wordplay · Meanings · Chorus ·
Full Review · Structure** — each sends a purpose-built prompt tuned for surgical,
minimal-edit feedback in your voice.

## Session features

- **🧠 Song Memory** — a brief (title, genre, mood, POV, theme, style rules) sent with
  every request so suggestions match your intent.
- **🕘 Versions / Restore** — automatic snapshots on Initial Analysis, saves, and
  imports; restore any point. `Ctrl/Cmd+S` snapshots on demand.
- **📥 Import / 📤 Export** — round-trip `.txt`.
- **Auto-save** — your draft persists across reloads.

## Extras baked in

- Live syllable counting and rhyme-scheme detection right in the gutter.
- Section headers (`[Chorus]`) are recognised and excluded from line/rhyme stats.
- "Test connection" button in Settings to validate a key before committing.
- Switch providers/models any time in ⚙️ Settings without losing your work.

## Notes

- Default models: `claude-opus-4-8`, `gpt-4o`, `deepseek-chat` — all editable in Settings.
- Claude is called with the direct-browser-access header so it works client-side.
- Everything is one file (`index.html`). Fork it, host it anywhere static, or just
  double-click it.
