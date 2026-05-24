# Steps

Steps is a Progressive Web App (PWA) built for the Blood Bank of Monastir.

The app guides users through visual, step-by-step processes ("processes") using a swipeable image viewer with offline-first caching.

## What It Does

- Shows a sequence of process images that users can swipe through.
- Lets users open a step list and jump to a specific step.
- Stores process images locally so the experience works offline.
- Prepares for versioned process updates (admin + API planned).

## Project Structure

- `apps/web`: the PWA viewer (Vite + React + React Router).
- `apps/admin`: planned admin UI for managing processes and versions.
- `apps/api`: planned API for serving manifests/assets.
