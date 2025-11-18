import ColorThief from 'colorthief';

function adjustColor([r, g, b], factor = 1) {
  return [
    Math.min(255, Math.max(0, Math.round(r * factor))),
    Math.min(255, Math.max(0, Math.round(g * factor))),
    Math.min(255, Math.max(0, Math.round(b * factor))),
  ];
}

function rgbToCss([r, g, b], alpha = 1) {
  return alpha === 1
    ? `rgb(${r}, ${g}, ${b})`
    : `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

window.addEventListener('load', () => {
  const img = document.getElementById('album-cover');
  if (!img) return;

  const thief = new ColorThief();

  function generateTheme() {
    try {
      const palette = thief.getPalette(img, 2);
      if (!palette || !palette.length) return;

      const bgColor = palette.reduce((darkest, color) => {
        const lum = color[0] * 0.299 + color[1] * 0.587 + color[2] * 0.114;
        const darkestLum =
          darkest[0] * 0.299 + darkest[1] * 0.587 + darkest[2] * 0.114;
        return lum < darkestLum ? color : darkest;
      }, palette[0]);

      const accentColor = palette.find((c) => c !== bgColor) || bgColor;

      const darkBg = adjustColor(bgColor, 0.35);
      const softAccent = adjustColor(accentColor, 1.1);

      const theme = {
        '--page-bg': rgbToCss(darkBg),
        '--accent': rgbToCss(softAccent),
        '--accent-text': rgbToCss(softAccent),
        '--accent-border': rgbToCss(accentColor, 0.4),
        '--accent-soft': rgbToCss(accentColor, 0.15),
      };

      for (const key in theme) {
        document.documentElement.style.setProperty(key, theme[key]);
      }

      window.currentAlbumTheme = theme;
    } catch (err) {
      console.error('Color extraction failed:', err);
    }
  }

  img.complete ? generateTheme() : img.addEventListener('load', applyColors);
});
