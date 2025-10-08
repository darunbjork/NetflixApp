import { getMovies } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const carouselContainer = document.getElementById('movie-carousel');

    if (carouselContainer) {
        const movies = await getMovies();

        movies.forEach(movie => {
            const slide = document.createElement('div');
            slide.classList.add('carousel-slide');

            const card = document.createElement('div');
            card.classList.add('movie-card');

            card.innerHTML = `
                <img src="${movie.imageUrl || './assets/images/placeholder.jpg'}" alt="${movie.title} poster">
                <div class="card-info">
                    <h3>${movie.title}</h3>
                    <p class="rating">⭐️ ${movie.rating} / 10</p>
                </div>
                <button class="details-button" data-id="${movie._id}">Visa Detaljer</button>
            `;

            slide.appendChild(card);
            carouselContainer.appendChild(slide);
        });
        

        let isDown = false;
        let startX;
        let scrollLeft;

        carouselContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            carouselContainer.classList.add('active');
            startX = e.pageX - carouselContainer.offsetLeft;
            scrollLeft = carouselContainer.scrollLeft;
        });

        carouselContainer.addEventListener('mouseleave', () => {
            isDown = false;
            carouselContainer.classList.remove('active');
        });

        carouselContainer.addEventListener('mouseup', () => {
            isDown = false;
            carouselContainer.classList.remove('active');
        });

        carouselContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carouselContainer.offsetLeft;
            const walk = (x - startX) * 2; //scroll-fast
            carouselContainer.scrollLeft = scrollLeft - walk;
        });

        carouselContainer.addEventListener('click', (e) => {
            if (e.target.matches('.details-button')) {
                const movieId = e.target.dataset.id;
                window.location.href = `movie-details.html?id=${movieId}`;
            }
        });
    }
});