import html2canvas from 'html2canvas';

document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('save-ranking');
  if (!button) return;

  button.addEventListener('click', async () => {
    const ranking = document.getElementById('ranking');
    const cover = document.getElementById('album-cover');
    const title = document.querySelector('.album-title');
    const artist = document.querySelector('.album-artist');
    const stars = document.getElementById('star-rating');
    const notes = document.getElementById('album-notes');

    if (!ranking || !cover || !title || !artist) return;

    const pageBg = getComputedStyle(document.documentElement)
      .getPropertyValue('--page-bg')
      .trim();

    const card = document.createElement('div');
    card.style.position = 'absolute';
    card.style.top = '-9999px';
    card.style.left = '-9999px';
    card.style.padding = '2rem';
    card.style.background = pageBg;
    card.style.display = 'grid';
    card.style.gridTemplateColumns = '40% 60%';
    card.style.gap = '2rem';
    card.style.width = '900px';
    card.style.borderRadius = '16px';
    card.style.boxSizing = 'border-box';
    card.style.fontFamily = 'inherit';

    const leftCol = document.createElement('div');
    leftCol.style.display = 'flex';
    leftCol.style.flexDirection = 'column';
    leftCol.style.alignItems = 'center';
    leftCol.style.justifyContent = 'center';
    leftCol.style.textAlign = 'center';
    leftCol.style.height = '100%';
    leftCol.style.boxSizing = 'border-box';
    leftCol.style.gap = '0.1rem';

    const coverClone = cover.cloneNode(true);
    coverClone.style.width = '200px';
    coverClone.style.borderRadius = '12px';
    coverClone.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    coverClone.style.margin = '0';
    leftCol.appendChild(coverClone);

    const titleClone = document.createElement('h2');
    titleClone.textContent = title.textContent;
    titleClone.style.color = 'var(--accent)';
    titleClone.style.margin = '0.2rem 0 0 0';
    titleClone.style.fontSize = '1.4rem';
    leftCol.appendChild(titleClone);

    const artistClone = document.createElement('p');
    artistClone.textContent = artist.textContent;
    artistClone.style.color = 'var(--accent-text)';
    artistClone.style.opacity = '0.8';
    artistClone.style.margin = '0';
    leftCol.appendChild(artistClone);

    const starsClone = stars.cloneNode(true);
    starsClone.style.marginTop = '0.25rem';
    starsClone.style.fontSize = '1.4rem';
    leftCol.appendChild(starsClone);

    if (notes && notes.value.trim() !== '') {
      let text = notes.value.trim();

      const maxChars = 250;
      if (text.length > maxChars) {
        text = text.slice(0, maxChars) + '…';
      }

      const notesBox = document.createElement('p');
      notesBox.textContent = `"${text}"`;
      notesBox.style.whiteSpace = 'pre-wrap';
      notesBox.style.wordWrap = 'break-word';
      notesBox.style.color = 'var(--accent-text)';
      notesBox.style.maxWidth = '240px';
      notesBox.style.marginTop = '0.5rem';
      notesBox.style.lineHeight = '1.3';
      leftCol.appendChild(notesBox);
    }

    const rightCol = document.createElement('div');
    rightCol.style.boxSizing = 'border-box';

    const rankingClone = ranking.cloneNode(true);
    rankingClone.style.width = '100%';

    rankingClone.querySelectorAll('.slot').forEach((slot) => {
      slot.style.maxWidth = '320px';
    });

    rightCol.appendChild(rankingClone);

    card.appendChild(leftCol);
    card.appendChild(rightCol);

    document.body.appendChild(card);

    const canvas = await html2canvas(card, {
      useCORS: true,
      backgroundColor: pageBg,
      scale: 2,
    });

    const link = document.createElement('a');
    link.download = 'ranking.png';
    link.href = canvas.toDataURL('image/png');
    link.click();

    document.body.removeChild(card);
  });
});
