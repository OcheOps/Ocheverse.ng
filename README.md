# Ocheverse – David Gideon's Portfolio

A sleek, developer-focused portfolio built with Next.js + TailwindCSS.

## Features
- 🚀 **Projects Section**: Showcasing infrastructure and DevOps work.
- 🐍 **Terminal Games**:
  - **Snake**: Classic terminal snake game (`/game`).
  - **2048**: Logic puzzle game (`/2048`).
- 📚 **Engineering Vault**: Curated DevOps resources (`/resources`).
- ⌘ **Command Palette**: `Ctrl+K` for keyboard-driven navigation.
- 🐳 **Docker Ready**: Optimized for containerized deployment.

## Setup

```bash
npm install
npm run dev
```

## Configuration (Local Data)
The "Resources" page is powered by a local data file. You can easily update this without touching the actual page code or needing external API keys.

Edit the file at: `data/siteData.js`

Here you can update:
- `resources`: The list of links showing on the `/resources` page.

## Docker

```bash
docker build -t ocheverse .
docker run -p 3000:3000 ocheverse
```
