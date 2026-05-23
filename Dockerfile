FROM node:20-slim

RUN npm install -g pnpm@9.4.0

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "wrangler", "pages", "dev", "./build/client", "--port", "3000", "--ip", "0.0.0.0"]
