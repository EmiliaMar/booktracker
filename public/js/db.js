// get firestore instance
const db = firebase.firestore();

// enable offline persistence by Firestore
// sync data with indexedDB, keep sync with actual DB when online
db.enablePersistence()
  .then(() => console.log("Offline persistence enabled"))
  .catch((err) => {
    if (err.code === "failed-precondition") {
      console.log("Persistence failed - multiple tabs open");
    } else if (err.code === "unimplemented") {
      console.log("Persistence not available in this browser");
    }
  });

// books - add
async function addBook(bookData) {
  const doc = await db.collection("books").add({
    ...bookData,
    dateAdded: firebase.firestore.FieldValue.serverTimestamp(),
    lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
  });
  return doc.id;
}

// books - get all
async function getAllBooks() {
  const snapshot = await db
    .collection("books")
    .orderBy("dateAdded", "desc")
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// books - get by id
async function getBookById(id) {
  const doc = await db.collection("books").doc(id).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

// books - update
async function updateBook(id, updates) {
  await db
    .collection("books")
    .doc(id)
    .update({
      ...updates,
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
    });
}

// books - delete
async function deleteBook(id) {
  await db.collection("books").doc(id).delete();
  const quotes = await db.collection("quotes").where("bookId", "==", id).get();
  quotes.forEach((doc) => doc.ref.delete());
}

// quotes - add
async function addQuote(quoteData) {
  const doc = await db.collection("quotes").add({
    ...quoteData,
    date: firebase.firestore.FieldValue.serverTimestamp(),
  });
  return doc.id;
}

// quotes - get all
async function getAllQuotes() {
  const snapshot = await db.collection("quotes").orderBy("date", "desc").get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// quotes - get by book
async function getQuotesByBook(bookId) {
  const snapshot = await db
    .collection("quotes")
    .where("bookId", "==", bookId)
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// quotes - delete
async function deleteQuote(id) {
  await db.collection("quotes").doc(id).delete();
}
