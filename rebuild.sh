#!/bin/sh

echo "rebuilding..."
docker stop $(docker ps -q)
docker rm $(docker ps -q -f 'status=exited')
docker volume rm $(docker volume ls -q)
docker rmi $(docker images -q -f "dangling=true")
docker-compose up -d --build
docker-compose logs -f -t
