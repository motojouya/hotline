FROM postgres:9.6
RUN localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8
ENV LANG en_US.UTF-8
COPY *.sql /docker-entrypoint-initdb.d/
