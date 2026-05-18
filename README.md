# Browser Extension - Daily Focus

[![Build](https://github.com/Divanshiv/Browser-Extension-/actions/workflows/ci.yml/badge.svg)](https://github.com/Divanshiv/Browser-Extension-/actions/workflows/ci.yml)

A **lightweight, beautiful new tab extension** that replaces your browser's default tab with a focus & productivity dashboard. Built with **React + Vite** — optimized for speed.

## Features

- **Personalized Welcome** — Greets you by name with a time-appropriate message
- **Live Clock** — Real-time clock that updates every second
- **Daily Focus** — Set one main focus per day. Resets automatically at midnight.
- **Todo List** — Add, check off, and delete tasks. Persisted in localStorage.
- **Fresh Backgrounds** — Beautiful random images from Picsum on every load
- **Motivational Quotes** — Curated quotes that rotate every 30 seconds
- **Zero API Keys** — No external services needed for images or quotes

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | [React 18](https://reactjs.org/) |
| Bundler | [Vite](https://vitejs.dev/) |
| State | Context API + useReducer |
| Persistence | localStorage |
| Images | picsum.photos (no API key) |
| Icons | Material Icons Outlined |
| Fonts | Raleway (Google Fonts) |

## Quick Start

```bash
npm install
npm run dev        # Development server
npm run build      # Production build → build/
```

## Install as Browser Extension

### Chrome / Edge
1. Run `npm run build`
2. Go to `chrome://extensions` or `edge://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked** → select the `build/` folder

### Firefox
1. Run `npm run build`
2. Go to `about:debugging#/runtime/this-firefox`
3. Click **Load Temporary Add-on**
4. Select `build/manifest.json`

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run package:extension` | Build + zip for store submission |
| `npm run preview` | Preview production build locally |

## Project Structure

```
├── index.html              # Entry HTML (root)
├── vite.config.js          # Vite config
├── public/
│   ├── manifest.json       # Extension manifest
│   └── icons
├── src/
│   ├── main.jsx            # React entry point
│   ├── App.jsx             # Root component
│   ├── context/            # Global state (Context + useReducer)
│   ├── db/                 # Data (quotes, image generator)
│   ├── components/Todo/    # Todo list component
│   ├── pages/              # Home (name entry) + Task (dashboard)
│   └── styles/             # Utility CSS
```

## What's New (v0.2.0)

- Migrated from Create React App → **Vite** — 70% smaller node_modules, ~10x faster builds
- Every new tab gets a **fresh random background** via picsum.photos (no more 21 hardcoded images)
- Removed 5 unused dependencies — from 390MB to 113MB
- Replaced `uuid` with native `crypto.randomUUID()` — one less dependency

---

Built by Divanshiv
