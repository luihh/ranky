window.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('save-theme');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!window.currentAlbumTheme) return alert('Theme not ready yet');

    localStorage.setItem(
      'albumTheme',
      JSON.stringify(window.currentAlbumTheme)
    );

    btn.textContent = 'Theme saved!';
    btn.setAttribute('disabled', true);
  });
});
