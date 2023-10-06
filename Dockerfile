FROM node:16.16.0-alpine3.16

WORKDIR /app

COPY . .

RUN npm i
RUN cd client && npm i && npm run build

ENTRYPOINT [ "npm", "run", "prod" ]