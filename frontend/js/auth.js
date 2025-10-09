document.addEventListener('DOMContentLoaded', () => {
    // Use relative path for API calls, as the backend serves the frontend
    const BASE_API_URL = ''; // This will be relative to the current host

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginStatus = document.getElementById('loginStatus');
    const registerStatus = document.getElementById('registerStatus');

    // Default state: show register form
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
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
                    registerStatus.textContent = 'Registration successful! Please log in.';
                    registerStatus.style.color = 'green';
                    loginForm.style.display = 'block';
                    registerForm.style.display = 'none';
                    loginStatus.textContent = 'Registration successful! Please log in.';
                    loginStatus.style.color = 'green';
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