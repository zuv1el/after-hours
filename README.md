# After Hours

**Music for how you feel.** Describe your night in your own words and After Hours builds a fresh playlist that matches your mood, or lifts you out of it, in any genre you like.

🔗 **Live:** https://afterhours-music.netlify.app

---

## What it does

- **Describe how you feel.** Type a sentence, a word, slang, emoji or a mess of feelings.
- **Pick a direction.** *Stay with it* keeps you company in the mood. *Lift me up* starts where you are and climbs, song by song, somewhere brighter.
- **Pick a genre, or don't.** Search almost 400 genres from Afrobeats, Highlife and Amapiano to K-pop, Bossa nova and Death metal, or type any other. Leave it empty for a mix.
- **A new playlist every time.** An AI curator picks 12 songs for your exact words. It remembers what you've already been given in this browser and avoids repeating it. Not feeling it? Press **Different playlist**.
- **Preview every song.** Each song has its cover art and a 30-second preview right on the page, with a player bar that moves on to the next song. Every song also opens in Apple Music (the exact song), Spotify or YouTube.
- **No made-up songs.** Every AI pick is checked against Apple Music and Deezer, and anything neither can find is dropped.
- **The sound orb.** A live 3D orb ringed by an equaliser, with orbiting records, stars, a galaxy and planets. Name it in Settings.
- **Weather-aware soundtrack.** Turn the sound on and the orb plays an ambient soundtrack generated in the browser. Local weather adds rain, thunder, wind, snow or a clear-night shimmer.
- **Your nights.** Recent playlists are kept in your browser.

## How the playlists are made

1. The page sends the listener's words, direction, genre and the songs to avoid to `/api/playlist`, a Netlify Function.
2. The function asks Google Gemini (through Netlify AI Gateway) for 16 real songs and a short reading of the mood.
3. The page checks each song with the iTunes Search API, then Deezer for anything Apple doesn't carry (both free, no key). It keeps the first 12 that exist and attaches the preview, cover art and an exact link.

If the AI isn't set up, is busy or has used its free daily quota, the site keeps working:

- with a genre chosen, it pulls real songs in that genre from Apple's catalogue;
- without one, a built-in mood reader (slang, emoji and negation aware) picks from about 290 hand-chosen songs.

## Files

| File | What it is |
| --- | --- |
| `index.html` | Page structure |
| `styles.css` | All styling (night ink + streetlight amber) |
| `app.js` | Mood reading, playlists, previews, 3D scene (three.js), generative sound (Web Audio), weather, settings |
| `netlify/functions/playlist.mjs` | The AI curator (calls Gemini through Netlify AI Gateway) |
| `netlify.toml` | Netlify settings: publish folder and functions folder |
| `_headers` | Security headers that Netlify applies automatically |

## Setup

Nothing to configure. The site deploys from this repository on Netlify, and the AI function uses **Netlify AI Gateway**, which supplies the Gemini connection automatically. Usage is paid in Netlify credits (the Free plan includes a monthly allowance).

Optional: to use your own Google Gemini key instead, add `GEMINI_API_KEY` under **Project configuration → Environment variables** in Netlify and redeploy. `GEMINI_MODEL` can force a specific model.

If the AI is unavailable or credits run out, the site falls back to the built-in engine automatically.

## Run it locally

```bash
python -m http.server 8000      # site only, uses the built-in engine
# or, with the AI function:
npx netlify-cli dev             # needs GEMINI_API_KEY in your environment
```

## Tech

- **Google Gemini** via **Netlify AI Gateway** (in a Netlify Function) to pick songs
- **iTunes Search API** and **Deezer API** for previews, cover art and exact links
- **three.js r128** (from cdnjs, with an integrity check) for the 3D orb and sky
- **Web Audio API** for the generated soundtrack
- **Open-Meteo** for live weather (free, no API key)
- **localStorage** for saved playlists, songs already heard, the orb's name and settings
- Hosted on **Netlify**, deployed from this repository

## Team

- **Ernest Zuviel**, owner and founder
- **Josi – Maame Nyaarko**, co-founder
