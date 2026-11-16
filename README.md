# After Hours

**Music for how you feel.** Describe your night in your own words and After Hours builds a playlist that matches your mood, or lifts you out of it.

🔗 **Live:** https://afterhours-music.netlify.app

---

## What it does

- **Describe how you feel.** Type a sentence, a word or a mess of feelings, or tap a quick example.
- **Pick a direction.** *Stay with it* keeps you company in the mood. *Lift me up* starts where you are and climbs, track by track, somewhere brighter.
- **Press play.** Get 12 tracks with a generated cover and a short read of your mood. Every track opens on Spotify or YouTube.
- **Twelve stations.** Late-night "frequencies" from *88.7 Rain on the Window* to *106.7 Low Battery*.
- **The sound orb.** A live 3D orb ringed by an equaliser, with orbiting records, stars, a galaxy and planets. Name it in Settings.
- **Weather-aware soundtrack.** Turn the sound on and the orb plays an ambient soundtrack generated in the browser. Local weather adds rain, thunder, wind, snow or a clear-night shimmer.
- **Your nights.** Recent playlists are kept in your browser.

## Files

| File | What it is |
| --- | --- |
| `index.html` | Page structure |
| `styles.css` | All styling (night ink + streetlight amber) |
| `app.js` | Mood reading, playlists, 3D scene (three.js), generative sound (Web Audio), weather, settings |
| `_headers` | Security headers that Netlify applies automatically |

## Run it locally

It's a static site with no build step and no backend.

```bash
# from this folder
python -m http.server 8000
# then open http://localhost:8000
```

Use a local server rather than opening the file directly, so location-based weather works.

## Tech

- **three.js r128** (from cdnjs, with an integrity check) for the 3D orb and sky
- **Web Audio API** for the generated soundtrack
- **Open-Meteo** for live weather (free, no API key)
- **localStorage** for saved playlists, the orb's name and settings
- Hosted on **Netlify**

No API keys, secrets or accounts are needed.

## Deploy

Drag this folder (or a zip of it) onto the project's **Deploys** page in Netlify. There's no build command, no environment variables and nothing to configure.

## Team

- **Ernest Zuviel**, owner and founder
- **Josi – Maame Nyaarko**, co-founder
