# Steps Web

Vite + React + React Router app configured as a PWA.

## Scripts

```bash
pnpm dev
pnpm dev:portless
pnpm build
pnpm preview
```

## PWA

- Service worker registration via `vite-plugin-pwa`
- Manifest configured in `vite.config.ts`

## Portless

Use a global Portless install to run the app at `https://steps.localhost`:

```bash
pnpm i -g portless
pnpm dev:portless
```
