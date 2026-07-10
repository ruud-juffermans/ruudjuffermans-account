# --- prod build (default build target) ---
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json vite.config.ts index.html ./
COPY src ./src

# Vite inlines VITE_* env at build time. Pass the production API origin in.
ARG VITE_API_URL=https://api.ruudjuffermans.nl
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# --- serve static build with nginx (SPA fallback) ---
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 3000
