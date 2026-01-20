FROM node:20-bullseye-slim
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* ./
# install all dependencies including devDependencies so TypeScript/Nest build works
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/src/main.js"]
