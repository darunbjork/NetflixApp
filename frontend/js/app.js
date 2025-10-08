document.addEventListener('DOMContentLoaded', async () => {
  const themeToggle = document.getElementById("darkToggle");
  const body = document.body;

  // Function to apply the theme
  const applyTheme = (isDark) => {
    if (isDark) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
    if (themeToggle) {
      themeToggle.textContent = isDark ? "🌙 Light" : "☀️ Dark";
    }
  };

  // Check localStorage for saved theme preference
  let isDark = localStorage.getItem("isDark") === "true";
  applyTheme(isDark);

  // Add event listener to the toggle button
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      isDark = !isDark;
      localStorage.setItem("isDark", isDark);
      applyTheme(isDark);
    });
  }

  // --- Authentication Status Check and Navbar Update ---
  const updateNavbarLinks = async () => {
    const profileLink = document.querySelector('#navbar a[href="profile.html"]');
    const authDropdown = document.querySelector('.auth-dropdown');
    const authDropdownContent = document.getElementById('auth-dropdown-content');

    if (!profileLink || !authDropdown || !authDropdownContent) return;

    // Clear existing dynamic links in the dropdown
    authDropdownContent.innerHTML = '';

    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // User is logged in
        profileLink.style.display = 'block'; // Show Profile link
        authDropdown.style.display = 'inline-block'; // Show Account dropdown

        // Add Logout link to the dropdown
        const logoutLink = document.createElement('a');
        logoutLink.classList.add('logout-dropdown-link');
        logoutLink.href = '#';
        logoutLink.textContent = 'Logout';
        logoutLink.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const logoutResponse = await fetch('/api/auth/logout', { method: 'GET' });
                if (logoutResponse.ok) {
                    window.location.href = 'auth.html';
                } else {
                    alert('Logout failed. Please try again.');
                }
            } catch (error) {
                console.error('Logout error:', error);
                alert('Network error during logout. Please try again.');
            }
        });
        authDropdownContent.appendChild(logoutLink);

      } else {
        // User is not logged in
        profileLink.style.display = 'none'; // Hide Profile link

        // Add Login/Register link to the dropdown
        authDropdownContent.innerHTML += '<a href="auth.html">Login/Register</a>';
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
      // Assume not logged in on network error
      profileLink.style.display = 'none'; // Hide Profile link
      authDropdownContent.innerHTML += '<a href="auth.html">Login/Register</a>';
    }
  };

  // Call the function to update navbar links on page load
  updateNavbarLinks();
});