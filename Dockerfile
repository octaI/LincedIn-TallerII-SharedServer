FROM ubuntu

RUN apt-get update && apt-get install -y nodejs && apt-get install -y npm && apt-get install -y postgresql-9.5

# Create app directory
RUN mkdir -p /usr/src/lincedin
WORKDIR /usr/src/lincedin

#fix nodejs name problem
RUN ln -sf /usr/bin/nodejs /usr/bin/node

# Install app dependencies
COPY package.json /usr/src/lincedin/
RUN npm install

# Bundle app source
COPY . /usr/src/lincedin

# DB
USER postgres
RUN  /etc/init.d/postgresql start && psql --command "CREATE USER lince WITH SUPERUSER PASSWORD 'tallerii';" && createdb -O lince lincedinsharedserver && psql lincedinsharedserver < DB/db_shared_server.sql

USER root
RUN echo "host all  all    0.0.0.0/0  md5" >> /etc/postgresql/9.5/main/pg_hba.conf
RUN echo "listen_addresses='*'" >> /etc/postgresql/9.5/main/postgresql.conf
RUN /etc/init.d/postgresql restart

EXPOSE 8080
#CMD [ "npm", "start" ]