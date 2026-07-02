# 🎼 LyricLab — AI Lyric Writer & Editor

A self-contained, single-file songwriting studio. Paste raw lyrics, auto-structure
them into sections, then sharpen them with focused AI tools — all with the goal of a
**better song using the smallest possible changes to your original words.**

No build step, no dependencies. Two ways to run it:

## Quick start

### Option A — recommended: local server holds your keys
```bash
cp .env.example .env    # put your API key(s) in .env
node server.js          # zero dependencies, Node 18+
# open http://localhost:8765
```
The browser talks only to your local backend — **API keys never enter the browser
or localStorage**. The Settings key field disappears automatically in this mode.

### Option B — no server: open `index.html` directly
1. Open `index.html` in any modern browser.
2. On first launch it asks for an **API key** from one of:
   - **Claude** (Anthropic) — `console.anthropic.com`
   - **ChatGPT** (OpenAI) — `platform.openai.com`
   - **DeepSeek** — `platform.deepseek.com`

   In this mode the key is kept in this browser's localStorage and sent only to
   the provider you chose.

Then, either way:
3. Paste your raw song into the left panel.
4. Hit **✨ Initial Analysis** — the AI restructures the song into `[Verse]`,
   `[Chorus]`, `[Bridge]` sections (keeping your words), **captures the song's
   identity** (title, genre, mood, POV, theme, rhyme scheme, imagery), and opens
   it in a pop-up. Apply the structure with one click.
5. **Select the lines** you want to work on, then run a tool. Each suggestion
   comes back as a card you can apply **inline** — **Replace**, **Keep both**, or
   **Insert** (for added lines). No selection = the tool works on the whole song.

### Song identity
The identity captured in step 4 becomes the song's fingerprint and is sent to the
AI with **every** tool, so suggestions always stay true to what the song is. It
also auto-fills your **🧠 Song Memory** — edit any field to steer things further.

Your API key lives only in this browser's `localStorage` and is sent **only** to the
provider you chose — nothing else leaves your machine.

## Layout (one screen, no page scroll)

| Panel | Width | What it does |
|-------|-------|--------------|
| **Lyrics** | 44% | Editor with a live per-line syllable gutter, word/line/syllable counts, and detected rhyme scheme |
| **AI Suggestions** | 40% | Tool output, rendered as clean Markdown — pop out (⛶) for a full-screen read |
| **Controls** | 16% | Tool rail + session actions |

## Tools

**Enhance:** Rhymes · Syllables · Clichés · Wordplay · Imagery & Senses ·
Pop Culture Refs · Improve Next Lines · Chorus
**Analyze:** Meanings · Compatibility · Repetition · Structure · Full Review

Each tool runs with its own **defined role** (the Rhyme Engineer, the Meter Coach,
the Continuity Editor, the Reference Digger, the Hook Producer…) and a detailed,
purpose-built prompt.

- **🧩 Compatibility** checks how well all the lines and sections fit *each other* —
  theme drift, tone clashes, POV/tense flips, vocabulary mismatches — and pulls
  outlier lines back into the song.
- **🎬 Pop Culture Refs** searches your lines for spots where a reference (music,
  film, TV, sports, games, memes…) would elevate the writing, matched to the song's
  identity. Optionally steer it ("90s hip-hop", "Tarantino movies", "anime").
- **🔂 Repetition** separates intentional refrains from accidental echoes; the live
  **echo** stat in the editor footer shows your most-repeated word at a glance.
- **🖼️ Imagery & Senses** swaps flat abstractions for concrete sensory images.

Every tool:
- Operates on your **current selection** (whole lines), or the whole song if nothing
  is selected — shown by a scope chip on each result.
- Returns a short analysis **plus concrete edits** you apply inline with
  **Replace** / **Keep both** / **Insert** — the original draft is snapshotted first.
- Is anchored to the captured **song identity** so edits stay on-brief.

## Session features

- **🧠 Song Memory** — a brief (title, genre, mood, POV, theme, style rules) sent with
  every request so suggestions match your intent.
- **🕘 Versions / Restore** — automatic snapshots on Initial Analysis, saves, and
  imports; restore any point. `Ctrl/Cmd+S` snapshots on demand.
- **📥 Import / 📤 Export** — round-trip `.txt`.
- **Auto-save** — your draft persists across reloads.
- **🆕 New Song / Reset** — a dedicated reset area that wipes the song's whole
  memory (lyrics, auto-captured identity, Song Memory, optionally version history)
  so you can start a fresh track. API keys and settings are always kept.

## Extras baked in

- Live syllable counting and rhyme-scheme detection right in the gutter.
- Section headers (`[Chorus]`) are recognised and excluded from line/rhyme stats.
- "Test connection" button in Settings to validate a key before committing.
- Switch providers/models any time in ⚙️ Settings without losing your work.

## Quality-of-life

- **Live streaming** — AI responses render token-by-token, with a **■ Stop** button
  that aborts the request mid-flight.
- **Token costs** — every result shows tokens used (in/out), with a session total
  on hover.
- **Undo-friendly** — applied edits go through the browser's native edit stack, so
  `Ctrl/Cmd+Z` reverses them right in the editor.
- **Hover preview** — hovering a suggestion card highlights the exact line that
  will change (and scrolls to it) before you commit.
- **Result history** — the last 3 suggestion sets are kept (and survive reloads);
  flip back with the ‹ › arrows in the panel header.
- **Ask anything** — a free-text box sends any custom request as its own tool, with
  the same selection scoping and inline-apply cards.
- **Robust parsing** — if the model returns malformed edit JSON, LyricLab retries
  once automatically and tells you if it still failed (never a silent empty panel).
- **Re-detect identity** — a button in 🧠 Song Memory re-runs identity capture on
  the current lyrics without resetting anything.
- **Real pronunciation data** — the CMU pronouncing dictionary is loaded in the
  background; syllable counts and rhyme detection use true phonemes (with a
  heuristic fallback offline), and measured counts are sent to the Meter/Rhyme
  tools as ground truth.
- **Non-English aware** — syllable/rhyme numbers hide automatically when the
  lyrics aren't English, instead of showing wrong data.
- **Phone-friendly** — below 860 px the three panels become tabs (Lyrics / AI /
  Tools) with proper page scrolling; running a tool jumps you to the AI tab.
- **Accessible** — icon buttons carry aria-labels; dialogs trap focus while open
  and return it on close.
- **Storage-safe** — if the browser's storage quota fills up, you get a clear
  warning instead of silent data loss.

## Notes

- Default models: `claude-opus-4-8`, `gpt-4o`, `deepseek-chat` — all editable in Settings.
- In browser-key mode, Claude is called with the direct-browser-access header.
- The frontend is still one file (`index.html`); `server.js` is an optional
  zero-dependency key-holding proxy.
