import { createCanvas } from 'canvas';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'icons');
mkdirSync(OUT, { recursive: true });

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
  grad.addColorStop(0, '#FF69B4');
  grad.addColorStop(0.5, '#E84D9C');
  grad.addColorStop(1, '#1a0a2e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = '#FFD700';
  ctx.font = `bold ${Math.floor(size * 0.2)}px Georgia`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('KKK', size / 2, size * 0.35);

  ctx.fillStyle = '#FFF0F5';
  ctx.font = `${Math.floor(size * 0.35)}px serif`;
  ctx.fillText('🃏', size / 2, size * 0.65);

  return canvas.toBuffer('image/png');
}

[192, 512].forEach(size => {
  writeFileSync(join(OUT, `icon-${size}.png`), generateIcon(size));
  console.log(`Generated icon-${size}.png`);
});
