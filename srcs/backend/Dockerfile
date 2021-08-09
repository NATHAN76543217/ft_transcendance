FROM node:16.2.0-alpine3.13 as build-stage

# Prepare workdir
COPY --chown=node:node srcs/package*.json /app/

RUN mkdir -p /app/node_modules /app/dist   \
    && chown -R node:node /app/node_modules /app/dist

USER    node
WORKDIR /app

# Install modules
RUN npm ci

# Install sources
COPY --chown=node:node srcs/ .

# Build
RUN npm run build

# Server stage
FROM node:16.2.0-alpine3.13 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Prepare workdir
COPY --chown=node:node srcs/package*.json /app/

RUN mkdir -p /app/node_modules /app/dist   \
    && chown -R node:node /app/node_modules /app/dist

USER node
WORKDIR /app

# Install modules
RUN npm ci --only=production

# Install sources
COPY --chown=node:node srcs/ .

# Copy build-stage files
COPY --from=build-stage --chown=node:node /app/dist /app/dist

CMD node dist/main
