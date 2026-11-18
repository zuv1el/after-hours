// After Hours — AI playlist curator (Netlify Function)
// Needs the environment variable GEMINI_API_KEY (Netlify → Site configuration → Environment variables).
// Optional: GEMINI_MODEL to force a specific model.

// Works two ways:
// 1. Netlify AI Gateway (no key needed): Netlify injects GEMINI_API_KEY + GOOGLE_GEMINI_BASE_URL.
// 2. Your own Google key: set GEMINI_API_KEY yourself and requests go straight to Google.
const MODELS = ["gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-flash-lite-latest"];
const env = k => (globalThis.Netlify?.env?.get?.(k)) || process.env[k];
const ENDPOINT = m => `${(env("GOOGLE_GEMINI_BASE_URL") || "https://generativelanguage.googleapis.com").replace(/\/+$/, "")}/v1beta/models/${m}:generateContent`;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });

const clean = (s, max) => String(s ?? "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max);

// Random nudges so the same feeling doesn't return the same songs twice
const ANGLES = [
  "Lean towards songs from the last five years.",
  "Include a couple of older classics alongside newer songs.",
  "Favour lesser-known songs and deep cuts over the biggest hits.",
  "Mix well-known songs with a few hidden gems.",
  "Draw from artists across several different countries.",
  "Include at least one song not sung in English if it fits.",
  "Lean towards songs from the 2000s and 2010s.",
  "Favour artists who are rising right now.",
  "Mix solo artists, bands and collaborations.",
  "Pick songs with a strong sense of place or atmosphere."
];

function buildPrompt({ text, mode, genre, avoid, count }) {
  const pick = () => ANGLES[Math.floor(Math.random() * ANGLES.length)];
  let a = pick(), b = pick(); while (b === a) b = pick();
  return `You are the curator for After Hours, a music discovery website. A listener described how they feel. Read their mood carefully, including slang (Ghanaian, Nigerian, UK, US and other), emoji, mixed feelings, sarcasm and negation, then build a playlist.

Listener wrote: """${text.replace(/"""/g, '"')}"""
Genre: ${genre ? `${genre}. Every song must genuinely belong to ${genre} or a close sub-style of it.` : "Any. Pick whatever genres fit the mood best, and mix genres."}
Direction: ${mode === "lift"
    ? "LIFT: the first songs meet them where they are, then each song moves gradually toward a brighter, more energised place."
    : "MATCH: stay with their mood and keep them company in it."}
Number of songs: ${count}
Variety for this playlist: ${a} ${b}
${avoid.length ? `Do NOT include any of these songs (the listener has already heard them): ${avoid.join("; ")}` : ""}

Rules:
- Only real, officially released songs that are on Apple Music and Spotify. Use the exact official song title and main artist name. Never invent a song or an artist.
- No more than 2 songs by the same artist.
- "note": one short sentence (max 12 words) on why the song fits at this point. Speak to the listener. Never quote lyrics.
- valence is -1 (very negative) to 1 (very positive); energy is -1 (very calm or tired) to 1 (very intense).
- Set "care" to true only if the text suggests they may be thinking about harming themselves.
- "read": one or two warm, plain sentences reflecting how they feel. "title": an evocative playlist title of 1 to 4 words.
- "search": 2 to 5 plain words someone would type into Spotify, Apple Music or YouTube to find existing playlists with this same feel. Combine the mood and the genre or sound (for example "late night afrobeats chill" or "sad rainy day piano"). No artist or song names, no quotes.`;
}

const SCHEMA = {
  type: "OBJECT",
  properties: {
    read: { type: "STRING" },
    title: { type: "STRING" },
    search: { type: "STRING" },
    valence: { type: "NUMBER" },
    energy: { type: "NUMBER" },
    care: { type: "BOOLEAN" },
    tracks: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: { title: { type: "STRING" }, artist: { type: "STRING" }, note: { type: "STRING" } },
        required: ["title", "artist"]
      }
    }
  },
  required: ["read", "title", "search", "valence", "energy", "tracks"]
};

async function ask(model, key, prompt) {
  const r = await fetch(ENDPOINT(model), {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 1.1, topP: 0.95, responseMimeType: "application/json", responseSchema: SCHEMA }
    }),
    signal: AbortSignal.timeout(22000)
  });
  if (!r.ok) {
    const msg = await r.text().catch(() => "");
    const e = new Error("gemini " + r.status); e.status = r.status;
    e.badKey = (r.status === 401 || r.status === 403 || /api key not valid|API_KEY_INVALID/i.test(msg)) && !/model/i.test(msg);
    e.detail = msg.slice(0, 300);
    throw e;
  }
  const data = await r.json();
  const txt = data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") || "";
  return JSON.parse(txt);
}

export default async (req) => {
  if (req.method !== "POST") return json({ error: "method" }, 405);
  const key = env("GEMINI_API_KEY");
  if (!key) return json({ error: "not_configured" }, 503);

  let body;
  try { body = await req.json(); } catch { return json({ error: "bad_request" }, 400); }
  const text = clean(body.text, 500);
  if (!text) return json({ error: "empty" }, 400);
  const genre = clean(body.genre, 60);
  const mode = body.mode === "lift" ? "lift" : "match";
  const count = Math.min(20, Math.max(8, Number(body.count) || 16));
  const avoid = (Array.isArray(body.avoid) ? body.avoid : []).slice(0, 80).map(s => clean(s, 100)).filter(Boolean);

  const prompt = buildPrompt({ text, mode, genre, avoid, count });
  const forced = env("GEMINI_MODEL");
  const models = forced ? [forced, ...MODELS] : MODELS;

  let lastErr = null;
  for (const m of models) {
    try {
      const out = await ask(m, key, prompt);
      const tracks = (Array.isArray(out.tracks) ? out.tracks : [])
        .filter(t => t && typeof t.title === "string" && typeof t.artist === "string" && t.title.trim() && t.artist.trim())
        .slice(0, count)
        .map(t => ({ title: clean(t.title, 120), artist: clean(t.artist, 120), note: clean(t.note, 140) }));
      if (tracks.length < 4) throw new Error("too_few");
      return json({
        title: clean(out.title, 48) || "Tonight",
        read: clean(out.read, 280),
        search: clean(out.search, 60).replace(/["“”]/g, ""),
        valence: Math.max(-1, Math.min(1, Number(out.valence) || 0)),
        energy: Math.max(-1, Math.min(1, Number(out.energy) || 0)),
        care: !!out.care,
        tracks,
        model: m
      });
    } catch (e) {
      lastErr = e;
      // a bad key fails the same way on every model
      if (e.badKey) break;
    }
  }
  console.error("playlist: all models failed", lastErr?.status, lastErr?.detail || lastErr?.message);
  return json({ error: lastErr?.badKey ? "key" : lastErr?.status === 429 ? "busy" : "unavailable" }, 502);
};

export const config = { path: "/api/playlist" };
