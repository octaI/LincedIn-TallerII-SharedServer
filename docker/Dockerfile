FROM nodesource/trusty:5.1

ADD package.json package.json
ADD waitforpostgres.sh waitforpostgres.sh
ADD index.js index.js
RUN npm install

CMD ["node","index.js"]
