 
const OMDB_KEY = "10cd594e"; 

// ─── Curated IMDb ID Lists by Category ───────────────────────────────────────

const LISTS = {
  action: [
    "tt0468569","tt0816692","tt1375666","tt4154796","tt0110912",
    "tt0137523","tt0133093","tt6751668","tt0482571","tt1745960",
    "tt0120737","tt0167260","tt0172495","tt2488496","tt3498820"
  ],
  comedy: [
    "tt0109830","tt0116282","tt0209144","tt1285016","tt0107048",
    "tt0377092","tt0211915","tt0367594","tt1596363","tt0110413",
    "tt0118749","tt0451279","tt0381061","tt0478970","tt1790864"
  ],
  drama: [
    "tt0111161","tt0068646","tt0071562","tt0050083","tt0073486",
    "tt0317248","tt0102926","tt0245429","tt0361862","tt0993846",
    "tt0120689","tt0372784","tt0407887","tt1853728","tt0266543"
  ],
  horror: [
    "tt0083658","tt0116922","tt1457767","tt0167404","tt1099212",
    "tt6751668","tt0266697","tt4explainer","tt3532592","tt5715874",
    "tt0078748","tt0081505","tt0080761","tt0087800","tt0259324"
  ],
  scifi: [
    "tt0816692","tt1375666","tt0133093","tt0062622","tt0087182",
    "tt1465522","tt0482571","tt0120915","tt0076759","tt0080684",
    "tt0086190","tt0088763","tt0096874","tt0182789","tt1483013"
  ],
  romance: [
    "tt0109830","tt0054215","tt0381061","tt0758752","tt0266543",
    "tt1457767","tt0116282","tt0311113","tt0120338","tt0393162",
    "tt0293715","tt1663202","tt3783958","tt1872181","tt2096673"
  ],
  thriller: [
    "tt0102926","tt0078748","tt0081505","tt0073195","tt0112641",
    "tt1130884","tt0364569","tt0361862","tt1375666","tt0120601",
    "tt0167404","tt0944947","tt0268978","tt4520988","tt1488589"
  ],
  animation: [
    "tt0245429","tt0317219","tt0266543","tt0120689","tt0435761",
    "tt2380307","tt1798684","tt4633694","tt0892769","tt0198781",
    "tt0382932","tt0266543","tt1055413","tt2543164","tt3606756"
  ],
  blockbusters: [
    "tt4154796","tt4154756","tt2395427","tt0848228","tt1825683",
    "tt0369610","tt3501632","tt1211837","tt3498820","tt4154664",
    "tt2820852","tt6320628","tt1745960","tt0468569","tt0816692"
  ],
  underrated: [
    "tt1375670","tt4729430","tt0338013","tt5090568","tt3783958",
    "tt0477348","tt4846340","tt1798684","tt2096673","tt2582802",
    "tt1291584","tt2024544","tt1130884","tt4189584","tt2948356"
  ],
  hindi: [
    "tt0758752","tt1187043","tt0816951","tt2338151","tt1023714",
    "tt2267998","tt1825544","tt3402236","tt2106476","tt1185420",
    "tt0452611","tt1950838","tt0317219","tt1798684","tt2096673"
  ],
  upcoming: [
    "tt5108870","tt6264654","tt9362722","tt10872600","tt1877830",
    "tt3480822","tt7126948","tt9784798","tt6966692","tt1877830",
    "tt4154796","tt0816692","tt1375666","tt4633694","tt2582802"
  ]
};

// ─── Genre → Category Mapping ────────────────────────────────────────────────
const GENRE_MAP = {
  action: "action",
  comedy: "comedy",
  drama: "drama",
  horror: "horror",
  scifi: "scifi",
  romance: "romance",
  thriller: "thriller",
  animation: "animation",
  crime: "thriller",
  fantasy: "scifi",
  mystery: "thriller",
  hindi: "hindi"
};

// ─── Fetch Single Movie by IMDb ID ───────────────────────────────────────────
async function fetchByID(imdbID) {
  try {
    const res = await fetch(
      `https://www.omdbapi.com/?i=${imdbID}&plot=short&apikey=${OMDB_KEY}`
    );
    const data = await res.json();
    return data.Response === "True" ? data : null;
  } catch {
    return null;
  }
}

// ─── Search by Title ─────────────────────────────────────────────────────────
async function searchByTitle(query, page = 1) {
  try {
    const res = await fetch(
      `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&type=movie&page=${page}&apikey=${OMDB_KEY}`
    );
    const data = await res.json();
    return data.Response === "True" ? data.Search : [];
  } catch {
    return [];
  }
}

// ─── Load & Display a Curated List ───────────────────────────────────────────
async function loadList(ids) {
  showLoading();
  const results = await Promise.all(ids.map(id => fetchByID(id)));
  const movies = results.filter(m => m && m.Poster && m.Poster !== "N/A");
  hideLoading();
  displayMovies(movies);
}

// ─── Category Buttons ─────────────────────────────────────────────────────────
function getMovies() {
  const genre = document.getElementById("genre").value;
  const cat = GENRE_MAP[genre] || "blockbusters";
  loadList(LISTS[cat]);
}

function getBlockbusters() { loadList(LISTS.blockbusters); }
function getUnderrated()   { loadList(LISTS.underrated); }
function getUpcoming()     { loadList(LISTS.upcoming); }
function getInTheatres()   { loadList(LISTS.blockbusters); }

