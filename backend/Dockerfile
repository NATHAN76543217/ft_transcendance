FROM  node:16.2.0-alpine3.13

#REVIEW delete line bellow?  
RUN     npm update -g npm
RUN     mkdir -p /app/node_modules

WORKDIR /app
COPY    srcs    .
# RUN     npm install -g @nestjs/cli

# If you are building your code for development
RUN     npm install
# If you are building your code for production
# RUN npm ci --only=production

# Fix bcrypt cross-platform module
RUN     npm uninstall bcrypt && npm install bcrypt

# RUN npm update @nestjs/cli

# RUN npx @nestjs/cli update

CMD     npm run start:dev
        # npm start
