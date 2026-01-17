let ocrStream = null;
let ocrPhoto = null;

// render quotes
async function renderQuotes() {
  const list = document.getElementById("quotes-list");
  const empty = document.getElementById("quotes-empty");

  const quotes = await getAllQuotes();
  const books = await getAllBooks();
  const booksMap = {};
  books.forEach((b) => (booksMap[b.id] = b));

  if (quotes.length === 0) {
    list.innerHTML = "";
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";
  list.innerHTML = quotes
    .map((quote) => {
      const book = booksMap[quote.bookId];
      const bookTitle = book ? book.title : "Unknown book";
      const bookAuthor = book ? book.author : "";

      return `
      <div class="quote-card">
        <div class="quote-text">"${escapeHtml(quote.text)}"</div>
        <div class="quote-meta">
          <div class="quote-book">
            ${escapeHtml(bookTitle)}
            ${bookAuthor ? `<small>by ${escapeHtml(bookAuthor)}</small>` : ""}
          </div>
          <div class="quote-date">${
            quote.date ? quote.date.toDate().toLocaleDateString() : ""
          }</div>
        </div>
        <div class="quote-actions">
<button class="btn-icon" onclick="shareQuote('${quote.id}')" title="Share">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
    <polyline points="16 6 12 2 8 6"></polyline>
    <line x1="12" y1="2" x2="12" y2="15"></line>
  </svg>
</button>
<button class="btn-icon" onclick="deleteQuoteWithConfirm('${
        quote.id
      }')" title="Delete">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
</button>

        </div>
      </div>
    `;
    })
    .join("");
}

// show add quote modal
async function showAddQuoteModal() {
  const modal = document.getElementById("quote-modal");
  const books = await getAllBooks();
  const readingBooks = books.filter(
    (b) => b.status === "reading" || b.status === "finished"
  );

  if (readingBooks.length === 0) {
    alert("Add a book first!");
    return;
  }

  const bookOptions = readingBooks
    .map(
      (b) =>
        `<option value="${b.id}">${escapeHtml(b.title)} - ${escapeHtml(
          b.author
        )}</option>`
    )
    .join("");

  modal.innerHTML = `
    <div class="modal-content">
      <span class="close" onclick="closeQuoteModal()">&times;</span>
      <h2>Add quote</h2>
      
      <div class="form-group">
        <label>Select book</label>
        <select id="quote-book-select">
          <option value="">-- Select book --</option>
          ${bookOptions}
        </select>
      </div>
      
      <div class="modal-tabs">
        <button class="modal-tab active" id="manual-tab">Type manually</button>
        <button class="modal-tab" id="ocr-tab">Scan with camera</button>
      </div>
      
      <div class="modal-input-section active" id="manual-section">
        <div class="form-group">
          <label>Quote text</label>
          <textarea id="quote-text" rows="6" placeholder="Enter quote..."></textarea>
        </div>
        <button class="btn-primary" onclick="saveManualQuote()">Save quote</button>
      </div>
      
      <div class="modal-input-section" id="ocr-section">
        <button class="btn-secondary" onclick="startOcrCamera()">Start camera</button>
        <div id="ocr-camera-container" style="display: none">
          <video id="ocr-video" autoplay playsinline></video>
          <div class="ocr-controls">
            <button class="btn-primary" onclick="captureOcrPhoto()">Capture</button>
            <button class="btn-secondary" onclick="stopOcrCamera()">Cancel</button>
          </div>
        </div>
        <div id="ocr-preview" style="display: none">
          <img id="ocr-preview-img" />
          <div id="ocr-result">Processing...</div>
          <div class="form-group">
            <label>Recognized text</label>
            <textarea id="ocr-text" rows="6"></textarea>
          </div>
          <button class="btn-primary" onclick="saveOcrQuote()">Save quote</button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add("active");

  document.getElementById("manual-tab").onclick = () => {
    document
      .querySelectorAll(".modal-tab")
      .forEach((t) => t.classList.remove("active"));
    document
      .querySelectorAll(".modal-input-section")
      .forEach((s) => s.classList.remove("active"));
    document.getElementById("manual-tab").classList.add("active");
    document.getElementById("manual-section").classList.add("active");
  };

  document.getElementById("ocr-tab").onclick = () => {
    document
      .querySelectorAll(".modal-tab")
      .forEach((t) => t.classList.remove("active"));
    document
      .querySelectorAll(".modal-input-section")
      .forEach((s) => s.classList.remove("active"));
    document.getElementById("ocr-tab").classList.add("active");
    document.getElementById("ocr-section").classList.add("active");
  };
}

// save manual quote
async function saveManualQuote() {
  const bookId = document.getElementById("quote-book-select").value;
  const text = document.getElementById("quote-text").value.trim();

  if (!bookId || !text) {
    alert("Select book and enter text!");
    return;
  }

  await addQuote({ bookId, text, photoUrl: null, rawOcrText: null });
  closeQuoteModal();
  renderQuotes();
}

// start OCR camera
async function startOcrCamera() {
  try {
    ocrStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment", width: 1280, height: 720 },
    });
    const video = document.getElementById("ocr-video");
    video.srcObject = ocrStream;
    document.getElementById("ocr-camera-container").style.display = "block";
    document.getElementById("ocr-preview").style.display = "none";
  } catch (err) {
    alert("Camera access denied");
  }
}

// capture OCR photo
function captureOcrPhoto() {
  const video = document.getElementById("ocr-video");
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);

  ocrPhoto = canvas.toDataURL("image/jpeg", 0.8);
  document.getElementById("ocr-preview-img").src = ocrPhoto;
  document.getElementById("ocr-camera-container").style.display = "none";
  document.getElementById("ocr-preview").style.display = "block";
  stopOcrCamera();
  processOcr();
}

// process OCR
async function processOcr() {
  const resultDiv = document.getElementById("ocr-result");
  const textArea = document.getElementById("ocr-text");

  resultDiv.textContent = "Processing...";

  try {
    const result = await Tesseract.recognize(ocrPhoto, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          resultDiv.textContent = `Processing... ${Math.round(
            m.progress * 100
          )}%`;
        }
      },
    });

    textArea.value = result.data.text.trim();
    resultDiv.textContent = "Done! Edit text below:";
  } catch (err) {
    resultDiv.textContent = "OCR failed. Try again or type manually.";
    textArea.value = "";
  }
}

// save OCR quote
async function saveOcrQuote() {
  const bookId = document.getElementById("quote-book-select").value;
  const text = document.getElementById("ocr-text").value.trim();

  if (!bookId || !text) {
    alert("Select book and check text!");
    return;
  }

  await addQuote({ bookId, text, photoUrl: ocrPhoto, rawOcrText: text });
  closeQuoteModal();
  renderQuotes();
}

// stop OCR camera
function stopOcrCamera() {
  if (ocrStream) {
    ocrStream.getTracks().forEach((track) => track.stop());
    ocrStream = null;
  }
}

// delete quote
async function deleteQuoteWithConfirm(id) {
  if (!confirm("Delete this quote?")) return;
  await deleteQuote(id);
  renderQuotes();
}

// share quote
async function shareQuote(id) {
  const quotes = await getAllQuotes();
  const quote = quotes.find((q) => q.id === id);
  if (!quote) return;

  const books = await getAllBooks();
  const book = books.find((b) => b.id === quote.bookId);
  const text = `"${quote.text}"\n\n— ${book ? book.title : "Unknown"}`;

  if (navigator.share) {
    navigator.share({ text });
  } else {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  }
}

// close quote modal
function closeQuoteModal() {
  stopOcrCamera();
  document.getElementById("quote-modal").classList.remove("active");
}
