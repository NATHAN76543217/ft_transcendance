FROM 	node:16.2.0-alpine3.13

# Do we need theese?
#ENV     PATH /app/node_modules/.bin:$PATH

# Prepare workdir
COPY	--chown=node:node srcs/package*.json    /app/

RUN     mkdir -p            /app/node_modules   \
    &&  chown -R node:node  /app/node_modules

USER    node
WORKDIR /app

# Install modules
# If you are building your code for development
RUN     npm install
# If you are building your code for production
# RUN npm ci --only=production

# Install sources
COPY    --chown=node:node srcs/                 .

CMD     npm start
