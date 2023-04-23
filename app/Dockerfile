FROM node:18.15.0-alpine3.17

RUN apk add --no-cache bash

WORKDIR /home/node/app

COPY . ./

RUN npm install

CMD ["npm", "run", "dev"]
EXPOSE 3000
