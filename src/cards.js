function cardPath(num, side) {
  const pad = String(num).padStart(2, '0');
  return `/cards/card_${pad}_${side}.png`;
}

const magicalNames = [
  'Windy', 'Shadow', 'Illusion', 'Flower', 'Mist', 'Storm', 'Float', 'Erase',
  'Glow', 'Move', 'Fight', 'Loop', 'Sleep', 'Song', 'Little', 'Mirror',
  'Maze', 'Return', 'Shield', 'Time', 'Power', 'Silent', 'Thunder', 'Sword',
  'Jump', 'Fly', 'Watery', 'Rain', 'Wood', 'Freeze', 'Firey', 'Arrow',
  'Through', 'Big', 'Create', 'Change', 'Light', 'Dark', 'Earthy', 'Lock',
  'Cloud', 'Dream', 'Sand', 'Dash', 'Voice', 'Twin', 'Snow', 'Wave',
  'Bubble', 'Sweet', 'Shot', 'Libra', 'Hope', 'Star', 'Nothing', 'Void',
  'Spark', 'Bloom', 'Aura', 'Fate', 'Spirit', 'Dawn', 'Dusk', 'Prism',
  'Crystal', 'Eclipse', 'Nova', 'Comet', 'Wish', 'Charm', 'Rune', 'Nexus'
];

export function initCardGrid(total) {
  const grid = document.getElementById('card-grid');
  const searchInput = document.getElementById('search-cards');
  const sortSelect = document.getElementById('sort-cards');
  if (!grid) return;

  let cards = [];
  for (let i = 1; i <= total; i++) {
    cards.push({
      num: i,
      name: magicalNames[i - 1] || `Card ${i}`,
    });
  }

  function render(list) {
    grid.innerHTML = '';
    list.forEach(card => {
      const el = document.createElement('div');
      el.className = 'card-item';
      el.dataset.cardNum = card.num;
      el.innerHTML = `
        <img src="${cardPath(card.num, 'front')}" alt="${card.name} Card #${card.num}" loading="lazy" />
        <div class="card-number">#${card.num} ${card.name}</div>
      `;
      el.addEventListener('click', () => openModal(card.num, card.name));
      grid.appendChild(el);
    });
  }

  function filterAndSort() {
    const query = (searchInput?.value || '').toLowerCase();
    let filtered = cards.filter(c =>
      c.name.toLowerCase().includes(query) || String(c.num).includes(query)
    );

    if (sortSelect?.value === 'random') {
      filtered = [...filtered].sort(() => Math.random() - 0.5);
    }

    render(filtered);
  }

  searchInput?.addEventListener('input', filterAndSort);
  sortSelect?.addEventListener('change', filterAndSort);

  render(cards);
}

export function initGallery(total) {
  const display = document.getElementById('gallery-card');
  const frontFace = display?.querySelector('.gallery-card-front');
  const backFace = display?.querySelector('.gallery-card-back');
  const info = document.getElementById('gallery-card-info');
  const thumbs = document.getElementById('gallery-thumbnails');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');

  if (!display || !frontFace || !backFace || !thumbs) return;

  let current = 1;

  function showCard(num) {
    current = num;
    display.classList.remove('flipped');

    frontFace.innerHTML = `<img src="${cardPath(num, 'front')}" alt="Card #${num} Front" />`;
    backFace.innerHTML = `<img src="${cardPath(num, 'back')}" alt="Card #${num} Back" />`;

    const name = magicalNames[num - 1] || `Card ${num}`;
    if (info) info.textContent = `#${num} — ${name} | Click to flip!`;

    thumbs.querySelectorAll('.gallery-thumb').forEach(t => {
      t.classList.toggle('active', parseInt(t.dataset.num) === num);
    });
  }

  display.addEventListener('click', () => {
    display.classList.toggle('flipped');
  });

  for (let i = 1; i <= total; i++) {
    const thumb = document.createElement('div');
    thumb.className = 'gallery-thumb' + (i === 1 ? ' active' : '');
    thumb.dataset.num = i;
    thumb.innerHTML = `<img src="${cardPath(i, 'front')}" alt="Card #${i}" loading="lazy" />`;
    thumb.addEventListener('click', () => showCard(i));
    thumbs.appendChild(thumb);
  }

  prevBtn?.addEventListener('click', () => {
    showCard(current <= 1 ? total : current - 1);
  });

  nextBtn?.addEventListener('click', () => {
    showCard(current >= total ? 1 : current + 1);
  });

  showCard(1);
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

function openModal(num, name) {
  const modal = document.getElementById('card-modal');
  const front = document.getElementById('modal-card-front');
  const back = document.getElementById('modal-card-back');
  const title = document.getElementById('modal-title');
  const desc = document.getElementById('modal-description');
  const cardEl = document.getElementById('modal-card');

  if (!modal || !front || !back) return;

  cardEl?.classList.remove('flipped');
  front.innerHTML = `<img src="${cardPath(num, 'front')}" alt="${name} Front" />`;
  back.innerHTML = `<img src="${cardPath(num, 'back')}" alt="${name} Back" />`;
  if (title) title.textContent = `#${num} — ${name}`;
  if (desc) desc.textContent = `A mystical card imbued with the power of ${name}. Click flip to see the other side!`;

  modal.classList.add('active');
}
