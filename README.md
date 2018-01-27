# hotline
[![Build Status](https://travis-ci.org/motojouya/hotline.svg?branch=master)](https://travis-ci.org/motojouya/hotline)

### description
This is kind of sample application. But it's also for me to training programming.
It's just realtime chat application. It also has phone(phone is developing in the Issue).

### how to use
Check out this project and just do `docker-compose up`.

If you want to get image from Docker hub, do this.

```
docker pull motojouya/hotline
docker run --some-options motojouya/hotline
```
But you need configure other images by yourself, so I recomend use resource from this git repository.

### What kind of Technology I use?
##### Front Side
- Riot.js
- SuperAgent
- WebSocket
- Service Worker(Service Worker Authentication is developing)
- Cache API
- Indexed DB
- WebPush (developing now)
- WebRTC (developing now)

##### Server Side
- Node.js
- express
- node-postgres
- ws (it's other choice of WebSocket Library without Socket.IO)

##### Infrastructure
- docker
- docker-compose
- AWS
- Node.js
- Nginx (use as Load Balancer and SSL Accelarater)
- PostgreSQL

### links
Docker Hub
https://hub.docker.com/r/motojouya/hotline/

