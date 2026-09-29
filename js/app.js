window.addEventListener('DOMContentLoaded', () => {
  if (!location.hash) location.hash = '#welcome';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  }

  EBX.Router.render();
});