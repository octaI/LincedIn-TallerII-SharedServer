# LincedIn-TallerII-SharedServer
Trabajo Práctico de Taller de Programación II (75.52) | Facultad de Ingeniería - Universidad de Buenos Aires

## Descripción
Server NodeJS del TP.

### Herramientas | Framework
  - Express

### Integrantes:
  - Octavio Iogha
  - Etchanchú Facundo
  - Bouvier Juan Manuel
  - Bert Tomás

## Instrucciones
Para correr el servidor con docker, realizar los siguientes pasos. (Hay que configurar docker primero siguiendo: https://docs.docker.com/engine/installation/linux/ubuntulinux) </br>
1- La primera vez se tiene que crear la imagen, haciendo ``"$ sudo docker build -t <NombreImagen> ."``</br>
2- Para correr la imagen en un container, hacer ``$ sudo docker run -p 49000:8080 -d --name <unNombre> <NombreImagen> `` </br>
3- Con el comando ``sudo docker ps`` podes verificar que la imagen este corriendo en un container, y el ID de ese container. </br>
Con el IDcontainer:</br>
4.a- Haciendo ``docker exec -ti <IDcontainer> /bin/bash`` tiras una terminal dentro de la imagen. </br>
4.b- Haciendo ``curl -i localhost:49000`` se accede por terminal al servidor. </br>
4.c- Haciendo ``docker logs <IDcontainer>`` se imprime lo que esta haciendo la imagen de docker. </br>

##Aclaraciones
Los nombres en los comandos DEBEN ir en minusculas SIEMPRE. </br>
