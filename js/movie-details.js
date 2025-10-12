// frontend/js/movie-details.js
import { getMovieById } from './api.js';

// --- DOM Elements ---
const mainContent = document.getElementById('details-main-content');

/**
 * Displays a loading message.
 */
function showLoading() {
    mainContent.innerHTML = '<p class="loading-state">Laddar filmdetaljer...</p>';
}

/**
 * Displays an error message.
 * @param {string} message - The error message to display.
 */
function showError(message) {
    mainContent.innerHTML = `<p class="error-state">Fel: ${message}</p>`;
}

/**
 * Renders the movie details on the page.
 * @param {Object} movie - The movie data object.
 */
function renderMovieDetails(movie) {
    // Clear the loading/error message
    mainContent.innerHTML = '';

    // Set the document title
    document.title = `${movie.title} - Filmwebbsida`;

    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'details-container';

    const genrePills = movie.genre.map(g => `<span class="genre-pill">${g}</span>`).join('');

    detailsContainer.innerHTML = `
        <a href="filmer.html" class="back-btn">&larr; Tillbaka till alla filmer</a>
        
        <div class="details-header">
            <h2>${movie.title}</h2>
        </div>

        <div class="poster-info">
            <img 
                src="${movie.imageUrl || './assets/images/placeholder.jpg'}" 
                alt="Poster for ${movie.title}"
                onerror="this.onerror=null; this.src='./assets/images/placeholder.jpg';"
            >
            <div class="movie-specs">
                <div class="metadata-row">
                    <strong>Genre:</strong> ${genrePills}
                </div>
                <div class="metadata-row">
                    <strong>Regissör:</strong> ${movie.director}
                </div>
                <div class="metadata-row">
                    <strong>År:</strong> ${movie.year}
                </div>
                <div class="metadata-row">
                    <strong>Betyg:</strong> ⭐️ ${movie.rating} / 10
                </div>
                <h3>Handling</h3>
                <p>${movie.description}</p>
            </div>
        </div>
    `;

    mainContent.appendChild(detailsContainer);
}

/**
 * Main function to initialize the page.
 */
async function init() {
    // 1. Get the movie ID from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    if (!movieId) {
        showError('Inget film-ID angivet.');
        return;
    }

    // 2. Show loading state and fetch data
    showLoading();
    try {
        const movie = await getMovieById(movieId);
        renderMovieDetails(movie);
    } catch (error) {
        showError(error.message);
    }
}

// --- Initialize the page on DOM load ---
document.addEventListener('DOMContentLoaded', init);


