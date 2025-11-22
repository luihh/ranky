document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  if (!root) return;

  const albumID = root.dataset.id;
  const artist = root.dataset.artist;
  const album = root.dataset.album;

  const tracks = document.querySelectorAll('.track-box');
  tracks.forEach(makeDraggable);

  const tracklistSlots = document.querySelectorAll('#tracklist .slot');
  tracklistSlots.forEach(handleDrop);

  const rankingSlots = document.querySelectorAll('#ranking .slot');
  rankingSlots.forEach(handleDrop);

  // LOADING STATE
  const stored = JSON.parse(localStorage.getItem('albumRankings') || '{}');
  const savedTracks = stored[albumID]?.tracks || [];

  savedTracks.forEach(({ name: trackName, slotIndex }) => {
    const track = Array.from(
      document.querySelectorAll('#tracklist .track-box')
    ).find((t) => t.querySelector('.track-name').textContent === trackName);
    if (!track) return;

    const slot = rankingSlots[slotIndex];
    if (!slot) return;

    const originalSlot = track.parentElement;
    const placeholder = document.createElement('div');
    placeholder.className = 'placeholder-box';

    const span = document.createElement('span');
    span.className = 'track-name';
    span.textContent = trackName;
    placeholder.appendChild(span);

    originalSlot.innerHTML = '';
    originalSlot.appendChild(placeholder);

    slot.innerHTML = '';
    slot.appendChild(track);
  });

  function handleDrop(slot) {
    slot.addEventListener('dragover', (e) => {
      e.preventDefault();
      slot.classList.add('drag-over');
    });

    slot.addEventListener('dragleave', () => {
      slot.classList.remove('drag-over');
    });

    slot.addEventListener('drop', (e) => {
      e.preventDefault();
      slot.classList.remove('drag-over');

      const trackID = e.dataTransfer.getData('text/plain');
      const track = document.getElementById(trackID);
      if (!track) return;

      const targetIndex = Array.from(rankingSlots).indexOf(slot);

      const placeholder = slot.querySelector('.placeholder-box');
      if (placeholder) {
        const originalSlot = track.parentElement;
        if (originalSlot) restorePlaceholder(originalSlot, track);

        slot.innerHTML = '';
        slot.appendChild(track);

        saveRankingState();
        return;
      }

      autoArrange(track, targetIndex);
      saveRankingState();
    });
  }

  function autoArrange(track, targetIndex) {
    const slots = Array.from(rankingSlots);

    const originalSlot = track.closest('.slot');
    const originalIndex = slots.indexOf(originalSlot);
    if (originalIndex === -1) return;

    const trackBoxes = slots.map((slot) => slot.querySelector('.track-box'));
    trackBoxes.splice(originalIndex, 1);
    trackBoxes.splice(targetIndex, 0, track);
    trackBoxes.forEach((trackbox, i) => {
      const slot = slots[i];

      if (trackbox) {
        slot.innerHTML = '';
        slot.appendChild(trackbox);
      } else {
        restorePlaceholder(slot, track);
      }
    });
  }

  function restorePlaceholder(slot, track) {
    slot.innerHTML = '';
    const placeholder = document.createElement('div');
    placeholder.className = 'placeholder-box';

    const span = document.createElement('span');
    span.className = 'track-name nowrap';
    span.textContent = track.querySelector('.track-name')?.textContent || '';

    placeholder.appendChild(span);
    slot.appendChild(placeholder);
  }

  function makeDraggable(el) {
    el.setAttribute('draggable', true);

    el.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', el.id);
      el.classList.add('dragging');
    });

    el.addEventListener('dragend', (e) => {
      el.classList.remove('dragging');
    });
  }

  function saveRankingState() {
    const rankedTracks = Array.from(rankingSlots)
      .map((slot, index) => {
        const trackBox = slot.querySelector('.track-box');
        if (!trackBox) return null;

        return {
          name: trackBox.querySelector('.track-name')?.textContent,
          slotIndex: index,
        };
      })
      .filter(Boolean);

    const stored = JSON.parse(localStorage.getItem('albumRankings') || '{}');

    stored[albumID] = {
      ...stored[albumID],
      id: albumID,
      tracks: rankedTracks,
      album,
      artist,
      timestamp: Date.now(),
      cover: document.getElementById('album-cover')?.src || null,
    };

    localStorage.setItem('albumRankings', JSON.stringify(stored));
  }

  const resetButton = document.getElementById('reset-ranking');
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      const stored = JSON.parse(localStorage.getItem('albumRankings') || '{}');
      delete stored[albumID];
      localStorage.setItem('albumRankings', JSON.stringify(stored));

      location.reload();
    });
  }
});
