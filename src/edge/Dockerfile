FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

CMD ["node", "src/edge-service.ts"]