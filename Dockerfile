# syntax=docker/dockerfile:1

# Use a lightweight Node image as a base to keep image size small.
ARG NODE_VERSION=20-alpine
FROM node:${NODE_VERSION} AS base

# Set the working directory and install global dependencies.
WORKDIR /usr/src/app

# Copy only package.json and lock file to leverage Docker caching.
COPY package*.json ./

# Install pnpm globally for dependency management (optional, can also use npm).
RUN npm install -g pnpm@9.10.0

# Install only production dependencies in this layer to use caching.
RUN pnpm install --prod

# Use a separate layer to install development dependencies for building.
FROM base AS builder

# Install dev dependencies needed for building the application.
COPY --chown=node:node . . 
RUN pnpm install --frozen-lockfile

# Run the NestJS build process.
RUN pnpm run build

# ---- Production Stage ----
# Use a new node base image for the final, minimal production image.
FROM node:${NODE_VERSION} AS production

# Set working directory in the final image.
WORKDIR /usr/src/app

# Copy the production node_modules and the built code from the previous stages.
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

# Copy only necessary files for running the application in production.
COPY package.json ./

# Set environment variables.
ENV NODE_ENV=production

# Expose the application port.
EXPOSE 3000

# Run the application with minimal logging.
CMD ["node", "dist/main"]
