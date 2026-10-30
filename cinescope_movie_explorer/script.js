// CineScope — interactive movie explorer (vanilla JavaScript).
// Watchlist data is saved in this browser using localStorage.

const movies = [
  {id:1,title:"Interstellar",year:2014,rating:8.7,genre:"Sci-Fi",runtime:"2h 49m",symbol:"✦",palette:["#172c49","#bd754d"],tagline:"Mankind was born on Earth. It was never meant to die here.",description:"A team of explorers travels beyond this galaxy to discover whether mankind has a future among the stars. A moving story about time, love and the people we leave behind.",tags:["Space","Adventure","Drama"],featured:true},
  {id:2,title:"The Grand Budapest Hotel",year:2014,rating:8.1,genre:"Drama",runtime:"1h 39m",symbol:"♜",palette:["#b34b62","#edb77c"],tagline:"A perfectly unusual adventure.",description:"A legendary concierge and his trusted lobby boy become tangled in a story involving a priceless painting, a family fortune and a changing world.",tags:["Comedy","Mystery","Adventure"]},
  {id:3,title:"Spider-Man: Into the Spider-Verse",year:2018,rating:8.4,genre:"Animation",runtime:"1h 57m",symbol:"🕸",palette:["#173c66","#e33c49"],tagline:"What's up, danger?",description:"Miles Morales becomes Spider-Man and meets a team of people from different dimensions who share the same extraordinary responsibility.",tags:["Superhero","Action","Adventure"]},
  {id:4,title:"Dune: Part Two",year:2024,rating:8.5,genre:"Sci-Fi",runtime:"2h 46m",symbol:"◈",palette:["#8a4e2c","#e2b66e"],tagline:"Long live the fighters.",description:"Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",tags:["Epic","Adventure","Drama"]},
  {id:5,title:"Everything Everywhere All at Once",year:2022,rating:7.8,genre:"Sci-Fi",runtime:"2h 19m",symbol:"◎",palette:["#3b286e","#e26c9a"],tagline:"The universe is so much bigger than you realize.",description:"An exhausted laundromat owner is swept into an adventure across the multiverse, where she must connect with alternate versions of herself.",tags:["Multiverse","Comedy","Action"]},
  {id:6,title:"The Dark Knight",year:2008,rating:9.0,genre:"Action",runtime:"2h 32m",symbol:"🦇",palette:["#20252b","#68747c"],tagline:"Why so serious?",description:"Batman faces his greatest psychological and physical test when the Joker brings chaos to Gotham and challenges the city's moral limits.",tags:["Superhero","Crime","Thriller"]},
  {id:7,title:"Your Name",year:2016,rating:8.4,genre:"Animation",runtime:"1h 46m",symbol:"☄",palette:["#294d80","#e69a87"],tagline:"A story that transcends time and space.",description:"Two teenagers find themselves mysteriously connected by a strange phenomenon, sharing lives and memories despite never having met.",tags:["Romance","Fantasy","Drama"]},
  {id:8,title:"Arrival",year:2016,rating:7.9,genre:"Sci-Fi",runtime:"1h 56m",symbol:"◯",palette:["#283e42","#a8b9a5"],tagline:"Why are they here?",description:"A linguist is recruited by the military to communicate with mysterious spacecraft that have landed around the world.",tags:["Mystery","Drama","Aliens"]},
  {id:9,title:"Whiplash",year:2014,rating:8.5,genre:"Drama",runtime:"1h 47m",symbol:"♫",palette:["#512e2b","#d08b52"],tagline:"The road to greatness can take you to the edge.",description:"A promising young drummer enrolls at a demanding music conservatory, where an intense instructor pushes him beyond his limits.",tags:["Music","Psychological","Drama"]},
  {id:10,title:"Mad Max: Fury Road",year:2015,rating:8.1,genre:"Action",runtime:"2h 00m",symbol:"⚡",palette:["#a44724","#e7b15e"],tagline:"What a lovely day.",description:"In a post-apocalyptic wasteland, Max joins Furiosa in a high-speed escape from a tyrannical ruler and his army.",tags:["Action","Adventure","Dystopian"]},
  {id:11,title:"Coco",year:2017,rating:8.4,genre:"Animation",runtime:"1h 45m",symbol:"✿",palette:["#6b3474","#e8a64e"],tagline:"The celebration of a lifetime.",description:"A young music-loving boy journeys into the Land of the Dead to uncover his family's history and discover the truth about his dreams.",tags:["Family","Music","Fantasy"]},
  {id:12,title:"The Truman Show",year:1998,rating:8.2,genre:"Drama",runtime:"1h 43m",symbol:"☀",palette:["#3a7473","#d6c17c"],tagline:"On the air. Unaware.",description:"An ordinary man begins to suspect that his picture-perfect town is actually a massive television set and everyone around him is an actor.",tags:["Comedy","Drama","Sci-Fi"]}
];

const grid = document.getElementById("movie-grid");
const searchInput = document.getElementById("search-input");
const filters = document.getElementById("filters");
const sortSelect = document.getElementById("sort-select");
const resultCount = document.getElementById("result-count");
const noResults = document.getElementById("no-results");
const modal = document.getElementById("movie-modal");
const toast = document.getElementById("toast");

let activeGenre = "All";
let watchlistOnly = false;
let currentMovieId = null;
let toastTimer;

