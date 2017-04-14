FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/

# Install app dependencies
RUN git clone https://github.com/amaitreynov/ynov-docker-back.git
WORKDIR /usr/src/ynov-docker-back
RUN npm install


EXPOSE 8080 10010
CMD [ "git", "pull" ]
CMD [ "npm", "start" ]
