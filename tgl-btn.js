const toggleBtn = document.getElementById("toggleBtn");
const controls = document.querySelector(".controls");
const backdrop = document.getElementById("sidebarBackdrop");
const mobileViewport = window.matchMedia("(max-width: 979px)");

function syncSidebarAccessibility(isOpen) {
  backdrop?.classList.toggle("active", isOpen);
  backdrop?.setAttribute("aria-hidden", String(!isOpen));

  if (toggleBtn) {
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
    toggleBtn.setAttribute("aria-label", isOpen ? "Close filters" : "Open filters");
  }
}

function setSidebarOpen(isOpen) {
  if (!controls) return;

  if (!mobileViewport.matches) {
    controls.classList.remove("open");
    syncSidebarAccessibility(false);
    return;
  }

  controls.classList.toggle("open", isOpen);
  syncSidebarAccessibility(isOpen);
}

function toggleSidebar() {
  if (!controls || !mobileViewport.matches) return;
  setSidebarOpen(!controls.classList.contains("open"));
}

toggleBtn?.addEventListener("click", toggleSidebar);
backdrop?.addEventListener("click", () => setSidebarOpen(false));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setSidebarOpen(false);
  }
});

mobileViewport.addEventListener("change", () => {
  setSidebarOpen(false);
});

setSidebarOpen(false);
