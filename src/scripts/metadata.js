document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  if (!root) return;

  const albumID = root.dataset.id;
  const album = root.dataset.album;
  const artist = root.dataset.artist;

  const starRating = document.getElementById('star-rating');
  const notes = document.getElementById('album-notes');

  if (!notes || !starRating) return;

  const stored = JSON.parse(localStorage.getItem('albumRankings') || '{}');
  const savedData = stored[albumID] || {};

  if (savedData.notes) {
    notes.value = savedData.notes;
  }

  notes.addEventListener('input', saveAlbumData);

  const stars = Array.from(starRating.querySelectorAll('span'));
  let savedRating = savedData.rating || 0;
  if (savedRating > 0) {
    highlightStars(savedRating);
  }

  stars.forEach((star, i) => {
    const value = i + 1;

    star.addEventListener('mouseenter', () => {
      highlightStars(value, true);
    });

    star.addEventListener('mouseleave', () => {
      highlightStars(savedRating);
    });

    star.addEventListener('click', () => {
      if (savedRating === value) {
        savedRating = 0;
        highlightStars(0);
      } else {
        savedRating = value;
        highlightStars(savedRating);
      }

      saveAlbumData();
    });
  });

  function highlightStars(amount, isHover = false) {
    stars.forEach((star, i) => {
      const value = i + 1;
      star.classList.toggle('active', value <= amount && !isHover);
      star.classList.toggle('hover', value <= amount && isHover);
    });
  }

  function saveAlbumData() {
    const stored = JSON.parse(localStorage.getItem('albumRankings') || '{}');
    stored[albumID] = stored[albumID] || {};

    stored[albumID] = {
      ...stored[albumID],
      id: albumID,
      album,
      artist,
      timestamp: Date.now(),
      notes: notes.value,
      rating: savedRating || 0,
      cover: document.getElementById('album-cover')?.src || null,
    };

    localStorage.setItem('albumRankings', JSON.stringify(stored));
  }
});
