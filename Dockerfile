FROM node:20-alpine

WORKDIR /app

RUN npm install -g npm@latest

COPY package*.json ./

RUN echo "//registry.npmjs.org/:_authToken=your-access-token" > .npmrc && \
  npm install && \
  rm -f .npmrc

COPY . .

RUN npm run build

CMD ["npm", "start"]