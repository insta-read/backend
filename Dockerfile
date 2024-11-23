# syntax=docker/dockerfile:1

# Use a lightweight Node image as a base to keep image size small.
ARG NODE_VERSION=20-alpine
FROM node:${NODE_VERSION} AS base

# Set the working directory.
WORKDIR /usr/src/app

# Copy only package.json and lock file to leverage Docker caching.
COPY package*.json ./

# Install npm globally (optional, npm comes pre-installed with Node.js, but you can update it if needed).
RUN npm install -g npm@latest

# Install dotenv-cli globally (required to load .env files in production).
RUN npm install -g dotenv-cli

# Install only production dependencies to optimize image size.
RUN npm install --prod

# ---- Builder Stage ----
FROM base AS builder

# Install dev dependencies needed for building the application.
COPY --chown=node:node . . 
RUN npm install --frozen-lockfile

# Run the NestJS build process.
RUN npm run build

# ---- Production Stage ----
FROM node:${NODE_VERSION} AS prod

# Set working directory in the final image.
WORKDIR /usr/src/app

# Copy the production node_modules and the built code from the previous stages.
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

# Copy only necessary files for running the application in production.
COPY package.json ./

# Set environment variables.
ENV NODE_ENV=prod

# Expose the application port.
EXPOSE 3000

# Use dotenv-cli to run the application
CMD ["node", "dist/main"]