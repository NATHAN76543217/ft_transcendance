FROM alpine:3.14.0

# Install dependencies
RUN apk add --update --no-cache bash nginx openssl

# Setup Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]
