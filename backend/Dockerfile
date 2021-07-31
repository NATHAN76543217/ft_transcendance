# FROM  node:16.2.0-alpine3.13

# # RUN apk add --update python3 py3-pip
# # RUN apk add --update --no-cache curl py-pip

# # RUN apk --no-cache add --virtual builds-deps build-base python

# #REVIEW delete line bellow?  
# RUN     npm update -g npm
# RUN     mkdir -p /app/node_modules

# WORKDIR /app
# COPY    srcs    .
# # RUN     npm install -g @nestjs/cli
# RUN npm install node-pre-gyp -g
# # RUN npm add sqlite3 -D

# # RUN npm rebuild


# RUN apk add --no-cache make gcc g++ python3 && \
#   npm install && \
#   npm rebuild bcrypt --build-from-source && \
#   apk del make gcc g++ python3


# # RUN     npm uninstall bcrypt
# # RUN     npm install bcrypt

# RUN npm install node-pre-gyp



# # RUN npm add sqlite3 -D

# # RUN apk add --no-cache make gcc g++ python3 py3-pip && \
# #   npm install && \
# #   npm rebuild bcrypt --build-from-source && \
# #    apk del make gcc g++ python3 py3-pip

# # If you are building your code for development
# RUN     npm install
# # If you are building your code for production
# # RUN npm ci --only=production

# # Fix bcrypt cross-platform module


# # RUN npm update @nestjs/cli

# # RUN npx @nestjs/cli update

# CMD     npm run start:dev
#         # npm start

FROM  node:16.2.0-alpine3.13

# TODO update front packages
# TODO bdd seeder implementation
# Prepare workdir
RUN     npm install -g npm@7.19.1
COPY    --chown=node:node srcs/package*.json    /app/

RUN     mkdir -p            /app/node_modules   /app/dist   \
    &&  chown -R node:node  /app/node_modules   /app/dist

USER    node
WORKDIR /app

# Install modules
# If you are building your code for development
RUN     npm install && npm uninstall bcrypt && npm install bcrypt

# If you are building your code for production
# RUN npm ci --only=production

# Install sources
COPY    --chown=node:node srcs/                 .

# RUN npm update --save @nestjs/cli

# RUN npx @nestjs/cli update

CMD     npm run start:dev
