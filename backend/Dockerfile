FROM  node:16.2.0-alpine3.13

RUN mkdir -p /app/node_modules /data

WORKDIR /data
# TODO upgrade npm
# REVIEW delete debug lines 
COPY srcs/node_modules ./node_modules
COPY srcs/package*.json ./
RUN npm install -g @nestjs/cli
RUN pwd && ls -la

# If you are building your code for development
RUN npm install
RUN pwd && ls -la
# If you are building your code for production
# RUN npm ci --only=production

WORKDIR /app
RUN     pwd && ls -la
COPY    srcs /app

CMD cp -r /data/*.json /app && \
    cp -r /data/node_modules /app/ && \
    pwd && ls -la ./* && \
    npm start
