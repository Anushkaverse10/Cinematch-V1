const API_KEY = "8ee85dfe8bd1583b6f33c83e7b52317c";

function getMovies() {
    const genre = document.getElementById("genre").value;
    const language = document.getElementById("language").value;

    document.getElementById("movies").innerHTML = "Loading... 🎬";

    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genre}&with_original_language=${language}`)
        .then(res => res.json())
        .then(data => displayMovies(data.results))
        .catch(() => {
            document.getElementById("movies").innerHTML = "⚠️ Failed to load movies. Try again.";
        });

    const genreText = document.getElementById("genre").selectedOptions[0].text;
    const langText = document.getElementById("language").selectedOptions[0].text;

    document.querySelector("h1").innerText = `🎬 ${genreText} (${langText}) Movies`;
}
function getUnderrated() {
    const language = document.getElementById("language").value;
    
    document.getElementById("movies").innerHTML = "Loading hidden gems... 💎";
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&vote_average.gte=7&vote_count.gte=50&sort_by=vote_count.asc&with_original_language=${language}`)
        .then(res => res.json())
        .then(data => displayMovies(data.results));
}

function getUpcoming() {
    fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(data => displayMovies(data.results));
}

function getBlockbusters() {
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`)
        .then(res => res.json())
        .then(data => displayMovies(data.results));
}

function getSimilar() {
    const query = document.getElementById("search").value;

    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`)
        .then(res => res.json())
        .then(data => displayMovies(data.results));
}

function getInTheatres() {
    fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(data => displayMovies(data.results));
}

function searchMovie() {
    const query = document.getElementById("search").value;
    const language = document.getElementById("language").value;

    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`)
        .then(res => res.json())
        .then(data => displayMovies(data.results));
}

function displayMovies(movies) {
    const moviesDiv = document.getElementById("movies");
    moviesDiv.innerHTML = "";

    if (!movies || movies.length === 0) {
        moviesDiv.innerHTML = "No movies found 😢";
        return;
    }

   movies.forEach((movie, index) => {

    const movieElement = document.createElement("div");
    movieElement.classList.add("movie");

    movieElement.innerHTML = `
        <img src="${movie.poster_path ? 'https://image.tmdb.org/t/p/w300' + movie.poster_path : 'https://via.placeholder.com/300x450'}" />
        <h3>${movie.title}</h3>
        <p>⭐ ${movie.vote_average}</p>
        <p id="platform-${movie.id}">Checking availability...</p>
        <p>${movie.overview ? movie.overview.substring(0, 100) : "No description available"}...</p>
        <button onclick="getTrailer(${movie.id})">▶ Trailer</button>
        <button onclick='addToFavorites(${JSON.stringify(movie)})'>❤️ Save</button>
    `;

    moviesDiv.appendChild(movieElement);

    setTimeout(() => {
        if (movie.id) getPlatform(movie.id);
    }, index * 300);

});
}

function getTrailer(movieId) {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                const trailer = data.results.find(v => v.type === "Trailer");
                if (trailer) {
                    window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_blank");
                } else {
                    alert("No trailer found 😢");
                }
            }
        });
}

function getPlatform(movieId) {
    if (!movieId) return;

    fetch(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            const platformText = document.getElementById(`platform-${movieId}`);
            if (!platformText) return;

            if (data.results && data.results.IN && data.results.IN.flatrate) {
                const platforms = data.results.IN.flatrate.map(p => p.provider_name);

                const logos = {
                    "Netflix": "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
                    "Amazon Prime Video": "https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png",
                    "Disney Plus": "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg",
                    "Hulu": "https://upload.wikimedia.org/wikipedia/commons/e/e4/Hulu_Logo.svg",
                    "SonylLIV": "https://upload.wikimedia.org/wikipedia/en/0/0e/SonyLIV_logo.png",
                    "Zee5": "https://upload.wikimedia.org/wikipedia/en/8/8e/ZEE5_logo.png",
                    "Hotstar": "https://upload.wikimedia.org/wikipedia/en/1/1b/Disney%2B_Hotstar_logo.svg",
                    "Voot": "https://upload.wikimedia.org/wikipedia/en/4/4e/Voot_logo.png",
                    "MX Player": "https://upload.wikimedia.org/wikipedia/en/5/5e/MX_Player_logo.png",
                    "Sony Crackle": "https://upload.wikimedia.org/wikipedia/en/0/0e/SonyLIV_logo.png",
                    "Apple TV Plus": "https://upload.wikimedia.org/wikipedia/en/1/1b/Apple_TV_Plus_logo.svg",
                    "HBO Max": "https://upload.wikimedia.org/wikipedia/en/1/1b/HBO_Max_Logo.svg",
                    "Peacock": "https://upload.wikimedia.org/wikipedia/en/1/1b/Peacock_Logo.svg",
                    "Paramount Plus": "https://upload.wikimedia.org/wikipedia/en/1/1b/Paramount_Plus_logo.svg",
                    "Starz": "https://upload.wikimedia.org/wikipedia/en/1/1b/Starz_logo.svg",
                    "Hoichoi": "https://upload.wikimedia.org/wikipedia/en/1/1b/Hoichoi_logo.png",
                };

                let html = "📺 ";

                platforms.forEach(p => {
                    if (logos[p]) {
                        html += `<img src="${logos[p]}" width="40" style="margin:5px;">`;
                    } else {
                        html += `<span>${p}</span>`;
                    }
                });

                platformText.innerHTML = html;
            } else {
                platformText.innerHTML = "❌ Not available on major platforms";
            }
        })
        .catch(() => {
            const el = document.getElementById(`platform-${movieId}`);
            if (el) el.innerHTML = "Error loading platform";
        });
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function loadHero() {
    fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            const movie = data.results[0];

            const hero = document.getElementById("hero");

            hero.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
            hero.innerHTML = `
                <div class="hero-content">
                    <h2>${movie.title}</h2>
                    <p>${movie.overview.substring(0, 150)}...</p>
                    <button onclick="getTrailer(${movie.id})">▶ Play Trailer</button>
                </div>
            `;
        });
}

function loadTrending() {
    fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            const trendingDiv = document.getElementById("trending");
            trendingDiv.innerHTML = "";

            data.results.forEach(movie => {
                const div = document.createElement("div");

                div.innerHTML = `
                    <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" />
                `;

                trendingDiv.appendChild(div);
            });
        });
}

window.onload = function () {
    loadHero();
    loadTrending();
};

function addToFavorites(movie) {
    let favs = JSON.parse(localStorage.getItem("favorites")) || [];

    if (!favs.find(m => m.id === movie.id)) {
        favs.push(movie);
        localStorage.setItem("favorites", JSON.stringify(favs));
        alert("Added to favorites ❤️");
    } else {
        alert("Already in favorites 😏");
    }
}