FROM node:latest

WORKDIR /usr/src/app

COPY . .

RUN yarn install && \
    yarn build

CMD ["yarn", "start"]