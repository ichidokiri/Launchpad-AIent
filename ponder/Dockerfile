FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

RUN npm run codegen
RUN npm run build

EXPOSE 42069

CMD ["npm", "run", "start"]