export function cardPath(card, side) {
  if (side === 'back') return '/cards/card_back_clow.png';
  if (!card || !card.file) return '/cards/card_back_clow.png';
  return `/cards/${card.file}`;
}

export function getCardStats(card) {
  if (!card) return { t: 1, r: 1, b: 1, l: 1, rank: 1 };
  
  const seedStr = `${card.num}-${card.variant || ''}-${card.name}`;
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
    hash |= 0;
  }
  
  const seededRandom = (s) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };

  const foilBonus = card.isFoil ? 1 : 0;

  const t = Math.min(10, Math.floor(seededRandom(hash * 1.1) * 9) + 1 + foilBonus);
  const r = Math.min(10, Math.floor(seededRandom(hash * 2.2) * 9) + 1 + foilBonus);
  const b = Math.min(10, Math.floor(seededRandom(hash * 3.3) * 9) + 1 + foilBonus);
  const l = Math.min(10, Math.floor(seededRandom(hash * 4.4) * 9) + 1 + foilBonus);
  const rank = Math.min(10, Math.floor(seededRandom(hash * 5.5) * 10) + 1 + foilBonus);

  return { t, r, b, l, rank };
}
