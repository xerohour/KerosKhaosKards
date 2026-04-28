import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CCC_DIR = path.join(__dirname, '..', 'ccc');
const PUBLIC_CARDS_DIR = path.join(__dirname, '..', 'public', 'cards');
const DATA_FILE = path.join(__dirname, '..', 'src', 'card-data.json');

if (!fs.existsSync(PUBLIC_CARDS_DIR)) {
  fs.mkdirSync(PUBLIC_CARDS_DIR, { recursive: true });
}

const files = fs.readdirSync(CCC_DIR);
const cardMap = new Map();

// Handle card backs
console.log('Processing card backs...');
const clowBack = files.find(f => f.includes('0 Back - Clow'));
if (clowBack) {
  fs.copyFileSync(path.join(CCC_DIR, clowBack), path.join(PUBLIC_CARDS_DIR, 'card_back_clow.png'));
  console.log('Copied Clow back.');
}
const sakBack = files.find(f => f.includes('0 Back - Sak'));
if (sakBack) {
  fs.copyFileSync(path.join(CCC_DIR, sakBack), path.join(PUBLIC_CARDS_DIR, 'card_back_sakura.png'));
  console.log('Copied Sakura back.');
}

console.log('Processing card fronts...');
files.forEach(file => {
  if (file.startsWith('0 Back') || !file.endsWith('.png') || file.startsWith('._') || file.includes('__MACOSX')) return;

  const match = file.match(/^(\d+)\s*([A-Z])?\s*(?:\.-?|-|\s+)\s*([A-Za-z\s]+?)\s*(2)?\.png$/);

  if (match) {
    const num = parseInt(match[1]);
    const variant = match[2] || '';
    const name = match[3].trim();
    const isFoil = !!match[4];

    const cardId = `${num}_${variant.toLowerCase()}`;
    const existing = cardMap.get(cardId);

    // If we have a duplicate, we only replace if the new one is a foil
    // (since foil is basically the "upgraded" version of the card graphic)
    if (!existing || (!existing.isFoil && isFoil)) {
      const targetName = `card_${String(num).padStart(2, '0')}${variant ? '_' + variant.toLowerCase() : ''}${isFoil ? '_foil' : ''}.png`;
      
      cardMap.set(cardId, {
        num,
        variant,
        name,
        isFoil,
        file: targetName,
        sourceFile: file
      });
    }
  }
});

const cards = Array.from(cardMap.values());

cards.forEach(card => {
  fs.copyFileSync(path.join(CCC_DIR, card.sourceFile), path.join(PUBLIC_CARDS_DIR, card.file));
  delete card.sourceFile; // Don't save this in JSON
});

// Sort cards by number, then variant, then foil
cards.sort((a, b) => {
  if (a.num !== b.num) return a.num - b.num;
  if (a.variant !== b.variant) return a.variant.localeCompare(b.variant);
  if (a.isFoil !== b.isFoil) return a.isFoil ? 1 : -1;
  return 0;
});

fs.writeFileSync(DATA_FILE, JSON.stringify(cards, null, 2));
console.log(`Processed ${cards.length} cards. Metadata saved to ${DATA_FILE}`);
