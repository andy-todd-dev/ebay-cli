FROM node:lts-slim

ARG EBAY_VERSION

RUN npm install ebay-cli@$EBAY_VERSION -g

VOLUME [ "/root/.config/configstore" ]

ENTRYPOINT [ "/usr/local/bin/ebay" ]