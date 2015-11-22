FROM node:4.2.2
MAINTAINER Alex <alex@upsalsa.com>

WORKDIR /src

COPY *.*  ./
COPY routes       routes

RUN npm install --production
EXPOSE 5000
CMD ["node", "server.js"]
