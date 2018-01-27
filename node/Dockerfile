FROM node:8.4.0

RUN export DEBIAN_FRONTEND=noninteractive LANG && \
    apt-get update && \
    apt-get install -y apt-utils && \
    apt-get install -y locales && \
    echo ja_JP.UTF-8 UTF-8 > /etc/locale.gen && \
    locale-gen ja_JP.UTF-8 && \
    update-locale LANG=ja_JP.UTF-8

ENV LANG=ja_JP.UTF-8 \
    LANGUAGE=ja_JP.UTF-8 \
    LC_ALL=ja_JP.UTF-8 \
    NODE_PATH=/usr/local/lib/node_modules

RUN npm install -g riot && \
    npm install -g forever && \
    npm install -g babel-cli && \
    npm install -g babel-core && \
    npm install -g uglify-js && \
    npm install -g less && \
    npm install -g webpack && \
    npm install -g eslint && \
    npm install -g karma && \
    npm install -g mocha && \
    useradd -d /home/hotline -m -s /bin/bash hotline && \
    mkdir /usr/local/src/hotline && \
    chown hotline /usr/local/src/hotline && \
    chmod 755 /usr/local/src/hotline

WORKDIR /usr/local/src/hotline
COPY . ./
RUN chown -R hotline:hotline .

USER hotline

RUN npm install && \
    node makeKey.js && \
    npm run build

CMD npm start
