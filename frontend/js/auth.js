document.addEventListener('DOMContentLoaded', () => {
    // Use relative path for API calls, as the backend serves the frontend
    const BASE_API_URL = ''; // This will be relative to the current host

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginStatus = document.getElementById('loginStatus');
    const registerStatus = document.getElementById('registerStatus');

    // --- Handle URL parameters for post-registration redirect ---
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
        // If redirected after successful registration, show login form
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        loginStatus.textContent = 'Registration successful! Please log in.';
        loginStatus.style.color = 'green';
        // Clear the query parameter from the URL
        window.history.replaceState({}, document.title, window.location.pathname);
    } else {
        // Default state: show register form
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }


    // Handle Login Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            loginStatus.textContent = 'Logging in...';
            loginStatus.style.color = 'blue';

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await fetch(`${BASE_API_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    loginStatus.textContent = 'Login successful! Redirecting...';
                    loginStatus.style.color = 'green';
                    // Redirect to home page or user profile
                    window.location.href = 'index.html'; // Or 'profile.html' later
                } else {
                    loginStatus.textContent = data.message || data.error || 'Login failed.';
                    loginStatus.style.color = 'red';
                }
            } catch (error) {
                console.error('Login error:', error);
                loginStatus.textContent = 'Network error. Please try again.';
                loginStatus.style.color = 'red';
            }
        });
    }

    // Handle Register Form Submission
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            registerStatus.textContent = 'Registering...';
            registerStatus.style.color = 'blue';

            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;

            try {
                const response = await fetch(`${BASE_API_URL}/api/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('Registration successful! Redirecting to auth.html?registered=true...');
                    window.location.href = 'auth.html?registered=true'; // Redirect with query param
                } else {
                    registerStatus.textContent = data.message || data.error || 'Registration failed.';
                    registerStatus.style.color = 'red';
                }
            } catch (error) {
                console.error('Registration error:', error);
                registerStatus.textContent = 'Network error. Please try again.';
                registerStatus.style.color = 'red';
            }
        });
    }
});