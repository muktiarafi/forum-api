FROM node:14-buster-slim AS builder

WORKDIR /app
COPY package.json .
COPY tsconfig.json .
RUN npm install
COPY . .

RUN npm run build

FROM node:14-buster-slim AS cleaner

WORKDIR /app
COPY package.json .
COPY --from=builder /app/dist .

RUN npm install --production

FROM gcr.io/distroless/nodejs:14

WORKDIR /app
COPY --from=cleaner /app .

CMD ["src/app.js"]