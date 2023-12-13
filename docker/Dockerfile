FROM node:21.4.0-alpine3.18

WORKDIR /app

ENV PORT=3000

# add curl for healthcheck
RUN apk add --no-cache curl

# Copy only package files first for efficient caching
COPY package*.json ./

# Install dependencies
RUN npm install

EXPOSE 3000

CMD [ "npm", "run", "start:dev" ]