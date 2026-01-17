// escape HTML
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// get status text
function getStatusText(status) {
  const statusMap = {
    reading: "Reading",
    finished: "Finished",
    wishlist: "To read",
  };
  return statusMap[status] || status;
}

// show page
function showPage(pageId) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add("active");
  }

  const targetBtn = document.querySelector(`[data-page="${pageId}"]`);
  if (targetBtn) {
    targetBtn.classList.add("active");
  }

  if (pageId === "library") {
    renderLibrary();
  } else if (pageId === "quotes") {
    renderQuotes();
  } else if (pageId === "stats") {
    renderStats();
  }
}
