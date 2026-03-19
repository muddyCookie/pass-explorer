(function initThemeToggle() {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;
  if (toggle.dataset.themeToggleBound === "true") return;
  toggle.dataset.themeToggleBound = "true";

  function getTheme() {
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  }

  function applyTheme(theme, { persist } = { persist: false }) {
    const normalized = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = normalized;
    toggle.setAttribute("aria-pressed", String(normalized === "dark"));
    toggle.textContent = normalized === "dark" ? "Light mode" : "Dark mode";

    if (persist) {
      try {
        localStorage.setItem("pe-theme", normalized);
      } catch (err) {
        // Ignore if storage is unavailable.
      }
    }
  }

  applyTheme(getTheme(), { persist: false });

  toggle.addEventListener("click", () => {
    const nextTheme = getTheme() === "dark" ? "light" : "dark";
    applyTheme(nextTheme, { persist: true });
  });
})();
