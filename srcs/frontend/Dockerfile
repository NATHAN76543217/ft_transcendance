# Build stage
FROM node:16.2.0-alpine3.13 as build-stage

# Prepare workdir
COPY --chown=node:node srcs/package*.json /app/

RUN mkdir -p /app/node_modules \
  &&  chown -R node:node  /app/node_modules

USER    node
WORKDIR /app

# Install moules
# If you are building your code for development
# RUN     npm install
# If you are building your code for production
RUN npm ci --only=production

# Install sources
COPY --chown=node:node srcs/                 .

# If you are building your code for development
# CMD     npm start
# If you are building your code for production
CMD npm run build

# Server stage, if you are building your code for production
FROM fitiavana07/nginx-react

# Copy build-stage files
COPY --from=build-stage /app/build /usr/share/nginx/html

# Expose frontend port
EXPOSE 3000

# Run nginx
CMD nginx -g 'daemon=off;'
