let genreChart = null;

// render stats
async function renderStats() {
  const books = await getAllBooks();
  const quotes = await getAllQuotes();
  
  if (books.length === 0) {
    document.getElementById('stats-empty').style.display = 'block';
    document.querySelector('.chart-section').style.display = 'none';
    document.querySelector('.stats-grid').style.display = 'none';
    return;
  }
  
  document.getElementById('stats-empty').style.display = 'none';
  document.querySelector('.chart-section').style.display = 'block';
  document.querySelector('.stats-grid').style.display = 'flex';
  
  document.getElementById('stat-finished').textContent = books.filter(b => b.status === 'finished').length;
  document.getElementById('stat-reading').textContent = books.filter(b => b.status === 'reading').length;
  document.getElementById('stat-wishlist').textContent = books.filter(b => b.status === 'wishlist').length;
  document.getElementById('stat-quotes').textContent = quotes.length;
  
  renderGenreChart(books);
}

// render genre chart
function renderGenreChart(books) {
  const genres = {};
  books.forEach(book => {
    genres[book.genre] = (genres[book.genre] || 0) + 1;
  });
  
  const labels = Object.keys(genres);
  const data = Object.values(genres);
  
  const canvas = document.getElementById('genre-chart');
  const ctx = canvas.getContext('2d');
  
  if (genreChart) {
    genreChart.destroy();
  }
  
  genreChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          '#f97316',
          '#fb923c',
          '#fdba74',
          '#fed7aa',
          '#ffedd5',
          '#6b7280',
          '#9ca3af',
          '#d1d5db'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}