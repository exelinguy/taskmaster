// Import the CSS so Webpack bundles it
import "./styles.css";

// Import our page loader functions
import loadHome from "./home";
import loadMenu from "./menu";
import loadReservations from "./reservations";

// Logic to switch tabs
function component() {
  const contentDiv = document.getElementById("content");
  const homeBtn = document.getElementById("home-btn");
  const menuBtn = document.getElementById("menu-btn");
  const resBtn = document.getElementById("reservations-btn");

  // Function to clear the current content
  function clearContent() {
    contentDiv.innerHTML = "";
    // Remove 'active' class from all buttons
    homeBtn.classList.remove("active");
    menuBtn.classList.remove("active");
    resBtn.classList.remove("active");
  }

  // Event Listeners
  homeBtn.addEventListener("click", () => {
    clearContent();
    loadHome();
    homeBtn.classList.add("active");
  });

  menuBtn.addEventListener("click", () => {
    clearContent();
    loadMenu();
    menuBtn.classList.add("active");
  });

  resBtn.addEventListener("click", () => {
    clearContent();
    loadReservations();
    resBtn.classList.add("active");
  });

  // Load Home by default on initial refresh
  loadHome();
}

// Run the function
component();

// FIX: Add a class to the body after the JS has run and injected CSS
window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");
});
