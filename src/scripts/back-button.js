const btn = document.getElementById('back-button');

btn.addEventListener('click', () => {
  if (document.referrer && !document.referrer.includes(location.href)) {
    window.history.back();
  } else {
    window.location.href = '/';
  }
});
