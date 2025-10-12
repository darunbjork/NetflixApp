// frontend/js/premieres.js
import { getMovies, addFavoriteMovie } from './api.js';

// --- DOM Elements ---
const premieresGrid = document.getElementById('premieres-grid');
const loadingMessage = document.getElementById('loading-message');
const errorMessage = document.getElementById('error-message');

function displayError(message) {
    loadingMessage.style.display = 'none';
    premieresGrid.innerHTML = '';
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
        <button class="favorite-button" data-id="${movie._id}">Lägg till i favoriter</button>
    `;
    
    premieresGrid.appendChild(card);
}

/**
 * Main function to fetch and render premiere movies.
 */
async function fetchAndRenderPremieres() {
    loadingMessage.style.display = 'block';
    errorMessage.style.display = 'none';
    premieresGrid.innerHTML = ''; 

    try {
        // Get today's date in YYYY-MM-DD format for filtering
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        // Fetch movies with releaseDate greater than or equal to today
        const movies = await getMovies(`?releaseDate[gte]=${formattedDate}`); 

        loadingMessage.style.display = 'none';
        
        if (movies.length === 0) {
            premieresGrid.innerHTML = '<p class="empty-state">Hittade inga kommande premiärer.</p>';
            return;
        }

        movies.forEach(renderMovie);

    } catch (error) {
        displayError(error.message);
    }
}

// --- Event Listener for Details Button and Favorite Button ---
premieresGrid.addEventListener('click', async (e) => {
    if (e.target.matches('.details-button')) {
        const movieId = e.target.dataset.id;
        window.location.href = `movie-detalis.html?id=${movieId}`;
    }

    if (e.target.matches('.favorite-button')) {
        const movieId = e.target.dataset.id;
        try {
            await addFavoriteMovie(movieId);
            alert('Movie added to favorites!');
        } catch (error) {
            console.error('Error adding to favorites:', error);
            alert('Could not add movie to favorites. Please log in.');
        }
    }
});

// Call the main function on DOMContentLoaded
document.addEventListener('DOMContentLoaded', fetchAndRenderPremieres);