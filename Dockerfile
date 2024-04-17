# Use a base image that includes build tools
FROM node:21-alpine as builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN apk add --no-cache --virtual .gyp python3 make g++ && \
    npm install && \
    apk del .gyp

# Copy the server folder containing server.js into the container
COPY back-end/server.js .

# Use a slimmer image for the final image
FROM node:21-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy built node modules and server files from the builder stage
COPY --from=builder /usr/src/app .

# Expose port 8080 to the outside world
EXPOSE 8080

# Command to run the application
CMD ["node", "server.js"]