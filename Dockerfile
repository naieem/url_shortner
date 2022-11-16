FROM node:14.14.0-alpine3.10 AS Dev
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build

FROM node:14.14.0-alpine3.10
WORKDIR /usr/src/app
COPY package.json .
COPY --from=Dev /usr/src/app/dist .

COPY environments ./environments
RUN npm install --production

CMD ["npm", "run", "start:dev"]