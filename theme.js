(function initThemeModule() {
  const STORAGE_KEY = "pe-theme";

  function normalizeTheme(value) {
    return value === "dark" ? "dark" : "light";
  }

  function getStoredTheme() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? normalizeTheme(stored) : null;
    } catch {
      return null;
    }
  }

  function prefersDarkTheme() {
    try {
      return Boolean(window.matchMedia?.("(prefers-color-scheme: dark)")?.matches);
    } catch {
      return false;
    }
  }

  function setDocumentTheme(theme) {
    document.documentElement.dataset.theme = normalizeTheme(theme);
  }

  function getDocumentTheme() {
    return normalizeTheme(document.documentElement.dataset.theme);
  }

  function setToggleUi(toggle, theme) {
    const normalized = normalizeTheme(theme);
    toggle.setAttribute("aria-pressed", String(normalized === "dark"));
    toggle.textContent = normalized === "dark" ? "Light mode" : "Dark mode";
  }

  function applyTheme(theme, { persist } = { persist: false }) {
    const normalized = normalizeTheme(theme);
    setDocumentTheme(normalized);

    const toggle = document.getElementById("themeToggle");
    if (toggle) {
      setToggleUi(toggle, normalized);
    }

    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, normalized);
      } catch {
        // Ignore if storage is unavailable.
      }
    }
  }

  // Set theme ASAP (script is loaded in <head>).
  const storedTheme = getStoredTheme();
  const initialTheme = storedTheme || (prefersDarkTheme() ? "dark" : "light");
  setDocumentTheme(initialTheme);

  function bindThemeToggle() {
    const toggle = document.getElementById("themeToggle");
    if (!toggle) return;
    if (toggle.dataset.themeToggleBound === "true") return;
    toggle.dataset.themeToggleBound = "true";

    setToggleUi(toggle, getDocumentTheme());

    toggle.addEventListener("click", () => {
      const nextTheme = getDocumentTheme() === "dark" ? "light" : "dark";
      applyTheme(nextTheme, { persist: true });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindThemeToggle);
  } else {
    bindThemeToggle();
  }
})();
