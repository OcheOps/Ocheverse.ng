# Ocheverse.ng

A full-stack personal engineering hub built with Next.js, TailwindCSS, and a production-grade DevOps pipeline. Live at [ocheverse.ng](https://ocheverse.ng).

Built by [David Gideon](https://github.com/OcheOps) — DevOps Engineer, Platform Engineer, Solutions Architect.

---

## What's Inside

### Pages

| Route | Description |
|---|---|
| `/` | Animated hero with typewriter roles, featured projects, fun facts grid |
| `/blog` | Aggregated blog from two Substack feeds (Ocheverse & BPUR) via RSS |
| `/blog/[source]/[slug]` | Full blog post with TOC, reading progress, reactions, comments, related posts |
| `/now` | What I'm focused on — Spotify now playing, GitHub activity, visitor globe |
| `/music` | Spotify top tracks with time range toggle and 30s audio previews |
| `/stack` | 50+ tools & skills with category filters, tap-to-expand details, soft skills |
| `/guestbook` | Anonymous guestbook powered by Remark42 |
| `/learn` | Group sessions and 1-on-1 coaching offerings |
| `/resources` | Curated DevOps learning resources and certification guides |
| `/game` | Terminal-styled Snake game with difficulty scaling |
| `/2048` | 2048 puzzle game with swipe controls |

### API Routes

| Endpoint | Description |
|---|---|
| `/api/now-playing` | Currently playing track from Spotify |
| `/api/top-tracks` | Top 10 tracks (accepts `?range=short_term\|medium_term\|long_term`) |
| `/api/github` | Recent GitHub activity with private repo funny messages |
| `/api/reactions` | Emoji reactions store (GET counts, POST to react) |
| `/api/feed` | Combined RSS feed from both Substack publications |
| `/api/sitemap` | Dynamic sitemap with all pages + blog posts |

### Features

- **Spotify Integration** — Real-time now playing widget (30s polling) and top tracks dashboard with audio preview
- **GitHub Activity Feed** — Live commits, PRs, and issues. Private repos show with lock icon and 30+ randomized funny messages like _"This repo is classified. Move along."_ and _"I'd tell you, but then I'd have to mass revoke your access."_
- **Interactive 3D Globe** — react-globe.gl with animated arcs from Nigeria to cities worldwide, auto-rotation, drag to explore
- **Blog Reactions** — Fire, rocket, brain, heart, clap emoji reactions on every post with persistent server-side storage
- **Command Palette** — `Ctrl+K` / `Cmd+K` for keyboard-driven navigation with blog post search
- **Page Transitions** — Smooth fade + slide animations between all pages via Framer Motion
- **Easter Eggs** — Konami code (↑↑↓↓←→) on desktop, 5-tap the logo on mobile. Console has a hidden message too
- **Dark/Light Mode** — Toggle with localStorage persistence
- **Reading Progress Bar** — Gradient bar tracking scroll depth on blog posts
- **Copy Code Buttons** — Auto-injected on all code blocks
- **Back to Top** — Floating button after 400px scroll
- **Mobile Responsive** — Touch/swipe controls on games, mobile d-pad buttons, responsive layouts everywhere

---

## Tech Stack

| Layer | Tools |
|---|---|
| Framework | Next.js 13.4 (Pages Router, ISR, Standalone Output) |
| Styling | Tailwind CSS 3.3, @tailwindcss/typography |
| Animations | Framer Motion |
| Globe | react-globe.gl (Three.js) |
| Command Palette | cmdk |
| RSS | rss-parser + Cloudflare Worker proxy |
| HTML Parsing | cheerio, slugify |
| Images | Sharp (Next.js image optimization) |
| Containerization | Docker (multi-stage, node:20-alpine) |
| Reverse Proxy | Traefik (via Coolify network) |
| SSL | Let's Encrypt (auto via Traefik) |
| CI/CD | GitHub Actions |
| Secrets | HashiCorp Vault (AppRole auth) |
| Registry | Private Docker registry |
| Hosting | Contabo VPS |
| Analytics | Umami (cloud) |
| Comments | Remark42 (self-hosted, anonymous) |
| DNS/CDN | Cloudflare |

---

## Architecture

```
                    ┌─────────────────┐
                    │   Cloudflare    │
                    │  DNS + Workers  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Contabo VPS    │
                    │                 │
                    │  ┌───────────┐  │
                    │  │  Traefik  │  │  ← Auto SSL via Let's Encrypt
                    │  └─────┬─────┘  │
                    │        │        │
                    │  ┌─────▼─────┐  │
                    │  │ Ocheverse │  │  ← Next.js standalone (port 6065)
                    │  │ Container │  │
                    │  └─────┬─────┘  │
                    │        │        │
                    │  ┌─────▼─────┐  │
                    │  │  Volumes  │  │  ← ocheverse-data (reactions.json)
                    │  └───────────┘  │
                    └─────────────────┘

GitHub Push → Actions → Vault Secrets → Docker Build → Push to Registry → SSH Deploy → Health Check
```

### Cloudflare Worker (RSS Proxy)

Substack blocks datacenter IPs with Cloudflare challenges. The Worker at `rss.ocheverse.ng` proxies RSS feeds through Cloudflare's clean network:

```
Next.js (Contabo) → rss.ocheverse.ng/ocheverse → ocheverse.substack.com/feed
                   → rss.ocheverse.ng/bpur      → bpur.substack.com/feed
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Local Development

```bash
git clone https://github.com/OcheOps/Ocheverse.ng.git
cd Ocheverse.ng
npm install
```

Create a `.env` file:

```env
# Spotify (get from https://developer.spotify.com/dashboard)
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REFRESH_TOKEN=

# GitHub (classic PAT with repo + read:user scope)
GITHUB_TOKEN=

# RSS Proxy (optional — falls back to https://rss.ocheverse.ng)
RSS_PROXY_URL=

# Remark42 (optional — shows placeholder if empty)
NEXT_PUBLIC_REMARK42_HOST=
NEXT_PUBLIC_REMARK42_SITE_ID=ocheverse

# Umami Analytics (optional)
NEXT_PUBLIC_UMAMI_WEBSITE_ID=
```

```bash
npm run dev
```

### Getting a Spotify Refresh Token

1. Create an app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Add `http://127.0.0.1:3000` as a redirect URI
3. Visit:
   ```
   https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://127.0.0.1:3000&scope=user-read-currently-playing%20user-top-read
   ```
4. Copy the `code` from the redirect URL
5. Exchange it:
   ```bash
   curl -s -X POST "https://accounts.spotify.com/api/token" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=authorization_code&code=YOUR_CODE&redirect_uri=http://127.0.0.1:3000&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET"
   ```
6. Use the `refresh_token` from the response

---

## Docker

### Build and Run Locally

```bash
docker build -t ocheverse .
docker run -p 6065:6065 \
  -e SPOTIFY_CLIENT_ID=xxx \
  -e SPOTIFY_CLIENT_SECRET=xxx \
  -e SPOTIFY_REFRESH_TOKEN=xxx \
  -e GITHUB_TOKEN=xxx \
  -v ocheverse-data:/app/.data \
  ocheverse
```

### Build Args (for NEXT_PUBLIC_ vars baked into the JS bundle)

```bash
docker build \
  --build-arg NEXT_PUBLIC_UMAMI_WEBSITE_ID=xxx \
  --build-arg NEXT_PUBLIC_REMARK42_HOST=https://comments.example.com \
  --build-arg NEXT_PUBLIC_REMARK42_SITE_ID=ocheverse \
  --build-arg RSS_PROXY_URL=https://rss.example.com \
  -t ocheverse .
```

---

## Deployment

The CI/CD pipeline is fully automated via GitHub Actions:

1. **Push to `main`** triggers the workflow
2. **HashiCorp Vault** provides all secrets via AppRole auth
3. **Docker Buildx** builds the image with `NEXT_PUBLIC_*` build args
4. **Image pushed** to a private Docker registry with `latest` + SHA tags
5. **SSH deploy** to Contabo — pulls image, runs container with Traefik labels
6. **Health check** verifies HTTPS is responding

### Vault Secrets Required

All secrets are stored at `secret/ocheverse/web`:

| Key | Type | Purpose |
|---|---|---|
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Build-time | Umami analytics website ID |
| `RSS_PROXY_URL` | Build + Runtime | Cloudflare Worker RSS proxy URL |
| `NEXT_PUBLIC_REMARK42_HOST` | Build-time | Remark42 comment system URL |
| `NEXT_PUBLIC_REMARK42_SITE_ID` | Build + Runtime | Remark42 site identifier |
| `SPOTIFY_CLIENT_ID` | Runtime | Spotify API client ID |
| `SPOTIFY_CLIENT_SECRET` | Runtime | Spotify API client secret |
| `SPOTIFY_REFRESH_TOKEN` | Runtime | Spotify OAuth refresh token |
| `GITHUB_TOKEN` | Runtime | GitHub classic PAT for activity feed |

### GitHub Repo Secrets Required

| Secret | Purpose |
|---|---|
| `VAULT_ROLE_ID` | Vault AppRole role ID |
| `VAULT_SECRET_ID` | Vault AppRole secret ID |
| `REGISTRY_HOST` | Private Docker registry URL |
| `REGISTRY_USERNAME` | Registry auth username |
| `REGISTRY_PASSWORD` | Registry auth password |
| `SSH_HOST` | Contabo server IP |
| `SSH_USERNAME` | SSH user |
| `SSH_KEY` | SSH private key |
| `SSH_PORT` | SSH port |

---

## Project Structure

```
.
├── .github/workflows/main.yaml  # CI/CD pipeline
├── cloudflare-worker/
│   └── rss-proxy.js              # Cloudflare Worker for RSS feed proxying
├── components/
│   ├── BackToTop.js              # Floating scroll-to-top button
│   ├── CommandPalette.js         # Ctrl+K search and navigation
│   ├── CopyCodeButton.js        # Auto-injected copy buttons on code blocks
│   ├── EasterEggs.js             # Konami code, logo tap, console message
│   ├── Footer.js                 # Site footer with socials
│   ├── Game2048.js               # Full 2048 game implementation
│   ├── GitHubActivity.js         # Live GitHub event feed
│   ├── Layout.js                 # Root layout with Umami analytics
│   ├── Navbar.js                 # Fixed top nav with theme toggle
│   ├── NowPlaying.js             # Spotify now playing widget
│   ├── Reactions.js              # Emoji reactions for blog posts
│   ├── ReadingProgress.js        # Scroll progress bar
│   ├── SnakeGame.js              # Terminal-style Snake game
│   ├── TechStack.js              # Interactive skills grid
│   └── VisitorGlobe.js           # 3D interactive globe
├── data/
│   └── siteData.js               # Static data for resources page
├── lib/
│   └── rssParser.js              # Centralized RSS parser + feed URLs
├── pages/
│   ├── api/                      # API routes (see table above)
│   ├── blog/                     # Blog index + dynamic post pages
│   ├── _app.js                   # Root app with transitions + easter eggs
│   ├── index.js                  # Homepage
│   ├── now.js                    # /now page
│   ├── music.js                  # Spotify top tracks
│   ├── stack.js                  # Tech stack showcase
│   ├── guestbook.js              # Anonymous guestbook
│   ├── learn.js                  # Coaching page
│   ├── resources.js              # DevOps resources
│   ├── game.js                   # Snake game
│   └── 2048.js                   # 2048 game
├── public/                       # Static assets, CV, robots.txt
├── styles/
│   └── globals.css               # Tailwind + custom animations
├── Dockerfile                    # Multi-stage Docker build
├── next.config.js                # Standalone output, rewrites, image domains
├── tailwind.config.js            # Tailwind + typography plugin
└── package.json
```

---

## Customizing

### Update Resources
Edit `data/siteData.js` — no page code changes needed.

### Update Now Page
Edit the `NOW_DATA` object at the top of `pages/now.js`.

### Update Tech Stack
Edit the `TECH`, `LEARNING`, and `SOFT_SKILLS` arrays in `components/TechStack.js`.

### Add More Easter Egg Messages
Edit the `PRIVATE_MESSAGES` array in `pages/api/github.js` for GitHub private repo quips.

### Blog Feeds
To add a new Substack feed, update `lib/rssParser.js` and add the feed to the blog index page.

---

## Easter Eggs

There are hidden interactions throughout the site. Here's what to look for:

- **Desktop**: Type ↑ ↑ ↓ ↓ ← → on any page
- **Mobile**: Tap the "Ocheverse" logo 5 times (hint appears at 3)
- **Console**: Open browser DevTools
- **Private repos**: Watch the GitHub activity section on `/now`

---

## License

This project is open source. Fork it, break it, make it yours.

If you build something cool with it, let me know — [ocheworks@gmail.com](mailto:ocheworks@gmail.com)
