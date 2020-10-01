## build stage
#FROM node:lts-alpine as build-stage
#WORKDIR /app
#COPY package*.json ./
#RUN npm install
#COPY . .
#RUN npm run build


FROM alpine:3.9.5

RUN apk add yarn

WORKDIR build

RUN ls
COPY package*.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

CMD ["node", "./dist/src/server/index.js"]
