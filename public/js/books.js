let currentFilter = "all";
let currentBookId = null;
let currentCoverData = null;
let cameraStream = null;

// render library
async function renderLibrary() {
  const grid = document.getElementById("books-grid");
  const empty = document.getElementById("empty-state");

  const allBooks = await getAllBooks();
  const books =
    currentFilter === "all"
      ? allBooks
      : allBooks.filter((b) => b.status === currentFilter);

  if (books.length === 0) {
    grid.innerHTML = "";
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";
  grid.innerHTML = books
    .map(
      (book) => `
    <div class="book-card" onclick="showBookModal('${book.id}')">
      <div class="book-cover" style="background-image: url(${
        book.cover || "assets/book-covers/default-cover.jpg"
      })"></div>
      <div class="book-title">${escapeHtml(book.title)}</div>
      <div class="book-author">${escapeHtml(book.author)}</div>
      <span class="book-status status-${book.status}">${getStatusText(
        book.status
      )}</span>
    </div>
  `
    )
    .join("");
}

// show book modal
async function showBookModal(bookId) {
  currentBookId = bookId;
  const book = await getBookById(bookId);
  if (!book) return;

  const modal = document.getElementById("book-modal");
  const title = document.getElementById("modal-book-title");
  const author = document.getElementById("modal-book-author");
  const genre = document.getElementById("modal-book-genre");
  const statusDiv = document.getElementById("modal-book-status");
  const actionsDiv = document.getElementById("modal-book-actions");

  title.textContent = book.title;
  author.textContent = `by ${book.author}`;
  genre.textContent = `Genre: ${book.genre}`;

  let statusHTML = `<strong>Status:</strong> ${getStatusText(book.status)}<br>`;
  if (book.status === "reading" && book.dateStarted) {
    const days = Math.floor(
      (new Date() - book.dateStarted.toDate()) / (1000 * 60 * 60 * 24)
    );
    statusHTML += `Reading for ${days} days<br>`;
  }
  if (book.status === "finished" && book.dateFinished) {
    statusHTML += `Finished on ${book.dateFinished
      .toDate()
      .toLocaleDateString()}`;
  }
  statusDiv.innerHTML = statusHTML;

  actionsDiv.innerHTML = "";
  if (book.status === "wishlist") {
    actionsDiv.innerHTML += `<button class="btn-secondary" onclick="changeBookStatus('${book.id}', 'reading')">Start reading</button>`;
  }
  if (book.status === "reading") {
    actionsDiv.innerHTML += `<button class="btn-secondary" onclick="changeBookStatus('${book.id}', 'finished')">Mark as finished</button>`;
  }

  modal.classList.add("active");
}

// change book status
async function changeBookStatus(id, newStatus) {
  const updates = { status: newStatus };
  if (newStatus === "reading") {
    updates.dateStarted = firebase.firestore.FieldValue.serverTimestamp();
  }
  if (newStatus === "finished") {
    updates.dateFinished = firebase.firestore.FieldValue.serverTimestamp();
  }
  await updateBook(id, updates);
  closeBookModal();
  renderLibrary();
}

// delete book
async function deleteBookWithConfirm() {
  if (!confirm("Delete this book?")) return;
  await deleteBook(currentBookId);
  closeBookModal();
  renderLibrary();
}

// close book modal
function closeBookModal() {
  document.getElementById("book-modal").classList.remove("active");
}

// init book form
function initBookForm() {
  document.getElementById("book-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("book-title").value.trim();
    const author = document.getElementById("book-author").value.trim();
    const genre = document.getElementById("book-genre").value;
    const status = document.getElementById("book-status").value;

    if (!title || !author || !genre || !status) {
      alert("Fill all fields!");
      return;
    }

    await addBook({
      title,
      author,
      genre,
      status,
      cover: currentCoverData,
      dateStarted:
        status === "reading"
          ? firebase.firestore.FieldValue.serverTimestamp()
          : null,
      dateFinished:
        status === "finished"
          ? firebase.firestore.FieldValue.serverTimestamp()
          : null,
    });

    e.target.reset();
    currentCoverData = null;
    document.getElementById("cover-preview").style.display = "none";
    document.getElementById("camera-btn").style.display = "block";
    document.getElementById("gallery-btn").style.display = "block";

    showPage("library");
  });
}

// init camera
function initCamera() {
  const cameraBtn = document.getElementById("camera-btn");
  const galleryBtn = document.getElementById("gallery-btn");
  const fileInput = document.getElementById("file-input");
  const cameraContainer = document.getElementById("camera-container");
  const video = document.getElementById("camera-video");
  const captureBtn = document.getElementById("capture-btn");
  const cancelBtn = document.getElementById("cancel-camera-btn");
  const preview = document.getElementById("cover-preview");

  cameraBtn.addEventListener("click", async () => {
    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 1280, height: 720 },
      });
      video.srcObject = cameraStream;
      cameraContainer.style.display = "block";
      preview.style.display = "none";
      cameraBtn.style.display = "none";
      galleryBtn.style.display = "none";
    } catch (err) {
      alert("Camera access denied");
    }
  });

  captureBtn.addEventListener("click", () => {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    currentCoverData = canvas.toDataURL("image/jpeg", 0.8);

    preview.width = 300;
    preview.height = 350;
    const ctx = preview.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, preview.width, preview.height);
    };
    img.src = currentCoverData;
    preview.style.display = "block";
    stopCamera();
  });

  cancelBtn.addEventListener("click", stopCamera);

  galleryBtn.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      currentCoverData = event.target.result;

      preview.width = 300;
      preview.height = 350;
      const ctx = preview.getContext("2d");
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, preview.width, preview.height);
      };
      img.src = currentCoverData;

      preview.style.display = "block";
      cameraBtn.style.display = "none";
      galleryBtn.style.display = "none";
    };
    reader.readAsDataURL(file);
  });
}

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
  }
  document.getElementById("camera-container").style.display = "none";
  document.getElementById("camera-btn").style.display = "block";
  document.getElementById("gallery-btn").style.display = "block";
}

// init filters
function initFilters() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentFilter = btn.dataset.filter;
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderLibrary();
    });
  });
}
