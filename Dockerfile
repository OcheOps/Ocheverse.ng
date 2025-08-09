# === Stage 1: Build the Next.js app ===
FROM node:18-alpine-slim AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .
RUN npm run build

# === Stage 2: Run the built app ===
FROM node:18-alpine-slim AS runner
WORKDIR /app

ENV PORT=6065

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 6065
CMD ["npm", "start"]