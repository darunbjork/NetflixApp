// frontend/js/movies.js
import { getMovies } from './api.js';

// --- DOM Elements ---
const movieGrid = document.getElementById('movie-grid');
const loadingMessage = document.getElementById('loading-message');
const errorMessage = document.getElementById('error-message');
// New element for filter buttons
const filterContainer = document.getElementById('filter-container'); 

// ... (displayError function remains the same)
function displayError(message) {
    loadingMessage.style.display = 'none';
    movieGrid.innerHTML = '';
    errorMessage.style.display = 'block';
    errorMessage.textContent = `Fel: ${message}`;
}

/**
 * Renders a single movie object as a card.
 * @param {Object} movie - The movie data object.
 */
function renderMovie(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    
    // Create genre pills dynamically
    const genrePills = movie.genre.map(g => `<span class="genre-pill">${g}</span>`).join('');
    
    // Use template literals for clean HTML generation
    card.innerHTML = `
        <img 
            src="${movie.imageUrl || './assets/images/placeholder.jpg'}" 
            alt="${movie.title} poster" 
            onerror="this.onerror=null; this.src='./assets/images/placeholder.jpg';"
        >
        <div class="card-info">
            <h3>${movie.title} (${movie.year})</h3>
            <div class="genre-list">${genrePills}</div>
            <p class="rating">⭐️ ${movie.rating} / 10</p>
            <p class="description">${(movie.description || '').substring(0, 100)}...</p>
        </div>
        <button class="details-button" data-id="${movie._id}">Visa Detaljer</button>
    `;
    
    movieGrid.appendChild(card);
}

/**
 * Extracts unique genres and creates filter buttons.
 * @param {Object[]} movies - Array of all movies.
 */
function setupGenreFilters(movies) {
    const allGenres = movies.flatMap(movie => movie.genre);
    // Use Set to get unique genres, then convert back to Array and sort
    const uniqueGenres = [...new Set(allGenres)].sort();

    // Add 'All' button first
    let filterHTML = '<button class="filter-btn active" data-genre="all">Alla</button>';

    // Add buttons for each unique genre
    uniqueGenres.forEach(genre => {
        filterHTML += `<button class="filter-btn" data-genre="${genre}">${genre}</button>`;
    });

    filterContainer.innerHTML = filterHTML;
    
    // Attach event listener to the container
    filterContainer.addEventListener('click', handleFilterClick);
}

/**
 * Handles the click event on a filter button.
 * @param {Event} e - The DOM click event.
 */
function handleFilterClick(e) {
    const button = e.target.closest('.filter-btn');
    if (!button) return;

    const selectedGenre = button.dataset.genre;

    // 1. Update active button class
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // 2. Filter the movies
    let filteredMovies = [];
    if (selectedGenre === 'all') {
        filteredMovies = allMovies;
    } else {
        // Filter movies where the 'genre' array includes the selected genre
        filteredMovies = allMovies.filter(movie => movie.genre.includes(selectedGenre));
    }

    // 3. Render the filtered list
    renderMovieList(filteredMovies);
}

/**
 * Main function to fetch and store ALL movies, then render and set up filters.
 */
let allMovies = []; // Store the full list of movies globally for client-side filtering

async function fetchAndRenderMovies() {
    loadingMessage.style.display = 'block';
    errorMessage.style.display = 'none';
    movieGrid.innerHTML = ''; 

    try {
        // Fetch all movies (no query for now, we filter locally)
        allMovies = await getMovies(); 

        loadingMessage.style.display = 'none';
        
        if (allMovies.length === 0) {
            movieGrid.innerHTML = '<p class="empty-state">Hittade inga filmer. Använd Postman för att lägga till några!</p>';
            return;
        }

        renderMovieList(allMovies); // Initial render
        setupGenreFilters(allMovies); // Set up filter buttons

    } catch (error) {
        displayError(error.message);
    }
}

/**
 * Renders a filtered list of movies.
 * @param {Object[]} moviesToRender - The array of movies to display.
 */
function renderMovieList(moviesToRender) {
    movieGrid.innerHTML = ''; // Clear existing grid
    if (moviesToRender.length === 0) {
        movieGrid.innerHTML = '<p class="empty-state">Inga filmer matchade filtret.</p>';
        return;
    }
    moviesToRender.forEach(renderMovie);
}

// ... (Event listener remains the same)
document.addEventListener('DOMContentLoaded', fetchAndRenderMovies);

// --- Event Listener for Details Button ---
// Use event delegation on the grid to handle clicks on any details button.
movieGrid.addEventListener('click', (e) => {
    // Check if the clicked element is a details button
    if (e.target.matches('.details-button')) {
        const movieId = e.target.dataset.id;
        // Redirect to the details page with the movie ID in the query string
        window.location.href = `movie-details.html?id=${movieId}`;
    }
});

const input = document.getElementById("searchInput");

input.addEventListener("input", () => {
  const searchTerm = input.value.trim().toLowerCase();

  if (searchTerm.length > 0) {
    const filteredMovies = allMovies.filter(movie => movie.title.toLowerCase().startsWith(searchTerm));
    renderMovieList(filteredMovies);
  } else {
    renderMovieList(allMovies);
  }
});