FROM node:8.4.0

RUN export DEBIAN_FRONTEND=noninteractive LANG && \
    apt-get update && \
    apt-get install -y apt-utils && \
    apt-get install -y locales && \
    echo en_US.UTF-8 UTF-8 > /etc/locale.gen && \
    locale-gen en_US.UTF-8 && \
    update-locale LANG=en_US.UTF-8

ENV LANG=en_US.UTF-8 \
    LANGUAGE=en_US.UTF-8 \
    LC_ALL=en_US.UTF-8 \
    NODE_PATH=/usr/local/lib/node_modules

RUN apt-get install -y vim && \
    npm install -g riot && \
    npm install -g pm2 && \
    npm install -g babel-cli && \
    npm install -g babel-core && \
    npm install -g uglify-js && \
    npm install -g less && \
    npm install -g webpack && \
    npm install -g eslint && \
    npm install -g karma
    npm install -g mocha

WORKDIR /usr/local/src/hotline

