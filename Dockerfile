# Use latest stable (LTS) alpine releases

# Stage 1: Build container
FROM node:lts-alpine as builder

# Install dependencies
# Git and python are currently necessary to install some packages
RUN apk update && apk upgrade  && apk add --no-cache --virtual .gyp git python make g++ bash
COPY package*.json ./
RUN npm install

# Stage 2: App Container
FROM node:lts-alpine as app

WORKDIR /usr/src/app
COPY --from=builder node_modules ./node_modules
COPY . .
EXPOSE 8081

CMD ["npm", "start"]
