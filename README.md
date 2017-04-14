# Skeleton project for Swagger

### Dev environment
Run environment :
```bash
npm install
export NODE_APP_INSTANCE=dev
npm start
```
Access :
```html
http://localhost:10010/docs
```

For documentation and tests, in the CLI : swagger project edit
For edit swagger.yaml

### Prod environment
On your server with docker installed, pull/update lnans/ynov-docker-back and lnans/ynov-docker-mongo
```bash
docker pull lnans/ynov-docker-back
docker pull lnans/ynov-docker-mongo
```
Need to verify if there is another instance of docker :
```bash
docker ps 
```
For restart ynov-docker-back :
```bash
docker kill <containerID>
```
Run docker images (MongoDB and Web-Back) :
```bash
docker run -d -p 27017:27017 -v /data/db:/data/db lnans/ynov-docker-mongo
docker run -d -p 10010:10010 -v /data/ynov-docker-back/images:/usr/src/app/ressources/images lnans/ynov-docker-back
```
Access :
```html
http://nanslaupretre.fr:10010/docs
```
