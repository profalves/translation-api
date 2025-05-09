FROM node:slim

WORKDIR /app

RUN npm install -g npm@latest

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "start"]