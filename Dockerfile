# Use Node.js with a smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first to optimize caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app files
COPY . .

# Expose the Vite dev server port
EXPOSE 5173

# Command to start the dev server
CMD ["npm", "run", "dev"]