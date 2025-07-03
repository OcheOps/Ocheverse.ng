# === Stage 1: Build the Next.js app ===
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app and build it
COPY . .
RUN npm run build

# === Stage 2: Run the built app ===
FROM node:18-alpine AS runner

WORKDIR /app

# Set the same PORT as NGINX reverse proxy
ENV PORT=6065

# Install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy built files from builder stage
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the custom port
EXPOSE 6065

# Start the app
CMD ["npm", "start"]
