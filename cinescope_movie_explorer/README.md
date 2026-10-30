# CineScope — Movie Explorer

A responsive, frontend-only movie discovery app built with HTML, CSS and vanilla JavaScript.

## Features
- Browse a curated collection of movies
- Search by movie title, genre, year or tags
- Filter by genre (Sci-Fi, Drama, Action and Animation)
- Sort by featured, rating, release year or title
- Open a movie details modal
- Add/remove movies from a personal watchlist
- Watchlist saved in browser `localStorage`
- Responsive layout for desktop, tablet and mobile
- Keyboard shortcuts: `Ctrl + K` / `Cmd + K` to focus search, `Esc` to close details

## Run locally
No installation or backend is required.
1. Extract the ZIP.
2. Open `index.html` in your browser.

Optional local server:
```bash
python -m http.server 5500
```
Then visit `http://localhost:5500`.

## Deploy
This is a static website. Push the files to GitHub and deploy using GitHub Pages, Vercel, Netlify or Cloudflare Pages. No build command is needed; use the project root as the publish directory.

## Data note
The movie collection is a demo dataset stored in `script.js`. The watchlist is saved in this browser only using `localStorage`; it is not synced between devices or users. The poster artwork is generated with CSS gradients and symbols, so no image API key is required.
