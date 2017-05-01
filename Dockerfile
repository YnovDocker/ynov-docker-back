FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY . /usr/src/app/
RUN npm install

# Expose port 
EXPOSE 10010

# Export nodejs variable env
ENV NODE_APP_INSTANCE prod
ENV NODE_APP_HOST localhost
ENV NODE_APP_PORT 10010

# Entrypoint -> npm start
CMD [ "npm", "start" ]

