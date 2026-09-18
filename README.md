# Daily Focus — Browser Extension

[![CI](https://github.com/Divanshiv/Browser-Extension-/actions/workflows/ci.yml/badge.svg)](https://github.com/Divanshiv/Browser-Extension-/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/tests-65%20passing-green)](https://vitest.dev/)

A **lightweight New Tab extension** that replaces your browser's default tab with a beautiful focus & productivity dashboard. Built with **React + Vite + TypeScript** — no backend, no API keys, everything runs locally.

## Features

### Focus & Productivity
- **Personalized Welcome** — Greets you by name with a time-appropriate message
- **Live Clock** — Real-time clock throughout the dashboard
- **Daily Focus** — Set one main focus per day; resets automatically at midnight
- **Todo List** — Add, check off, and delete tasks. Persisted in `localStorage`
- **Pomodoro Timer** — Work / short break / long break cycles with progress ring, session dots, skip & reset
- **Quick Notes (Scratchpad)** — Always-on notes panel with auto-bullets and debounced auto-save

### Appearance
- **4 Themes** — Dark, Light, Sepia, High Contrast (cycle with one click)
- **Fresh Backgrounds** — Random Picsum images, curated presets, or your own image (upload or URL)
- **Motivational Quotes** — Curated quotes that rotate automatically

### Power Tools
- **Keyboard Shortcuts** — `Cmd/Ctrl + K/T/N/P`, `Shift + ?` help, and more (toggleable)
- **Data Manager** — Export / import a full JSON backup, or clear all data (with confirmation)
- **Settings Persistence** — Theme, background, and Pomodoro settings survive reloads

### Quality
- **Zero API Keys** — No external services needed for images or quotes
- **Error Resilience** — Error boundary catches crashes with a friendly message
- **Accessibility** — ARIA labels, semantic HTML, keyboard navigable
- **Content Security Policy** — Security headers in `index.html`

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | [React 18](https://reactjs.org/) |
| Language | [TypeScript](https://www.typescriptlang.org/) (strict mode) |
| Bundler | [Vite](https://vitejs.dev/) |
| State | Context API + useReducer |
| Testing | [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react) |
| Linting | [ESLint](https://eslint.org/) (flat config) + [typescript-eslint](https://typescript-eslint.io/) |
| Formatting | [Prettier](https://prettier.io/) |
| Persistence | `localStorage` |
| Images | [picsum.photos](https://picsum.photos/) (no API key) |
| Fonts | Raleway (Google Fonts) |

## Quick Start

```bash
npm install
npm run dev        # Development server → http://localhost:5173/
npm run build      # Production build → build/
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build to `build/` |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | TypeScript type checking (`tsc --noEmit`) |
| `npm run lint` | Check for lint errors |
| `npm run lint:fix` | Auto-fix lint errors |
| `npm run format` | Check formatting with Prettier |
| `npm run format:fix` | Auto-format all source files |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once (CI mode) |
| `npm run package:extension` | Build + zip for store submission |

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

## Project Structure

```
├── index.html                   # Entry HTML (with Content-Security-Policy)
├── vite.config.js               # Vite + Vitest configuration
├── tsconfig.json                # TypeScript strict config
├── eslint.config.js             # ESLint flat config
├── .prettierrc                  # Prettier formatting rules
├── .vscode/
│   └── settings.json            # Editor settings (format on save)
├── .github/
│   ├── workflows/ci.yml         # CI pipeline (lint → typecheck → format → test → build)
│   ├── ISSUE_TEMPLATE/          # Bug report + feature request templates
│   └── PULL_REQUEST_TEMPLATE.md # PR template
├── public/
│   ├── manifest.json            # Extension manifest (MV3)
│   ├── favicon.ico              # 16px icon
│   ├── logo192.png              # 48px icon
│   └── logo512.png              # 128px icon
├── src/
│   ├── main.tsx                 # React entry point (with ErrorBoundary)
│   ├── App.tsx                  # Root component (lazy-loads widgets)
│   ├── components/
│   │   ├── BackgroundSelector/  # Background chooser (random/presets/upload/URL)
│   │   ├── DataManager/         # Export / import / clear-all backup
│   │   ├── ErrorBoundary.tsx    # Error boundary for crash resilience
│   │   ├── Pomodoro/            # Pomodoro timer
│   │   ├── Scratchpad/          # Quick notes panel
│   │   ├── ShortcutsHelp/       # Keyboard shortcuts modal
│   │   ├── ThemeToggle/         # Theme cycle button
│   │   └── Todo/                # Todo list
│   ├── context/
│   │   ├── browser-context.tsx  # Name / task state provider
│   │   ├── browser-reducer.ts   # Browser state reducer + typed actions
│   │   └── settings-context.tsx # Theme/background/Pomodoro settings (persisted)
│   ├── data/
│   │   ├── images.ts            # Random image generator + presets
│   │   └── quotes.ts            # Motivational quotes
│   ├── hooks/
│   │   └── useKeyboardShortcuts.ts  # Global keyboard shortcut handling
│   ├── pages/
│   │   ├── Home/                # Name entry screen
│   │   └── Task/                # Main dashboard
│   └── styles/
│       └── utility.css          # Utility CSS classes + fonts
```

## Development

This project follows modern best practices:

- **TypeScript strict mode** — full type safety across the codebase
- **ESLint flat config + typescript-eslint** — catches code quality issues early
- **Prettier** — consistent code formatting (enforced in CI)
- **Vitest + Testing Library** — 65 component tests across 9 suites, run in CI
- **Error Boundary** — prevents full-page crashes from unhandled errors
- **Content Security Policy** — restricts sources for scripts and images
- **Code-splitting** — heavy widgets are lazy-loaded for a fast first paint

## CI

Every push to `main` runs: **lint → typecheck → formatting check → tests → production build** via GitHub Actions (`.github/workflows/ci.yml`).

---

Built by Divanshiv