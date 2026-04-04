function cardPath(num, side) {
  const pad = String(num).padStart(2, '0');
  return `/cards/card_${pad}_${side}.png`;
}

export function initBattle(totalCards) {
  const btnDraw = document.getElementById('btn-draw');
  const btnBattle = document.getElementById('btn-battle');
  const btnReset = document.getElementById('btn-reset');
  const playerSlot = document.getElementById('player-card');
  const opponentSlot = document.getElementById('opponent-card');
  const battleLog = document.getElementById('battle-log');

  if (!btnDraw || !btnBattle || !btnReset || !playerSlot || !opponentSlot) return;

  let playerCard = null;
  let opponentCard = null;
  let playerHP = 100;
  let opponentHP = 100;

  function randomCard() {
    return Math.floor(Math.random() * totalCards) + 1;
  }

  function updateHP() {
    const pBar = document.querySelector('.player-hp');
    const oBar = document.querySelector('.opponent-hp');
    if (pBar) pBar.style.width = `${Math.max(0, playerHP)}%`;
    if (oBar) oBar.style.width = `${Math.max(0, opponentHP)}%`;
  }

  function log(msg, cls) {
    if (!battleLog) return;
    const p = document.createElement('p');
    p.className = cls || '';
    p.textContent = msg;
    battleLog.prepend(p);
  }

  function setSlotCard(slot, num) {
    slot.innerHTML = `<img src="${cardPath(num, 'front')}" alt="Card #${num}" />`;
    slot.classList.add('filled');
  }

  function clearSlot(slot) {
    slot.innerHTML = '<div class="card-placeholder">?</div>';
    slot.classList.remove('filled');
  }

  btnDraw.addEventListener('click', () => {
    playerCard = randomCard();
    opponentCard = randomCard();

    setSlotCard(playerSlot, playerCard);
    setSlotCard(opponentSlot, opponentCard);

    log(`🌸 You drew Card #${playerCard}! Opponent drew Card #${opponentCard}!`);
    btnBattle.disabled = false;
    btnDraw.disabled = true;
  });

  btnBattle.addEventListener('click', () => {
    if (playerCard === null || opponentCard === null) return;

    const pPower = Math.floor(Math.random() * 30) + playerCard;
    const oPower = Math.floor(Math.random() * 30) + opponentCard;

    if (pPower > oPower) {
      const dmg = Math.floor((pPower - oPower) * 1.5);
      opponentHP -= dmg;
      log(`⚡ Your card (${pPower} power) beats opponent (${oPower})! -${dmg} HP!`, 'win');
    } else if (oPower > pPower) {
      const dmg = Math.floor((oPower - pPower) * 1.5);
      playerHP -= dmg;
      log(`💔 Opponent (${oPower} power) beats your card (${pPower})! -${dmg} HP!`, 'lose');
    } else {
      log(`✨ It's a magical tie! Both cards have ${pPower} power!`, 'draw');
    }

    updateHP();

    if (playerHP <= 0) {
      log('🌙 The stars fade... You have been defeated! 🌙', 'lose');
      btnDraw.disabled = true;
      btnBattle.disabled = true;
    } else if (opponentHP <= 0) {
      log('🌟 Victory! The cards bow to your magical power! 🌟', 'win');
      btnDraw.disabled = true;
      btnBattle.disabled = true;
    } else {
      btnBattle.disabled = true;
      btnDraw.disabled = false;
    }

    playerCard = null;
    opponentCard = null;
  });

  btnReset.addEventListener('click', () => {
    playerHP = 100;
    opponentHP = 100;
    playerCard = null;
    opponentCard = null;
    updateHP();
    clearSlot(playerSlot);
    clearSlot(opponentSlot);
    if (battleLog) battleLog.innerHTML = '';
    btnDraw.disabled = false;
    btnBattle.disabled = true;
    log('🔄 A new magical battle begins!');
  });
}
