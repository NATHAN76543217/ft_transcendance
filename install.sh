#!/bin/sh

CNT_NODE_VERSION="v16.2.0"

# This script can be used to install dependencies on your development platform
# node and npm are required.

if ! which node > /dev/null; then
  echo 1>&2 "'node' could not be found in PATH!"
  exit 1
else
  OUR_NODE_VERSION="$(node --version)"
  if [ ! "$OUR_NODE_VERSION" = "$CNT_NODE_VERSION" ]; then
    echo 1>&2 "Warning: Your node version ($OUR_NODE_VERSION) does not match the container's ($CNT_NODE_VERSION)!"
  fi

  (echo "Installing frontend modules..." && cd frontend/srcs && npm install)
  echo
  (echo "Installing backend modules..." && cd backend/srcs && npm install)
fi
