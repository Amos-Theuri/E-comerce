// --- Navigation Drawer ---
const bar = document.getElementById("bar");
const close = document.getElementById("close");
const nav = document.getElementById("navbar");

if (bar && nav) {
  bar.addEventListener("click", () => {
    nav.classList.add("active");
  });
}

if (close && nav) {
  close.addEventListener("click", () => {
    nav.classList.remove("active");
  });
}

// Close drawer when clicking outside on mobile
document.addEventListener("click", (e) => {
  if (
    nav &&
    nav.classList.contains("active") &&
    !nav.contains(e.target) &&
    bar &&
    !bar.contains(e.target)
  ) {
    nav.classList.remove("active");
  }
});

// --- Modern Dark Mode Management ---
const THEME_STORAGE_KEY = "storefront_theme";

function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === "dark" || saved === "light") {
    return saved;
  }
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.setAttribute("data-theme", theme);

  if (document.body) {
    document.body.classList.toggle("dark-mode", isDark);
  }

  // Update all toggle icons (desktop & mobile)
  const toggles = document.querySelectorAll(".theme-toggle, #darkmode");
  toggles.forEach((el) => {
    if (isDark) {
      el.classList.remove("ri-moon-line", "ri-contrast-2-fill");
      el.classList.add("ri-sun-line");
      el.setAttribute("title", "Switch to light mode");
      el.setAttribute("aria-label", "Switch to light mode");
    } else {
      el.classList.remove("ri-sun-line", "ri-contrast-2-fill");
      el.classList.add("ri-moon-line");
      el.setAttribute("title", "Switch to dark mode");
      el.setAttribute("aria-label", "Switch to dark mode");
    }
  });
}

function toggleTheme() {
  const current =
    document.documentElement.getAttribute("data-theme") ||
    (document.body && document.body.classList.contains("dark-mode") ? "dark" : "light");
  const next = current === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_STORAGE_KEY, next);
  applyTheme(next);
}

// Global backward compatibility
window.myFunction = toggleTheme;

function initTheme() {
  applyTheme(getPreferredTheme());

  const toggles = document.querySelectorAll(".theme-toggle, #darkmode");
  toggles.forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      toggleTheme();
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTheme);
} else {
  initTheme();
}

// Listen for system theme changes if user has not explicitly chosen
if (window.matchMedia) {
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
      applyTheme(e.matches ? "dark" : "light");
    }
  });
}

// --- Star Rating Functionality ---
function myFunction1() {
  const element = document.body;
  element.classList.toggle("star-fill");
}
