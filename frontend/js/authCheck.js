document.addEventListener('DOMContentLoaded', async () => {
    const protectedRoutes = [
        'index.html',
        'filmer.html',
        'movie-detalis.html',
        'profile.html'
    ];

    const currentPage = window.location.pathname.split('/').pop();

    if (protectedRoutes.includes(currentPage)) {
        try {
            const response = await fetch('/api/auth/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                // Not authenticated, redirect to login
                window.location.href = 'auth.html';
            }
            // If authenticated, proceed to load the page
        } catch (error) {
            console.error('Authentication check failed:', error);
            // Network error or server unreachable, redirect to login
            window.location.href = 'auth.html';
        }
    }
});