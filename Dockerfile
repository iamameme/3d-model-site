FROM node:18-bullseye

# Install Blender and dependencies
RUN apt-get update && \
    apt-get install -y blender wget unzip xvfb && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PNPM (optional, swap with yarn/npm if preferred)
RUN npm install -g pnpm

# Create app directory
WORKDIR /app

# Copy package manager files and install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

# Copy all source code
COPY . .

# Build the project
RUN pnpm build

# Expose Next.js port
EXPOSE 3002

# Command to run Next.js server
CMD ["pnpm", "start"]
