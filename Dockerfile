FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN ls -al && ls -al src

RUN npm install

RUN npm run build

CMD ["node", "server.js"]

ENV PORT=8080
EXPOSE 8080
