##### In order to run:

###### download mongodb docker image:
######   docker pull mongo
######   docker pull rabbitmq

###### run:
######   docker-compose up 

###### test on : node app/server.js
######    localhost:8080/Hello
######    localhost:8080/upload 
######    localhost:8080/del?name<image name> 
######    localhost:8080/view?name<image name>
######    use the upload.html to load an image