const PETAL_COUNT = 25;

export function createSakuraPetals() {
  const container = document.getElementById('sakura-container');
  if (!container) return;

  for (let i = 0; i < PETAL_COUNT; i++) {
    const petal = document.createElement('div');
    petal.className = 'sakura-petal';

    const size = 10 + Math.random() * 14;
    const left = Math.random() * 100;
    const duration = 8 + Math.random() * 12;
    const delay = Math.random() * duration;
    const hue = 330 + Math.random() * 20;

    petal.style.cssText = `
      left: ${left}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
      opacity: ${0.3 + Math.random() * 0.5};
      background: radial-gradient(
        ellipse at 30% 30%,
        hsl(${hue}, 100%, 85%),
        hsl(${hue}, 80%, 70%)
      );
    `;

    container.appendChild(petal);
  }
}
