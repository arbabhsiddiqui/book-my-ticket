FROM node:24

RUN apt-get update && apt-get install -y \
    git curl bash ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable
RUN corepack prepare pnpm@latest --activate

# Fix pnpm store location
ENV PNPM_STORE_PATH=/pnpm-store
RUN mkdir -p /pnpm-store

WORKDIR /workspace

CMD ["sleep", "infinity"]