FROM nodesource/trusty:5.1

ADD package.json package.json
ADD server.js server.js
RUN npm install
ADD src src

EXPOSE 8080
CMD ["npm","start"]
