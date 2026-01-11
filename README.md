# Ocheverse – David Gideon's Portfolio

A sleek, developer-focused portfolio built with Next.js + TailwindCSS.

## Features
- 🚀 **Projects Section**: Showcasing infrastructure and DevOps work.
- 🐍 **Terminal Games**:
  - **Snake**: Classic terminal snake game (`/game`).
  - **2048**: Logic puzzle game (`/2048`).
- ⚡ **Now Page**: Real-time status inspired by Derek Sivers (`/now`).
  - **Spotify Integration**: Displays currently playing song via API.
  - **CMS-Powered Focus**: Track exam prep (Google PCA/AWS SAP) via Notion.
- 📚 **Engineering Vault**: Curated DevOps resources (`/resources`) managed via Notion.
- ⌘ **Command Palette**: `Ctrl+K` for keyboard-driven navigation.
- 🐳 **Docker Ready**: Optimized for containerized deployment.

## Setup

```bash
npm install
npm run dev
```

## Configuration (.env.local)
To enable the "Now Playing" widget and Notion CMS features, create a `.env.local` file:

```bash
# Spotify (For 'Now Playing' Widget)
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
SPOTIFY_REFRESH_TOKEN=...

# Notion CMS (For /resources and /now content)
NOTION_KEY=...
NOTION_RESOURCES_DATABASE_ID=...
NOTION_FOCUS_DATABASE_ID=...
```
*Note: The site works in "Mock Mode" if these keys are missing.*

## Docker

```bash
docker build -t ocheverse .
docker run -p 3000:3000 ocheverse
```
