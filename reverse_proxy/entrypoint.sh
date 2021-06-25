#!/bin/bash

set -e

make_certs()
{
  KEY="tls.key"
  CERT="tls.crt"

  DST="$1"

  echo "Generating $KEY and $CERT at $DST..."
 
  mkdir -p "$DST"
  
  openssl req -x509 -newkey rsa:4096 -keyout "$DST/$KEY" -out "$DST/$CERT" -days 365 -nodes -subj "/CN=localhost"
}

[ -f /etc/nginx/certs/tls.key ] && [ -f /etc/nginx/certs/tls.crt ] || make_certs /etc/nginx/certs

if [[ -z ${1} ]]; then
  echo "Starting nginx..."
  exec $(which nginx) -c /etc/nginx/nginx.conf -g "daemon off;" ${EXTRA_ARGS}
else
  exec "$@"
fi
