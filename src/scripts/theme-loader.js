(function () {
  const saved = localStorage.getItem('albumTheme');
  if (!saved) return;

  const theme = JSON.parse(saved);
  for (const key in theme) {
    document.documentElement.style.setProperty(key, theme[key]);
  }
})();
