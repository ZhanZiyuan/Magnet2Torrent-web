document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const toggleButton = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");

    const setTheme = (mode) => {
        body.classList.remove("light-mode", "dark-mode");
        body.classList.add(mode + "-mode");
        themeIcon.textContent = mode === "dark" ? "dark_mode" : "light_mode";
    };

    // Detect system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    let currentTheme = prefersDark ? "dark" : "light";
    setTheme(currentTheme);

    toggleButton.addEventListener("click", () => {
        currentTheme = currentTheme === "light" ? "dark" : "light";
        setTheme(currentTheme);
    });
});
