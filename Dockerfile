# BASE
FROM node:12.18.3-alpine3.12

LABEL Maintainer="Romain Berton <romain.berton.dev@gmail.com>"

RUN apk update; \
    apk upgrade; \
    apk add bash; \
    adduser --disabled-password k64; \
    mkdir /home/k64/www; \
    npm i -g pm2;

ENV HOME /home/k64

# frontend
COPY $PWD $HOME/www/frontend/

WORKDIR $HOME/www/frontend

RUN yarn

EXPOSE 3002

# RUN COMMAND
CMD ["pm2-runtime", "start", "yarn", "--name", "frontend", "--interpreter", "bash", "--", "start"]
