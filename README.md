# ServingStudio Intro

The introduction website for ServingStudio: its simulation foundation, Agent
workflows, performance analysis, and applications to real serving frameworks.

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

This produces `dist/ServingStudioIntro.html` with the JavaScript, CSS, and logo
inlined. The file can be opened directly or uploaded to static hosting.
