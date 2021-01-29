FROM node:latest

WORKDIR /usr/src/app

COPY . .

RUN yarn install

CMD ["yarn", "start"]