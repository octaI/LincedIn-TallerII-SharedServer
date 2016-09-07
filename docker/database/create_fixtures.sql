
GRANT ALL PRIVILEGES ON DATABASE "lincedb" to lince;

create table users(
  id serial primary key, 
  email varchar(255) not null unique, 
  first varchar(50), 
  last varchar(50)
);

INSERT INTO users  VALUES (1,'prueba@prueba.com','Mala','Fama');
