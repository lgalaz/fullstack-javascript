FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV DATA_DIR=/data

COPY src ./src

RUN mkdir -p /data

EXPOSE 3000

CMD ["node", "src/server.js"]
