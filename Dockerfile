FROM node:24.4.0-alpine3.22

ENV AMQP_URL=amqp://localhost
ENV TURSO_DATABASE_URL="file:./turso.db"

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
