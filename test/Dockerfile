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
    NODE_PATH=/usr/local/lib/node_modules \
    DOCKERIZE_VERSION=v0.6.0

RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz && \
    tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz && \
    rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz && \
    wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb http://dl.google.com/linux/chrome/deb/ stable main " >> /etc/apt/sources.list.d/google.list && \
    apt-get update && \
    apt-get install -y openjdk-7-jdk && \
    apt-get install -y google-chrome-stable && \
    apt-get install -y chromedriver && \
    apt-get install -y postgresql-client

RUN npm install -g webdriverio && \
    npm install -g selenium-standalone && \
    npm install -g mocha && \
    useradd -d /home/test -m -s /bin/bash test && \
    mkdir /usr/local/src/test && \
    chown test /usr/local/src/test && \
    chmod 755 /usr/local/src/test

WORKDIR /usr/local/src/test
COPY . ./
RUN chown -R test:test .

USER test
RUN npm install
