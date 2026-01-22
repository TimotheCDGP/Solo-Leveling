# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* tsconfig*.json vite.config.ts index.html tailwind.config.js postcss.config.js ./
COPY public ./public
COPY src ./src
RUN npm ci || npm install
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=build /app/dist ./dist
RUN npm install -g serve # lightweight static server
EXPOSE 5173
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "5173", "--strictPort"]
