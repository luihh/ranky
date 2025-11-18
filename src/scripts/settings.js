document.getElementById('export-btn').addEventListener('click', () => {
  const data = { ...localStorage };
  const json = JSON.stringify(data, null, 2);

  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'ranky-backup.json';
  a.click();

  URL.removeObjectURL(url);
});

document.getElementById('import-btn').addEventListener('click', async () => {
  const input = document.createElement('input');
  input.style.display = 'none';
  input.type = 'file';
  input.accept = '.json';

  input.addEventListener('change', async () => {
    const file = input.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      localStorage.clear();

      for (const key in data) {
        localStorage.setItem(key, data[key]);
      }

      alert('Data imported successfully!');
      location.reload();
    } catch (error) {
      if (error.name !== 'AbortError') {
        alert('Failed to import file: ' + error.message);
      }
    }

    input.remove();
  });

  document.body.appendChild(input);
  input.click();
});

document.getElementById('reset-btn').addEventListener('click', async () => {
  const confirmation = confirm(
    'Do you really want to reset your data? This will delete all your album rankings and the global theme.'
  );

  if (confirmation) {
    localStorage.clear();
    location.reload();
  }
});

document.getElementById('reset-theme').addEventListener('click', async () => {
  const confirmation = confirm('Do you really want to reset the theme?');

  if (confirmation) {
    localStorage.removeItem('albumTheme');
    document.documentElement.removeAttribute('style');

    alert('Theme reset!');
    location.reload();
  }
});
