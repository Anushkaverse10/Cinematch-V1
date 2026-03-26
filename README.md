# 🎬 CineMatch — OMDB Edition

A movie discovery app powered entirely by the **OMDB API**  
## ⚡ Setup

1. Get a **free OMDB API key** at https://www.omdbapi.com/apikey.aspx
2. Open `script.js` and replace the key on line 3:
   ```js
   const OMDB_KEY = "your_key_here";
   ```
3. Open `index.html` in your browser — done!

> The free OMDB plan allows **1,000 requests/day**.

## ✨ Features

- 🎬 Browse by Genre (Action, Comedy, Drama, Horror, Sci-Fi, Romance, Thriller, Animation, Hindi & more)
- ⭐ Blockbusters, 💎 Underrated Gems, ⏳ Upcoming, 🎟 In Theatres
- 🔍 Search any movie by title
- **IMDb, Rotten Tomatoes & Metacritic ratings** on every card
- Director, Runtime, Genre, Language, Awards info
- ▶ Trailer button (opens YouTube search)
- IMDb direct link on every card
- ❤️ Favorites — save & remove movies (stored in localStorage)

## 🛠 APIs Used

| API  | Purpose |
|------|---------|
| [OMDB](https://www.omdbapi.com/) | All movie data, posters, ratings |
| YouTube Search | Trailer links (no API key needed) |
| IMDb | Direct movie page links |

## 📁 Files

- `index.html` — Main page
- `favorites.html` — Saved movies
- `script.js` — All logic (OMDB only)
- `style.css` — Styling
