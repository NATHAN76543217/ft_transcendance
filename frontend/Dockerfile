FROM  node:16.2.0-alpine3.13

RUN npm update npm -g
RUN mkdir -p /app/node_modules /data

WORKDIR /data
COPY    srcs/node_modules ./node_modules
COPY    srcs/package*.json ./

# If you are building your code for development
RUN     npm install
# If you are building your code for production
# RUN npm ci --only=production

WORKDIR /app
COPY    srcs /app

CMD cp -r /data/*.json ./ && \
    cp -r /data/node_modules ./ && \
    npm start
