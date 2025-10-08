document.addEventListener('DOMContentLoaded', () => {
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
      themeToggle.textContent = isDark ? "🌙 Switch to Light" : "☀️ Switch to Dark";
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
});