FROM  node:16.2.0-alpine3.13

# Prepare workdir
COPY    --chown=node:node srcs/package*.json    /app/

RUN     mkdir -p            /app/node_modules   /app/dist   \
    &&  chown -R node:node  /app/node_modules   /app/dist

USER    node
WORKDIR /app

# Install modules
# If you are building your code for development
RUN     npm install
# If you are building your code for production
# RUN npm ci --only=production

# Install sources
COPY    --chown=node:node srcs/                 .

# RUN npm update @nestjs/cli

# RUN npx @nestjs/cli update

CMD     npm run start:dev
