# VibeSim Intro

The standalone VibeSim introduction site.

## Development

```bash
npm ci
npm run dev
```

The development server listens on all interfaces by default.

## Production build

```bash
npm run build
```

Vite writes the deployable site to `dist/`.

## Single-file build

```bash
npm run build:single
```

This produces `dist/vibesim-intro.html` with the JavaScript, CSS, and logo
inlined. The file can be opened directly or uploaded to static hosting.
