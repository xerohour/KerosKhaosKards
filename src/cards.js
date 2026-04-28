import cardData from './card-data.json';
import { cardPath } from './utils.js';

export function initCardGrid() {
  const grid = document.getElementById('card-grid');
  const searchInput = document.getElementById('search-cards');
  const sortSelect = document.getElementById('sort-cards');
  if (!grid) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target.querySelector('img');
        if (img && img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '100px' });

  function render(list) {
    grid.innerHTML = '';
    list.forEach(card => {
      const el = document.createElement('div');
      el.className = 'card-item' + (card.isFoil ? ' card-foil' : '');
      el.dataset.cardNum = card.num;
      el.innerHTML = `
        <img data-src="${cardPath(card, 'front')}" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="${card.name} Card #${card.num}" />
        <div class="card-number">#${card.num}${card.variant ? ' ' + card.variant : ''} ${card.name}${card.isFoil ? ' (Foil)' : ''}</div>
      `;
      el.addEventListener('click', () => openModal(card));
      grid.appendChild(el);
      observer.observe(el);
    });
  }

  function filterAndSort() {
    const query = (searchInput?.value || '').toLowerCase();
    let filtered = cardData.filter(c =>
      c.name.toLowerCase().includes(query) || 
      String(c.num).includes(query) ||
      (c.variant && c.variant.toLowerCase().includes(query))
    );

    if (sortSelect?.value === 'random') {
      filtered = [...filtered].sort(() => Math.random() - 0.5);
    } else if (sortSelect?.value === 'number') {
      filtered = [...filtered].sort((a, b) => a.num - b.num);
    }

    render(filtered);
  }

  searchInput?.addEventListener('input', filterAndSort);
  sortSelect?.addEventListener('change', filterAndSort);

  render(cardData);
}

export function initGallery() {
  const display = document.getElementById('gallery-card');
  const frontFace = display?.querySelector('.gallery-card-front');
  const backFace = display?.querySelector('.gallery-card-back');
  const info = document.getElementById('gallery-card-info');
  const thumbs = document.getElementById('gallery-thumbnails');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');

  if (!display || !frontFace || !backFace || !thumbs) return;

  let currentIndex = 0;

  function showCard(index) {
    currentIndex = index;
    const card = cardData[index];
    display.classList.remove('flipped');
    display.classList.toggle('card-foil', card.isFoil);

    frontFace.innerHTML = `<img src="${cardPath(card, 'front')}" alt="Card #${card.num} Front" />`;
    backFace.innerHTML = `<img src="${cardPath(card, 'back')}" alt="Card #${card.num} Back" />`;

    if (info) info.textContent = `#${card.num}${card.variant ? ' ' + card.variant : ''} — ${card.name}${card.isFoil ? ' (Foil)' : ''} | Click to flip!`;

    thumbs.querySelectorAll('.gallery-thumb').forEach((t, i) => {
      t.classList.toggle('active', i === index);
    });
    
    // Scroll thumbnail into view
    const activeThumb = thumbs.querySelector('.gallery-thumb.active');
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  display.addEventListener('click', () => {
    display.classList.toggle('flipped');
  });

  thumbs.innerHTML = '';
  cardData.forEach((card, i) => {
    const thumb = document.createElement('div');
    thumb.className = 'gallery-thumb' + (i === 0 ? ' active' : '') + (card.isFoil ? ' card-foil' : '');
    thumb.dataset.index = i;
    thumb.innerHTML = `<img src="${cardPath(card, 'front')}" alt="Card #${card.num}" loading="lazy" />`;
    thumb.addEventListener('click', () => showCard(i));
    thumbs.appendChild(thumb);
  });

  prevBtn?.addEventListener('click', () => {
    const nextIdx = (currentIndex - 1 + cardData.length) % cardData.length;
    showCard(nextIdx);
  });

  nextBtn?.addEventListener('click', () => {
    const nextIdx = (currentIndex + 1) % cardData.length;
    showCard(nextIdx);
  });

  showCard(0);
}

export function initModal() {
  const modal = document.getElementById('card-modal');
  const closeBtn = document.getElementById('modal-close');
  const flipBtn = document.getElementById('modal-flip');
  const backdrop = modal?.querySelector('.modal-backdrop');
  const cardEl = document.getElementById('modal-card');

  if (!modal) return;

  closeBtn?.addEventListener('click', () => modal.classList.remove('active'));
  backdrop?.addEventListener('click', () => modal.classList.remove('active'));
  flipBtn?.addEventListener('click', () => cardEl?.classList.toggle('flipped'));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') modal.classList.remove('active');
  });
}

function openModal(card) {
  const modal = document.getElementById('card-modal');
  const front = document.getElementById('modal-card-front');
  const back = document.getElementById('modal-card-back');
  const title = document.getElementById('modal-title');
  const desc = document.getElementById('modal-description');
  const cardEl = document.getElementById('modal-card');

  if (!modal || !front || !back) return;

  cardEl?.classList.remove('flipped');
  cardEl?.classList.toggle('card-foil', card.isFoil);

  front.innerHTML = `<img src="${cardPath(card, 'front')}" alt="${card.name} Front" />`;
  back.innerHTML = `<img src="${cardPath(card, 'back')}" alt="${card.name} Back" />`;
  
  if (title) title.textContent = `#${card.num}${card.variant ? ' ' + card.variant : ''} — ${card.name}${card.isFoil ? ' (Foil)' : ''}`;
  if (desc) desc.textContent = `A mystical card imbued with the power of ${card.name}. ${card.isFoil ? 'This is a rare foil version!' : ''} Click flip to see the other side!`;

  modal.classList.add('active');
}

