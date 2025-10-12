import { getMovieById, removeFavoriteMovie } from './api.js'; // Assuming getMovieById is in api.js

document.addEventListener('DOMContentLoaded', async () => {
    const profileUsername = document.getElementById('profileUsername');
    const profileEmail = document.getElementById('profileEmail');
    const logoutBtn = document.getElementById('logoutBtn');
    const favoriteMoviesGrid = document.getElementById('favoriteMoviesGrid');

    // Function to fetch user data
    const fetchUserProfile = async () => {
        try {
            const response = await fetch('/api/auth/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const user = data.data;
                profileUsername.textContent = user.username;
                profileEmail.textContent = user.email;

                // Fetch and display favorite movies
                if (user.favoriteMovieIds && user.favoriteMovieIds.length > 0) {
                    favoriteMoviesGrid.innerHTML = ''; // Clear any loading message
                    for (const movieId of user.favoriteMovieIds) {
                        try {
                            const movie = await getMovieById(movieId);
                            renderMovieCard(movie, favoriteMoviesGrid);
                        } catch (error) {
                            console.error(`Error fetching favorite movie ${movieId}:`, error);
                            // Optionally display a placeholder or error for this specific movie
                        }
                    }
                } else {
                    favoriteMoviesGrid.innerHTML = '<p>No favorite movies added yet.</p>';
                }

            } else {
                // If not authenticated, redirect to login page
                window.location.href = 'auth.html';
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            window.location.href = 'auth.html'; // Redirect on network error
        }
    };

    // Function to render a single movie card (reused from movies.js/carousel.js)
    const renderMovieCard = (movie, container) => {
        const card = document.createElement('div');
        card.className = 'movie-card';

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
            <button class="remove-favorite-button" data-id="${movie._id}">Ta bort från favoriter</button>
        `;
        container.appendChild(card);
    };

    // Handle Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/auth/logout', { // Need to implement logout route
                    method: 'GET',
                });

                if (response.ok) {
                    window.location.href = 'auth.html'; // Redirect to login after logout
                } else {
                    console.error('Logout failed:', await response.json());
                    alert('Logout failed. Please try again.');
                }
            } catch (error) {
                console.error('Logout error:', error);
                alert('Network error during logout. Please try again.');
            }
        });
    }

    // Initial fetch of user profile
    fetchUserProfile();

    // Event listener for details and remove favorite buttons on favorite movies
    favoriteMoviesGrid.addEventListener('click', async (e) => {
        if (e.target.matches('.details-button')) {
            const movieId = e.target.dataset.id;
            window.location.href = `movie-detalis.html?id=${movieId}`;
        }

        if (e.target.matches('.remove-favorite-button')) {
            const movieId = e.target.dataset.id;
            try {
                await removeFavoriteMovie(movieId);
                alert('Movie removed from favorites!');
                // Re-fetch profile to update the list
                fetchUserProfile();
            } catch (error) {
                console.error('Error removing from favorites:', error);
                alert('Could not remove movie from favorites.');
            }
        }
    });
});