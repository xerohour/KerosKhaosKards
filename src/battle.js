function cardPath(num, side) {
  const pad = String(num).padStart(2, '0');
  return `/cards/card_${pad}_${side}.png`;
}

function getCardStats(num) {
  // Simple deterministic stats based on card number
  const seededRandom = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Stats for Triple Triad (1-9)
  const t = Math.floor(seededRandom(num * 1.1) * 9) + 1;
  const r = Math.floor(seededRandom(num * 2.2) * 9) + 1;
  const b = Math.floor(seededRandom(num * 3.3) * 9) + 1;
  const l = Math.floor(seededRandom(num * 4.4) * 9) + 1;
  
  // Rank for Caravan sum (1-10)
  const rank = Math.floor(seededRandom(num * 5.5) * 10) + 1;

  return { t, r, b, l, rank };
}

export function initBattle(totalCards) {
  const btnStart = document.getElementById('btn-start');
  const btnReset = document.getElementById('btn-reset');
  const playerHandEl = document.getElementById('player-hand');
  const opponentHandEl = document.getElementById('opponent-hand');
  const boardSlots = document.querySelectorAll('.board-slot');
  const turnIndicator = document.getElementById('turn-indicator');
  const gameScore = document.getElementById('game-score');
  const battleLog = document.getElementById('battle-log');
  const caravanScoreEls = [
    document.getElementById('score-col-0'),
    document.getElementById('score-col-1'),
    document.getElementById('score-col-2')
  ];

  if (!btnStart || !playerHandEl || !opponentHandEl || !boardSlots.length) return;

  let gameState = {
    playerHand: [],
    opponentHand: [],
    board: Array(9).fill(null),
    turn: 'player', // 'player' or 'opponent'
    selectedCardIdx: null,
    gameActive: false,
    scores: { player: 0, opponent: 0 },
    caravans: [0, 0, 0] // Sums of columns
  };

  function log(msg, cls) {
    if (!battleLog) return;
    const p = document.createElement('p');
    p.className = cls || '';
    p.innerHTML = msg;
    battleLog.prepend(p);
  }

  function updateUI() {
    // Render hands
    renderHand(playerHandEl, gameState.playerHand, true);
    renderHand(opponentHandEl, gameState.opponentHand, false);

    // Update board
    boardSlots.forEach((slot, i) => {
      const card = gameState.board[i];
      slot.innerHTML = '';
      if (card) {
        const cardEl = createCardElement(card);
        cardEl.classList.add(card.owner === 'player' ? 'player-owned' : 'opponent-owned');
        slot.appendChild(cardEl);
      }
    });

    // Update scores and caravans
    calculateCaravans();
    updateCaravanUI();
    
    // Overall score (Triple Triad style - board control)
    let pCount = gameState.playerHand.length;
    let oCount = gameState.opponentHand.length;
    gameState.board.forEach(c => {
      if (c?.owner === 'player') pCount++;
      if (c?.owner === 'opponent') oCount++;
    });
    
    gameScore.textContent = `P1: ${pCount} | CPU: ${oCount}`;
    turnIndicator.textContent = gameState.gameActive 
      ? (gameState.turn === 'player' ? "Your Turn" : "Opponent Thinking...") 
      : "Game Over";
      
    if (gameState.turn === 'player') {
      turnIndicator.style.color = 'var(--sakura-400)';
    } else {
      turnIndicator.style.color = 'var(--moon-300)';
    }
  }

  function renderHand(container, hand, isPlayer) {
    container.innerHTML = '';
    hand.forEach((card, i) => {
      const cardEl = createCardElement(card);
      if (isPlayer) {
        if (gameState.selectedCardIdx === i) cardEl.classList.add('selected');
        cardEl.addEventListener('click', () => {
          if (gameState.turn !== 'player' || !gameState.gameActive) return;
          gameState.selectedCardIdx = i;
          updateUI();
        });
      } else {
        // Hide stats and show back face for opponent in hand
        const img = cardEl.querySelector('img');
        if (img) img.src = cardPath(card.num, 'back');
        const stats = cardEl.querySelector('.card-stats');
        if (stats) stats.style.display = 'none';
      }
      container.appendChild(cardEl);
    });
  }

  function createCardElement(card) {
    const el = document.createElement('div');
    el.className = 'game-card';
    el.innerHTML = `
      <img src="${cardPath(card.num, 'front')}" />
      <div class="card-stats">
        <div class="stat-t">${card.stats.t}</div>
        <div class="stat-r">${card.stats.r}</div>
        <div class="stat-b">${card.stats.b}</div>
        <div class="stat-l">${card.stats.l}</div>
      </div>
    `;
    return el;
  }

  function calculateCaravans() {
    const cols = [0, 0, 0];
    for (let i = 0; i < 9; i++) {
      const card = gameState.board[i];
      if (card) {
        const colIdx = i % 3;
        // In our hybrid, rank affects caravan score
        cols[colIdx] += card.stats.rank;
      }
    }
    gameState.caravans = cols;
  }

  function updateCaravanUI() {
    gameState.caravans.forEach((val, i) => {
      const el = caravanScoreEls[i];
      el.textContent = val;
      el.classList.remove('sold', 'too-high');
      if (val >= 21 && val <= 26) {
        el.classList.add('sold');
      } else if (val > 26) {
        el.classList.add('too-high');
      }
    });
  }

  function placeCard(boardIdx) {
    if (!gameState.gameActive || gameState.board[boardIdx] !== null) return false;
    
    let card;
    if (gameState.turn === 'player') {
      if (gameState.selectedCardIdx === null) return false;
      card = gameState.playerHand.splice(gameState.selectedCardIdx, 1)[0];
      gameState.selectedCardIdx = null;
    } else {
      // CPU logic would call this
      card = gameState.opponentHand.splice(0, 1)[0]; // Placeholder for AI
    }

    card.owner = gameState.turn;
    gameState.board[boardIdx] = card;
    
    log(`✨ ${gameState.turn === 'player' ? 'You' : 'Opponent'} placed card at slot ${boardIdx + 1}`);
    
    checkCaptures(boardIdx);
    
    // Switch turn
    gameState.turn = gameState.turn === 'player' ? 'opponent' : 'player';
    
    if (checkGameOver()) {
      endGame();
    } else if (gameState.turn === 'opponent') {
      setTimeout(cpuTurn, 1000);
    }
    
    updateUI();
    return true;
  }

  function checkCaptures(idx) {
    const card = gameState.board[idx];
    const neighbors = [
      { pos: idx - 3, dir: 't', oppDir: 'b' }, // Top
      { pos: idx + 3, dir: 'b', oppDir: 't' }, // Bottom
      { pos: idx - 1, dir: 'l', oppDir: 'r', sameRow: true }, // Left
      { pos: idx + 1, dir: 'r', oppDir: 'l', sameRow: true }  // Right
    ];

    neighbors.forEach(n => {
      // Bounds check
      if (n.pos < 0 || n.pos >= 9) return;
      if (n.sameRow && Math.floor(n.pos / 3) !== Math.floor(idx / 3)) return;

      const neighbor = gameState.board[n.pos];
      if (neighbor && neighbor.owner !== card.owner) {
        if (card.stats[n.dir] > neighbor.stats[n.oppDir]) {
          neighbor.owner = card.owner;
          log(`⚡ Capturing card at ${n.pos + 1}!`, 'win');
        }
      }
    });
  }

  function cpuTurn() {
    if (!gameState.gameActive) return;
    
    // Simple AI: Find first empty slot and place first card
    const emptySlots = [];
    gameState.board.forEach((slot, i) => {
      if (slot === null) emptySlots.push(i);
    });

    if (emptySlots.length > 0) {
      const randomSlot = emptySlots[Math.floor(Math.random() * emptySlots.length)];
      // Choose a card from opponent hand
      // (The logic is already in placeCard for simple removal)
      placeCard(randomSlot);
    }
  }

  function checkGameOver() {
    return gameState.board.every(slot => slot !== null);
  }

  function endGame() {
    gameState.gameActive = false;
    
    // Score calculation
    let pCount = 0;
    let oCount = 0;
    gameState.board.forEach(c => {
      if (c.owner === 'player') pCount++;
      else oCount++;
    });

    // Caravan bonus? 
    // Let's say each "sold" caravan column adds 2 points to the owner of the most cards in that column
    gameState.caravans.forEach((val, i) => {
      if (val >= 21 && val <= 26) {
        // Who has more cards in this column?
        let pCol = 0, oCol = 0;
        [i, i+3, i+6].forEach(idx => {
          if (gameState.board[idx]?.owner === 'player') pCol++;
          else oCol++;
        });
        if (pCol > oCol) pCount += 2;
        else if (oCol > pCol) oCount += 2;
      }
    });

    if (pCount > oCount) {
      log(`🌟 VICTORY! Final Score - P1: ${pCount} | CPU: ${oCount}`, 'win');
    } else if (oCount > pCount) {
      log(`🌙 DEFEAT! Final Score - P1: ${pCount} | CPU: ${oCount}`, 'lose');
    } else {
      log(`✨ DRAW! Final Score - P1: ${pCount} | CPU: ${oCount}`, 'draw');
    }
  }

  boardSlots.forEach((slot, i) => {
    slot.addEventListener('click', () => {
      if (gameState.turn === 'player') {
        placeCard(i);
      }
    });
  });

  btnStart.addEventListener('click', () => {
    // Initialize hands
    gameState.playerHand = [];
    gameState.opponentHand = [];
    for (let i = 0; i < 5; i++) {
      const pNum = Math.floor(Math.random() * totalCards) + 1;
      const oNum = Math.floor(Math.random() * totalCards) + 1;
      gameState.playerHand.push({ num: pNum, stats: getCardStats(pNum), owner: 'player' });
      gameState.opponentHand.push({ num: oNum, stats: getCardStats(oNum), owner: 'opponent' });
    }

    gameState.board = Array(9).fill(null);
    gameState.turn = Math.random() > 0.5 ? 'player' : 'opponent';
    gameState.gameActive = true;
    gameState.selectedCardIdx = null;
    
    if (battleLog) battleLog.innerHTML = '';
    log('🌸 A new magical battle begins! Good luck!');
    
    if (gameState.turn === 'opponent') {
      setTimeout(cpuTurn, 1000);
    }
    
    updateUI();
    btnStart.disabled = true;
  });

  btnReset.addEventListener('click', () => {
    gameState.gameActive = false;
    gameState.board = Array(9).fill(null);
    gameState.playerHand = [];
    gameState.opponentHand = [];
    updateUI();
    btnStart.disabled = false;
    if (battleLog) battleLog.innerHTML = '';
    log('🔄 Battle reset. Click Start to begin.');
  });
}
