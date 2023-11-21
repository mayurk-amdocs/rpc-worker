FROM node:lts-alpine

WORKDIR /usr/app

COPY package.json ./
COPY package-lock.json ./

COPY . .

RUN npm install

CMD ["npm", "run", "start:dev"]
