# Kero's Khaos Kards 🌸✨

A magical girl themed card game web app inspired by **Card Captor Sakura**. Collect 72 mystical cards, battle opponents, and explore your enchanted collection — all wrapped in sparkling sakura petals and celestial magic.

Built as a **Progressive Web App (PWA)** that installs natively on Android and iOS devices.

## Features

- **72 Unique Cards** — Each card features a randomized RGB-colored number with magical names inspired by the Clow Cards
- **Card Collection** — Browse, search, and sort your entire card collection with smooth animations
- **Card Battle** — Draw cards and battle opponents in HP-based combat with randomized power rolls
- **Gallery Viewer** — Flip through cards with a 3D flip animation, navigate with thumbnails
- **Falling Sakura Petals** — Animated cherry blossom petals drift across the screen
- **Geocities Aesthetic** — Blinking stars, marquee text, visitor counter, and retro web badges
- **PWA / Installable** — Add to home screen on Android and iOS for a native app experience
- **Offline Support** — Service worker caches assets for offline use
- **Responsive Design** — Works on phones, tablets, and desktops
- **Accessibility** — Reduced motion support, ARIA labels, semantic HTML

## Tech Stack

| Layer | Technology |
|-------|------------|
| Build | [Vite](https://vitejs.dev/) (vanilla JS, no framework) |
| Styling | Vanilla CSS with custom properties, glassmorphism, gradients |
| Typography | [Cinzel Decorative](https://fonts.google.com/specimen/Cinzel+Decorative) + [Quicksand](https://fonts.google.com/specimen/Quicksand) |
| PWA | Custom service worker + `manifest.json` |
| Card Generation | Node.js + [node-canvas](https://github.com/Automattic/node-canvas) |
| Mobile Wrapper | Capacitor (planned) / PWA install prompt |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm

### Install

```bash
git clone https://github.com/xerohour/KerosKhaosKards.git
cd KerosKhaosKards
npm install
```

### Generate Card Assets

The 72 card images (front + back = 144 PNGs) are pre-generated in `public/cards/`. To regenerate with new random colors:

```bash
npm run generate
```

### Development

```bash
npm run dev
```

Opens the app at `http://localhost:3000`.

### Production Build

```bash
npm run build
npm run preview
```

## Mobile Installation

### Android

1. Open the app in Chrome
2. Tap the "Install" banner or use the browser menu → "Add to Home screen"
3. The app launches in standalone mode like a native app

### iOS

1. Open the app in Safari
2. Tap the Share button → "Add to Home Screen"
3. The app saves to your home screen with its own icon

## Project Structure

```
KerosKhaosKards/
├── public/
│   ├── cards/          # 144 generated card PNGs (72 front + 72 back)
│   ├── icons/          # PWA app icons (192px, 512px)
│   ├── manifest.json   # PWA manifest
│   └── sw.js           # Service worker
├── scripts/
│   ├── generate-cards.mjs   # Card PNG generator
│   └── generate-icons.mjs   # PWA icon generator
├── src/
│   ├── main.js         # App entry point
│   ├── cards.js        # Card grid, gallery, modal
│   ├── battle.js       # Card battle mini-game
│   ├── sakura.js       # Falling petal animation
│   ├── pwa.js          # Service worker + install prompt
│   └── style.css       # Complete design system
├── index.html          # App shell
├── generate-cards.html # Browser-based card generator (standalone)
├── vite.config.js      # Vite configuration
└── package.json
```

## Design

The visual design draws from:

- **Card Captor Sakura** — Sakura pink palette, celestial moon/sun motifs, star decorations, magical card names
- **Magical Girl Anime** — Sparkle overlays, glass morphism, gradient backgrounds, whimsical typography
- **Wiccan / Witchy** — Moon crescents, star symbols, mystical purple tones
- **Geocities Era** — Blinking text, marquee scrolling, visitor counters, decorative badges, star dividers
- **Kawaii** — Soft colors, rounded corners, playful emoji icons, cute hover animations

## License

MIT
