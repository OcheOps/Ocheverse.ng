# === Stage 1: Build the Next.js app ===
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

ARG NEXT_PUBLIC_UMAMI_WEBSITE_ID
ARG NEXT_PUBLIC_REMARK42_HOST
ARG NEXT_PUBLIC_REMARK42_SITE_ID
ARG RSS_PROXY_URL

ENV NEXT_PUBLIC_UMAMI_WEBSITE_ID=$NEXT_PUBLIC_UMAMI_WEBSITE_ID
ENV NEXT_PUBLIC_REMARK42_HOST=$NEXT_PUBLIC_REMARK42_HOST
ENV NEXT_PUBLIC_REMARK42_SITE_ID=$NEXT_PUBLIC_REMARK42_SITE_ID
ENV RSS_PROXY_URL=$RSS_PROXY_URL

COPY . .
RUN npm run build

# === Stage 2: Run the built app ===
FROM node:20-alpine AS runner
WORKDIR /app

ENV PORT=6065
ENV NODE_ENV=production

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Create writable .data directory for reactions storage
RUN mkdir -p /app/.data && chown nextjs:nodejs /app/.data

USER nextjs

EXPOSE 6065

CMD ["node", "server.js"]
