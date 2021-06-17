FROM 	node:16.2.0-alpine3.13

RUN     npm update -g npm 
RUN     mkdir -p /app/node_modules

WORKDIR	/app

ENV     PATH /app/node_modules/.bin:$PATH
COPY	srcs .

# COPY	srcs/node_modules ./node_modules
# COPY	srcs/package*.json ./
# If you are building your code for development
RUN     npm install
# If you are building your code for production
# RUN npm ci --only=production

CMD     npm start
