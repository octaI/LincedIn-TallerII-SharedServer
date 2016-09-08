# LincedIn-TallerII-SharedServer
Trabajo Práctico de Taller de Programación II (75.52) | Facultad de Ingeniería - Universidad de Buenos Aires

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

## Instrucciones REST API
http://rebilly.github.io/ReDoc/?url=https://gist.githubusercontent.com/NickCis/d6a8132a228440c41889b4e0003efc3b/raw/jobify-shared-api.yaml

## Instrucciones
Para correr el servidor con docker, realizar los siguientes pasos. (Hay que configurar docker primero siguiendo: https://docs.docker.com/engine/installation/linux/ubuntulinux) </br>
1- La primera vez se tiene que crear la imagen, haciendo ``"$ sudo docker-compose build"``</br>
2- Para correr la imagen en un container, hacer ``$ sudo docker-compose up`` </br>
3- Con el comando ``sudo docker ps`` podes verificar que la imagen este corriendo en un container, y el ID de ese container. </br>
Con el IDcontainer:</br>
4- Ya se puede conectar al servidor mediante la direccion `` localhost:8080`` </br>
