# Browser Extension - Daily Focus

[![CI](https://github.com/Divanshiv/Browser-Extension-/actions/workflows/ci.yml/badge.svg)](https://github.com/Divanshiv/Browser-Extension-/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF)](https://vitejs.dev/)

A **lightweight, beautiful new tab extension** that replaces your browser's default tab with a focus & productivity dashboard. Built with **React + Vite + TypeScript**.

## Features

- **Personalized Welcome** — Greets you by name with a time-appropriate message
- **Live Clock** — Real-time clock that updates every second
- **Daily Focus** — Set one main focus per day. Resets automatically at midnight.
- **Todo List** — Add, check off, and delete tasks. Persisted in localStorage.
- **Fresh Backgrounds** — Beautiful random images from Picsum on every load
- **Motivational Quotes** — Curated quotes that rotate every 30 seconds
- **Zero API Keys** — No external services needed for images or quotes
- **Error Resilience** — Error boundary catches and displays friendly error messages
- **Accessibility** — ARIA labels, semantic HTML, keyboard navigable

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | [React 18](https://reactjs.org/) |
| Language | [TypeScript](https://www.typescriptlang.org/) (strict mode) |
| Bundler | [Vite](https://vitejs.dev/) |
| State | Context API + useReducer |
| Testing | [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react) |
| Linting | [ESLint](https://eslint.org/) (flat config) |
| Formatting | [Prettier](https://prettier.io/) |
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

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once (CI mode) |
| `npm run lint` | Check for lint errors |
| `npm run lint:fix` | Auto-fix lint errors |
| `npm run format` | Check formatting with Prettier |
| `npm run format:fix` | Auto-format all source files |
| `npm run package:extension` | Build + zip for store submission |
| `npm run preview` | Preview production build locally |

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
├── index.html                   # Entry HTML
├── vite.config.js               # Vite + Vitest configuration
├── tsconfig.json                # TypeScript strict config
├── eslint.config.js             # ESLint flat config
├── .prettierrc                  # Prettier formatting rules
├── .vscode/
│   └── settings.json            # Editor settings (format on save)
├── .github/
│   ├── workflows/ci.yml         # CI pipeline (lint → test → build)
│   ├── ISSUE_TEMPLATE/          # Bug report + feature request templates
│   └── PULL_REQUEST_TEMPLATE.md # PR template
├── public/
│   ├── manifest.json            # Extension manifest
│   └── icons/                   # Extension icons
├── src/
│   ├── main.tsx                 # React entry point (with ErrorBoundary)
│   ├── App.tsx                  # Root component
│   ├── components/
│   │   ├── ErrorBoundary.tsx    # Error boundary for crash resilience
│   │   └── Todo/                # Todo list component
│   ├── context/
│   │   ├── browser-context.tsx  # Global state provider
│   │   └── browser-reducer.ts   # State reducer + typed actions
│   ├── data/
│   │   ├── images.ts            # Random image generator
│   │   └── quotes.ts            # Motivational quotes
│   ├── pages/
│   │   ├── Home/                # Name entry screen
│   │   └── Task/                # Main dashboard
│   └── styles/
│       └── utility.css          # Utility CSS classes + fonts
```

## Development

This project follows modern best practices:

- **TypeScript strict mode** — full type safety across the codebase
- **ESLint flat config** — catches code quality issues early
- **Prettier** — consistent code formatting (enforced in CI)
- **Vitest + Testing Library** — component tests run in CI
- **Error Boundary** — prevents full-page crashes from unhandled errors
- **Content Security Policy** — security headers in index.html

---

Built by Divanshiv