function getSimilar() {
  const q = document.getElementById("search").value.trim();
  if (!q) { alert("Enter a movie name to find similar ones!"); return; }
  // Search by genre of the first result
  searchMovie(true);
}

// ─── Search ──────────────────────────────────────────────────────────────────
async function searchMovie(similar = false) {
  const q = document.getElementById("search").value.trim();
  if (!q) return;

  showLoading();
  const results = await searchByTitle(q);

  if (!results.length) {
    hideLoading();
    document.getElementById("movies").innerHTML =
      `<p style="color:#aaa;grid-column:1/-1">No results found for "<strong>${q}</strong>"</p>`;
    return;
  }

  // Fetch full details for each search result
  const detailed = await Promise.all(
    results.slice(0, 12).map(m => fetchByID(m.imdbID))
  );
  const movies = detailed.filter(m => m && m.Poster && m.Poster !== "N/A");
  hideLoading();
  displayMovies(movies);
}

// ─── Display Movies ───────────────────────────────────────────────────────────
function displayMovies(movies) {
  const div = document.getElementById("movies");
  div.innerHTML = "";

  if (!movies.length) {
    div.innerHTML = `<p style="color:#aaa;grid-column:1/-1">No movies found.</p>`;
    return;
  }

  movies.forEach(m => {
    const el = document.createElement("div");
    el.classList.add("movie");

    // Ratings
    const imdb = m.imdbRating && m.imdbRating !== "N/A"
      ? `<span class="badge imdb">⭐ ${m.imdbRating}</span>` : "";
    const rt = m.Ratings && m.Ratings.find(r => r.Source === "Rotten Tomatoes");
    const rtBadge = rt
      ? `<span class="badge rt">${parseInt(rt.Value) >= 60 ? "🍅" : "🤢"} ${rt.Value}</span>` : "";
    const meta = m.Metascore && m.Metascore !== "N/A"
      ? `<span class="badge meta">🎯 ${m.Metascore}</span>` : "";

    // Extra info
    const genre   = m.Genre   && m.Genre   !== "N/A" ? `<p class="info">🎭 ${m.Genre}</p>` : "";
    const director= m.Director&& m.Director!== "N/A" ? `<p class="info">🎬 ${m.Director}</p>` : "";
    const runtime = m.Runtime && m.Runtime !== "N/A" ? `<p class="info">⏱ ${m.Runtime}</p>` : "";
    const awards  = m.Awards  && m.Awards  !== "N/A" && m.Awards !== "N/A."
      ? `<p class="info awards">🏆 ${m.Awards}</p>` : "";
    const language= m.Language&& m.Language!== "N/A" ? `<p class="info">🌐 ${m.Language.split(",")[0]}</p>` : "";
    const plot    = m.Plot    && m.Plot    !== "N/A"
      ? m.Plot.substring(0, 120) + "..." : "No description available.";

    // Trailer search link (YouTube)
    const trailerURL = `https://www.youtube.com/results?search_query=${encodeURIComponent(m.Title + " " + (m.Year || "") + " official trailer")}`;

    // IMDb link
    const imdbURL = `https://www.imdb.com/title/${m.imdbID}/`;

    const savedMovie = {
      imdbID: m.imdbID,
      Title: m.Title,
      Year: m.Year,
      Poster: m.Poster,
      imdbRating: m.imdbRating,
      Genre: m.Genre,
      Plot: m.Plot
    };

    el.innerHTML = `
      <img src="${m.Poster}" alt="${m.Title}" onerror="this.src='https://placehold.co/300x445/1f1f1f/aaa?text=No+Image'" />
      <h3>${m.Title}</h3>
      <p class="year">📅 ${m.Year || "N/A"}</p>
      <div class="badges">${imdb}${rtBadge}${meta}</div>
      ${genre}${director}${runtime}${language}${awards}
      <p class="desc">${plot}</p>
      <div class="btn-row">
        <a href="${trailerURL}" target="_blank"><button>▶ Trailer</button></a>
        <a href="${imdbURL}" target="_blank"><button class="imdb-btn">IMDb</button></a>
        <button class="fav-btn" onclick='addToFavorites(${JSON.stringify(savedMovie).replace(/'/g, "&#39;")})'>❤️</button>
      </div>
    `;

    div.appendChild(el);
  });
}

// ─── Favorites ────────────────────────────────────────────────────────────────
function addToFavorites(movie) {
  let fav = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!fav.find(m => m.imdbID === movie.imdbID)) {
    fav.push(movie);
    localStorage.setItem("favorites", JSON.stringify(fav));
    alert(`"${movie.Title}" added to favorites ❤️`);
  } else {
    alert("Already in favorites!");
  }
}

// ─── UI Helpers ───────────────────────────────────────────────────────────────
function showLoading() {
  document.getElementById("movies").innerHTML =
    `<p style="color:#aaa;grid-column:1/-1;padding:40px 0">🎬 Loading movies...</p>`;
}

function hideLoading() {}  // cleared by displayMovies

// ─── On Load: Show Blockbusters ───────────────────────────────────────────────
window.onload = () => {
  loadList(LISTS.blockbusters);
};

// ─── Enter key on search ─────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const inp = document.getElementById("search");
  if (inp) inp.addEventListener("keydown", e => { if (e.key === "Enter") searchMovie(); });
});
