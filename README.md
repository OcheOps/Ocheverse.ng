# Ocheverse – David Gideon's Portfolio

A sleek, developer-focused portfolio built with Next.js + TailwindCSS.

## Features
- 🚀 **Projects Section**: Showcasing infrastructure and DevOps work.
- 🐍 **Terminal Games**:
  - **Snake**: Classic terminal snake game (`/game`).
  - **2048**: Logic puzzle game (`/2048`).
- ⚡ **Now Page**: Real-time status inspired by Derek Sivers (`/now`).
  - **Now Playing**: Displays currently playing song via `siteData.js`.
  - **Focus Tracker**: Track exam prep (Google PCA/AWS SAP).
- 📚 **Engineering Vault**: Curated DevOps resources (`/resources`).
- ⌘ **Command Palette**: `Ctrl+K` for keyboard-driven navigation.
- 🐳 **Docker Ready**: Optimized for containerized deployment.

## Setup

```bash
npm install
npm run dev
```

## Configuration (Local Data)
The "Now" page and "Resources" page are powered by a local data file. You can easily update this without touching the actual page code or needing external API keys.

Edit the file at: `data/siteData.js`

Here you can update:
- `focusItems`: Your current goals and progress bars.
- `currentlyListening`: The song showing on your Now Playing widget.
- `currentReading`: The book you are reading.
- `resources`: The list of links showing on the `/resources` page.

## Docker

```bash
docker build -t ocheverse .
docker run -p 3000:3000 ocheverse
```
