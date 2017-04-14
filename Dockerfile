FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY . /usr/src/app/
RUN npm install

EXPOSE 10010
ENV NODE_APP_INSTANCE dev
CMD [ "npm", "start" ]

