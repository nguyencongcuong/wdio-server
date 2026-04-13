# Chromium + Bun: official Bun image. Node is copied in for @wdio/cli (bunx breaks WDIO).
FROM node:20-bookworm-slim AS node
FROM oven/bun:1.3.12-debian

COPY --from=node /usr/local/bin/node /usr/local/bin/node

RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    chromium-driver \
    ca-certificates \
    fonts-liberation \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libasound2 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY wdio/package.json wdio/bun.lock ./wdio/
RUN cd wdio && bun install --frozen-lockfile

COPY . .

ENV CHROME_BIN=/usr/bin/chromium
ENV PORT=3000

EXPOSE 3000

CMD ["bun", "run", "index.ts"]
