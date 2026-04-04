import { createCanvas } from 'canvas';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'cards');
mkdirSync(OUT, { recursive: true });

const W = 300, H = 420;

function randomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r},${g},${b})`;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawCard(num, isFront) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, W, H);
  if (isFront) {
    grad.addColorStop(0, '#FFB7D5');
    grad.addColorStop(1, '#FFF0F5');
  } else {
    grad.addColorStop(0, '#D4A5FF');
    grad.addColorStop(1, '#F0E6FF');
  }
  ctx.fillStyle = grad;
  roundRect(ctx, 0, 0, W, H, 16);
  ctx.fill();

  ctx.strokeStyle = isFront ? '#FF69B4' : '#9B59B6';
  ctx.lineWidth = 4;
  roundRect(ctx, 4, 4, W - 8, H - 8, 14);
  ctx.stroke();

  ctx.strokeStyle = isFront ? '#FFD700' : '#C0C0C0';
  ctx.lineWidth = 2;
  roundRect(ctx, 16, 16, W - 32, H - 32, 10);
  ctx.stroke();

  const stars = [[30, 30], [W - 30, 30], [30, H - 30], [W - 30, H - 30]];
  ctx.fillStyle = isFront ? '#FFD700' : '#C0C0C0';
  ctx.font = '16px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  stars.forEach(([x, y]) => ctx.fillText('\u2605', x, y));

  const color = randomColor();
  ctx.fillStyle = color;
  ctx.font = 'bold 120px Georgia';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(num), W / 2, H / 2);

  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 2;
  ctx.strokeText(String(num), W / 2, H / 2);

  ctx.fillStyle = isFront ? '#FF69B4' : '#9B59B6';
  ctx.font = '14px Georgia';
  ctx.fillText(isFront ? 'FRONT' : 'BACK', W / 2, H - 40);

  return canvas.toBuffer('image/png');
}

for (let i = 1; i <= 72; i++) {
  const pad = String(i).padStart(2, '0');

  const front = drawCard(i, true);
  writeFileSync(join(OUT, `card_${pad}_front.png`), front);

  const back = drawCard(i, false);
  writeFileSync(join(OUT, `card_${pad}_back.png`), back);

  process.stdout.write(`\rGenerated card ${i}/72`);
}
console.log('\nDone! 144 card images saved to public/cards/');
