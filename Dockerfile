# === Stage 1: Build the Next.js app ===
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# === Stage 2: Run the built app ===
FROM node:18-alpine AS runner
WORKDIR /app

ENV PORT=6065

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
# Removed: COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 6065
CMD ["npm", "start"]
