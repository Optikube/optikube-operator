# Use the official Node.js image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the server folder containing server.js into the container
COPY server ./server

# Expose port 8080 to the outside world
EXPOSE 8080

# Command to run the application
CMD ["node", "server/server.js"]
