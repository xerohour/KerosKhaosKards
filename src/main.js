import './style.css';
import { createSakuraPetals } from './sakura.js';
import { initCardGrid, initGallery, initModal } from './cards.js';
import { initBattle } from './battle.js';
import { registerServiceWorker, initInstallPrompt } from './pwa.js';

function initNavigation() {
  const navBtns = document.querySelectorAll('.nav-btn');
  const views = document.querySelectorAll('.view');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.view;

      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      views.forEach(v => v.classList.remove('active'));
      const targetView = document.getElementById(`view-${target}`);
      if (targetView) {
        targetView.classList.add('active');
      }
    });
  });
}

function initVisitorCounter() {
  const counter = document.getElementById('visitor-count');
  if (!counter) return;

  let visits = parseInt(localStorage.getItem('kkk-visits') || '0', 10);
  visits++;
  localStorage.setItem('kkk-visits', String(visits));
  counter.textContent = String(visits).padStart(6, '0');
}

function init() {
  createSakuraPetals();
  initNavigation();
  initCardGrid();
  initGallery();
  initModal();
  initBattle();
  initVisitorCounter();
  registerServiceWorker();
  initInstallPrompt();

  // Hide loading overlay
  const loading = document.getElementById('loading-overlay');
  if (loading) {
    setTimeout(() => {
      loading.classList.add('hidden');
    }, 1000); // Small delay for effect
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
