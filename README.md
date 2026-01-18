# BookTracker - Progressive Web App

> Aplikacja pozwala śledzić swoje postępy w czytaniu, zapisywać ulubione cytaty z książek i analizować statystyki.

[![PWA](https://img.shields.io/badge/PWA-enabled-success)](https://web.dev/progressive-web-apps/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange)](https://firebase.google.com/docs/firestore)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## 📖 Spis Treści

- [O Projekcie](#-o-projekcie)
- [Demo](#-demo)
- [Funkcjonalności](#-funkcjonalności)
- [Wykorzystane Technologie](#-wykorzystane-technologie)
- [Struktura Projektu](#-struktura-projektu)
- [Offline Mode](#-offline-mode)
- [Natywne API](#-natywne-api)
- [Instalacja i Deploy](#-instalacja-i-deploy)

---

## 🎯 O Projekcie

**BookTracker** to Progressive Web App (PWA) która pozwala śledzić postępy w czytaniu książek, umożliwia zarządzanie biblioteką osobistą, i pozwala na zapisywanie ulubionych cytatów oraz analizowanie statystyk czytelniczych.

Aplikacja wykorzystuje **Firebase Firestore** jako bazę danych w chmurze z automatyczną synchronizacją i obsługą offline.

---

## 🌐 Demo

**🔗 Live Demo:** [https://booktracker-16e79.web.app/](https://booktracker-16e79.web.app/)

---

## ✨ Funkcjonalności

### 📚 Biblioteka Książek
- Przeglądanie książek z filtrami (All / Reading / Finished / Wishlist)
- Dodawanie nowych książek z okładkami
- Śledzenie statusu czytania (To read, Reading, Finished)
- Automatyczne śledzenie dat rozpoczęcia i ukończenia
- Usuwanie książek z biblioteki z powiązanymi cytatami
- Wyświetlanie szczegółów książki w modalu

### 📸 Zarządzanie Okładkami
- **Aparat** - możliwość zrobienia zdjęcia okładki książki bezpośrednio z aplikacji
- **Galeria** - możliwość wyboru zdjęć z urządzenia jako okładki książki
- **Preview** - podgląd okładki przed zapisaniem (canvas)
- Kompresja obrazów (JPEG 80% quality)

### 💭 Cytaty
- Aplikacja pozwala na zapis ulubionych cytatów z książek
- **Dwa tryby dodawania:**
  - Ręczne wpisywanie tekstu
  - **OCR** - rozpoznawanie tekstu ze zdjęcia (Tesseract.js)
- Edycja rozpoznanego tekstu przed zapisem
- Cytaty przypisywane są do konkretnej książki z biblioteki
- **Udostępnianie** - Web Share API (lub kopiowanie do schowka)
- **Usuwanie** cytatów z potwierdzeniem

### 📊 Statystyki
- Wykres kołowy gatunków książek (Chart.js)
- Liczba przeczytanych książek
- Liczba aktualnie czytanych książek
- Lista książek do przeczytania (wishlist)
- Liczba zapisanych cytatów

### 🔄 Offline Mode
- **Pełna funkcjonalność offline** - Firestore Persistence
- Service Worker cache dla zasobów statycznych
- Firestore offline cache dla danych użytkownika
- Wskaźnik statusu sieci
- Automatyczna synchronizacja po powrocie online

---

## 🛠 Wykorzystane Technologie

### Core Technologies
- **HTML5** - semantyczna struktura
- **CSS3** - design
  - Flexbox dla layoutu
  - CSS Grid dla siatki książek
  - Responsive (mobile-first)
  - CSS Variables dla kolorów
- **JavaScript (ES6+)** - vanilla JS
  
### Backend & Database
- **Firebase Firestore** - NoSQL cloud database
  - Realtime synchronization
  - Offline persistence
  - Security rules
- **Firebase Hosting** - deployment platform

### Web APIs
| API | Zastosowanie |
|-----|--------------|
| 📷 **getUserMedia API** | Dostęp do kamery urządzenia |
| 📁 **File API** | Wybór plików z galerii |
| 🎨 **Canvas API** | Przetwarzanie i podgląd obrazów |
| 🔗 **Web Share API** | Udostępnianie cytatów |
| 📋 **Clipboard API** | Fallback dla Share API |
| ⚙️ **Service Worker** | Offline cache |
| 🌐 **Fetch API** | Network requests |

### External Libraries
- **Firebase SDK 9.23.0** (compat mode)
- **Chart.js 4.4.1** - wykresy statystyk
- **Tesseract.js 5.0** - OCR (rozpoznawanie tekstu)

---

## 📋 Funkcjonalności PWA Zaimplementowane w Aplikacji

### ✅ 1. Instalowalność
- `manifest.json` z metadanymi aplikacji
- Ikony w 5 rozmiarach (72, 128, 144, 192, 512px)
- Apple touch icons i splash screens
- `display: standalone` dla trybu fullscreen
- `theme_color: #f97316` (pomarańczowy)

### ✅ 2. Service Worker
- Cache-first strategy dla zasobów statycznych
- Dynamic caching (limit 15 items)
- Offline fallback page

### ✅ 3. Natywne API
Wykorzystano **4 natywne API:**
1. **Camera API** (getUserMedia) - zdjęcia okładek i skanowanie cytatów
2. **File API** - wybór z galerii + canvas processing
3. **Web Share API** - udostępnianie cytatów
4. **Clipboard API** - kopiowanie tekstu

### ✅ 4. Tryb Offline
- **Firestore Persistence** - lokalna baza danych (IndexedDB)
- Service Worker cache dla HTML/CSS/JS
- Network status indicator
- Pełna funkcjonalność offline:
  - Przeglądanie książek i cytatów
  - Wyświetlanie statystyk
  - Dodawanie nowych danych (synchronizacja po powrocie online)

### ✅ 5. Responsywność
- Mobile-first design
- Flexbox & Grid layout
- iOS Safe Area support

### ✅ 6. Hosting
- Aplikacja dostępna online przez HTTPS
- Firebase Hosting z CDN
- URL: [https://booktracker-16e79.web.app/](https://booktracker-16e79.web.app/)

---

## 📖 Użytkowanie Aplikacji

### Pierwsze Kroki

1. **Dodaj pierwszą książkę**
   - Kliknij "Add" w dolnej nawigacji
   - Wypełnij formularz:
     - Tytuł książki
     - Autor
     - Gatunek (dropdown)
     - Status (To read / Reading / Finished)
   - Opcjonalnie: dodaj okładkę
     - "Take photo" - zrób zdjęcie aparatem
     - "Choose from gallery" - wybierz z galerii
     - Zobacz podgląd przed zapisem
   - Kliknij "Save book"

2. **Zarządzaj biblioteką**
   - Przejdź do "Library"
   - Filtruj książki: All / Reading / Finished / Wishlist
   - Kliknij na książkę aby zobaczyć szczegóły
   - W modalu:
     - Zobacz informacje (status, daty)
     - Zmień status ("Start reading" / "Mark as finished")
     - Usuń książkę (czerwony przycisk z ikoną)

3. **Zapisz cytat**
   - Kliknij "Quotes"
   - "Add quote" (przycisk na dole)
   - Wybierz książkę z listy
   - **Tryb 1: Wpisz ręcznie**
     - Tab "Type manually"
     - Wpisz tekst cytatu
     - "Save quote"
   - **Tryb 2: OCR ze zdjęcia**
     - Tab "Scan with camera"
     - "Start camera"
     - Zrób zdjęcie strony z cytatem
     - Poczekaj na rozpoznanie tekstu
     - Edytuj tekst jeśli potrzeba
     - "Save quote"

4. **Zobacz statystyki**
   - Kliknij "Statistics"
   - Wykres kołowy gatunków
   - Liczby:
     - Finished (przeczytane)
     - Currently reading (czytane)
     - Wishlist (do przeczytania)
     - Quotes (wszystkie cytaty)

### Funkcje Zaawansowane

#### Udostępnianie cytatów
```
1. Kliknij ikonę "share" (↗) przy cykacie
2. Wybierz aplikację (WhatsApp, Messenger, etc.)
3. LUB: jeśli Share API niedostępne → automatyczne kopiowanie do schowka
```

#### Tryb offline
```
1. Otwórz aplikację online
2. Przeglądaj książki/cytaty (cache się zapisze)
3. Wyłącz internet
4. Aplikacja dalej działa!
5. Dodane dane zsynchronizują się po powrocie online
```

#### Instalacja PWA
```
Chrome (Desktop):
Pasek adresu → ikona instalacji (+) → "Install"

Chrome (Mobile):
Menu (⋮) → "Add to Home Screen"

iOS Safari:
Share → "Add to Home Screen"
```

---

## 📁 Struktura Projektu

```
booktracker/
├── 📄 index.html              # Główna strona aplikacji (SPA)
├── 📄 manifest.json           # PWA manifest
├── 📄 sw.js                   # Service Worker
├── 📄 firebase.json           # Firebase Hosting config
│
├── 📁 css/
│   └── styles.css             # Minimalistyczny design (biały + pomarańczowy)
│
├── 📁 js/
│   ├── app.js                 # Inicjalizacja, nawigacja, SW registration
│   ├── utils.js               # Funkcje pomocnicze (escapeHtml, getStatusText, showPage)
│   ├── db.js                  # Firestore CRUD (async/await)
│   ├── books.js               # Książki, kamera, formularze, modal
│   ├── quotes.js              # Cytaty, OCR, share, delete
│   └── stats.js               # Statystyki, Chart.js
│
├── 📁 pages/
│   └── fallback.html          # Offline fallback page
│
└── 📁 assets/
    ├── 72.png                 # Favicon
    ├── 128.png
    ├── 144.png
    ├── 192.png                # PWA icon
    ├── 512.png                # PWA icon (maskable)
    ├── apple-icon-180.png     # iOS home screen icon
    ├── apple-splash-*.jpg     # iOS splash screens (wszystkie rozmiary)
    └── book-covers/
        └── default-cover.jpg  # Placeholder dla książek bez okładki
```

---

## 🔥 Firebase Firestore - Struktura Danych

### Kolekcje

#### `books`
```javascript
{
  id: "auto-generated-id",      // Document ID (string)
  title: "Wiedźmin",             // string
  author: "Andrzej Sapkowski",   // string
  genre: "fantasy",              // string
  status: "finished",            // 'reading' | 'finished' | 'wishlist'
  cover: "data:image/jpeg...",   // base64 string (opcjonalnie)
  dateAdded: Timestamp,          // Firestore serverTimestamp
  dateStarted: Timestamp | null, // gdy status = 'reading'
  dateFinished: Timestamp | null,// gdy status = 'finished'
  lastUpdated: Timestamp         // Firestore serverTimestamp
}
```

#### `quotes`
```javascript
{
  id: "auto-generated-id",       // Document ID (string)
  bookId: "xK7mP3nQ9sR2tV5wY8z", // Reference do książki (string)
  text: "Zło jest złem...",      // string
  photoUrl: "data:image/jpeg..." | null, // zdjęcie strony (opcjonalnie)
  rawOcrText: "..." | null,      // surowy tekst z OCR (opcjonalnie)
  date: Timestamp                // Firestore serverTimestamp
}
```

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /books/{bookId} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasAll(['title', 'author', 'genre', 'status']);
      allow update, delete: if true;
    }
    match /quotes/{quoteId} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasAll(['bookId', 'text']);
      allow update, delete: if true;
    }
  }
}
```

---

## 🔄 Offline Mode - Jak Działa?

### 1. Service Worker Cache
```javascript
// Cachowane zasoby (static cache)
- index.html
- styles.css
- wszystkie pliki .js
- manifest.json
- fallback.html

// Dynamic cache (max 15 items)
- Firebase SDK
- Chart.js, Tesseract.js
- Ikony, obrazy
```

### 2. Firestore Offline Persistence
```javascript
// Automatycznie włączone w db.js
db.enablePersistence()
  .then(() => console.log('Offline persistence enabled'))
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.log('Multiple tabs open');
    }
  });
```

### Co Działa Offline?
✅ Przeglądanie książek (z cache)
✅ Przeglądanie cytatów (z cache)
✅ Wyświetlanie statystyk (z cache)
✅ Cały interfejs aplikacji
✅ Dodawanie nowych danych (zapisuje się lokalnie)

### Network Status Indicator
```
Offline: Żółty banner na górze "You are offline"
Online: Banner znika
```

---

## 🔧 Natywne API - Szczegóły Implementacji

### 1. Camera API (getUserMedia)

**Zastosowanie:** Zdjęcia okładek książek + skanowanie cytatów OCR

**Kod:**
```javascript
const stream = await navigator.mediaDevices.getUserMedia({
  video: { 
    facingMode: 'environment', // Tylna kamera
    width: 1280, 
    height: 720 
  }
});
video.srcObject = stream;
```

**Obsługa błędów:**
- Brak uprawnień → alert "Camera access denied"
- Brak kamery → automatyczne wyłączenie przycisku

### 2. File API + Canvas API

**Zastosowanie:** Wybór okładki z galerii + podgląd

**Kod:**
```javascript
const reader = new FileReader();
reader.onload = (event) => {
  const img = new Image();
  img.onload = () => {
    canvas.getContext('2d').drawImage(img, 0, 0, 300, 450);
  };
  img.src = event.target.result;
};
reader.readAsDataURL(file);
```

### 3. Web Share API

**Zastosowanie:** Udostępnianie cytatów

**Kod:**
```javascript
if (navigator.share) {
  await navigator.share({
    text: `"${quote.text}"\n\n— ${book.title}`
  });
} else {
  // Fallback: Clipboard API
  await navigator.clipboard.writeText(text);
  alert('Copied to clipboard!');
}
```

### 4. Clipboard API

**Zastosowanie:** Fallback dla Share API (desktop)

---

## 🚀 Instalacja i Deploy

### Wymagania
- Node.js (dla Firebase CLI)
- Konto Firebase (darmowe)

### 1. Sklonuj Repozytorium
```bash
git clone https://github.com/twoj-username/booktracker.git
cd booktracker
```

### 2. Firebase Setup
```bash
# Zainstaluj Firebase CLI
npm install -g firebase-tools

# Zaloguj się
firebase login

# Inicjalizuj projekt
firebase init

# Wybierz:
# - Hosting: Configure files for Firebase Hosting
# - Use existing project: booktracker-16e79
# - Public directory: . (current folder)
# - Single-page app: Yes
# - GitHub deploys: No
```

### 3. Deploy
```bash
firebase deploy
```

### 4. Gotowe
URL: `https://booktracker-16e79.web.app/`

### Re-deploy Po Zmianach
```bash
# Po każdej zmianie w kodzie:
firebase deploy

# LUB tylko hosting (szybsze):
firebase deploy --only hosting
```

---

## 📸 Screenshots

<div align="center">
  <img width="290" height="796" alt="Library view" src="https://github.com/user-attachments/assets/c3c71a2f-b9b1-4b72-91e3-239aceec2dd4" />
  <img width="290" height="796" alt="Add book form" src="https://github.com/user-attachments/assets/8e324db8-adc2-4cdd-9330-5dbce8d79527" />
  <img width="290" height="796" alt="Quotes list" src="https://github.com/user-attachments/assets/0f71f5b4-a0e1-4c79-9f9e-80d6d3432777" />
  <img width="290" height="796" alt="Statistics" src="https://github.com/user-attachments/assets/29d6c6db-608c-4d2b-9dc4-d4025be5a3c2" />
</div>

---


## 📚 Wykorzystane Źródła

### Dokumentacja
- [Firebase Firestore Docs](https://firebase.google.com/docs/firestore) - baza danych
- [PWA Checklist](https://web.dev/pwa-checklist/) - best practices
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://web.dev/add-manifest/)
- [MDN Web Docs](https://developer.mozilla.org/) - dokumentacja Web APIs

### Libraries
- [Chart.js](https://www.chartjs.org/) - wykresy statystyk
- [Tesseract.js](https://tesseract.projectnaptha.com/) - OCR engine

### Narzędzia
- [pwa-asset-generator](https://www.npmjs.com/package/pwa-asset-generator) - generowanie ikon i splash screens
- [Firebase CLI](https://firebase.google.com/docs/cli) - deployment

---

[🔝 Wróć do góry](#booktracker---progressive-web-app)
