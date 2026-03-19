// Get references to the elements
const toggleBtn = document.getElementById('toggleBtn');
const controls = document.querySelector('.controls');
const backdrop = document.getElementById('sidebarBackdrop');

// Function to open/close the sidebar
function setSidebarOpen(isOpen) {
  controls.classList.toggle('open', isOpen);           // Add/remove .open class
  backdrop?.classList.toggle('active', isOpen);        // Show/hide backdrop
  backdrop?.setAttribute('aria-hidden', String(!isOpen)); // Hide from screen readers
  toggleBtn.setAttribute('aria-expanded', String(isOpen)); // Update toggle button state
  toggleBtn.setAttribute('aria-label', isOpen ? 'Close filters' : 'Open filters');
}

// Helper to toggle the current state
function toggleSidebar() {
  setSidebarOpen(!controls.classList.contains('open'));
}

// Click the button to toggle
toggleBtn.addEventListener('click', toggleSidebar);

// Click the backdrop to close
backdrop?.addEventListener('click', () => setSidebarOpen(false));

// Press Escape to close
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setSidebarOpen(false);
  }
});