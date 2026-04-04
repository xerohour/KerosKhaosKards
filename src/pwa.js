export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
  }
}

let deferredPrompt = null;

export function initInstallPrompt() {
  const promptEl = document.getElementById('install-prompt');
  const installBtn = document.getElementById('install-btn');
  const dismissBtn = document.getElementById('install-dismiss');

  if (!promptEl) return;

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    promptEl.classList.remove('hidden');
  });

  installBtn?.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    promptEl.classList.add('hidden');
  });

  dismissBtn?.addEventListener('click', () => {
    promptEl.classList.add('hidden');
  });

  window.addEventListener('appinstalled', () => {
    promptEl.classList.add('hidden');
    deferredPrompt = null;
  });
}
