document.addEventListener('DOMContentLoaded', () => {
    const BASE_API_URL = 'http://localhost:3000';
    const showLoginBtn = document.getElementById('showLogin');
    const showRegisterBtn = document.getElementById('showRegister');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginStatus = document.getElementById('loginStatus');
    const registerStatus = document.getElementById('registerStatus');

    // Function to toggle between login and register forms
    const toggleForms = (showLogin) => {
        if (showLogin) {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
            showLoginBtn.classList.add('active');
            showRegisterBtn.classList.remove('active');
        } else {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            showLoginBtn.classList.remove('active');
            showRegisterBtn.classList.add('active');
        }
        loginStatus.textContent = ''; // Clear messages
        registerStatus.textContent = '';
    };

    // Event listeners for form toggles
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', () => toggleForms(true));
    }
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', () => toggleForms(false));
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
                    registerStatus.textContent = 'Registration successful! Logging in and redirecting...';
                    registerStatus.style.color = 'green';
                    // After successful registration, automatically log in and redirect
                    window.location.href = 'auth.html'; // Redirect to login page
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