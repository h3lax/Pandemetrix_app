# Use an official Node.js image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the container
COPY package.json package-lock.json ./

# Install all dependencies (including dev dependencies for Vite)
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port Vite uses (default is 5173)
EXPOSE 5173

# Run the Vite development server
CMD ["npm", "run", "dev"]
