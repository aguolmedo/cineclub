FROM node:14

WORKDIR /srv

RUN git clone https://github.com/aguolmedo/cineclub.git

COPY package*.json ./
RUN npm install --production
RUN npm install -g typescript
RUN npm i --save-dev @types/node
 
COPY tsconfig.json /srv/
COPY src /srv/src/

RUN npm run build

RUN npm ci --production

EXPOSE 3000

CMD ["node", "/srv/dist/server.js"]