function getWatchlist() {
  try {
    const parsed = JSON.parse(localStorage.getItem("cinescope_watchlist") || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}
function saveWatchlist(ids) {
  localStorage.setItem("cinescope_watchlist", JSON.stringify(ids));
  updateWatchlistCount();
}
function updateWatchlistCount() {
  document.getElementById("watchlist-count").textContent = getWatchlist().length;
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}
function posterBackground(movie) {
  return `linear-gradient(145deg, ${movie.palette[0]}, ${movie.palette[1]})`;
}
function toggleWatchlist(id) {
  const list = getWatchlist();
  const exists = list.includes(id);
  saveWatchlist(exists ? list.filter(item => item !== id) : [...list, id]);
  showToast(exists ? "Removed from your watchlist" : "Added to your watchlist");
  renderMovies();
  if (currentMovieId === id && modal.classList.contains("open")) updateModalButton();
}
function createMovieCard(movie) {
  const saved = getWatchlist().includes(movie.id);
  const card = document.createElement("article");
  card.className = "movie-card";
  card.innerHTML = `
    <div class="poster" style="background:${posterBackground(movie)}">
      <span class="poster-kicker">CINESCOPE ORIGINALS</span>
      <span class="rating">★ ${movie.rating.toFixed(1)}</span>
      <button class="favorite-btn ${saved ? "saved" : ""}" type="button" aria-label="${saved ? "Remove from" : "Add to"} watchlist">${saved ? "♥" : "♡"}</button>
      <span class="poster-art" aria-hidden="true">${movie.symbol}</span>
      <span class="poster-title">${movie.title}</span>
    </div>
    <div class="movie-info"><span class="movie-name">${movie.title}</span><span class="movie-year">${movie.year}</span></div>
    <div class="movie-genre">${movie.genre} <span>·</span> ${movie.runtime}</div>`;
  card.querySelector(".favorite-btn").addEventListener("click", event => {
    event.stopPropagation();
    toggleWatchlist(movie.id);
  });
  card.querySelector(".poster").addEventListener("click", () => openModal(movie.id));
  card.querySelector(".movie-info").addEventListener("click", () => openModal(movie.id));
  return card;
}
function getVisibleMovies() {
  const query = searchInput.value.trim().toLowerCase();
  let result = movies.filter(movie => {
    const matchesGenre = activeGenre === "All" || movie.genre === activeGenre;
    const matchesWatchlist = !watchlistOnly || getWatchlist().includes(movie.id);
    const searchable = `${movie.title} ${movie.genre} ${movie.year} ${movie.tags.join(" ")}`.toLowerCase();
    return matchesGenre && matchesWatchlist && searchable.includes(query);
  });
  const sort = sortSelect.value;
  if (sort === "rating") result.sort((a,b) => b.rating-a.rating);
  if (sort === "year") result.sort((a,b) => b.year-a.year);
  if (sort === "title") result.sort((a,b) => a.title.localeCompare(b.title));
  return result;
}
function renderMovies() {
  const visible = getVisibleMovies();
  grid.innerHTML = "";
  visible.forEach(movie => grid.appendChild(createMovieCard(movie)));
  resultCount.textContent = `${visible.length} ${visible.length === 1 ? "title" : "titles"}`;
  noResults.hidden = visible.length > 0;
  grid.hidden = visible.length === 0;
  document.getElementById("section-title").innerHTML = watchlistOnly ? 'Your watchlist<span>.</span>' : 'Explore movies<span>.</span>';
  document.querySelectorAll(".filter").forEach(button => button.classList.toggle("active", button.dataset.genre === activeGenre));
  document.getElementById("watchlist-nav").classList.toggle("active", watchlistOnly);
}
function openModal(id) {
  const movie = movies.find(item => item.id === id);
  if (!movie) return;
  currentMovieId = id;
  const poster = document.getElementById("modal-poster");
  poster.style.background = posterBackground(movie);
  poster.querySelector(".poster-symbol").textContent = movie.symbol;
  document.getElementById("modal-title").textContent = movie.title;
  document.getElementById("modal-kicker").textContent = `${movie.genre.toUpperCase()} · MOVIE DETAILS`;
  document.getElementById("modal-meta").textContent = `${movie.year}  ·  ★ ${movie.rating.toFixed(1)}  ·  ${movie.runtime}`;
  document.getElementById("modal-description").textContent = movie.description;
  const tags = document.getElementById("modal-tags");
  tags.innerHTML = "";
  movie.tags.forEach(tag => {
    const chip = document.createElement("span");
    chip.textContent = tag;
    tags.appendChild(chip);
  });
  updateModalButton();
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function updateModalButton() {
  const saved = getWatchlist().includes(currentMovieId);
  document.getElementById("modal-watchlist").textContent = saved ? "♥ Remove from watchlist" : "＋ Add to watchlist";
}
function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  currentMovieId = null;
}

filters.addEventListener("click", event => {
  const button = event.target.closest(".filter");
  if (!button) return;
  activeGenre = button.dataset.genre;
  watchlistOnly = false;
  renderMovies();
});
searchInput.addEventListener("input", renderMovies);
sortSelect.addEventListener("change", renderMovies);
document.getElementById("watchlist-nav").addEventListener("click", () => {
  watchlistOnly = !watchlistOnly;
  activeGenre = "All";
  searchInput.value = "";
  renderMovies();
  document.getElementById("library").scrollIntoView({behavior:"smooth"});
});
document.getElementById("modal-close").addEventListener("click", closeModal);
modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeModal();
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.focus();
    document.getElementById("library").scrollIntoView({behavior:"smooth"});
  }
});
document.getElementById("modal-watchlist").addEventListener("click", () => {
  if (currentMovieId !== null) toggleWatchlist(currentMovieId);
});
document.getElementById("reset-filters").addEventListener("click", () => {
  activeGenre = "All";
  watchlistOnly = false;
  searchInput.value = "";
  sortSelect.value = "featured";
  renderMovies();
});

updateWatchlistCount();
renderMovies();
