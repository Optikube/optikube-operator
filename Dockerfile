# # Use the official Node.js image as the base image
# # FROM node:14
# FROM node:14-alpine

# # Set the working directory in the container
# WORKDIR /usr/src/app

# # Copy package.json and package-lock.json (if available)
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the server folder containing server.js into the container
# COPY server ./server

# # Expose port 8080 to the outside world
# EXPOSE 8080

# # Command to run the application
# CMD ["node", "server/server.js"]

# Use a base image that includes build tools
FROM node:14-alpine as builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN apk add --no-cache --virtual .gyp python3 make g++ && \
    npm install && \
    apk del .gyp

# Copy the server folder containing server.js into the container
COPY server ./server

# Use a slimmer image for the final image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy built node modules and server files from the builder stage
COPY --from=builder /usr/src/app .

# Expose port 8080 to the outside world
EXPOSE 8080

# Command to run the application
CMD ["node", "server/server.js"]
