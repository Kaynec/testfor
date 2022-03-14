#!/bin/sh

# Build project
npm run build

# Copy files and set env
ssh root@185.18.214.200 "rm -Rf /var/www/staging && mkdir -p /var/www/staging"
scp -r ./dist/* root@185.18.214.200:/var/www/staging/
