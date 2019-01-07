# Use latest stable (LTS) alpine releases

# Stage 1: Build container
FROM node:lts-alpine as builder

# Install dependencies
# Git and python are currently necessary to install some packages
RUN apk update
RUN apk upgrade
COPY package*.json ./
RUN apk add --no-cache --virtual .gyp git python make g++ bash
RUN yarn 

# Stage 2: App Container
FROM node:lts-alpine as app

WORKDIR /usr/src/app
COPY --from=builder node_modules ./node_modules
COPY . .
EXPOSE 8081

CMD ["yarn", "start"]
