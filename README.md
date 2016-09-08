# LincedIn-TallerII-SharedServer
Trabajo Práctico de Taller de Programación II (75.52) | Facultad de Ingeniería - Universidad de Buenos Aires
[![Build Status](https://travis-ci.org/tbert12/LincedIn-TallerII-SharedServer.svg?branch=master)](https://travis-ci.org/tbert12/LincedIn-TallerII-SharedServer)

## Descripción
Server NodeJS del TP.

### Herramientas | Framework
  - Express
  - Body-Parser
  - Log4js
  - Massive
  - BD: PostgreSQL

### Integrantes:
  - Octavio Iogha
  - Etchanchú Facundo
  - Bouvier Juan Manuel
  - Bert Tomás

## REST API
[Especificación completa de la api](http://rebilly.github.io/ReDoc/?url=https://gist.githubusercontent.com/NickCis/d6a8132a228440c41889b4e0003efc3b/raw/jobify-shared-api.yaml)

## Heroku
  - https://lincedin.herokuapp.com/

## Instrucciones
  - Para correr el servidor con docker, realizar los siguientes pasos. (Hay que configurar docker primero siguiendo: https://docs.docker.com/engine/installation/linux/ubuntulinux) </br>
  - 1- La primera vez se tiene que crear la imagen, haciendo ``"$ docker-compose build"``</br>
  - 2- Para correr la imagen en los correspondientes containers, hacer ``"$ docker-compose up"`` y esperar a ver el siguiente mensaje en la terminal: `` db_1 | LOG:  autovacuum launcher started `` </br>
  - 3- Con el comando ``sudo docker ps`` podes verificar que los containers esten corriendo. </br>
  - 4- Luego se puede usar la REST API en `` http://localhost:8080/ ``.
