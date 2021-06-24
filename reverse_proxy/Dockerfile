FROM alpine:3.14.0

ENV WWW_USER="www-data"
ENV WWW_DIR="/var/www/localhost"

# Install dependencies
RUN apk add --update --no-cache bash nginx openssl

# Setup Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]
