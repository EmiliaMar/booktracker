// service worker registration
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((reg) => console.log("Service worker registered"))
    .catch((err) => console.log("Service worker not registered", err));
}

// init app
document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initBookForm();
  initCamera();
  initFilters();

  document
    .getElementById("add-quote-btn")
    .addEventListener("click", showAddQuoteModal);
  document
    .getElementById("close-book-modal")
    .addEventListener("click", closeBookModal);
  document
    .getElementById("delete-book-btn")
    .addEventListener("click", deleteBookWithConfirm);

  renderLibrary();
  checkNetwork();
});

// navigation
function initNav() {
  document.querySelector('[data-page="library"]').classList.add("active");
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      showPage(btn.dataset.page);
    });
  });
}

// network status
function checkNetwork() {
  const status = document.getElementById("network-status");
  const statusText = document.getElementById("network-status-text");

  function updateStatus() {
    if (!navigator.onLine) {
      status.style.display = "block";
      statusText.textContent = "You are offline";
    } else {
      status.style.display = "none";
    }
  }

  window.addEventListener("online", updateStatus);
  window.addEventListener("offline", updateStatus);
  updateStatus();
}
